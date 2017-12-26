var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};

exports.verifyOrdinaryUser = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};

/**
 * Use after verifyOrdinaryUser to check if the user is admin
 */
exports.verifyAdmin = function(req, res, next){
    // We should have req.decoded._doc.admin in the req object
    // since it is a middleware that is supposed to be used after verifyOrdinaryUser
    if(req.decoded && req.decoded._doc && req.decoded._doc.admin){
        // Proceed, the user is an admin!
        next();
    }
    else{
        // not an admin or no decoded information
        var err = new Error("You are not authorized to perform this operation.");
        err.status = 403;
        return next(err);
    }
}