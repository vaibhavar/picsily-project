var express = require("express");
var leaderRouter = express.Router();
var morgan = require("morgan");
var bodyParser = require("body-parser");

var mongoose = require("mongoose");

// Leaders model
var Leaders = require('../models/leaderships');


// Logging Middleware
leaderRouter.use(morgan('dev'));
// JSON Parser middleware
leaderRouter.use(bodyParser.json());

// Leaders collection handler
leaderRouter.route("/")
.get(function(req, res, next){
     // Find all leaders from mongoDB
    Leaders.find({}, function(err, leader){
        if(err){ 
            throw err;
        }
        res.json(leader);
    });
})
.post(function(req, res, next){
  // Assuming req.body contains new promotion object
    Leaders.create(req.body, function(err, leader){
        if(err){
            throw err;
        }
        var id = leader._id;
        res.json(leader);
    });    
})
.put(function(req, res, next){
    res.end('Will update the leaders for you');    
})
.delete(function(req, res, next){
    Leaders.remove({}, function(err, response){
        if(err){
            throw err;
        }
        res.json(response);
    });
});

// Dish entity handler
leaderRouter.route("/:leaderId")
.get(function(req, res, next){
    Leaders.findById(req.params.leaderId, function(err, oLeader){
        if(err){
            throw err;
        }
        res.json(oLeader);
    });
})
.put(function(req, res, next){
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set: req.body
    },
    {
        new: true   // callback should return updated promotion object
    }, function(err, oLeader){
        if(err){
            throw err;
        }
        res.json(oLeader);
    })
})
.delete(function(req, res, next){
    Leaders.findByIdAndRemove(req.params.leaderId, function (err, response) {
        if (err){
            throw err;
        }
        res.json(response);
    });
})
.post(function(req, res, next){
  res.end("POST not supported");  
});

// Export the module
module.exports = leaderRouter;