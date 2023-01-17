const feedModel = require("../models/feedModel");
const userModel = require("../models/userModel");

exports.getPost = (req, res, next) => {
  let totalItems;
  let perPage = 3;
  let currentpage = req.query.page || 1;

  feedModel
    .find()
    .countDocuments()
    .then((counts) => {
      totalItems = counts;
      return feedModel
        .find()
        .skip((currentpage - 1) * perPage)
        .limit(perPage);
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
  let creator;

  const feed = new feedModel({
    title: title,
    content: content,
    creator: req.userId,
  });

  feed
    .save()
    .then((result) => {
      return userModel.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.post.push(feed);
      return user.save();
    })
    .then(() => {
      res.status(201).json({
        message: "Post created successfully",
        post: feed,
        creator: {
          _id: creator._id,
          name: creator.name,
        },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
