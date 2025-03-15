import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getDashboardData } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/get-info", verifyToken, getDashboardData);

export default router;
