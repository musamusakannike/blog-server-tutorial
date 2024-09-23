const BlogPost = require("../model/blogpost.model");
const Comment = require("../model/comment.model");

const postComment = async (req, res) => {
  const { postId } = req.params;
  const { content, parentComment } = req.body;

  const user = req.user;

  if (!content) {
    return res.status(400).json({ message: "Missing required field" });
  }

  try {
    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const newComment = new Comment({
      content,
      blogPost: postId,
      parentComment: parentComment || null,
      postedBy: user._id,
    });

    await newComment.save();

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getComments = async (req, res) => {
  // Fixed route definition
  const { postId } = req.params;

  try {
    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const comments = await Comment.find({
      blogPost: postId,
      parentComment: null,
    })
      .populate("postedBy", "username")
      .populate({
        path: "replies",
        populate: {
          path: "postedBy",
          select: "username",
        },
      });

    res.json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  postComment,
  getComments,
};
