const express = require("express");
const router = express.Router();
const keys = require("../config/keys.js");
const Event = require("../models/Events.js");
const db = require("../models");

///// CR-UD RESTful API  /////
/////    Event Routes   /////
/////  POST - Create  /////

//Creating new Event
router.post("/newevent", (req, res) => {
  console.log(`req.body contents: \n ${req.body}`);
  console.log(req.body)

  const newEvent = new Event({
    eventName: req.body.eventName,
    eventLocation: req.body.eventLocation,
    eventLat: req.body.lat,
    eventLng: req.body.lng,
    eventId: req.body.eventCode,
    eventOwner: req.body.id
  });

  db.Event.create(newEvent).then((event) => {
    console.log(`Pushing to our db \n ${event}`);
    res.send(`Event Added \n ${event}`);
  }).catch(err => res.send(err));
});

  /////  GET - Read  /////
  // Find all events
  router.get('/', (req, res) => {
    db.Event.find({}).then((event) => {
      console.log("grabbed all events from our db");
      res.json(event);
    }).catch(err => console.log(err));
  });

  // Find event by ID
  router.get('/:id', (req, res) => {
    db.Event.find({
      eventId: req.params.id
    }).then((event) => {
      console.log("grabbed event from our db by id");
      res.json(event);
    }).catch(err => console.log(err));
  });

  ///// PUT  -  Update /////
  // // Update password by email
  // router.put("/:email", (req, res) => {
  //   const email = req.params.email;

  //   db.User.find(
  //     { "email": email }
  //   ).then(() => {
  //     db.User.update(
  //       { "email": email },
  //       {
  //         $set: {
  //           password: req.body.password
  //         }
  //       }
  //     ).then((dbUser) => {
  //       console.log(`Saved updated \n ${dbUser}`);
  //       res.send(`User's password has been updated.`);
  //     }).catch((err) => res.json(err));
  //   }).catch((err) => res.json(err));
  // });

  // // Update email by email
  // router.put("/:email", (req, res) => {
  //   const email = req.params.email;

  //   db.User.find(
  //     { "email": email }
  //   ).then(() => {
  //     db.User.update(
  //       { "email": email },
  //       {
  //         $set: {
  //           email: req.body.email
  //         }
  //       }
  //     ).then((dbUser) => {
  //       console.log(`Saved updated \n ${dbUser}`);
  //       res.send(`User's email has been updated.`);
  //     }).catch((err) => res.json(err));
  //   }).catch((err) => res.json(err));
  // });

  ///// DELETE - Delete /////
  // router.delete("/:email", (req, res) => {
  //   const email = req.params.email;
  //   db.User.find(
  //     { "email": email }
  //   ).then(() => {
  //     db.User.deleteOne(
  //       { "email": email }
  //     ).then((dbUser) => {
  //       console.log(`User deleted \n ${dbUser}`);
  //       res.send(`User ${email} has been deleted.`);
  //     }).catch((err) => res.json(err));
  //   }).catch((err) => res.json(err));
  // });

  module.exports = router;