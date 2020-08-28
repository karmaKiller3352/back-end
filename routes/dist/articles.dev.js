"use strict";

var express = require('express');

var router = express.Router();

var Article = require('../models/Article'); //Routes


router.get('/', function (req, res) {
  res.send('Articles page');
});
router.post('/', function (req, res) {
  var article = new Article({
    title: req.body.title,
    content: req.body.content
  });
  article.save().then(function (data) {
    res.json(data);
  })["catch"](function (error) {
    res.json({
      message: error
    });
  });
  console.log(req.body);
});
module.exports = router;