import { Conversation } from '../models/Conversation.js';
import { isConnected, inMemoryDb } from '../config/db.js';
import { processLegalQuery } from '../services/ai/llmService.js';
import { translateConversationMessages } from '../services/ai/translationService.js';

export async function sendChatMessage(req, res) {
  try {
    const { message, conversationId } = req.body;
    const language = req.body.language || req.headers['x-language'] || req.headers['accept-language'] || 'en';
    const userId = req.user.id;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    // ── Fetch existing conversation history to pass as context ──────
    let conversationHistory = [];
    let activeConversation;

    if (conversationId) {
      try {
        if (isConnected()) {
          activeConversation = await Conversation.findOne({ _id: conversationId, userId });
        } else {
          activeConversation = inMemoryDb.conversations.find(
            c => c._id.toString() === conversationId && c.userId.toString() === userId.toString()
          );
        }
        if (activeConversation?.messages?.length) {
          // Pass last 10 messages as context (5 turns)
          conversationHistory = activeConversation.messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          }));
        }
      } catch (_) {}
    }

    // Process legal query through AI RAG pipeline with full conversation context
    const aiResult = await processLegalQuery(message, conversationHistory, language);

    if (isConnected()) {
      if (conversationId && !activeConversation) {
        activeConversation = await Conversation.findOne({ _id: conversationId, userId });
      }

      if (!activeConversation) {
        activeConversation = await Conversation.create({
          userId,
          title: message.slice(0, 40) + '...',
          messages: []
        });
      }

      activeConversation.messages.push(
        { role: 'user', content: message },
        {
          role: 'assistant',
          content: aiResult.answer,
          sources: aiResult.sources,
          disclaimer: aiResult.disclaimer
        }
      );
      activeConversation.updatedAt = new Date();
      await activeConversation.save();
    } else {
      activeConversation = inMemoryDb.conversations.find(c => c._id.toString() === conversationId && c.userId.toString() === userId.toString());

      if (!activeConversation) {
        activeConversation = {
          _id: 'conv_' + Date.now(),
          userId,
          title: message.slice(0, 40) + '...',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        inMemoryDb.conversations.push(activeConversation);
      }

      activeConversation.messages.push(
        { role: 'user', content: message, timestamp: new Date() },
        {
          role: 'assistant',
          content: aiResult.answer,
          sources: aiResult.sources,
          disclaimer: aiResult.disclaimer,
          timestamp: new Date()
        }
      );
    }

    return res.json({
      success: true,
      conversationId: activeConversation._id,
      answer: aiResult.answer,
      sources: aiResult.sources,
      disclaimer: aiResult.disclaimer,
      intent: aiResult.intent
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getConversations(req, res) {
  try {
    const userId = req.user.id;
    let list = [];

    if (isConnected()) {
      list = await Conversation.find({ userId }).sort({ updatedAt: -1 }).select('title createdAt updatedAt');
    } else {
      list = inMemoryDb.conversations
        .filter(c => c.userId.toString() === userId.toString())
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return res.json({ success: true, conversations: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getConversationById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    let conv;

    if (isConnected()) {
      conv = await Conversation.findOne({ _id: id, userId });
    } else {
      conv = inMemoryDb.conversations.find(c => c._id.toString() === id.toString() && c.userId.toString() === userId.toString());
    }

    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    return res.json({ success: true, conversation: conv });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteConversation(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isConnected()) {
      await Conversation.deleteOne({ _id: id, userId });
    } else {
      const idx = inMemoryDb.conversations.findIndex(c => c._id.toString() === id.toString() && c.userId.toString() === userId.toString());
      if (idx !== -1) inMemoryDb.conversations.splice(idx, 1);
    }

    return res.json({ success: true, message: 'Conversation deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function translateConversation(req, res) {
  try {
    const { messages, targetLanguage, conversationId } = req.body;
    const userId = req.user?.id;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages array is required.' });
    }

    const translated = await translateConversationMessages(messages, targetLanguage || 'en');

    if (conversationId) {
      if (isConnected()) {
        await Conversation.updateOne({ _id: conversationId, userId }, { messages: translated, updatedAt: new Date() });
      } else {
        const conv = inMemoryDb.conversations.find(c => c._id.toString() === conversationId.toString());
        if (conv) {
          conv.messages = translated;
          conv.updatedAt = new Date();
        }
      }
    }

    return res.json({
      success: true,
      messages: translated,
      language: targetLanguage
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
