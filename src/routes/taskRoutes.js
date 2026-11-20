import { Router } from 'express';
import db from '../db/database.js';
import { validate } from '../middlewares/validate.js';
import { createTaskSchema, updateTaskStatusSchema } from '../schemas/kanbanSchemas.js';

const router = Router();

router.get('/board/:boardId', (req, res) => {
  const boardId = Number(req.params.boardId);

  const board = db
    .prepare('SELECT id FROM boards WHERE id = ? AND user_id = ?')
    .get(boardId, req.user.id);

  if (!board) {
    return res.status(404).json({ error: 'Pano bulunamadı veya erişim yetkiniz yok.' });
  }

  const tasks = db
    .prepare('SELECT * FROM tasks WHERE board_id = ? ORDER BY created_at DESC')
    .all(boardId);

  res.json(tasks);
});

router.post('/', validate(createTaskSchema), (req, res) => {
  const { title, description, board_id } = req.body;

  const board = db
    .prepare('SELECT id FROM boards WHERE id = ? AND user_id = ?')
    .get(board_id, req.user.id);

  if (!board) {
    return res.status(404).json({ error: 'Pano bulunamadı veya erişim yetkiniz yok.' });
  }

  const insert = db.prepare(
    'INSERT INTO tasks (title, description, board_id) VALUES (?, ?, ?)'
  );
  const result = insert.run(title, description ?? null, board_id);

  const newTask = db
    .prepare('SELECT * FROM tasks WHERE id = ?')
    .get(result.lastInsertRowid);

  req.app.get('io').emit('task:created', newTask);
  res.status(201).json(newTask);
});

router.patch('/:id/status', validate(updateTaskStatusSchema), (req, res) => {
  const taskId = Number(req.params.id);
  const { status } = req.body;

  const task = db
    .prepare(
      `SELECT tasks.id FROM tasks
       JOIN boards ON tasks.board_id = boards.id
       WHERE tasks.id = ? AND boards.user_id = ?`
    )
    .get(taskId, req.user.id);

  if (!task) {
    return res.status(404).json({ error: 'Görev bulunamadı veya erişim yetkiniz yok.' });
  }

  db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, taskId);

  const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  req.app.get('io').emit('task:updated', updatedTask);
  res.json(updatedTask);
});

router.delete('/:id', (req, res) => {
  const taskId = Number(req.params.id);

  const task = db
    .prepare(
      `SELECT tasks.id FROM tasks
       JOIN boards ON tasks.board_id = boards.id
       WHERE tasks.id = ? AND boards.user_id = ?`
    )
    .get(taskId, req.user.id);

  if (!task) {
    return res.status(404).json({ error: 'Silinecek görev bulunamadı veya erişim yetkiniz yok.' });
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
  req.app.get('io').emit('task:deleted', { id: taskId });
  res.status(204).send();
});

export default router;