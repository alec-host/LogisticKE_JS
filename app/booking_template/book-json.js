const dotenv = require('dotenv');

dotenv.config();
/**
*-.method: json template for single booking.
**/
function sigleBookingJsonBluePrint(content,is_live="no") {
	if(is_live == "no") {
		mail = process.env.API_LITTLE_TEST_USER;;
	}else{
		if(is_live == "") {
			mail = "";
		}else{
			mail = "bbbbbbbbbbbbbbbbb";
		}
	}
	const payload = {
		"type":process.env.API_LITTLE_ACCOUNT_TYPE,
		"driver":mail,
		"rider": {
			"mobileNumber": content.mobile_number,
			"name": content.name,
			"picture": "https://cdn.standardmedia.co.ke/images/wednesday/ylcv3nuvqz5tabulgz615db51a1e15d.jpg"
		},
		"vehicle": {
			"type":process.env.API_LITTLE_VEHICLE_TYPE,
			"details": {
				"itemCarried": "My ORDER ITEM[S]",
				"size": content.parcel_size,
				"recipientName": content.recipient_name,
				"recipientMobile": content.recipient_mobile,
				"recipientAddress": content.recipient_addresss,
				"contactPerson": content.contact_name,
				"deliveryNotes": content.delivery_notes,
				"typeOfAddress": "Office"
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
				"order": 1,
				"address": content.drop_off_address,
				"latlng": content.drop_off_latlng,
				"contactMobileNumber": content.recipient_mobile,
				"contactName": content.contact_name,
				"notes":"next to ..."
			}
		],
		"corporate": {
			"corporateId": process.env.API_LIITLE_CORPORATE_ID
		}
	}
	return payload;
}

module.exports.sigleBookingJsonBluePrint = sigleBookingJsonBluePrint;