const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventSchema = new Schema({
    eventName:{
        type: String,
        required: true
    },
    eventLocation:{
        type: String,
        required: true
    },
    eventLat:{
        type: Number,
        required: true
    },
    eventLng:{
        type: Number,
        required: true
    },
    eventId:{
        type: String,
        required: true
    },
    eventOwner:{
        type: String,
        required: true
    },
})

const Event = mongoose.model("EventSchema", EventSchema);

module.exports = Event;