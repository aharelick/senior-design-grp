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

module.exports = router;
