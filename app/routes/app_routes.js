const express  = require('express');
const mysql    = require('mysql');
const crypto   = require('crypto'); 

const db       = require('../db/config/dbConfig');
const model    = require('../db/model');
const auth     = require('../utils/little_method_handler');
const utils    = require('../utils/rider_handler');
const template = require('../booking_template/book-json');
const test     = require('../booking_template/test-estimate-json');
const estimate = require('../utils/price_estimate_handler');

var conn = mysql.createPool({connectionLimit: db.connectionLimit, host: db.host, user: db.user, password: db.password, database: db.database});

module.exports = function(app) {
	
	app.use(express.json());
	
	/**
	* @route POST /token
	* @param {string} client_json.path.required
	* @returns {object} 200 - returns a generated access token.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/	
	app.post('/token', async(req,res) => {
		var client_json = req.body;
		auth.generateClientToken(client_json,(getActiveToken) => {		
			res.status(200).send(getActiveToken);
		});
	});
	/**
	* @route POST /getdriver
	* @param {string} client_json.path.required
	* @param {string} token.path.required
	* @returns {object} 200 - list of riders/drivers near your location.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/	
	app.post('/getdriver', async (req, res) => {
		var client_json = req.body;
		auth.generateClientToken({"provider": "little"},(getAccessToken) => {
			auth.pickDriver(client_json,getAccessToken,(getServerResponse) => {
				res.status(200).send(utils.driverInformationFilter(getServerResponse));
			});			
		});
	});	
	/**
	* @route POST /book
	* @param {string} pickup.path.required|dropoff.path.required
	* @returns {object} 200 - successful payload which includes trip id.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/
	app.post('/book', async (req, res) => {
		var client_json = req.body;
		
		auth.generateClientToken({"provider": "little"},(getActiveToken) => {
			/*
			*-.parse params to booking json template.
			*-.method:sigleBookingJsonBluePrint()
			*/
			client_json_parsed = template.sigleBookingJsonBluePrint(client_json,"no");
			/*
			*-.peform booking operation.
			*-.method:bookDelivery()
			*/
			auth.bookDelivery({"provider": "little"},client_json_parsed,getActiveToken,(getServerResponse) => {
				if(JSON.stringify(getServerResponse).includes("BookRideServiceException") || JSON.stringify(getServerResponse).includes("error")) {
					res.status(200).send(getServerResponse);
					//console.log(client_json.pick_up_latlng);
					//console.log(client_json.drop_off_latlng);
					//console.log(client_json.type);
				}else{
					console.log(client_json.pick_up_latlng);
					console.log(client_json.drop_off_latlng);
					console.log(client_json);
					res.status(200).send({"message":"We've got our data."});
				}
			});
		});
	});	
	/**
	* @route GET /estimate
	* @param {string} pickup.path.required|dropoff.path.required
	* @returns {object} 200 - successful payload which includes trip id.
	* @returns {Error} default - {message: ops something wrong has happened.}
	*/
	app.post('/testEstimateApi', async (req, res) => {
		var client_json = req.body;

		var vehicle_type = process.env.API_LITTLE_VEHICLE_TYPE.split(',');

		auth.generateClientToken({"provider": "little"},(getActiveToken) => {	
			auth.getShippingEstimate({"provider": "little"},client_json,getActiveToken,(getServerResponse) => {	
			if(getServerResponse !== undefined) {
				let price_range = estimate.getDeliveryPriceEstimate(JSON.parse(getServerResponse),vehicle_type[1]);
				res.status(200).send({price_range});
			}else{
				res.status(200).send({"message":"ops something wrong has happened."});
			}
			});
		});
	});
	
	app.post('/test', async (req, res) => {
		var client_json = req.body;
		console.log(template.sigleBookingJsonBluePrint(client_json,""));
		res.status(200).send(client_json);
	});	

	app.post('/testParsingEstimatePriceRangeJson',async(req,res) => {
		let obj = test.testEstimatePayload();
		let vehicle_type = process.env.API_LITTLE_VEHICLE_TYPE.split(',');
		let output = estimate.getDeliveryPriceEstimate(obj,vehicle_type[3]);
		res.status(200).send({output});
	});
};