var express = require("express");

var router = express.Router();

var db = require("../models");

// var model = require("../models/burger.js");

router.get('/', function (req, res) {
    res.json("Hello World, Z!");
});

router.get('/test', function (req, res) {
    res.json("Hello World, work pls!");
});

///// CRUD Restful API /////
/////  POST - Create  /////

// Dummy test Route
router.get('/api/dummycreate', function (req, res) {
    const dummy = {
        "actualName": "JP",
        "displayName": "Jpizzle",
        "email": "jpizzle@gmail.com",
        "picture": "fcku"
    }

    console.log(dummy);

    db.User.create(dummy).then((user) => {
        console.log("pushing to our db");
        console.log(user);
    }).catch(err => console.log(err));

    res.send("User Added");
});

//Creating new User Route
router.post('/api/register', function (req, res) {

    const newUser = {
        "password": req.body.password,
        "displayName": req.body.displayName,
        "email": req.body.email,
        "picture": req.body.picture
    }

    console.log(newUser);

    db.User.create(newUser).then((user) => {
        console.log("pushing to our db");
        console.log(user);
    }).catch(err => console.log(err));

    res.send("User Added");
});

/////  GET - Read  /////
router.get('/api/user', function (req, res) {
    db.User.find({}).then((user) => {
        console.log("grabbed from our db");
        res.send(user);
    }).catch(err => console.log(err));
});


// PUT  -  Update //

// DELETE  -  Delete //



module.exports = router;