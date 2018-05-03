var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
secret: process.env.JWT_SECRET,
userProperty: 'payload'
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'SecSysApp' });
});

module.exports = router;
