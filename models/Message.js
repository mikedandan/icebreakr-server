const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    nickName:{
        type: String,
        required: true
    },
    message:{
        type: String
    },
    email:{
        type: String,
        required: true
    },
    picture:{
        type: String,
        required: true
    },
    userID:{
        type: String,
        required: true
    },
    lon:{
        type: Number,
        required: true
    },
    lat:{
        type: Number,
        required: true
    }
})

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;