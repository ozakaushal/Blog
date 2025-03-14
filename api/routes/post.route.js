import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { storage } from "../storage/storage.js";
import multer from "multer";
import {
  createPost,
  uploadPostImage,
  getPosts,
  deletePost,
  updatePost,
} from "../controllers/post.controller.js";

const router = express.Router();
const upload = multer({ storage });

router.post("/create-post", verifyToken, createPost);
router.post("/upload", upload.single("postImage"), uploadPostImage);
router.get("/all", getPosts);
router.delete("/delete-post/:postId/:userId", verifyToken, deletePost);
router.put("/update-post/:postId/:userId", verifyToken, updatePost);
export default router;
