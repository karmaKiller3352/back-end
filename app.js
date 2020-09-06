const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const articlesRoute = require('./routes/articles');
const categoriesRoute = require('./routes/categories');
const makePageUrl = require('./utils/makePageUrl');

require('dotenv/config');

//Middlewares
app.use(bodyParser.json());

app.use('/articles', articlesRoute);
app.use('/categories', categoriesRoute);

// Routes

app.get('/', (req, res) => {
	res.send(makePageUrl(' Однажды d студенную! зимнюю пору!'));
});

//Connect to DB
mongoose.connect(
	process.env.DB_CONNECTION,

	{
		useUnifiedTopology: true,
		useCreateIndex: true,
		useNewUrlParser: true,
	},
	(e) => {
		console.log('connected');
		console.log(e);
	}
);

app.listen(5000);
