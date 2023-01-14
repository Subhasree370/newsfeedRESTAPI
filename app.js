const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const feedRoutes = require("./routes/feed");
// const authRoutes = require("./routes/auth");

const MONGODB_URI =
  "mongodb+srv://root:root@cluster0.inbf1sx.mongodb.net/newsfeedmongoose";

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencode <form>
app.use(bodyParser.json()); // application/json
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
// app.use("/auth", authRoutes);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

// GET /feed/posts
// POST /feed/posts
// GET /feed/post/:postId
// PUT /feed/post/:postId
// DELETE /feed/post/:postId
// POST /auth/signup
// POST /auth/login