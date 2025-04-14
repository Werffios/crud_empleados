// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'konectaSecure';

export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};