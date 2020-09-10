const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/images');
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

router.post('/', upload.single('upload'), async (req, res) => {
  res.status(201).json({
    uploaded: true,
    url: `${process.env.DEV_HOST}/uploads/images/${req.file.filename}`,
  });
});

module.exports = router;
