import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  console.log("test");
};

export const uploadProile = async (req, res, next) => {
  // const { userImage } = req.file;
  try {
    if (req.file) {
      //upload to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
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

export const updateUser = async (req, res, next) => {
  //check user id who is updating and stored user id generated in JWT
  if (req.user.id !== req.params.userId) {
    //person is not allowed
    return next(errorHandler(403, "You are not allowed to update"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        errorHandler(400, "Password must be at-least of 6 characters")
      );
    }
    //encrypt the password
    req.body.password = await bcryptjs.hash(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 to 20 characters")
      );
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: req.body,
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
    // res.status(200);
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return next(errorHandler(403, "Not allowed"));
    }
    //proceed
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ success: true, message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};

export const signOutUser = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Signed out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(403, "This operation is not allowed");
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .select("-password");
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthsUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ users, totalUsers, lastMonthsUsers });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};
