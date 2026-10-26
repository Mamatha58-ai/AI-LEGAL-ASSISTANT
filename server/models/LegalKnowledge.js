import mongoose from 'mongoose';

const legalKnowledgeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String, required: true },
  act: { type: String, default: 'General Statute' },
  section: { type: String, default: '' },
  jurisdiction: { type: String, default: 'India (Union & States)' },
  court: { type: String, default: 'Supreme Court / High Court' },
  date: { type: String, default: '' },
  documentType: { type: String, enum: ['Act', 'Section', 'Rule', 'Judgment', 'Notification', 'Procedure'], default: 'Act' },
  url: { type: String, default: '' },
  text: { type: String, required: true },
  embedding: [{ type: Number }],
  createdAt: { type: Date, default: Date.now }
});

export const LegalKnowledge = mongoose.models.LegalKnowledge || mongoose.model('LegalKnowledge', legalKnowledgeSchema);
