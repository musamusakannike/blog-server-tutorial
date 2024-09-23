const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    blogPost: {
      type: mongoose.Types.ObjectId,
      ref: "BlogPost",
      required: true,
    },
    parentComment: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field to get replies
commentSchema.virtual("replies", {
  ref: "Comment", // Reference to the same Comment model
  localField: "_id", // Match where `_id` is the parent
  foreignField: "parentComment", // Match with the `parentComment` field in the target model
});

// Ensure virtual fields are included in the toObject and JSON responses
commentSchema.set("toObject", { virtuals: true });
commentSchema.set("toJSON", { virtuals: true });

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
