import express from "express";
import {
  createComment,
  getPostComments,
  likeComment,
  deleteComment,
  editComment,
  getAllComments,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/get/:postId", getPostComments);
router.get("/get-all", verifyToken, getAllComments);
router.put("/like/:commentId", verifyToken, likeComment);
router.put("/update/:commentId", verifyToken, editComment);
router.delete("/delete/:commentId", verifyToken, deleteComment);

export default router;
