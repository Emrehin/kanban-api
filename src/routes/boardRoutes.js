import { Router } from 'express';
import db from '../db/database.js';
import { validate } from '../middlewares/validate.js';
import { createBoardSchema } from '../schemas/kanbanSchemas.js';

const router = Router();

router.get('/', (req, res) => {
  const boards = db
    .prepare('SELECT * FROM boards WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);
  res.json(boards);
});

router.post('/', validate(createBoardSchema), (req, res) => {
  const { title } = req.body;

  const insert = db.prepare('INSERT INTO boards (title, user_id) VALUES (?, ?)');
  const result = insert.run(title, req.user.id);

  const newBoard = db
    .prepare('SELECT * FROM boards WHERE id = ?')
    .get(result.lastInsertRowid);

  res.status(201).json(newBoard);
});

export default router;