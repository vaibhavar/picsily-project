var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var users = require('./routes/users');
var photosRouter = require('./routes/photosRouter');

var config = require('./config');

console.log('Config = ', config);

var app = express();

// Connection to MongoDB server
var mongoose = require('mongoose');

mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connected correctly to server');
});

// passport config
var User = require('./models/user');
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser({ keepExtensions: true, uploadDir: 'uploads', limit: '50mb' }));
app.use(cookieParser());

app.use(function(req, res, next) {
  // Allow requests from Picsily UI
  res.header('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
  // Allow custom header to be set
  res.header('Access-Control-Allow-Headers', 'x-access-token');
  // Allow all methods
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
  // Allow cookies
  res.header('Access-Control-Allow-Credentials', true);

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.send();
  } else {
    // Other requests after preflight
    next();
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/photos', photosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
    });
  });
}

module.exports = app;
