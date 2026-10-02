import { Router } from 'express';
import { createTask, editTask, getTasks } from './task.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.get('/tasks', authMiddleware, getTasks);
router.post('/create-task', authMiddleware, createTask);
router.patch('/edit-task/:taskId', authMiddleware, editTask);

export default router;
