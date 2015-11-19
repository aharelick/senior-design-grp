var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/User');

/* GET signup page. */
router.get('/', function(req, res, next) {
  res.redirect('/signup');
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'RaaS' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'RaaS'});
});

/* GET dashboard. */
router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'RaaS'});
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
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  var user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  // email.toLowerCase()?
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }
    user.save(function(err) {
      if (err) return next(err);
      req.login(user, function(err) {
        if (err) return next(err);
        res.redirect('/dashboard');
      });
    });
  });
});

/* POST login. */
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', { msg: 'Incorrect email or password.' });
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
  res.redirect('/login');
});

module.exports = router;
