"use strict";

var express = require('express');

var app = express();

var mongoose = require('mongoose');

var bodyParser = require('body-parser');

var postRoute = require('./routes/articles');

require('dotenv/config'); //Middlewares


app.use(bodyParser.json());
app.use('/articles', postRoute); // Routes

app.get('/', function (req, res) {
  res.send('Home page');
}); //Connect to DB

mongoose.connect(process.env.DB_CONNECTION, {
  useUnifiedTopology: true
}, function (e) {
  console.log('connected');
  console.log(e);
});
app.listen(5000);