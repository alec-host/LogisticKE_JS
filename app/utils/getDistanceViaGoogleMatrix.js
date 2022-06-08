var axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

distanceByGoogleMatrixApi = function(origins,destinations,callback) {
    var config = {
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+origins+'&destinations='+destinations+'&key='+process.env.API_GOOGLE_MATRIX_KEY,
        headers: { }
      };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        callback(response.data);
      })
      .catch(function (error) {
        console.log(error);
        callback(response.data);
      });

}

module.exports.distanceByGoogleMatrixApi = distanceByGoogleMatrixApi;