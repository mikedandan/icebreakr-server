const express = require("express");
const router = express.Router();
const db = require("../models");
const haversine = require("haversine");

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
        res.send(`Message Added \n ${message}`);
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
        res.send(`Message Added \n ${message}`);
    }).catch(err => res.send(err));
});

//Post route to grab messages and filter it for the group chat
//need put for exact parems passed from front end
router.post('/filterHistory', (req, res) => {

    console.log(`What was recieved from app: \n ${req.body}`);
    console.log(req.body);

    db.Message.find({
        namespace: req.body.namespace
    }
    ).then((messages) => {
        const filtered = messages.filter(msg => {
            const start = {
                latitude: req.body.lat,
                longitude: req.body.lon 
            }

            const end = {
                latitude: msg.lat,
                longitude: msg.lon
            }
            // console.log(`User Location: \n ${start} \n  Message Location: \n ${end}`);
            // console.log(start);
            // console.log("Message Location: ")
            // console.log(end);

            return haversine(start, end, {threshold: 2, unit: 'mile'});
        });
        // console.log("========== Filtered Messages ==========")
        // console.log(filtered);

        // if messages exist / does not exist
        if (messages && messages.length) {
            res.json(filtered);
        } else {
            res.json([])
        }

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