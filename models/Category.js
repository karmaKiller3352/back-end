const mongoose = require('mongoose');

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

module.exports = mongoose.model('Category', CategorySchema);
