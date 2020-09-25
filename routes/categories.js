const express = require('express');
const router = express.Router();
const multer = require('multer');
const Category = require('../models/Category');
const Article = require('../models/Article');
const makePageUrl = require('../utils/makePageUrl');


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/uploads/images/');
	},
	filename: (req, file, cb) => {
		cb(null, `_${file.originalname}`);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(new Error('Invalid file type'), false);
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 3,
	},
});

//Routes

// return all Categories
router.get('/', async (req, res) => {
	const perPage = 10;
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
			pagination: {
				count: numOfCat,
				page,
				pages: Math.ceil(numOfCat / perPage),
			},
		});
	} catch (error) {
		console.log(error);
		res.status(404).json(error);
	}
});

// add Category
router.post('/', upload.single('image'), async (req, res) => {
	const category = new Category({
		...req.body,
		image: req.file
			? `${process.env.DEV_HOST}/uploads/images/${req.file.filename}`
			: '',
		metaTitle: req.body.metaTitle || req.body.title,
		url: req.body.url || makePageUrl(req.body.title),
	});

	try {
		const savedCategory = await category.save();
		res.status(201).json(savedCategory);
	} catch (error) {
		res.status(404).json(error);
	}
});

// return Category by ID
router.get('/:categoryId', async (req, res) => {
	console.log(req.params.categoryId);
	try {
		const category = await Category.findById(req.params.categoryId);
		const articles = await Article.find({
			categories: req.params.categoryId,
		}).limit(100);
		res.status(200).json({
      category: category,
      articles: articles,
    });
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
router.patch('/:categoryId', upload.single('image'), async (req, res) => {
  if (req.body.active) {
		const updatedActivityCategory = await Category.updateOne(
			{ _id: req.params.categoryId },
			{ $set: { ...req.body } }
    );
    res.status(200).json(updatedActivityCategory);
	} else {
	const updatedCategory = await Category.updateOne(
		{ _id: req.params.categoryId },
		{
			$set: {
				...req.body,
				image: req.file
					? `${process.env.DEV_HOST}/uploads/images/${req.file.filename}`
					: req.body.image,
			},
		}
	);
  res.status(200).json(updatedCategory);
  }
	try {
	} catch (error) {
		res.status(404).json(error);
	}
});

module.exports = router;
