import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/database.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../schemas/kanbanSchemas.js';

const router = Router();

// Kullanıcı Kaydı
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = db
      .prepare('SELECT id FROM users WHERE email = ? OR username = ?')
      .get(email, username);

    if (existingUser) {
      return res
        .status(409)
        .json({ error: 'Bu e-posta veya kullanıcı adı zaten kullanımda.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const insert = db.prepare(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
    );
    const result = insert.run(username, email, passwordHash);

    res.status(201).json({
      id: result.lastInsertRowid,
      username,
      email,
    });
  } catch (err) {
    next(err);
  }
});

// Kullanıcı Girişi ve JWT Üretimi
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'E-posta veya şifre hatalı.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'E-posta veya şifre hatalı.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

export default router;