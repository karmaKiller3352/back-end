const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const postRoute = require('./routes/articles');

require('dotenv/config');

//Middlewares
app.use(bodyParser.json());

app.use('/articles', postRoute);



// Routes



app.get('/', (req, res) => {
    res.send('Home page')
});


//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, 
{ useUnifiedTopology: true }, 
(e) => {
    console.log('connected');
    console.log(e)
})


app.listen(5000);