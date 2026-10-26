import express from 'express';
import multer from 'multer';
import { ingestLegalDocument, getUsersList } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const upload = multer({ limits: { fileSize: 20 * 1024 * 1024 } });
const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.post('/ingest', upload.single('document'), ingestLegalDocument);
router.get('/users', getUsersList);

export default router;
