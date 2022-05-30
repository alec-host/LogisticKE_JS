/**
 *-.method:saveParcelBookingRequest.
 *-.record parcel booking service.
 **/
function saveParcelBookingRequest(pool,content,recordCallback) {
	pool.getConnection((err, conn) => {
		if(err){
			throw err;
		}else{
			var insert_value = [content.reference_no,content.recipient_name,content.recipient_mobile,content.recipient_addresss,content.pick_up_latlng,content.pick_up_address,content.drop_off,content.drop_off_latlng,content.provider,content.date_created];
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
function updateParcelBookingRequestWithTripID(pool,tripID,recordCallback) {
	pool.getConnection((err, conn) => {
		if(err){
			throw err;
		}else{
			var insert_value = [content.reference_no,content.recipient_name,content.recipient_mobile,content.recipient_addresss,content.pick_up_latlng,content.pick_up_address,content.drop_off,content.drop_off_latlng,content.provider,content.date_created];
			conn.query("UPDATE " + 
					   "`db_parcel_service`.`tbl_booking_request` " +
					   "SET "+
					   +"`trip_id` = ? " +
					   "WHERE " +
					   "`recipient_mobile` = ?;" ,insert_value, (err, res) => {
				if(err) throw err;
				recordCallback(err, res);
				conn.release();
			});
		}
	});
}


function createCustomer(pool,customer,recordCallback) {
	pool.getConnection((err, conn) => {
		if(err){
			throw err;
		}else{
			var insert_value = [customer.unique_uid,customer.first_name,customer.second_name,customer.msisdn,customer.date_created];
			conn.query("INSERT INTO `tbl_customer` (`unique_uid`,`first_name`,`second_name`,`msisdn`,`date_created`) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE `date_modified` = NOW();" ,insert_value, (err, res) => {
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

module.exports.saveParcelBookingRequest = saveParcelBookingRequest;
module.exports.createCustomer = createCustomer;
module.exports.getCustomerExist = getCustomerExist;
module.exports.getCustomerList = getCustomerList;
module.exports.getCustmerName = getCustmerName;