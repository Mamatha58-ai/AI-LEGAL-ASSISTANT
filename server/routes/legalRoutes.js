import express from 'express';
import { searchLegalStatutes, searchCasesAndJudgments } from '../controllers/legalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/search', searchLegalStatutes);
router.get('/cases/search', searchCasesAndJudgments);

export default router;
