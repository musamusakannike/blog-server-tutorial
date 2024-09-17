const mongoose = require("mongoose");

const blogPostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageLink: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
},{
  timestamps: true
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema)
module.exports = BlogPost;