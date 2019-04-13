var express = require("express");

var router = express.Router();

var db = require("../models");

// var model = require("../models/burger.js");

router.get('/', function (req, res) {
    res.json("Hello World!");
});

router.post('/api/dummycreate', function (req, res) {
    const dummy = {
        actualName: "JP",
        displayName: "Jpizzle",
        email: "jpizzle@gmail.com",
        picture: "fcku"
    }

    console.log(dummy);

    db.User.create(dummy).then((user) => {
        console.log("pushing to our db");
        console.log(user);
    }).catch(err => console.log(err));

    res.send("User Added");
});


router.get('/api/user', function (req, res) {
    db.User.find({}).then((user) => {
        console.log("grabbed from our db");
        res.send(user);
    }).catch(err => console.log(err));
});

module.exports = router;