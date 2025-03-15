import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, userId, postId } = req.body;
    if (userId !== req.user.id) {
      return next(403, "This operation is not allowed");
    }
    const newComment = new Comment({ content, postId, userId });
    await newComment.save();

    res.status(200).json({
      success: true,
      message: "comment published",
      comment: newComment,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    // -1 is desc
    res.status(200).json({ comments: comments });
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment does not exist"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex !== -1) {
      // remove the like
      comment.likes.splice(userIndex, 1);
      comment.noOfLikes -= 1;
    } else {
      // add the like
      comment.likes.push(req.user.id);
      comment.noOfLikes += 1;
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment does not exist"));
    }
    if (!req.body.content) {
      return next(errorHandler(403, "Kindly enter a value"));
    }
    if (comment.userId === req.user.id || req.user.isAdmin) {
      // allow edit functionality
      const editedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        { content: req.body.content },
        { new: true }
      );
      res.status(200).json(editedComment);
    } else {
      return next(errorHandler(403, "you can not edit this comment"));
    }
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment does not exist"));
    }
    if (comment.userId === req.user.id || req.user.isAdmin) {
      // allow edit functionality
      await Comment.findByIdAndDelete(req.params.commentId);
      res.status(200).json({ success: true, message: "comment deleted" });
    } else {
      return next(errorHandler(403, "you can not delete this comment"));
    }
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(403, "This operation is not allowed");
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const comments = await Comment.find()
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthsComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ comments, totalComments, lastMonthsComments });
  } catch (error) {
    next(error);
  }
};
