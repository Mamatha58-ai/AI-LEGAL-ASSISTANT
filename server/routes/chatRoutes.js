import express from 'express';
import { sendChatMessage, getConversations, getConversationById, deleteConversation, translateConversation } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/', sendChatMessage);
router.post('/translate-conversation', translateConversation);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversationById);
router.delete('/conversations/:id', deleteConversation);

export default router;
