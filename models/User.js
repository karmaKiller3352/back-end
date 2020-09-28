const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	email: {
    type: String,
    unique: true,
    required: true,
    match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'User'
  }
});


module.exports = mongoose.model('User', UserSchema);
