const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const passport = require("passport");
const users = require("./routes/user");
const messages = require("./routes/message"); 
let namespaces = require('./data/namespaces');


const env = require('dotenv').config();
// var cors = require('cors');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");

// Require all models
// const db = require("./models");

const PORT = process.env.PORT || 3000;

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
app.use("/api/message", messages);

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
io.on('connection', (socket) => {
  // console.log('how many namespaces there are: ', socket.handshake);
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint
    }
  })
  // console.log(nsData);
// Emit this to ONLY the socket who just logged in. 
  socket.emit('nsList', nsData);
})

namespaces.forEach((namespace) => {
  // console.log(namespace.rooms);
  io.of(namespace.endpoint).on('connection', (nsSocket) => {
    const username = nsSocket.handshake.query.username;
    // console.log(`${nsSocket.id} has joined ${namespace.endpoint}`)
    // a socket has connected to one of our chatgroup namespaces. Send that ns group info back
    nsSocket.emit('nsRoomLoad', namespace.rooms);
    nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback)=> {
      console.log('how many rooms there are: ',nsSocket.rooms);
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsersInRoom(namespace, roomToLeave);
      nsSocket.join(roomToJoin);
  
      // grab specific room
      const nsRoom = namespace.rooms.find((room)=>{
        // loop through ALL rooms in that namespace to rename 
        return room.roomTitle === roomToJoin;
      })
      // send out room history
      nsSocket.emit('historyCatchup', nsRoom.history);
      updateUsersInRoom(namespace, roomToJoin);
      
    })
    nsSocket.on('newMessageToServer', (msg)=>{
      console.log(msg)
      console.log(`Server received message
      message: ${msg.text}`)
      const fullMsg = {
        text: msg.text,
        time: Date.now(), // Sam, did you get this to work?
        username: username,
        avatar: 'https://mir-s3-cdn-cf.behance.net/user/115/1697063.54b7480d65618.jpg'
      }
      // console.log(fullMsg);
      // This message gets sent to all peopl in this room
      //Need to find the specific room?????????
      // console.log(nsSocket.rooms);
      // The user is in the second room in the obj list. Because the socket ALWAYS joins group room on connect.
      // get the keys
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      // Need to find the Room obj for this room (for the history)
      const nsRoom = namespace.rooms.find((room)=>{
        // loop through ALL rooms in that namespace to rename 
        return room.roomTitle === roomTitle;
      })
      // console.log("the room object that we made matches this NS room...")
      // console.log(nsRoom);
      nsRoom.addMessage(fullMsg);
      io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg)
      console.log(`Server emits the message back to the entire Namespace 'io' so everyone can see the message
      --------
      server message: ${JSON.stringify(fullMsg)}`)
    })
  })
})

// Updating the users in a Namespace room:
function updateUsersInRoom(namespace, roomToJoin){
  // send back number of users in this room to all Sockets
  io.of(namespace.endpoint).in(roomToJoin).clients((err,clients)=>{
    // console.log(`There are ${clients.length} in this room`);
    io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length)
    
  })
}

http.listen(PORT, function () {
  console.log(`listening on *: ${PORT}`);
});


app.get('/', (req, res) => {
  res.json("Hello welcome to the Icebreakr Server!");
});

