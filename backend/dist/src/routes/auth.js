import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { JWT_TOKEN } from '../config.js';
const router = Router();
router.post('/register', asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'email+password required' });
    const exists = await User.findOne({ email });
    if (exists)
        return res.status(400).json({ message: 'email exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash: hash, name });
    const token = jwt.sign({ id: user._id }, JWT_TOKEN, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
}));
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'email+password required' });
    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({ message: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
        return res.status(400).json({ message: 'invalid credentials' });
    const token = jwt.sign({ id: user._id }, JWT_TOKEN, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
}));
export default router;
