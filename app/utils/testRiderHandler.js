/**
*-.method: driver information.
*-.return a list of available rider/driver within your location.
**/
driverInformationFilter = function(json_payload,callback) {
	let responseData = '';
	callback = callback || function(){};
	if(json_payload){
		let result = JSON.parse(json_payload).drivers;
		
		let found = result.filter(function(item) {
			/**
			*-.filter for riders/drivers within 1km radius & have a service rating of 5.
			*-.adjustment on filter criteria can be made to generate a larger list. 
			**/
			return item !== undefined && (item.rating == 5 && item.distance <= 1);
		});
		if(found[0]) {
			return found[0];
		} else {
			return {error:true,message:"no rider found"};
		}
	} else {
		try {
			if(json_payload === undefined) {
				return {error:true,message:"missing access token"};
			} else {
				return {error:true,message:"no rider found"};
			}
		} catch(error) {
			return {error:true,message:"something wrong has happened"};
		}
	}
}

module.exports.driverInformationFilter = driverInformationFilter;