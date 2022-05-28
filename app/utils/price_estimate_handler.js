const dotenv = require('dotenv');

dotenv.config();
/**
*-.method: json template for single booking.
**/
getDeliveryPriceEstimate = function(json_payload,vehicle_type) {
	
	let j_string = JSON.stringify(json_payload);

	if(j_string){
		
		let result = JSON.parse(j_string).estimates;
		
		let found = result.filter(function(item) {
			/**
			*-.filter for riders/drivers within 1km radius & have a service rating of 5.
			*-.adjustment on filter criteria can be made to generate a larger list. 
			**/
			return item !== undefined && (item.vehicle == vehicle_type);
		});

		if(found[0]) {
			return (found[0].estimate);
		}else{
			return  ({"message": "no vehicle found"});
		}
	}else{
		try{
			if(json_payload === undefined) {
				return  ({"message":"missing access token"});
			}else{
				return ({"message": "no vehicle found"});
			}
		}catch(error){
			return ({"message": "error: something wrong has happened"});
		}
	}
}


module.exports.getDeliveryPriceEstimate = getDeliveryPriceEstimate;