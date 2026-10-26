import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'User',
    required: true,
    index: true
  },
  filename: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  extractedText: {
    type: String,
    required: true
  },
  analysisResult: {
    type: Object,
    default: {}
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  vectorReference: {
    type: String,
    default: ''
  }
});

export const Document = mongoose.models.Document || mongoose.model('Document', documentSchema);
