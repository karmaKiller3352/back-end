const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const CategorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  url: {
    type: String,
    unique: true,
    required: true,
  },
  metaTitle: {
    type: String,
  },
  metaDesc: {
    type: String,
  },
});
CategorySchema.index({title: 'text', content: 'text'});
CategorySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Category', CategorySchema);
