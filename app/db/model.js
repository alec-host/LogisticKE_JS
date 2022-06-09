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
			let params = [content.trip_id,content.mobile_no];
			conn.query("UPDATE " + 
					   "`db_parcel_service`.`tbl_booking_request` " +
					   "SET `trip_id` = ? " +
					   "WHERE " +
					   "`recipient_mobile` = ? AND `trip_id` IS NULL ORDER BY `_id` DESC LIMIT 1;" ,params, (err, res) => {
				if(err) throw err;
				recordCallback(err, res);
				conn.release();
			});
		}
	});
}
/**
 *-.method:recordTripInformation.
 *-.record trip information.
 **/
 function recordTripInformation(pool,content,recordCallback) {
	pool.getConnection((err, conn) => {
		if(err){
			throw err;
		}else{
			var insert_value = [content.trip_id,content.estimate_cost,JSON.stringify(content.payload)];
			console.log(insert_value);

			conn.query("INSERT " + 
			           "INTO " +
					   "`db_parcel_service`.`tbl_trip` " +
					   "(`trip_id`,`estimate_cost`,`book_ride_payload`) " +
					   "VALUES (?,?,?) " +
					   "ON DUPLICATE KEY UPDATE `modified_at` = NOW();" ,insert_value, (err, res) => {
				if(err) throw err;
				recordCallback(err, res);
				conn.release();
			});
		}
	});
}
/**
 *-.method:markTripAsCancelled.
 *-.updates booking request.
 **/
 function markTripAsCancelled(pool,content,recordCallback) {
	pool.getConnection((err, conn) => {
		if(err){
			throw err;
		}else{
			let param = [content.trip_id];
			conn.query("UPDATE " + 
					   "`db_parcel_service`.`tbl_trip` " +
					   "SET `is_cancelled` = 1 " +
					   "WHERE " +
					   "`is_cancelled` = 0 AND `modified_at` = NOW() AND `trip_id` = ?;" ,params, (err, res) => {
				if(err) throw err;
				recordCallback(err, res);
				conn.release();
			});
		}
	});
}

module.exports.recordParcelBookRequest = recordParcelBookRequest;
module.exports.updateParcelBookRequestWithTripID = updateParcelBookRequestWithTripID;
module.exports.recordTripInformation = recordTripInformation;
module.exports.markTripAsCancelled = markTripAsCancelled;