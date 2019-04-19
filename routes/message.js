const express = require("express");
const router = express.Router();
const db = require("../models");

/////Note to team:
////There are 3 identifiers within mesasges, i know a bit confusing but we will have to work with it
//// userID is the users unique identifier from ther User database
//// uid is a unique identifier for a message if needed to identify a "room" or "privatemessage" within a namespace
//// _id is the built in unique identifier for the message provided by mongodb

///// CRUD RESTful API  /////
/////    Message Routes   /////
/////  POST - Create  /////
//Creating new message general
router.post('/new', (req, res) => {

    const newMessage = {
        "nickName": req.body.nickName,
        "message": req.body.message,
        "picture": req.body.picture,
        "userID": req.body.userID,
        "lon": req.body.lon,
        "lat": req.body.lat,
        "namespace": req.body.namespace,
        "date": req.body.date,
    }

    console.log(`What was recieved from app: \n ${newMessage}`);

    db.Message.create(newMessage).then((message) => {
        console.log(`Pushing to our db \n ${message}`);
        res.send(`User Added \n ${message}`);
    }).catch(err => res.send(err));
});
// Createing new messages with an unique identifier
router.post('/unique-new', (req, res) => {

    const newMessage = {
        "nickName": req.body.nickName,
        "message": req.body.message,
        "picture": req.body.picture,
        "userID": req.body.userID,
        "lon": req.body.lon,
        "lat": req.body.lat,
        "namespace": req.body.namespace,
        "uid": req.body.uid,
        "date": req.body.date,
    }

    console.log(`What was recieved from app: \n ${newMessage}`);

    db.Message.create(newMessage).then((message) => {
        console.log(`Pushing to our db \n ${message}`);
        res.send(`User Added \n ${message}`);
    }).catch(err => res.send(err));
});

/////  GET - Read  /////
// Find all messages from db regardless of namespace
router.get('/', (req, res) => {
    db.Message.find({}).then((message) => {
        console.log("grabbed all messages from our db");
        res.json(message);
    }).catch(err => console.log(err));
});

// Find messages by uid (Private Messages or Event)
router.get('/:uid', (req, res) => {
    db.Message.find({
        uid: req.parems.uid
    }).then((message) => {
        console.log("grabbed message from our db by uid");
        res.json(message);
    }).catch(err => console.log(err));
});

// Find messages by uid and sort by date (Private Messages or Event)
router.get('/:uid', (req, res) => {
    db.Message.find({
        uid: req.parems.uid
    }).sort('-date').then((message) => {
        console.log("grabbed message from our db by uid and sorted by date");
        res.json(message);
    }).catch(err => console.log(err));
});

// Find messages by uid (Private Messages or Event)
router.get('/:uid', (req, res) => {
    db.Message.find({
        uid: req.parems.uid
    }).then((message) => {
        console.log("grabbed message from our db by uid");
        res.json(message);
    }).catch(err => console.log(err));
});

// Find all messages by namespace (Group Chat)
router.get('/:nsp', (req, res) => {
    db.Message.find({
        namespace: req.parems.nsp
    }).then((message) => {
        console.log("grabbed message from our db by nsp");
        res.json(message);
    }).catch(err => console.log(err));
});

///// PUT  -  Update /////
// Edit message by _id
router.put("/:id", (req, res) => {
    const id = req.params.id;

    db.User.find(
        { "_id": id }
    ).then(() => {
        db.User.update(
            { "_id": id },
            {
                $set: {
                    message: req.body.message
                }
            }
        ).then((message) => {
            console.log(`Saved updated \n ${message}`);
            res.send(`Message has been updated.`);
        }).catch((err) => res.json(err));
    }).catch((err) => res.json(err));
});

///// DELETE - Delete /////
// Delete a message by _id
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    db.User.find(
        { "_id": id }
    ).then(() => {
        db.User.deleteOne(
            { "_id": id }
        ).then((message) => {
            console.log(`Message deleted \n ${message}`);
            res.send(`Message ${id} has been deleted.`);
        }).catch((err) => res.json(err));
    }).catch((err) => res.json(err));
});

module.exports = router;