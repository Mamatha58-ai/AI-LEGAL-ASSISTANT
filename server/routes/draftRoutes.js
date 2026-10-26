import express from 'express';
import { generateDraft } from '../controllers/draftController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/generate', generateDraft);

export default router;
