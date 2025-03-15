import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";

export const getDashboardData = async (req, res, next) => {
  try {
    // req.user
    const isAdmin = req.user.isAdmin;
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    //fetch users
    const users = await User.find().sort({ createdAt: -1 }).limit(5);
    const totalUsers = await User.countDocuments();
    const lastMonthsUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    //fetch posts - if admin then fetch all the posts otherwise fecth user specific posts
    const posts = isAdmin
      ? await Post.find().sort({ createdAt: -1 }).limit(5)
      : await Post.find({ userId: req.user.id })
          .sort({ createdAt: -1 })
          .limit(5);
    const totalPosts = isAdmin
      ? await Post.countDocuments()
      : await Post.countDocuments({
          userId: req.user.id,
        });
    const lastMonthPosts = isAdmin
      ? await Post.countDocuments({
          createdAt: { $gte: oneMonthAgo },
        })
      : await Post.countDocuments({
          createdAt: { $gte: oneMonthAgo },
          userId: req.user.id,
        });

    //fetch comments - if admin then fetch all the posts otherwise fecth user specific posts
    const comments = isAdmin
      ? await Comment.find().sort({ createdAt: -1 }).limit(5)
      : await Comment.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    const totalComments = isAdmin
      ? await Comment.countDocuments()
      : await Comment.countDocuments({
          userId: req.user.id,
        });
    const lastMonthComments = isAdmin
      ? await Comment.countDocuments({
          createdAt: { $gte: oneMonthAgo },
        })
      : await Comment.countDocuments({
          createdAt: { $gte: oneMonthAgo },
          userId: req.user.id,
        });

    res.status(200).json({
      users,
      totalUsers,
      totalComments,
      lastMonthsUsers,
      posts,
      totalPosts,
      lastMonthPosts,
      comments,
      totalComments,
      lastMonthComments,
    });
  } catch (error) {
    next(error);
  }
};
