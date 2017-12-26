var express = require("express");
var favoritesRouter = express.Router();
var morgan = require("morgan");
var bodyParser = require("body-parser");

var mongoose = require("mongoose");

// Favorites model
var Favorites = require('../models/favorites');

// To verify user
var Verify = require('./verify');


// Logging middleware
favoritesRouter.use(morgan('dev'));
// Parsing JSON middleware
favoritesRouter.use(bodyParser.json());

// Favorites collection handler
favoritesRouter.route("/")
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    // Find all favorites from mongoDB
    Favorites.find({}).populate('user').populate('dish').exec(function(err, favorite){
        if(err){ 
            throw err;
        }
        res.json(favorite);
    });
})
.post(Verify.verifyOrdinaryUser, function(req, res, next){
    var sUserId = req.decoded._doc._id;
    // Add user information
    req.body.user = sUserId;

    // Find if this user has added this dish to favorites earlier or not
    Favorites.find({user: sUserId, dish: req.body.dish}, function(err, oFavorite){
        if(err){
            throw err;
        }
        
        if(oFavorite.length !== 0){
            var err = new Error("You cannot favorite a dish twice!");
            return next(err);
        }
        else{
            // Create favorite for this dish
            // Assuming req.body contains new dish information
            Favorites.create(req.body, function(err, favorite){
                if(err){
                    throw err;
                }
                res.json(favorite);
            });
        }
    });
})
.delete(Verify.verifyOrdinaryUser, function(req, res, next){
    var sUserId = req.decoded._doc._id;
    Favorites.remove({user: sUserId}, function(err, response){
        if(err){
            throw err;
        }
        res.json(response);
    });
});

// Favorite entity handler
favoritesRouter.route("/:dishObjectId")
.delete(Verify.verifyOrdinaryUser, function(req, res, next){
    var sUserId =  req.decoded._doc._id;
    Favorites.find({dish: req.params.dishObjectId}).exec(function(err, aFavorites){
        // the entry does not exist
        if(aFavorites.length === 0){
            err = new Error("The dish has already been removed from favorites ");
            return next(err);
        }
        var oFavorite = aFavorites[0];
        var sFavoriteId = oFavorite._id;
        if(oFavorite.user == sUserId){
            // Remove the favorite entry
            Favorites.findByIdAndRemove(sFavoriteId, function (err, response) {
                if (err){
                    throw err;
                }
                res.json(response);
            });
        }
        else{
            err = new Error("You can only delete your own favorite entry");
            return next(err);
        }
    });
});
// Export the module
module.exports = favoritesRouter;