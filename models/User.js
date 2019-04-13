const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    password:{
        type: String,
        required: true
    },
    displayName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    picture:{
        type: String,
        required: true
    }
    // ,
    // userID:{
    //     type: String,
    //     required: true
    // }
})

const User = mongoose.model("User", UserSchema);

module.exports = User;