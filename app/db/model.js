
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

module.exports.createCustomer = createCustomer;
module.exports.getCustomerExist = getCustomerExist;
module.exports.getCustomerList = getCustomerList;
module.exports.getCustmerName = getCustmerName;