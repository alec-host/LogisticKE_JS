const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 5050;

module.exports = {
    apps : [
    {
      name      : "PARCEL DELIVERY MICROSERVICE",
      script    : "/usr/local/lib/little-parcel/littleApp/parcelEngine.js",
      instances : "2",
      exec_mode : "cluster",
      env: {
        NODE_ENV: "production",
        PORT: port
      }
    },
    { },
    ]
  }