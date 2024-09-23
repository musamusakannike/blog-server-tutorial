const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const { postComment, getComments } = require("../controller/comment.controller");

router.post("/:postId", authenticate, postComment);

router.get('/:postId/', getComments);

module.exports = router;
