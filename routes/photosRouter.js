var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Photo model
var Photos = require('../models/photos');

// To verify user
var Verify = require('./verify');


// Create router instance
var photoRouter = express.Router();
// Middleware for logging
photoRouter.use(morgan('dev'));
// Middleware for parsing JSON requests
photoRouter.use(bodyParser.json());

// Photos collection handler
photoRouter.route("/")
.get(function(req, res, next){
    // Find all photos from mongoDB
    Photos.find({})
          .exec(function(err, photo){
            if(err){ 
                throw err;
            }
            res.json(photo);
        });
})
.post(Verify.verifyOrdinaryUser, function(req, res, next){
    // Assuming name and description has been sent from request in JSON
    if(req.body.fileURL){
        var oUser = req.user;
        var oPhoto = {
            title: req.body.title,
            fileURL: req.body.fileURL,
            colors: [],     // TODO detect colors and add here
            tags: [],       // TODO handle tags
            user: req.user
        }
        // Assuming req.body contains new photo object
        Photos.create(req.body, function(err, photo){
            if(err){
                throw err;
            }
            var id = photo._id;
            res.json(photo);
        });
    }
    else{
        res.json({error: 'Name / Description are required'});
    }
});

// Photo entity handler
photoRouter.route("/:photoId")
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    Photos.findById(req.params.photoId, function(err, photo){
        if(err){
            throw err;
        }
        res.json(photo);
    });
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Photos.findByIdAndUpdate(req.params.photoId,{
        $set: req.body
    },
    {
        new: true   // callback should return updated photo object
    }, function(err, photo){
        if(err){
            throw err;
        }
        res.json(photo);
    })
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Photos.findByIdAndRemove(req.params.photoId, function (err, response) {
        if (err){
            throw err;
        }
        res.json(response);
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
  res.json({error: "POST not supported"});  
});


// Export the module
module.exports = photoRouter;