var haversine = require("haversine-distance");

const util  = require('../utils/calculateDistance');

var p1 =-1.265955;
var p2 = 36.805038;

var d1 = -1.2648989;
var d2 = 36.8372708;

let distance_in_km = util.calc_distance(p1,p2,d1,d2);

console.log(distance_in_km);

//First point in your haversine calculation
var point1 = { lat: p1, lng: p2 }

//Second point in your haversine calculation
var point2 = { lat: d1, lng: d2 }

var haversine_m = haversine(point1, point2); //Results in meters (default)
var haversine_km = haversine_m /1000; //Results in kilometers

console.log("distance (in meters): " + haversine_m + "m");
console.log("distance (in kilometers): " + haversine_km + "km");