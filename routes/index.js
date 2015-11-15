var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/User');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'RaaS' });
});

/* GET dashboard. */
router.get('/dashboard', function(req, res, next) {
    res.render('dash', { title: 'RaaS'});
});

/* POST signup. */
router.post('/signup', function(req, res, next) {
	//for testing, set to always return true
	var email = req.body.email;
	var password = req.body.password;
	var confirm = req.body.confirm;
    // req.assert('fname', 'First name cannot be blank').notEmpty();
    // req.assert('lname', 'Last name cannot be blank').notEmpty();
    // req.assert('email', 'Email is not valid').isEmail();
    // req.assert('password', 'Password must be at least 6 characters long').len(6);
    // req.assert('confirm', 'Passwords do not match').equals(req.body.password);
    // req.assert('role', 'Not a valid role').role();

    // var errors = req.validationErrors();

    // if (errors) {
    //  req.flash('errors', errors);
    //  return res.redirect('/signup');
    // }

    var user = new User({
        email: req.body.email,
        password: req.body.password,
    });

    // email.toLowerCase()?
    User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {
            // req.flash('errors', { msg: 'Account with that email address already exists.' });
            return res.redirect('/');
        }
        console.log('before save');
        user.save(function(err) {
            console.log('after save');
            if (err) return next(err);
            req.logIn(user, function(err) {
                if (err) return next(err);
                res.redirect('/dashboard');
            });
        });
    });
});

/* POST login. */
router.post('/login', passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    })
);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
