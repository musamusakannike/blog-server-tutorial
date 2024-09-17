const express = require("express");
const BlogPost = require("../model/blogpost.model");
const authenticate = require("../middleware/authMiddleware");
const { blogPoster } = require("../controller/blog.controller");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "uploads/");
  // },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
})

const upload = multer({ storage });

router.post("/post", authenticate, upload.single("image"), blogPoster);

module.exports = router;
