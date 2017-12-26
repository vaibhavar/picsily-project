var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Dish model
var Dishes = require('../models/dishes');

// To verify user
var Verify = require('./verify');


// Create router instance
var dishRouter = express.Router();
// Middleware for logging
dishRouter.use(morgan('dev'));
// Middleware for parsing JSON requests
dishRouter.use(bodyParser.json());

// Dishes collection handler
dishRouter.route("/")
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    // Find all dishes from mongoDB
    Dishes.find({})
          .populate('comments.postedBy')
          .exec(function(err, dish){
            if(err){ 
                throw err;
            }
            res.json(dish);
        });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    // Assuming name and description has been sent from request in JSON
    if(req.body.name && req.body.description){
        
        // Best practice to create dish with a new object (validations)
        var oNewDish = {
            name: req.body.name,
            description: req.body.description
        };
        
        // Assuming req.body contains new dish object
        Dishes.create(req.body, function(err, dish){
            if(err){
                throw err;
            }
            var id = dish._id;
            res.json(dish);
        });
    }
    else{
        res.json({error: 'Name / Description are required'});
    }
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    res.end('Will update the dishes for you');    
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin,  function(req, res, next){
    Dishes.remove({}, function(err, response){
        if(err){
            throw err;
        }
        res.json(response);
    });
});

// Dish entity handler
dishRouter.route("/:dishId")
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    Dishes.findById(req.params.dishId, function(err, dish){
        if(err){
            throw err;
        }
        res.json(dish);
    });
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set: req.body
    },
    {
        new: true   // callback should return updated dish object
    }, function(err, dish){
        if(err){
            throw err;
        }
        res.json(dish);
    })
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Dishes.findByIdAndRemove(req.params.dishId, function (err, response) {
        if (err){
            throw err;
        }
        res.json(response);
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
  res.json({error: "POST not supported"});  
});


// Handling comments
dishRouter.route('/:dishId/comments')
.all(Verify.verifyOrdinaryUser)
.get( function (req, res, next) {
    Dishes.findById(req.params.dishId)
          .populate('comments.postedBy')
          .exec(function (err, dish) {
                if (err) throw err;
                res.json(dish.comments);
            });
})
.post( function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) throw err;
        // Getting user id from request
        req.body.postedBy = req.decoded._doc._id;
        dish.comments.push(req.body);
        dish.save(function (err, dish) {
            if (err) throw err;
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})
.put(function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) throw err;
        dish.comments.id(req.params.commentId).remove();
        req.body.postedBy = req.decoded._doc._id;
        dish.comments.push(req.body);
        dish.save(function (err, dish) {
            if (err) throw err;
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})
.delete(function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (dish.comments.id(req.params.commentId).postedBy !== req.decoded._doc._id) {
            var err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
        dish.comments.id(req.params.commentId).remove();
        dish.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
});

dishRouter.route('/:dishId/comments/:commentId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err){ 
            throw err;
        }
        res.json(dish.comments.id(req.params.commentId));
    });
})
.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err){
            throw err;
        }
        // Remove existing comment
        dish.comments.id(req.params.commentId).remove();
        // Insert new comment
        dish.comments.push(req.body);
        
        dish.save(function (err, dish) {
            if (err) throw err;
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})
.delete(function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (dish.comments.id(req.params.commentId).postedBy
           != req.decoded._doc._id) {
            var err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
        dish.comments.id(req.params.commentId).remove();
        dish.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
});


// Export the module
module.exports = dishRouter;