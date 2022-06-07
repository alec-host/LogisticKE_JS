
getParcelCharge = function(input_distance,obj,callback) {
    let charge = 0;
    for(var j=0;j<obj['data'].length;j++) {
        //-.min distance check.
        if(obj['data'][j]['min'] >=input_distance && obj['data'][j]['min']<=input_distance) {
            charge = (obj['data'][j]['price']);
            callback(charge);
            break;
        }
        //-.max distance check.
        if(obj['data'][j]['max'] >=input_distance && obj['data'][j]['max']<=input_distance) {
            charge = (obj['data'][j]['price']);
            callback(charge);
            break;
        }
        //-.between min & max check.
        if(input_distance >= obj['data'][j]['min'] && input_distance <= obj['data'][j]['max']) {
            charge = (obj['data'][j]['price']);
            callback(charge);
            break;
        }			
    }
}

module.exports.getParcelCharge=getParcelCharge;