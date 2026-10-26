import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  sources: [{
    title: String,
    source: String,
    act: String,
    section: String,
    jurisdiction: String,
    court: String,
    date: String,
    url: String,
    text: String
  }],
  disclaimer: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Legal Query'
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
