import { Router } from 'express';
import { getUser, signIn, signUp } from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.get('/me', authMiddleware, getUser);

export default router;
