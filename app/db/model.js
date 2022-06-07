/**
 *-.method:saveParcelBookingRequest.
 *-.record parcel booking service.
 **/
function recordParcelBookRequest(pool,content,recordCallback) {
	pool.getConnection((err, conn) => {
		if(err){
			throw err;
		}else{
			var insert_value = [content.reference_no,content.recipient_name,content.recipient_mobile,content.recipient_addresss,content.pick_up_latlng,content.pick_up_address,content.drop_off_latlng,content.drop_off_address,content.provider,content.date_created];
			conn.query("INSERT " + 
			           "INTO " +
					   "`db_parcel_service`.`tbl_booking_request` " +
					   "(`reference_no`,`recipient_name`,`recipient_mobile`,`recipient_addresss`,`pick_up`,`pick_up_address`,`drop_off`,`drop_off_address`,`provider`,`date_created`) " +
					   "VALUES (?,?,?,?,?,?,?,?,?,?) " +
					   "ON DUPLICATE KEY UPDATE `date_modified` = NOW();" ,insert_value, (err, res) => {
				if(err) throw err;
				recordCallback(err, res);
				conn.release();
			});
		}
	});
}
/**
 *-.method:updateParcelBookingRequestWithTripID.
 *-.updates booking request.
 **/
function updateParcelBookRequestWithTripID(pool,content,recordCallback) {
	pool.getConnection((err, conn) => {
		if(err){
			throw err;
		}else{
			var params = [content.trip_id,content.mobile_no];
			conn.query("UPDATE " + 
					   "`db_parcel_service`.`tbl_booking_request` " +
					   "SET "+
					   +"`trip_id` = ? " +
					   "WHERE " +
					   "`trip_id` IS NULL AND `recipient_mobile` = ?;" ,params, (err, res) => {
				if(err) throw err;
				recordCallback(err, res);
				conn.release();
			});
		}
	});
}

function getCustomerExist(pool,msisdn,recordCallback) {
	pool.getConnection((err, conn) => {
		if(err){
			throw err;
		}else{
			conn.query("SELECT COUNT(`_id`) AS CNT FROM `tbl_customer` WHERE `msisdn` = ? ",msisdn, (err, res) => {
				if(err) throw err;
				recordCallback(err, res);
				conn.release();
			});
		}
	});
}

function getCustomerList(pool,recordCallback) {
	pool.getConnection((err, conn) => {
		if(err){ 
			throw err;
		}else{
			conn.query("SELECT `unique_uid`,`first_name`,`second_name`,`msisdn` FROM `tbl_customer` LIMIT 5;",(err, res, fields) => {
				if(err) throw err;
				recordCallback(err, res, fields);
				conn.release();
			});
		}
	});
}

function getCustmerName(pool,msisdn,recordCallback) {
	pool.getConnection((err, conn) => {
		if(err) {
			throw err;
		}else{
			conn.query("SELECT `first_name`, `second_name` FROM `tbl_customer` WHERE `msisdn` = ?;" ,[msisdn], (err, res) => {
				if(err) throw err;
				recordCallback(err, res);
				conn.release();
			});
		}
	});
	
}

module.exports.recordParcelBookRequest = recordParcelBookRequest;
module.exports.updateParcelBookRequestWithTripID = updateParcelBookRequestWithTripID;
module.exports.getCustomerExist = getCustomerExist;
module.exports.getCustomerList = getCustomerList;
module.exports.getCustmerName = getCustmerName;