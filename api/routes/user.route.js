import express from "express";
import {
  test,
  uploadProile,
  updateUser,
  deleteUser,
  signOutUser,
  getUsers,
  getUserById,
} from "../controllers/user.controller.js";
import { storage } from "../storage/storage.js";
import multer from "multer";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
const upload = multer({ storage });

router.get("/", test);
router.post("/upload", upload.single("userPhoto"), uploadProile);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/sign-out", signOutUser);
router.get("/get-users", verifyToken, getUsers);
router.get("/:userId", getUserById);

export default router;
