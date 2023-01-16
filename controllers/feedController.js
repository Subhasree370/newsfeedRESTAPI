const feedModel = require("../models/feedModel");

exports.getPost = (req, res, next) => {
  let totalItems;
  feedModel
    .find()
    .countDocuments()
    .then((counts) => {
      totalItems = counts;
      return feedModel.find();
      // console.log(counts);
    })
    .then((posts) => {
      res.status(201).json({
        message: "Fetched posts successfully.",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const createdBy = req.body.createdBy;
  const id = Math.random();

  const feed = new feedModel({
    title: title,
    content: content,
    creator: req.userId,
  });

  feed
    .save()
    .then(() => {
      res.status(201).json({
        id: id,
        title: title,
        content: content,
        createdBy: createdBy,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
