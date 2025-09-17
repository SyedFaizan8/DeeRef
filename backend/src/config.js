import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

export const PORT = process.env.PORT || 4000;
export const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://admin:secret@localhost:27017/mydb?authSource=admin";
export const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

export const JWT_TOKEN = process.env.JWT_TOKEN;

export const SALT_ROUNDS = 10;

export const options = {
  httpOnly: true,
  secure: true,
};

export const jwtTokenOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 60 * 60 * 24,
};
