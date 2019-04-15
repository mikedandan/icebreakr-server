const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const env = require('dotenv').config(); 
// var cors = require('cors');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");

// Require all models
const db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var routes = require("./controller/apiRoutes.js");

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(routes);
// app.use(cors());

// //// Connect to the Mongo DB via Heroku ////
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect(MONGODB_URI);

// Connect to the Mongo DB via Azure ////

mongoose.connect(process.env.COSMOSDB_CONNSTR+"?ssl=true&replicaSet=globaldb",  {
    auth: {
      user: process.env.COSMODDB_USER,
      password: process.env.COSMOSDB_PASSWORD
    }
  })
  .then(() => console.log('Connection to CosmosDB successful'))
  .catch((err) => console.error(err));

// HTML Routes

// Start the server
io.on('connection', function (socket) {
    console.log('an user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
      });
});

http.listen(PORT, function () {
    console.log(`listening on *: ${PORT}`);
});

app.get('/api/users', function (req, res) {
    db.User.find({}).then((user) => {
        res.json(user);
    }).catch(err => console.log(err));
});

