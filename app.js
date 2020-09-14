const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const http = require("http");

require("dotenv/config");
const app = express();
app.use(morgan("dev"));

const articlesRoute = require("./routes/articles");
const categoriesRoute = require("./routes/categories");
const imageUpload = require("./routes/imageUpload");
const makePageUrl = require("./utils/makePageUrl");

//Middlewares

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(
  "/uploads/images/",
  express.static(__dirname + "/public/uploads/images")
);

app.use("/articles/", articlesRoute);
app.use("/categories/", categoriesRoute);
app.use("/image-upload/", imageUpload);

// Routes
app.get("/", (req, res) => {
  res.status(200).send(makePageUrl(" Однажды d студенную! зимнюю пору!"));
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.log(req);
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      er: req.toString(),
    },
  });
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
    console.log("connected");
    console.log(e);
  }
);

app.listen("3001");
