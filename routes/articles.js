const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongooseErrorHandler = require('mongoose-error-handler');

const Article = require('../models/Article');
const formatDate = require('../utils/formatDate');
const makePageUrl = require('../utils/makePageUrl');
const e = require('express');

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

// return all articles
router.get('/', async (req, res) => {
  const perPage = 5;
  const page = req.query.page;
	const query = {};
	if (
		req.query.hasOwnProperty('categories') &&
		req.query.categories &&
		req.query.categories !== 'Not choosed'
	) {
		query['categories'] = req.query.categories;
	}
	if (req.query.hasOwnProperty('search') && req.query.search) {
		query['$text'] = {
			$search: req.query.search,
		};
	}
	
	try {
    const numOfArticles = await Article.count(query);
		const articles = await Article.find(query)
			.populate({
				path: 'categories',
				select: ['title', 'url'],
      })
      .skip((perPage * page) - perPage)
      .limit(perPage)
			.sort({ date: -1 })
		res.status(200).json({
      articles,
      count: numOfArticles,
      page,
      pages: Math.ceil(numOfArticles / perPage), 
    }
   );
	} catch (error) {
		res.status(404).json(error);
	}
});

// add article
router.post('/', upload.single('image'), async (req, res) => {
	const article = new Article({
		...req.body,
		image: req.file
			? `${process.env.DEV_HOST}/uploads/images/${req.file.filename}`
			: '',
		metaTitle: req.body.metaTitle || req.body.title,
		url: req.body.url || makePageUrl(req.body.title),
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
		await Article.deleteOne({
			_id: req.params.articleId,
		});
		res.status(204).json({});
	} catch (error) {
		res.status(404).json(error);
	}
});

const removeRef = (field, ref) => (field ? {} : { [ref]: field });

// update article by ID
router.patch('/:articleId', upload.single('image'), async (req, res) => {
	const updatedArticle = await Article.updateOne(
		{ _id: req.params.articleId },
		{
			$unset: removeRef(req.body.categories, 'categories'),
			$set: {
				...req.body,
				image: req.file
					? `${process.env.DEV_HOST}/uploads/images/${req.file.filename}`
					: req.body.image,
				metaTitle: req.body.metaTitle || req.body.title,
				url: req.body.url || makePageUrl(req.body.title),
			},
		}
	);
	res.status(200).json(updatedArticle);
	try {
	} catch (error) {
		res.status(404).json(error);
	}
});

module.exports = router;
