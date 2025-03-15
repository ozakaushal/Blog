import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import dashRoutes from "./routes/dashboard.route.js";
import cookieParser from "cookie-parser";
import path from "path";

//without this package we can not use env variables directly
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Mongo is connected");
  })
  .catch((err) => console.log(err));

const __dirname = path.resolve();
const app = express();
app.use(express.json());

app.use(cookieParser());

app.listen(3000, (req, res) => {
  console.log(`Server is running on port 3000`);
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/dashboard", dashRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
//middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const msg = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: msg,
  });
});
