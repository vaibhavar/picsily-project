// Grab the mongoose
var mongoose = require("mongoose");
// Schema class
var Schema = mongoose.Schema;

// Create the dish schema
var favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }
}, { 
    timestamps: true
});

// Create the model with schema
var Favorites = mongoose.model('Favorite', favoriteSchema);
// Node module export
module.exports = Favorites;