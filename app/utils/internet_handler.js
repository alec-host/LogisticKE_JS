const dns  = require('dns');

checkInternetConnection = function(callback) {
	dns.lookup('google.com',function(err){
		if(err && err.code == "ENOTFOUND") {
			callback(false);
		}else{
			callback(true);
		}
	});
}

module.exports.checkInternetConnection = checkInternetConnection;