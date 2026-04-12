import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { loginSchema, updateProfileSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.me);
router.put('/profile', authMiddleware, validate(updateProfileSchema), authController.updateProfile);

export default router;
