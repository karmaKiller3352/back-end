"use strict";

var express = require('express');

var router = express.Router(); //Routes

router.get('/', function (req, res) {
  res.send('Posts page');
});
router.get('/specific', function (req, res) {
  res.send('Posts page - specific');
});
module.exports = router;