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
      console.log(err);
    });
};
