const express = require('express');
const mysql   = require('mysql2');
const crypto  = require('crypto'); 

const db      = require('../db/config/dbConfig');
const model   = require('../db/model')

const store   = require('../db/rateCardStore');

const utils = require('../utils/littleOperationHandler');
const template = require('../booking_template/bookRequestJsonPlaceholder');
const parcel_charge = require('../utils/getParcelCharge');
const matrix_distance = require('../utils/getDistanceViaGoogleMatrix');
const valid = require('../utils/validateCoordinate');

const test_driver = require('../utils/testRiderHandler');
const test_estimate_price = require('../utils/testPriceEstimateHandler');
const test_estimate_json = require('../booking_template/test-estimate-json');

var conn =  mysql.createPool({connectionLimit: db.connectionLimit, host: db.host, port: db.port ,user: db.user, password: db.password, database: db.database});

module.exports = function(app) {
	
	app.use(express.json());
		
	/**
	* @route POST /little-book
	* @param {string} pickup.path.required
	* @param {string} dropoff.path.required
	* @returns {object} 200 - successful payload which includes trip id.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/
	app.post('/little-book', async (req, res) => {
		var client_json = req.body;
		if(Object.keys(req.body).length !== 0) {
			var date_part = new Date().toISOString().slice(0, 10) ;
			var t = new Date();
			var new_json = Object.assign({reference_no:crypto.randomBytes(16).toString("hex")},client_json,{date_created:date_part+" "+t.getHours()+':'+t.getMinutes()+':'+t.getSeconds()});
			
			utils.generateClientToken({"provider":"little"},(getActiveTokenCallback) => {
				/*
				*-.parse params to book json object.
				*-.method:sigleBookingJsonBluePrint.
				*/
				var parsed_client_json = template.sigleBookingJsonBluePrint(client_json,"sandbox");
				/*
				*-.make a booking operation.
				*-.method:bookDelivery.
				*/
				utils.bookDelivery({"provider":"little"},parsed_client_json,getActiveTokenCallback,(getServerResponseCallback) => {
					var json_string = JSON.stringify(getServerResponseCallback);
					if(json_string.includes("BookRideServiceException") || json_string.includes("error")) {
						var payload = {error:true,message:getServerResponseCallback.reason.Message};
						//-.message.
						res.status(200).send(payload);
					} else {
						var resp = JSON.parse(getServerResponseCallback);
						//-.log the book request.
						model.recordParcelBookRequest(conn,new_json,(error, row) => {
							//-.link a book request to a trip id.
							model.updateParcelBookRequestWithTripID(conn,{trip_id: resp.tripId, mobile_no: new_json.recipient_mobile}, (error2,row2) => {
									let inner_payload = {trip_id:resp.tripId,order_id,order_id:client_json.order_id,distance:resp.distance,time:resp.time,driver:resp.driver,car:resp.car};
									let payload = {trip_id:resp.tripId,estimate_cost:client_json.estimate_cost,payload:inner_payload};
									//-.record trip information.
									model.recordTripInformation(conn,payload,(error,row3) => {
										//-.message.
										res.status(200).send({error:false,data:inner_payload,message:"booking request was successful"});
									});
							});
						});
					}
				});
			});
		} else {
			res.status(200).send({error:true,message:"content cannot be empty."});
		}
	});
	/**
	* @route GET /little-cost-estimate
	* @param {string} origins.path.required
	* @param {string} destinations.path.required
	* @returns {object} 200 - successful payload which includes trip cost estimate etc.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/
	app.get('/little-cost-estimate', async(req,res) => {
		if(Object.keys(req.body).length !== 0) {
			var origins = req.body.origins;
			var destinations = req.body.destinations;
			if(origins != '' && destinations !='') {
				//-.validate coordinates - lat/lng.
				valid.validateLocationCordinates(origins,destinations,(getIsValidLocationCordinatesCallback) => {
					if(getIsValidLocationCordinatesCallback == true) {
						matrix_distance.distanceByGoogleMatrixApi(origins,destinations,(getRateCardCallback) => {
							if(getRateCardCallback) {
								var rate_card_obj = store.rateCardConfig(); 
								if(rate_card_obj) {
									var distance_in_km = (getRateCardCallback['rows'][0]['elements'][0]['distance']['text']).replace('km','').trim();
									//-.distance greater than set rates on the rate card.
									if(distance_in_km <= process.env.LITTLE_RATE_CARD_UPPER_LIMIT) {
										//-.distance is zero or a few metres.
										if(distance_in_km.indexOf('m') > -1) {
											res.status(200).send({error:true,message:"Attention: pickup & drop off cannot be the same location."});
										} else {
											parcel_charge.getParcelCharge(Math.round(distance_in_km),rate_card_obj,(getChargeCallback) => {
												res.status(200).send({error:false,data:{estimate_charge:getChargeCallback},message:"rate charge applicable found."});
											});
										}
									} else {
										res.status(200).send({error:true,message:"Attention: request cannot be handled within the current RATE CARD."});
									}
								} else {
									res.status(200).send({error:true,message:"Attention: rate card js file is empty."});
								}
							} else {
								res.status(200).send({error:true,message:"Ops something wrong has happened."});
							}
						});
					} else {
						res.status(200).send({error:true,message:"invalid input: i.e pickup/drop ofd points."});
					}
				});
			} else {
				res.status(200).send({error:true,message:"pickup and drop off points have to be checked."});
			}
		} else {
			res.status(200).send({error:true,message:"content cannot be empty."});
		}
	});
	/**
	* @route POST /little-cancel
	* @param {string} provider.path.required
	* @param {string} trip_id.path.required
	* @returns {object} 200 - returns a json object.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/	
	app.post('/little-cancel', async(req,res) => {
		var client_json = req.body;
		if(Object.keys(req.body).length !== 0) {
			utils.generateClientToken(client_json,(getActiveTokenCallback) => {	
				utils.cancelBookRequest(client_json,getActiveTokenCallback,(getServerResponseCallback) => {	
					let resp = getServerResponseCallback;
					res.status(200).send({error:false,data:{trip_id: resp.tripId},message:resp.message});
				});
			});
		} else {
			res.status(200).send({error:true,message:"content cannot be empty."});
		}
	});
	/**
	* @route GET /little-status
	* @param {string} trip_id.path.required
	* @returns {object} 200 - returns a json object.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/	
	app.get('/little-status', async(req,res) => {
		var trip_id = req.body.trip_id;
		var payload;
		if(Object.keys(req.body).length !== 0) {
			utils.generateClientToken({provider:"little"},(getActiveTokenCallback) => {	
				utils.getDeliveryStatus({trip_id:trip_id,provider:"little"},getActiveTokenCallback,(getServerResponseCallback) => {
					let resp = getServerResponseCallback;
					let payload = {trip_id:resp.tripId,startedOn:resp.startedOn,status:resp.tripStatus,driver:resp.driver,order_id:"000000",trip_cost:resp.tripCost};
					res.status(200).send({error:false,data: {payload},message:"delivery status information"});
				});
			});
		} else {
			res.status(200).send({"error":true,"message":"content cannot be empty."});
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
		if(Object.keys(req.body).length !== 0) {
			utils.generateClientToken(client_json,(getActiveToken) => {		
				res.status(200).send(getActiveToken);
			});
		} else {
			res.status(200).send({error:true,message:"content cannot be empty."});
		}
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
		if(Object.keys(req.body).length !== 0) {
			utils.generateClientToken({provider:"little"},(getAccessToken) => {
				utils.pickDriver(client_json,getAccessToken,(getServerResponse) => {
					res.status(200).send(test_driver.driverInformationFilter(getServerResponse));
				});			
			});
		} else {
			res.status(200).send({error:true,message:"content cannot be empty."});
		}
	});
	/**
	* @route GET /testEstimateCostParserApi
	* @param {string} pickup.path.required|dropoff.path.required
	* @returns {object} 200 - successful payload which includes trip id.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/
	app.post('/testEstimateCostParserApi', async (req, res) => {
		var client_json = req.body;
		if(Object.keys(req.body).length !== 0) {
			var vehicle_type = process.env.API_LITTLE_VEHICLE_TYPE.split(',');

			utils.generateClientToken({provider:"little"},(getActiveToken) => {	
				utils.getShippingEstimate({provider:"little"},client_json,getActiveToken,(getServerResponse) => {	
				if(getServerResponse !== undefined) {
					let price_range = test_estimate_price.getDeliveryPriceEstimate(JSON.parse(getServerResponse),vehicle_type[5]);
					res.status(200).send({price_range});
				}else{
					res.status(200).send({error:true,message:"ops something wrong has happened."});
				}
				});
			});
		} else {
			res.status(200).send({error:true,message:"content cannot be empty."});
		}
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