import { LegalKnowledge } from '../models/LegalKnowledge.js';
import { isConnected, inMemoryDb } from '../config/db.js';
import { extractTextFromBuffer } from '../services/documents/pdfExtractor.js';

export async function ingestLegalDocument(req, res) {
  try {
    const { title, source, act, section, jurisdiction, court, documentType, url, text } = req.body;
    const file = req.file;

    let docText = text;
    let docTitle = title || "Uploaded Legal Knowledge Item";

    if (file) {
      docTitle = file.originalname;
      docText = await extractTextFromBuffer(file.buffer, file.mimetype);
    }

    if (!docText || docText.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'No document text found for ingestion.' });
    }

    const newItem = {
      title: docTitle,
      source: source || 'Admin Ingestion Pipeline',
      act: act || 'Indian Legal Code',
      section: section || '',
      jurisdiction: jurisdiction || 'India',
      court: court || 'Supreme Court / High Court',
      date: new Date().toISOString().split('T')[0],
      documentType: documentType || 'Act',
      url: url || '',
      text: docText
    };

    if (isConnected()) {
      await LegalKnowledge.create(newItem);
    } else {
      inMemoryDb.legalKnowledge.push({
        _id: 'ingest_' + Date.now(),
        ...newItem,
        createdAt: new Date()
      });
    }

    return res.status(201).json({
      success: true,
      message: `Document "${docTitle}" successfully ingested into RAG Knowledge Base.`,
      item: newItem
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getUsersList(req, res) {
  try {
    let users = [];

    if (isConnected()) {
      users = await LegalKnowledge.find({}).select('-passwordHash');
    } else {
      users = inMemoryDb.users.map(({ passwordHash, ...rest }) => rest);
    }

    return res.json({ success: true, count: users.length, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
