const http   = require("https");
const axios  = require('axios').default;
const dotenv = require('dotenv');

dotenv.config();
/**
*-.method: generate access token.
*-.return json payload.
**/
generateClientToken = function(content,callback) {

	let responseData = '';
	callback = callback || function(){};
	
	if(content.provider == 'little') {
		/**
		* LITTLE HEADER
		**/
		hostname = process.env.API_LITTLE_HOST_NAME;
		app_path = process.env.API_LITTLE_TOKEN_PATH;
		method   = "GET";
		headers_payload = {			
							"Content-Type": "application/json",
							"Content-Length": "0",
							"Authorization": "Basic " + process.env.API_LITTLE_KEY
						  };
	} else {
		/**
		* SENDYIT HEADER
		**/
		hostname=null;
		app_path=null;
		method= "POST";
		headers_payload = {			
							"Content-Type": "application/json",
							"Content-Length": "0"
						  };
	}
	
	const options = {
		"method":method,
		"hostname":hostname,
		"port":null,
		"path":app_path,
		"headers":headers_payload
	};
	
	const req = http.request(options,res => {
		res.on('data', chunk => {
			responseData+=chunk;
		});
		
		res.on('end',() => {
			try{
				return callback(responseData);
			}catch(error){
				return callback(error);
			}
		});
		
		res.on('error', (err) => {
			return {"message":"Ops something wrong has happened."};
		});
	});
	req.end();
}
/**
*-.method: pick driver.
*-.return a json payload.
**/
pickDriver = function (content,token_json,callback) {
	let responseData = '';	
	callback   = callback || function(){};
	/*
	-.convert to json object.
	*/
	auth = JSON.parse(token_json);

	if(content.provider == 'little'){
		/**
		* LITTLE HEADER
		**/
		hostname = process.env.API_LITTLE_HOST_NAME;
		app_path = process.env.API_LITTLE_PICK_DRIVER_PATH+"?mobile=&vehicle="+content.vehicle+"&latlng="+content.latlng;
		method   = 'GET';
		headers_payload = {			
							"Content-Type": "application/json",
							"Content-Length": "0",
							"Authorization": "Bearer "+auth.token
						  };
	}else{
		/**
		* SENDYIT HEADER
		**/
		method = 'GET';
		headers_payload = {			
							"Content-Type": "application/json",
							"Content-Length": "0"
						  };
	}
	
	const options = {
		"method":method,
		"hostname":hostname,
		"port":null,
		"path":app_path,
		"headers":headers_payload
	}
	
	const req = http.request(options,res => {
		res.on('data', chuck => {
			responseData+=chuck;
		});
	
		res.on('end',() => {
			try{
				return callback(responseData);
			}catch(error){
				return callback();
			}
		});
		
		res.on('error', (err) => {
			return {"message":"Ops something wrong has happened."};
		});
	});
	req.end();
}
/**
*-.method: book delivery.
*-.return: json payload.
**/
bookDelivery = function (provider,content,token_json,callback) {
	//let responseData = '';	
	callback   = callback || function(){};	
	/*
	-.convert to json object.
	*/
	var auth = JSON.parse(token_json);
	var data = JSON.stringify(content);

	if(provider.provider == 'little'){
		/**
		* LITTLE HEADER
		**/
		hostname = process.env.API_LITTLE_HOST_NAME;
		app_path = process.env.API_LITTLE_BOOK_PATH;
		method   = 'POST';
		headers_payload = {			
							"Content-Type": "application/json",
							"Authorization": "Bearer "+auth.token
						  };
	}else{
		/**
		* SENDYIT HEADER
		**/
		headers_payload = {			
							"Content-Type": "application/json",
							"Content-Length": "0"
						  };
	}

	const options = {
		"method":method,
		"url":'https://'+hostname+app_path,
		"headers": headers_payload,
		"data": JSON.parse(data)
	};

	axios.request(options).then(function(response) {
		callback(response.data)
	}).catch(function(error){
		callback(error.response.data);
	}); 
}
/**
*-.method: shipping estimate.
*-.return: json payload.
**/
getShippingEstimate = function (provider,content,token_json,callback) {

	callback   = callback || function(){}	
	/*
	-.convert to json object.
	*/
	auth = JSON.parse(token_json);
	
	if(provider.provider == 'little'){
		/**
		* LITTLE HEADER
		**/
		hostname = process.env.API_LITTLE_HOST_NAME;
		app_path = process.env.API_LITTLE_ESTIMATE_PATH+"?mobile=254&from_latlng="+content.from_latlng+"&to_latlng="+content.to_latlng;
		method   = 'GET';
		headers_payload = {			
							"Content-Type": "application/json",
							"Content-Length": "0",
							"Authorization": "Bearer "+auth.token};
	}else{
		/**
		* SENDYIT HEADER
		**/
		headers_payload = {			
							"Content-Type": "application/json",
							"Content-Length": "0"
						  };
	}

	const options = {
		"method":method,
		"url":'https://'+hostname+app_path,
		"headers": headers_payload,
		"data": null
	};
	
	axios.request(options).then(function(response) {
		callback(response.data)
	}).catch(function(error){
		callback(error);
	}); 
}
/**
*-.method: shipping estimate.
*-.return: json payload.
**/
cancelBookRequest = function (content,token_json,callback) {
	let responseData = '';	
	callback   = callback || function(){};	
	/*
	-.convert to json object.
	*/
	var auth = JSON.parse(token_json);
	var data = JSON.stringify({reason: content.reason});
	if(content.provider == 'little'){
		/**
		* LITTLE HEADER
		**/
		hostname = process.env.API_LITTLE_HOST_NAME;
		app_path = process.env.API_LITTLE_CANCEL_PATH.replace('{0}',content.trip_id);
		method   = 'POST';
		headers_payload = {			
			"Content-Type": "application/json",
			"Authorization": "Bearer "+auth.token};
	}else{
		/**
		* SENDYIT HEADER
		**/
		headers_payload = {			
							"Content-Type": "application/json",
							"Content-Length": "0"
						  };
	}

	const options = {
		"method":method,
		"url":'https://'+hostname+app_path,
		"headers": headers_payload,
		"data": data
	};
	
	axios.request(options).then(function(response) {
		callback(response.data)
	}).catch(function(error){
		callback(error);
	}); 
}
/**
*-.method: shipping estimate.
*-.return: json payload.
**/
getDeliveryStatus = function (content,token_json,callback) {
	let responseData = '';	
	callback   = callback || function(){};	
	/*
	-.convert to json object.
	*/
	var auth = JSON.parse(token_json);
	if(content.provider == 'little'){
		/**
		* LITTLE HEADER
		**/
		hostname = process.env.API_LITTLE_HOST_NAME;
		app_path = process.env.API_LITTLE_STATUS_PATH.replace('{0}',content.trip_id);
		method   = 'GET';
		headers_payload = {			
			"Content-Type": "application/json",
			"Authorization": "Bearer "+auth.token};
	}else{
		/**
		* SENDYIT HEADER
		**/
		headers_payload = {			
							"Content-Type": "application/json",
							"Content-Length": "0"
						  };
	}

	const options = {
		"method":method,
		"url":'https://'+hostname+app_path,
		"headers": headers_payload
	};
	
	axios.request(options).then(function(response) {
		callback(response.data)
	}).catch(function(error){
		callback(error);
	}); 
}
module.exports.generateClientToken = generateClientToken;
module.exports.pickDriver = pickDriver;
module.exports.bookDelivery = bookDelivery;
module.exports.getShippingEstimate = getShippingEstimate;
module.exports.cancelBookRequest = cancelBookRequest;
module.exports.getDeliveryStatus = getDeliveryStatus;