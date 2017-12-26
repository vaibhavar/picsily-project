var express = require("express");
var promoRouter = express.Router();
var morgan = require("morgan");
var bodyParser = require("body-parser");

var mongoose = require("mongoose");

// Promotion model
var Promotions = require('../models/promotions');

// To verify user
var Verify = require('./verify');


// Logging middleware
promoRouter.use(morgan('dev'));
// Parsing JSON middleware
promoRouter.use(bodyParser.json());

// Promotions collection handler
promoRouter.route("/")
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    // Find all promotions from mongoDB
    Promotions.find({}, function(err, promotion){
        if(err){ 
            throw err;
        }
        res.json(promotion);
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
     // Assuming req.body contains new promotion object
    Promotions.create(req.body, function(err, promotion){
        if(err){
            throw err;
        }
        var id = promotion._id;
        res.json(promotion);
    });
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    res.end('Will update the promotions for you');    
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Promotions.remove({}, function(err, response){
        if(err){
            throw err;
        }
        res.json(response);
    });
});

// Promotion entity handler
promoRouter.route("/:promoId")
.get(Verify.verifyOrdinaryUser, function(req, res, next){
     Promotions.findById(req.params.promoId, function(err, oPromotion){
        if(err){
            throw err;
        }
        res.json(oPromotion);
    });
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Promotions.findByIdAndUpdate(req.params.promoId,{
        $set: req.body
    },
    {
        new: true   // callback should return updated promotion object
    }, function(err, oPromotion){
        if(err){
            throw err;
        }
        res.json(oPromotion);
    })
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Promotions.findByIdAndRemove(req.params.promoId, function (err, response) {
        if (err){
            throw err;
        }
        res.json(response);
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
  res.end("POST not supported");  
});

// Export the module
module.exports = promoRouter;