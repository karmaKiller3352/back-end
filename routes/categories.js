const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Article = require('../models/Article');
const makePageUrl = require('../utils/makePageUrl');

//Routes

// return all Categories
router.get('/', async (req, res) => {
	const perPage = 2;
	const page = req.query.page || 1;
	const query = {};
	if (req.query.hasOwnProperty('search') && req.query.search) {
		query['$text'] = {
			$search: req.query.search,
		};
	}
	try {
		const numOfCat = await Category.count(query);
		const categories = await Category.find(query)
			.skip(perPage * (page === 'all' ? 1 : page) - perPage)
			.limit(perPage + (page === 'all' ? 1000 : 0))
			.sort({ date: -1 });
		res.status(200).json({
			categories,
			count: numOfCat,
			page,
			pages: Math.ceil(numOfCat / perPage),
		});
	} catch (error) {
		console.log(error);
		res.status(404).json(error);
	}
});

// add Category
router.post('/', async (req, res) => {
	console.log(req.body);
	const category = new Category({
		title: req.body.title,
		content: req.body.content,
		url: makePageUrl(req.body.title),
	});

	try {
		const savedCat = await category.save();
		res.status(201).json(savedCat);
	} catch (error) {
		res.status(400).json(error);
	}
});

// return Category by ID
router.get('/:categoryId', async (req, res) => {
	console.log(req.params.categoryId);
	try {
		const category = await Category.findById(req.params.categoryId);
		const articles = await Article.find({
			categories: req.params.categoryId,
		}).limit(20);
		category['articles'] = articles;
		res.status(200).json(category);
	} catch (error) {
		res.status(404).json(error);
	}
});

// delete Category by ID
router.delete('/:categoryId', async (req, res) => {
	try {
		const removedCat = await Category.deleteOne({
			_id: req.params.categoryId,
		});
		res.status(204).json(removedCat);
	} catch (error) {
		res.status(404).json(error);
	}
});

// update Category by ID
router.patch('/:categoryId', async (req, res) => {
	try {
		const updatedCat = await Category.updateOne(
			{ _id: req.params.categoryId },
			{ $set: { ...req.body } }
		);
		res.status(200).json(updatedCat);
	} catch (error) {
		res.status(404).json(error);
	}
});

module.exports = router;
