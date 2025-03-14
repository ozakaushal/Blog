import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      next(errorHandler(400, "All fields are required"));
    }
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({ message: "Sign up successful", success: true });
  } catch (error) {
    next(error);
  }
};

export const SignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }
    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(400, "Invalid credentials"));
    }
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid credentials"));
    }
    //create token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = user._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({ success: true, user: rest });
  } catch (error) {
    next(error);
  }
};

export const GoogleSignIn = async (req, res, next) => {
  try {
    const { name, email, googlePhotoURL } = req.body;
    console.log(req.body);
    //check user exist or not
    const user = await User.findOne({ email }).select("-password");
    if (user) {
      const token = await jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(user);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      //0.s4dd6e6e6 so last 8 character only
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        userPhoto: googlePhotoURL,
      });
      await newUser.save();
      const token = await jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
