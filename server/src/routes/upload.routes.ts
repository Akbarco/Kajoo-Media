import { Router } from 'express';
import * as uploadController from '../controllers/upload.controller';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.post('/', authMiddleware, upload.single('image'), uploadController.uploadImage);

export default router;
