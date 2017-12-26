// Grab the mongoose
var mongoose = require("mongoose");
// Schema class
var Schema = mongoose.Schema;

// Create the dish schema
var leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true    // Assuming unique names 
    },
    image: {
        type: String,
        required: false
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: false,
        default: ""
    },
    description: {
        type: String,
        required: true
    }
});

// Create the model with schema
var Leaders = mongoose.model('Leader', leaderSchema);
// Node module export
module.exports = Leaders;