// Grab the mongoose
var mongoose = require("mongoose");

// Schema class
var Schema = mongoose.Schema;

// Create the dish schema
var dishSchema = new Schema({
    title: {
        type: String,
        required: false,
        unique: false
    },
    fileURL: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    colors: {
        type: [String],
        required: false,
        default: [""]
    },
    tags:{
        type: [String],
        required: false,
        default: [""]
    }
}, { 
    timestamps: true
});

// Create the model with schema
var Photos = mongoose.model('Photo', dishSchema);
// Node module export
module.exports = Photos;