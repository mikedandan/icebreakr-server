const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const passport = require("passport");
const users = require("./routes/apiRoutes");

const env = require('dotenv').config();
// var cors = require('cors');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");

// Require all models
// const db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
// var routes = require("./controller/apiRoutes.js");

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
// app.use(routes);
// app.use(cors());

// //// Connect to the Mongo DB via Heroku ////
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/icebreakr";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/user", users);

// Connect to the Mongo DB via Azure ////

// mongoose.connect(process.env.COSMOSDB_CONNSTR+"?ssl=true&replicaSet=globaldb",  {
//     auth: {
//       user: process.env.COSMODDB_USER,
//       password: process.env.COSMOSDB_PASSWORD
//     }
//   })
//   .then(() => console.log('Connection to CosmosDB successful'))
//   .catch((err) => console.error(err));

// HTML Routes

// Start the server
io.of('/').on('connection', function (socket) {
  console.log('User ' + socket.id + ' connected');

  socket.on('msgToServer', function (msg) {
    console.log('msgToServer ' + msg);
    io.emit('messageToApp', {
      message: msg,
      id: socket.id
    })

  });

  socket.on('disconnect', function () {
    console.log(socket.id + ' user disconnected');
  });
});

const adminNamespace = io.of('/admin');

adminNamespace.emit('an event', { some: 'data' });


// Global Chat Socket (/chat) -------------------------------------------------------------------------------

io.of('/group').on('connection', function (socket) {
  console.log('User ' + socket.id + ' connected to group');

  socket.on('GroupMsgToServer', function (msg) {
    console.log('GroupMsgToServer ' + msg);
    socket.emit('GroupMessageToApp', {
      message: msg,
      id: socket.id
    })

  });

  socket.on('disconnect', function () {
    console.log(socket.id + ' user disconnected');
  });
});


// END Global Chat Socket -------------------------------------------------------------------------------

// Private Chat Socket (/chat) -------------------------------------------------------------------------------


// END Private Chat Socket -------------------------------------------------------------------------------

// Event Chat Socket (/chat) -------------------------------------------------------------------------------


// END Event Chat Socket -------------------------------------------------------------------------------


// Event Admin Chat Socket (/chat) -------------------------------------------------------------------------------


// END Event Admin Chat Socket -------------------------------------------------------------------------------


http.listen(PORT, function () {
  console.log(`listening on *: ${PORT}`);
});


app.get('/', (req, res) => {
  res.json("Hello welcome to the Icebreakr Server!");
});

