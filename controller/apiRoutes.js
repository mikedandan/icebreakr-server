const express = require("express");

const router = express.Router();

const db = require("../models");

// var model = require("../models/burger.js");

router.get('/', (req, res) => {
    res.json("Hello welcome to the Icebreakr Server!");
});

///// CRUD RESTful API  /////
/////    User Routes   /////
/////  POST - Create  /////
//Creating new User Route
router.post('/api/register', (req, res) => {

    const newUser = {
        "password": req.body.password,
        "displayName": req.body.displayName,
        "email": req.body.email,
        "picture": req.body.picture
    }

    console.log(`What was recieved from app: \n ${newUser}`);

    db.User.create(newUser).then((user) => {
        console.log(`Pushing to our db \n ${user}`);
        res.send(`User Added \n ${user}`);
    }).catch(err => res.send(err));
});

/////  GET - Read  /////
// Find all users
router.get('/api/user', (req, res) => {
    db.User.find({}).then((user) => {
        console.log("grabbed all users from our db");
        res.json(user);
    }).catch(err => console.log(err));
});
// Find user by email
router.get('/api/user/:email', (req, res) => {
    db.User.find({
        email: req.parems.email
    }).then((user) => {
        console.log("grabbed user from our db by email");
        res.json(user);
    }).catch(err => console.log(err));
});
// Find user by ID
router.get('/api/user/:id', (req, res) => {
    db.User.find({
        _id: req.parems.id
    }).then((user) => {
        console.log("grabbed from our db by id");
        res.json(user);
    }).catch(err => console.log(err));
});

///// PUT  -  Update /////
// Update password by email
router.put("/api/user/:email", (req, res) => {
    const email = req.params.email;

    db.User.find(
        { "email": email }
    ).then(() => {
        db.User.update(
            { "email": email },
            {
                $set: {
                    password: req.body.password
                }
            }
        ).then((dbUser) => {
            console.log(`Saved updated \n ${dbUser}`);
            res.send(`User's password has been updated.`);
        }).catch((err) => res.json(err));
    }).catch((err) => res.json(err));
});

// Update email by email
router.put("/api/user/:email", (req, res) => {
    const email = req.params.email;

    db.User.find(
        { "email": email }
    ).then(() => {
        db.User.update(
            { "email": email },
            {
                $set: {
                    email: req.body.email
                }
            }
        ).then((dbUser) => {
            console.log(`Saved updated \n ${dbUser}`);
            res.send(`User's email has been updated.`);
        }).catch((err) => res.json(err));
    }).catch((err) => res.json(err));
});

///// DELETE - Delete /////
router.delete("/api/user/:email", (req, res) => {
    const email = req.params.email;
    db.User.find(
        { "email": email }
    ).then(() => {
        db.User.deleteOne(
            { "email": email }
        ).then((dbUser) => {
            console.log(`User deleted \n ${dbUser}`);
            res.send(`User ${email} has been deleted.`);
        }).catch((err) => res.json(err));
    }).catch((err) => res.json(err));
});


module.exports = router;