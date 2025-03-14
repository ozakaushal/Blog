import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  try {
    const { title, content, postImage, category } = req.body;
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Not allowed to create a post"));
    }
    if (!title || !content) {
      return next(errorHandler(404, "Please provide valid data"));
    }
    const titleExists = await Post.exists({ title: title });
    if (titleExists) {
      return next(errorHandler(404, "Please choose a different title"));
    }
    // create a slug for the post
    const slug = title
      .replace(/[^a-zA-Z0-9-\s]/g, "")
      .split(" ")
      .join("-")
      .toLowerCase();
    const newPost = new Post({
      title,
      content,
      postImage,
      category,
      slug,
      userId: req.user.id,
    });
    try {
      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export const uploadPostImage = async (req, res, next) => {
  try {
    if (req.file) {
      //upload to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "post_images",
      });

      if (result) {
        if (result.secure_url) {
          res.status(200).json({ url: result.secure_url });
        }
      } else {
        res
          .status(500)
          .json({ success: false, message: "Unable to upload the image" });
      }
    } else {
      res
        .status(500)
        .json({ success: false, message: "Unable to get the image" });
    }
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    //
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDir = req.query.order === "asc" ? 1 : -1;
    const post = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDir })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      post,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to delete others posts!!!")
    );
  }

  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ success: true, message: "Post has been deleted" });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to update this posts!!!")
    );
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(404, "Please provide valid data"));
  }
  try {
    const slug = req.body.title
      .replace(/[^a-zA-Z0-9-\s]/g, "")
      .split(" ")
      .join("-")
      .toLowerCase();
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          postImage: req.body.postImage,
          slug,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
