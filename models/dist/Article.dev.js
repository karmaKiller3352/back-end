"use strict";

var mongoose = require('mongoose');

var ArticleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    "default": Date.now
  },
  url: {
    type: String,
    unique: true
  }
});
module.exports = mongoose.model('Article', ArticleSchema);