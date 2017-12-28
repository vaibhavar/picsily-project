var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// Used for photo upload
var cloudinary = require('cloudinary')
var multer = require("multer");
var upload = multer({ dest: "uploads" }); // multer configuration

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

photoRouter.route("/upload")
.post(Verify.verifyOrdinaryUser, upload.single("file"), function(req, res, next){    // Verify.verifyOrdinaryUser,
    console.log("File = ",req.file.path);
    //res.json(req.file);
    cloudinary.config("cloudinary://578513365711197:");
    cloudinary.config({ 
      cloud_name: 'hj4eeazq0', 
      api_key: '578513365711197', 
      api_secret: 'ngNEJtjRQf8Wui5SWr3PPKAWWcA' 
    });
    cloudinary.uploader.upload(req.file.path, function(result) { 
        // Add to photos db
        var oUser = req.decoded._doc;
        var oPhoto = {
            title: "",
            fileURL: result.url,
            colors: [],
            tags: [],
            userId: mongoose.Types.ObjectId(req.decoded._doc._id)
        }
        
        // Assuming req.body contains new photo object
        Photos.create(oPhoto, function(err, photo){
            if(err){
                throw err;
            }
            var id = photo._id;
            res.json(photo);
        });
     });
});

photoRouter.route("/my")
.get(Verify.verifyOrdinaryUser, function(req, res, next){

    // Find all photos from mongoDB
    Photos.find({userId: req.decoded._doc}).populate('userId')
          .exec(function(err, photo){
            if(err){ 
                throw err;
            }
            res.json(photo);
        });
});

// Photos collection handler
photoRouter.route("/")
.get(function(req, res, next){
    // Find all photos from mongoDB
    Photos.find({}).populate('userId')
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
        var oUser = req.decoded._doc;
        var oPhoto = {
            title: req.body.title,
            fileURL: req.body.fileURL,
            colors: [],     // TODO detect colors and add here
            tags: [],       // TODO handle tags
            userId: mongoose.Types.ObjectId(req.decoded._doc._id)
        }
        // Assuming req.body contains new photo object
        Photos.create(oPhoto, function(err, photo){
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