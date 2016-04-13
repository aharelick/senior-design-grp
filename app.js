var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var routes = require('./routes/index');
var expressValidator = require('express-validator');
var aws = require('aws-sdk');

require('./config/pass')(passport);

var app = express();


/**
 * Connect to MongoDB.
 */

var config;
if (app.get('env') === 'development') {
  config = require('./config/config');
}

var dbURI = process.env.MONGODB_URI || config.db;
var awsAccessKey = process.env.AWS_ACCESS_KEY || config.awsAccessKey;
var awsSecretKey = process.env.AWS_SECRET_KEY || config.awsSecretKey;

mongoose.connect(dbURI);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

aws.config.update({accessKeyId: awsAccessKey, secretAccessKey: awsSecretKey});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: dbURI,
    autoReconnect: true
  }),
  secret: process.env.SESSION_SECRET || config.sessionSecret,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
  res.locals.messages = {
    success: req.flash('success'),
    errors: req.flash('errors'),
    form_errors: req.flash('form-errors')
  };
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

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
    res.render('error', {
      message: err.message,
      status: err.status,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    status: err.status,
    error: {}
  });
});


module.exports = app;
