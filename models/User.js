const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    password:{
        type: String,
        required: false
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
    // userID:{
    //     type: String,
    //     required: true
    // }
})

const User = mongoose.model("users", UserSchema);

module.exports = User;