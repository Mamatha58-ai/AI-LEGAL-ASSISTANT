import { Document } from '../models/Document.js';
import { isConnected, inMemoryDb } from '../config/db.js';
import { extractTextFromBuffer } from '../services/documents/pdfExtractor.js';
import { analyzeDocumentRisk, answerDocumentQA } from '../services/documents/riskAnalyzer.js';

export async function uploadAndAnalyzeDocument(req, res) {
  try {
    const userId = req.user?.id || req.user?._id || 'demo_user_6789';
    const file = req.file;

    let textContent = req.body.text;
    let fileName = req.body.filename || "Uploaded Legal Document.pdf";
    let fileType = "PDF";
    let fileSize = 1024;

    if (file) {
      fileName = file.originalname || "Uploaded Document";
      const nameLower = fileName.toLowerCase();
      fileType = file.mimetype.includes('pdf') || nameLower.endsWith('.pdf') ? 'PDF' :
                 file.mimetype.includes('word') || nameLower.endsWith('.docx') || nameLower.endsWith('.doc') ? 'DOCX' :
                 nameLower.endsWith('.md') ? 'MARKDOWN' : 'TXT';
      fileSize = file.size;
      textContent = await extractTextFromBuffer(file.buffer, file.mimetype, fileName);
    }

    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No readable text could be extracted from this document. If this is a scanned image or password-protected PDF, please provide an OCR or text-based document.' 
      });
    }

    // Run Legal Risk & Executive Summary Analysis
    const analysis = analyzeDocumentRisk(textContent, fileName);

    let newDoc;

    if (isConnected()) {
      newDoc = await Document.create({
        userId,
        filename: fileName,
        fileType,
        size: fileSize,
        extractedText: textContent,
        analysisResult: analysis,
        processingStatus: 'completed'
      });
    } else {
      newDoc = {
        _id: 'doc_' + Date.now(),
        userId,
        filename: fileName,
        fileType,
        size: fileSize,
        uploadDate: new Date(),
        extractedText: textContent,
        analysisResult: analysis,
        processingStatus: 'completed'
      };
      inMemoryDb.documents.push(newDoc);
    }

    return res.status(201).json({
      success: true,
      document: {
        id: newDoc._id,
        filename: newDoc.filename,
        fileType: newDoc.fileType,
        uploadDate: newDoc.uploadDate,
        analysis: analysis
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getDocuments(req, res) {
  try {
    const userId = req.user.id;
    let docs = [];

    if (isConnected()) {
      docs = await Document.find({ userId }).sort({ uploadDate: -1 }).select('-extractedText');
    } else {
      docs = inMemoryDb.documents
        .filter(d => d.userId.toString() === userId.toString())
        .map(({ extractedText, ...rest }) => rest);
    }

    return res.json({ success: true, documents: docs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getDocumentById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    let doc;

    if (isConnected()) {
      doc = await Document.findOne({ _id: id, userId });
    } else {
      doc = inMemoryDb.documents.find(d => d._id.toString() === id.toString() && d.userId.toString() === userId.toString());
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    return res.json({ success: true, document: doc });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function askQuestionAboutDocument(req, res) {
  try {
    const { id } = req.params;
    const { question, language } = req.body;
    const userId = req.user?.id || req.user?._id || 'demo_user_6789';
    const lang = req.headers['x-language'] || req.headers['accept-language'] || language || 'en';

    if (!question) {
      return res.status(400).json({ success: false, message: 'Question parameter required.' });
    }

    let doc;
    if (isConnected()) {
      doc = await Document.findOne({ _id: id, userId });
    } else {
      doc = inMemoryDb.documents.find(d => d._id.toString() === id.toString() && d.userId.toString() === userId.toString());
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    const result = answerDocumentQA(question, doc.extractedText, doc.analysisResult, lang);

    return res.json({
      success: true,
      answer: result.answer,
      relevantSection: result.relevantSection,
      pageNumber: result.pageNumber,
      disclaimer: lang === 'te' ? "పత్రం Q&A కేవలం అప్‌లోడ్ చేసిన పత్రం ఆధారంగా మాత్రమే సమాచారాన్ని అందిస్తుంది." :
                  lang === 'hi' ? "दस्तावेज़ Q&A केवल अपलोड किए गए दस्तावेज़ संदर्भ पर आधारित जानकारी प्रदान करता है।" :
                  "Document Q&A provides information based solely on the uploaded document context."
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteDocument(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isConnected()) {
      await Document.deleteOne({ _id: id, userId });
    } else {
      const idx = inMemoryDb.documents.findIndex(d => d._id.toString() === id.toString() && d.userId.toString() === userId.toString());
      if (idx !== -1) inMemoryDb.documents.splice(idx, 1);
    }

    return res.json({ success: true, message: 'Document removed.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
