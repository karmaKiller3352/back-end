const express = require('express');
const router = express.Router();
const multer = require('multer');

router.get('/', async (req, res) => {
	console.log(req);
	console.log(res);
});
