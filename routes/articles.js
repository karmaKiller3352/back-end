const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const makePageUrl = require('../utils/makePageUrl');

//Routes

// return all articles
router.get('/', async (req, res) => {
	try {
		const articlles = await Article.find()
			.populate({
				path: 'categories',
				select: ['title', 'url'],
			})
			.limit(20);
		res.status(200).json(articlles);
	} catch (error) {
		res.status(404).json(error);
	}
});

// add article
router.post('/', async (req, res) => {
	const article = new Article({
		...req.body,
		metaTitle: req.body.metaTitle || req.body.title,
		url: makePageUrl(req.body.title),
	});

	try {
		const savedPost = await article.save();
		res.status(201).json(savedPost);
	} catch (error) {
		res.status(404).json(error);
	}
});

// return article by ID
router.get('/:articleId', async (req, res) => {
	console.log(req.params.articleId);
	try {
		const article = await Article.findById(req.params.articleId).populate({
			path: 'categories',
			select: ['title', 'url'],
		});
		res.status(200).json(article);
	} catch (error) {
		res.status(404).json(error);
	}
});

// delete article by ID
router.delete('/:articleId', async (req, res) => {
	try {
		const removedPost = await Article.deleteOne({
			_id: req.params.articleId,
		});
		res.status(204).json(removedPost);
	} catch (error) {
		res.status(404).json(error);
	}
});

// update article by ID
router.patch('/:articleId', async (req, res) => {
	try {
		const updatedPost = await Article.updateOne(
			{ _id: req.params.articleId },
			{ $set: { ...req.body } }
		);
		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(404).json(error);
	}
});

module.exports = router;
