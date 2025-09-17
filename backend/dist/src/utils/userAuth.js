import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_TOKEN, SALT_ROUNDS } from "../config.js";
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
export const generateToken = (user_id) => {
    return jwt.sign({ user_id }, JWT_TOKEN, { expiresIn: "7d" });
};
