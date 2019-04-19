const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys.js");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const User = require("../models/User");
const db = require("../models");

///// CRUD RESTful API  /////
/////    User Routes   /////
/////  POST - Create  /////
//Creating new User 
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    }
    const newUser = new User({
      displayName: req.body.name,
      email: req.body.email,
      password: req.body.password,
      picture: req.body.picture
    });
    // Hash password before saving in database
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    });

  });
});

//Check user login
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password 
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.displayName,
          email: user.email,
          picture: user.picture
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

/////  GET - Read  /////
// Find all users
router.get('/', (req, res) => {
  db.User.find({}).then((user) => {
    console.log("grabbed all users from our db");
    res.json(user);
  }).catch(err => console.log(err));
});
// Find user by email
router.get('/:email', (req, res) => {
  db.User.find({
    email: req.parems.email
  }).then((user) => {
    console.log("grabbed user from our db by email");
    res.json(user);
  }).catch(err => console.log(err));
});
// Find user by ID
router.get('/:id', (req, res) => {
  db.User.find({
    _id: req.parems.id
  }).then((user) => {
    console.log("grabbed from our db by id");
    res.json(user);
  }).catch(err => console.log(err));
});

///// PUT  -  Update /////
// Update password by email
router.put("/:email", (req, res) => {
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
router.put("/:email", (req, res) => {
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
router.delete("/:email", (req, res) => {
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