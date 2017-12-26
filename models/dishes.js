// Grab the mongoose
var mongoose = require("mongoose");

// Currency Module needed for price field
// This line adds another schema type to Mongoose provided types
require('mongoose-currency').loadType(mongoose);

// Type for price field
var Currency = mongoose.Types.Currency;


// Schema class
var Schema = mongoose.Schema;

// Comments schema
var commentSchema = new Schema({
    rating: {   // Constraints >= 1 and <= 5
        type: Number,
        min: 1, 
        max: 5,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Create the dish schema
var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    comments: [commentSchema],
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label:{
        type: String,
        required: false, // Label is optional
        default: "" // Default label is blank string
    },
    price: {
        type: Currency, // Mongoose-currency type
        required: true,
        min: 0  // Minimum price = 0 (Free!)
    }
}, { 
    timestamps: true
});

// Create the model with schema
var Dishes = mongoose.model('Dish', dishSchema);
// Node module export
module.exports = Dishes;