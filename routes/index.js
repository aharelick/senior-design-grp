var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'RaaS' });
});

/* GET dashboard. */
router.get('/dashboard', function(req, res, next) {
  res.render('index', { title: 'RaaS' });
});

module.exports = router;
