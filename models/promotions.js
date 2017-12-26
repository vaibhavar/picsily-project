// Mongoose require
var mongoose = require("mongoose");
// Schema class of mongoose
var Schema = mongoose.Schema;

// Currency Module needed for price field
// This line adds another schema type to Mongoose provided types
require('mongoose-currency').loadType(mongoose);
// Type for price field
var Currency = mongoose.Types.Currency;

// Create the dish schema
var promotionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true  
    },
    price: {
        type: Currency,
        required: true
    },
    label: {
        type: String,
        required: false,
        default: ""
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
});

// Create the model with schema
var Promotions = mongoose.model('Promotion', promotionSchema);
// Node module export
module.exports = Promotions;