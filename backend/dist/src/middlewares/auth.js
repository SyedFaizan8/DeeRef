import jwt from 'jsonwebtoken';
import { JWT_TOKEN } from '../config.js';
export const auth = (req, res, next) => {
    try {
        const h = req.headers.authorization;
        if (!h || !h.startsWith('Bearer '))
            return res.status(401).json({ message: 'Unauthorized' });
        const token = h.split(' ')[1];
        const payload = jwt.verify(token, JWT_TOKEN);
        req.userId = payload.id;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
