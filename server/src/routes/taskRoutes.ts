import { Router } from 'express';
import { createTask, getTasks } from '../controllers/taskController';

const router = Router();

router.get('/all-tasks', getTasks);
router.post('/create-task', createTask);

export default router;
