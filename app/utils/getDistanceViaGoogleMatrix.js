var axios = require('axios');

distanceByGoogleMatrixApi = function(origins,destinations,callback) {
    var config = {
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+origins+'&destinations='+destinations+'&key=AIzaSyA5tdtg7PU2eVqRaDjB-iSbGoqSzHSVBog',
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