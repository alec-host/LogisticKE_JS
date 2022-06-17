const valid  = require('../utils/validateCoordinate');
const dotenv = require('dotenv');

dotenv.config();

/**
*-.method: json template for single book request.
**/
function singleBookingJsonBluePrint(content,environment="sandbox") {

	var vehicle_type = process.env.API_LITTLE_VEHICLE_TYPE.split(',');

	if(environment == "sandbox") {
		env_mail = process.env.API_LITTLE_TEST_USER;
		env_mobile = process.env.API_LITTLE_TEST_MOBILE;
	}else{
		if(is_live == "production") {
			env_mail = process.env.API_LITTLE_LIVE_USER;
			env_mobile = process.env.API_LITTLE_LIVE_MOBILE;
		}else{
			env_mail = process.env.API_LITTLE_TEST_USER;
			env_mobile = process.env.API_LITTLE_TEST_MOBILE;
		}
	}
	var payload=null;
	//-.validate location information.
	valid.validateLocationCordinates(content.pick_up_latlng,content.drop_off_latlng,(getServerResponseCallback) => {
		if(getServerResponseCallback == true) {
			payload = {
				"type": process.env.API_LITTLE_ACCOUNT_TYPE,
				"driver": env_mail,
				"rider": {
					"mobileNumber": env_mobile,
					"name": process.env.API_LITTLE_USER_NAME,
					"picture": process.env.API_AIRDUKA_LOGO
				},
				"vehicle": {
					"type":vehicle_type[5],
					"details": {
						"itemCarried": "AirDuka:ORDER ITEM[S]",
						"size": content.parcel_size,
						"recipientName": content.recipient_name,
						"recipientMobile": content.recipient_mobile,
						"recipientAddress": content.recipient_addresss,
						"contactPerson": content.contact_name,
						"deliveryNotes": content.delivery_notes,
						"typeOfAddress": "AirDuka:Office"
					}
				},
				"pickUp": {
					"latlng": content.pick_up_latlng,
					"address": content.pick_up_address
				},
				"dropOff": {
					"latlng": content.drop_off_latlng,
					"address": content.drop_off_address
				},
				"dropOffs": [
					{
						"order": content.order_id,
						"latlng": content.drop_off_latlng,
						"address": content.drop_off_address,
						"contactMobileNumber": content.recipient_mobile,
						"contactName": content.contact_name,
						"notes":"next to ..."
					}
				],
				"corporate": {
					"corporateId": process.env.API_LIITLE_CORPORATE_ID
				}
			}
		}else{
			payload = {"error":true,"message":"invalid input: i.e pickup/drop off points."}
		}
	});

	return payload;
}

module.exports.sigleBookingJsonBluePrint = singleBookingJsonBluePrint;