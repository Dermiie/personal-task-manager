import { Router } from 'express';
import { createTask, deleteTask, editTask, getTasks } from './task.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.get('/tasks', getTasks);
router.post('/create-task', createTask);
router.patch('/edit-task/:taskId', editTask);
router.delete('/delete-task/:taskId', deleteTask);

export default router;
