var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'RaaS' });
});

/* GET dashboard. */
router.get('/dashboard', function(req, res, next) {
	//if logged in, go to this page, else don't
	res.render('dash', { title: 'RaaS'});
});

/* POST signup. */
router.post('/signup', function(req, res, next) {
	//for testing, set to always return true
	var email = req.body.email;
	var password1 = req.body.password1;
	var password2 = req.body.password2;
	res.render('dash', {title: 'Welcome!', success: true});
});

/* POST login. */
router.post('/login', function(req, res, next) {
	//for testing, set to always return true
	var email = req.body.email;
	var password = req.body.password;
	res.render('dash', {title: 'Welcome!', success: true});
});

module.exports = router;
