const { response } = require("express");
const feedModel = require("../models/feedModel");
const userModel = require("../models/userModel");
const { validationResult } = require("express-validator"); //named export

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

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

exports.getSinglePost = (req, res, next) => {
  const feedId = req.params.postId;
  feedModel
    .findById(feedId)
    .populate("creator", ["name", "email"])
    .then((feed) => {
      if (!feed) {
        const error = new Error("Feed does not exist");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        message: "Feeds fetched succesfully",
        feed: feed,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const feedId = req.params.postId;

  feedModel
    .findByIdAndRemove(feedId)
    .then(() => {
      res.status(200).json({
        message: "Feed is deleted succesfully",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;

  const feedId = req.params.postId;
  feedModel
    .findById(feedId)
    .then((feed) => {
      if (!feed) {
        const error = new Error("Feed does not exist");
        error.statusCode = 404;
        throw error;
      }
      feed.title = title;
      feed.content = content;
      return feed.save();
    })
    .then((feed) => {
      res.status(200).json({
        message: "feed are updated succesfully",
        feed: feed,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
