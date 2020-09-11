const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const ArticleSchema = mongoose.Schema({
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
	image: {
		type: String,
	},
	categories: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
	},
});

ArticleSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Article', ArticleSchema);
