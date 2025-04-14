// src/routes/auth.routes.js
import { Router } from 'express';
import { pool } from '../database/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = 'konectaSecure';

// Registro de usuario
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const userCheck = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar usuario
        const result = await pool.query(
            'INSERT INTO usuarios (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar usuario
        const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const user = result.rows[0];

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

export default router;