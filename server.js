const express = require('express');
const app     = express();
const dotenv  = require('dotenv');

var expressSwagger = require('express-swagger-generator')(app);

dotenv.config();

const port = process.env.PORT || 5050;

app.use(express.urlencoded({extended: true}));

require('./app/routes')(app, {});

let options = {
    swaggerDefinition: {
        info: {
            description: 'AirDuka Delivery Microservice server',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost:'+port,
        basePath: '/',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./app/routes/**/*.js'] //Path to the API handle folder
};

expressSwagger(options);

const server = app.listen(port, ()=> console.log('Listening on localhost:'+port));
server.keepAliveTimeout = 61 * 1000;
server.setTimeout(0);