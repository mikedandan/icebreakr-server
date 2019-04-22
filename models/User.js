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
        type: Number,
        required: true
    },
    gender:{
        type: Number,
        required: true
    }
})

const User = mongoose.model("users", UserSchema);

module.exports = User;