// import cookieParser from "cookie-parser";

// export const app = express();

// // app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// // app.use(express.static("public"));
// // app.use(cookieParser());

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import pdfRoutes from "./routes/pdfs.js";
import { CORS_ORIGIN, MONGO_URI, PORT } from "./config.js";

const app = express();

dotenv.config({
  path: "./.env",
});

// app.use(
//   cors({
//     origin: CORS_ORIGIN,
//     credentials: true,
//   }),
// );

app.use(express.json());
// app.use(express.json({ limit: "16kb" }));

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch((e) => console.error("Mongo error", e));

app.use("/api/auth", authRoutes);
app.use("/api/pdfs", pdfRoutes);
app.use("/uploads", express.static(path.resolve("uploads")));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "server error" });
});

app.listen(PORT, () => console.log(`Server ${PORT}`));
