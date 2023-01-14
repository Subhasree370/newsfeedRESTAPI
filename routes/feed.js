const express = require("express");
const { getPost, createPost } = require("../controllers/feedController");
const router = express.Router();

router.get("/posts", getPost);
router.post("/posts", createPost);

module.exports = router;
