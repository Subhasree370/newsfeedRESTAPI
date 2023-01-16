const express = require("express");
const { getPost, createPost } = require("../controllers/feedController");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/posts", getPost);
router.post("/posts", isAuth, createPost);

module.exports = router;
