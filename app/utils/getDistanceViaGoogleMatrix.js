var axios = require('axios');

distanceByGoogleMatrixApi = function(origins,destinations,callback) {
    var config = {
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=-1.265955,36.805038&destinations=-1.2648989,36.8372708&key=AIzaSyA5tdtg7PU2eVqRaDjB-iSbGoqSzHSVBog',
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