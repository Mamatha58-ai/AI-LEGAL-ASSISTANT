import { SEEDED_INDIAN_LEGAL_KNOWLEDGE } from '../services/legal-search/indianLegalKnowledgeBase.js';
import { searchKnowledgeBase } from '../services/rag/vectorStore.js';

export async function searchLegalStatutes(req, res) {
  try {
    const { q, act, section } = req.query;
    const queryStr = q || `${act || ''} ${section || ''}`.trim() || 'Act Section';

    const results = await searchKnowledgeBase(queryStr, 10);

    return res.json({
      success: true,
      query: queryStr,
      count: results.length,
      results
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function searchCasesAndJudgments(req, res) {
  try {
    const { q, court, year } = req.query;
    const queryStr = q || 'Supreme Court Judgment';

    const allDocs = await searchKnowledgeBase(queryStr, 15);
    const caseResults = allDocs.filter(d => d.documentType === 'Judgment' || d.court?.toLowerCase().includes('court') || d.title?.toLowerCase().includes('v.'));

    return res.json({
      success: true,
      query: queryStr,
      count: caseResults.length,
      cases: caseResults.length > 0 ? caseResults : allDocs.slice(0, 5)
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
