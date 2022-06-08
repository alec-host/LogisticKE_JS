validateLocationCordinates = function(origins,destination,callback){
	
	let pattern = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');

	var is_valid = (pattern.test(origins.split(',')[0].trim()) && pattern.test(origins.split(',')[1].trim())) && (pattern.test(destination.split(',')[0].trim()) && pattern.test(destination.split(',')[1].trim())) 
	
	callback(is_valid);
}

module.exports.validateLocationCordinates = validateLocationCordinates