const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

//Routes

router.get('/', (req, res) => {
    res.send('Articles page')
});

router.post('/', (req, res) => {
    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });

    article.save()
    .then((data) => {
        res.json(data);
    })
    .catch((error) => {
        res.json({
            message: error,
        })
    })

    console.log(req.body);
});



module.exports = router;