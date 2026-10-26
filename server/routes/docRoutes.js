import express from 'express';
import multer from 'multer';
import { uploadAndAnalyzeDocument, getDocuments, getDocumentById, askQuestionAboutDocument, deleteDocument } from '../controllers/docController.js';
import { protect } from '../middleware/authMiddleware.js';

const upload = multer({ limits: { fileSize: 15 * 1024 * 1024 } }); // 15MB max file size
const router = express.Router();

router.use(protect);
router.post('/upload', upload.single('document'), uploadAndAnalyzeDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.post('/:id/ask', askQuestionAboutDocument);
router.delete('/:id', deleteDocument);

export default router;
