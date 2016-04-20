var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/User');
var aws = require('aws-sdk');

var PAGE_TITLE = 'GRP';

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

/* GET signup page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  return res.redirect('/login');
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  return res.render('signup', { title: PAGE_TITLE });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  return res.render('login', { title: PAGE_TITLE});
});

/* GET dashboard. */
router.get('/dashboard', isAuthenticated, function(req, res, next) {
  return res.render('dashboard', { title: PAGE_TITLE});
});

/* POST signup. */
router.post('/signup', function(req, res, next) {
	//for testing, set to always return true
	var email = req.body.email;
	var password = req.body.password;
	var confirm = req.body.confirm;
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 6 characters long').len(6);
  req.assert('confirm', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('form-errors', errors);
    return res.redirect('/signup');
  }

  var user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  // TODO: lowercase email?
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('form-errors', 'Account with that email address already exists.');
      return res.redirect('/signup');
    }
    user.save(function(err) {
      if (err) return next(err);
      req.login(user, function(err) {
        if (err) return next(err);
        return res.redirect('/dashboard');
      });
    });
  });
});

/* POST login. */
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', 'Incorrect email or password.');
      return res.redirect('/login');
    }
    req.login(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  return res.redirect('/login');
});

// TODO protect this authenticated route
router.get('/sign-s3', isAuthenticated, function(req, res) {
  // TODO validate the query variables name, type exist

  var name = req.query.name;
  var type = req.query.type;
  var bucketName = 'raas';

  var s3 = new aws.S3();
  var s3Options = {
    Bucket: bucketName,
    Key: name,
    Expires: 60,
    ContentType: type,
    // TODO do we want this to be public read
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3Options, function(err, data) {
    if (err){
      console.log(err);
    } else {
      var return_data = {
        signed_request: data,
        url: 'https://'+ bucketName +'.s3.amazonaws.com/' + name
      };
      return res.json(return_data);
    }
  });
});

module.exports = router;
