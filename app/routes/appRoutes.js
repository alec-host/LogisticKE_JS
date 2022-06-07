const express = require('express');
const mysql   = require('mysql');
const crypto  = require('crypto'); 

const db      = require('../db/config/dbConfig');
const model   = require('../db/model')

const store   = require('../db/rateCardStore');

const utils = require('../utils/littleOperationHandler');
const template = require('../booking_template/book-json');
const parcel_charge = require('../utils/getParcelCharge');
const matrix_distance = require('../utils/getDistanceViaGoogleMatrix');

const test_driver = require('../utils/testRiderHandler');
const test_estimate_price = require('../utils/testPriceEstimateHandler');
const test_estimate_json = require('../booking_template/test-estimate-json');

var conn = mysql.createPool({connectionLimit: db.connectionLimit, host: db.host, user: db.user, password: db.password, database: db.database});

module.exports = function(app) {
	
	app.use(express.json());
		
	/**
	* @route POST /bookApi
	* @param {string} pickup.path.required
	* @param {string} dropoff.path.required
	* @returns {object} 200 - successful payload which includes trip id.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/
	app.post('/bookApi', async (req, res) => {
		var client_json = req.body;
		var date_part = new Date().toISOString().slice(0, 10) ;
		var t = new Date();
		var new_json = Object.assign({reference_no: crypto.randomBytes(16).toString("hex")},client_json,{date_created: date_part+" "+t.getHours()+':'+t.getMinutes()+':'+t.getSeconds()});
		
		utils.generateClientToken({"provider": "little"},(getActiveTokenCallback) => {
			/*
			*-.parse params to book json object.
			*-.method:sigleBookingJsonBluePrint.
			*/
			var parsed_client_json = template.sigleBookingJsonBluePrint(client_json,"no");
			/*
			*-.make a booking operation.
			*-.method:bookDelivery.
			*/
			utils.bookDelivery({"provider": "little"},parsed_client_json,getActiveTokenCallback,(getServerResponseCallback) => {
				var json_string = JSON.stringify(getServerResponseCallback);
				if(json_string.includes("BookRideServiceException") || json_string.includes("error")) {
					//-.log the book request.
					model.recordParcelBookRequest(conn,new_json,(error, row) => {
						//model.updateParcelBookRequestWithTripID(conn,'1010111','254725239191', (error2,row2) => {
							//-.message.
							res.status(200).send(getServerResponseCallback);
						//});
					});
				}else{
					//-.log the book request.
					model.recordParcelBookRequest(conn,new_json,(error, row) => {
						//model.updateParcelBookRequestWithTripID(conn,'1010112','254725239191', (error2,row2) => {
							//-.message.
							res.status(200).send(getServerResponseCallback);
						//});
					});
				}
			});
		});
	});
	/**
	* @route GET /getCostEstimateApi
	* @param {string} origins.path.required
	* @param {string} destinations.path.required
	* @returns {object} 200 - successful payload which includes trip cost estimate etc.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/
	app.get('/getCostEstimateApi', async(req,res) => {
		var origins = req.body.origins;
		var destinations = req.body.destinations;
		if(origins != '' && destinations !='') {
			//-.validate coordinates - lat lng.
			let pattern = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');
			if(pattern.test(origins.split(',')[0].trim()) && pattern.test(origins.split(',')[1].trim())) {
				if(pattern.test(destinations.split(',')[0].trim()) && pattern.test(destinations.split(',')[1].trim())) {
					matrix_distance.distanceByGoogleMatrixApi(origins,destinations,(getRateCardCallback) => {
						if(getRateCardCallback) {
							var rate_card_obj = store.rateCardConfig(); 
							if(rate_card_obj) {
								var distance_in_km = (getRateCardCallback['rows'][0]['elements'][0]['distance']['text']).replace('km','').trim();
								parcel_charge.getParcelCharge(Math.round(distance_in_km),rate_card_obj,(getChargeCallback) => {
									res.status(200).send({"error":false,"message":"rate charge applicable found.","base_charge":getChargeCallback});
								});
							} else{
								res.status(200).send({"error":true,"message":"Attention: rate card js file is empty."});
							}
						}else{
							res.status(200).send({"error":true,"message":"Ops something wrong has happened."});
						}
					});
				}else{
					res.status(200).send({"error":true,"message":"invalid inputs."});	
				}
			}else{
				res.status(200).send({"error":true,"message":"invalid inputs."});
			}
	   }else{
			res.status(200).send({"error":true,"message":"pickup and drop off points have to be checked."});
	   }
	});	
	/**
	* @route POST /testGetTokenApi
	* @param {string} client_json.path.required
	* @returns {object} 200 - returns a generated access token.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/	
	app.post('/testGetTokenApi', async(req,res) => {
		var client_json = req.body;
		utils.generateClientToken(client_json,(getActiveToken) => {		
			res.status(200).send(getActiveToken);
		});
	});
	/**
	* @route POST /testGetDriverApi
	* @param {string} client_json.path.required
	* @param {string} token.path.required
	* @returns {object} 200 - list of riders/drivers near your location.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/	
	app.post('/testGetDriverApi', async (req, res) => {
		var client_json = req.body;
		utils.generateClientToken({"provider": "little"},(getAccessToken) => {
			utils.pickDriver(client_json,getAccessToken,(getServerResponse) => {
				res.status(200).send(test_driver.driverInformationFilter(getServerResponse));
			});			
		});
	});
	/**
	* @route GET /testEstimateCostParserApi
	* @param {string} pickup.path.required|dropoff.path.required
	* @returns {object} 200 - successful payload which includes trip id.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/
	app.post('/testEstimateCostParserApi', async (req, res) => {
		var client_json = req.body;

		var vehicle_type = process.env.API_LITTLE_VEHICLE_TYPE.split(',');

		utils.generateClientToken({"provider": "little"},(getActiveToken) => {	
			utils.getShippingEstimate({"provider": "little"},client_json,getActiveToken,(getServerResponse) => {	
			if(getServerResponse !== undefined) {
				let price_range = test_estimate_price.getDeliveryPriceEstimate(JSON.parse(getServerResponse),vehicle_type[1]);
				res.status(200).send({price_range});
			}else{
				res.status(200).send({"message":"ops something wrong has happened."});
			}
			});
		});
	});
	/**
	* @route GET /testGetJsonTemplateApi
	* @param {object} dummyJson.path.required
	* @returns {object} 200 - successful payload which includes trip id.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/	
	app.post('/testGetJsonTemplateApi', async (req, res) => {
		var dummyJson = req.body;
		console.log(template.sigleBookingJsonBluePrint(dummyJson,""));
		res.status(200).send(dummyJson);
	});	
	/**
	* @route GET /testParsingEstimatePriceRangeJsonApi
	* @param {object} vehicle_type.path.required
	* @returns {object} 200 - successful payload which includes trip id.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/
	app.post('/testParsingEstimatePriceRangeJsonApi',async(req,res) => {
		//-.method call.
		let obj = test_estimate_json.testEstimatePayload();
		let vehicle_type = process.env.API_LITTLE_VEHICLE_TYPE.split(',');
		let output = test_estimate_price.getDeliveryPriceEstimate(obj,vehicle_type[3]);
		res.status(200).send({output});
	});

	app.post('/testSearchRateCardApi', async(req,res) => {
		var obj = store.rateCardConfig(); 
		var input = 40.5;
		parcel_charge.getParcelCharge(Math.round(input),obj,(getCharge) => {
			res.status(200).send({getCharge});
		});
	});
};