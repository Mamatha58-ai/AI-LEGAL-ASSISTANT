import { SEEDED_INDIAN_LEGAL_KNOWLEDGE, getLocalizedLegalDocument } from '../legal-search/indianLegalKnowledgeBase.js';
import { isConnected, inMemoryDb } from '../../config/db.js';
import { LegalKnowledge } from '../../models/LegalKnowledge.js';

// Multilingual topic synonym mapping for high-precision legal RAG
const MULTILINGUAL_SYNONYMS = [
  {
    topic: 'rent_deposit',
    matches: [
      'అద్దె', 'కిరాయి', 'లీజు', 'అద్దెదారు', 'యజమాని', 'డిపాజిట్', 'సెక్యూరిటీ డిపాజిట్', 'వాపసు', 'ఖాళీ', 'ఒప్పందం', 'అగ్రిమెంట్',
      'किराया', 'किरायेदार', 'मकान मालिक', 'पट्टा', 'जमानत', 'जमा', 'वापसी', 'समझौता', 'अनुबंध', 'खाली',
      'rent', 'rental', 'lease', 'tenant', 'tenancy', 'deposit', 'security deposit', 'refund', 'eviction'
    ],
    targetDocIds: ['doc-rent-agreement-deposit']
  },
  {
    topic: 'car_vehicle',
    matches: [
      'కారు', 'వాహన', 'బైక్', 'ఆర్సీ', 'ఆర్టీవో', 'చలాన్', 'ఫారమ్ 29', 'ఫారమ్ 30', 'ఫారమ్ 35', 'హైపోథికేషన్',
      'कार', 'गाड़ी', 'वाहन', 'आरसी', 'आरटीओ', 'फॉर्म 29', 'फॉर्म 30', 'फॉर्म 35', 'हाइपोथीकेशन',
      'car', 'vehicle', 'bike', 'rto', 'rc', 'form 29', 'form 30', 'form 35', 'hypothecation'
    ],
    targetDocIds: ['doc-car-transfer-forms', 'doc-car-hypothecation-noc']
  },
  {
    topic: 'house_property',
    matches: [
      'ఇల్లు', 'ఇంటి', 'స్థలం', 'ఆస్తి', 'భూమి', 'రిజిస్ట్రేషన్', 'సేల్ డీడ్', 'పట్టా', 'ఖాటా', 'మ్యుటేషన్', 'ec', 'ఎన్‌కంబరెన్స్',
      'मकान', 'घर', 'जमीन', 'प्लॉट', 'फ्लैट', 'संपत्ति', 'रजिस्ट्री', 'बैनामा', 'दाखिल खारिज', 'म्यूटेशन',
      'house', 'property', 'flat', 'plot', 'sale deed', 'mother deed', 'mutation', 'khata', 'patta', 'encumbrance'
    ],
    targetDocIds: ['doc-house-sale-deed-title', 'doc-house-encumbrance-ec']
  },
  {
    topic: 'home_loan',
    matches: [
      'హోమ్ లోన్', 'రుణం', 'లోన్', 'ఈఎంఐ', 'మార్ట్‌గేజ్', 'సర్ఫేసి', 'modt', 'cersai',
      'होम लोन', 'गृह ऋण', 'ऋण', 'लोन', 'बंधक', 'सरफेसी',
      'home loan', 'housing loan', 'mortgage', 'modt', 'cersai', 'sarfaesi', 'sanction letter', 'npa'
    ],
    targetDocIds: ['doc-home-loan-modt-cersai', 'doc-home-loan-default-sarfaesi']
  },
  {
    topic: 'gold_loan',
    matches: [
      'బంగారం', 'బంగారు', 'గోల్డ్', 'ఆభరణ', 'తాకట్టు', 'ప్లెడ్జ్', 'వేలం', 'హాల్‌మార్క్', 'huid',
      'सोना', 'सोने', 'गोल्ड', 'गहने', 'आभूषण', 'गिरवी', 'नीलामी', 'हॉलमार्क',
      'gold', 'jewel', 'jewellery', 'gold loan', 'pledge', 'hallmark', 'huid', 'ltv', 'pawn'
    ],
    targetDocIds: ['doc-gold-loan-agreement-rbi', 'doc-gold-hallmark-bis']
  }
];

/**
 * Unicode-friendly Keyword & Semantic Scorer for Multilingual Indian Legal RAG
 */
export function calculateRelevanceScore(query, doc) {
  const queryLower = query.toLowerCase();
  const qTerms = queryLower
    .split(/[\s,?.!&;:\"'()\[\]{}।/\\_-]+/)
    .filter(w => w.length >= 2);

  let score = 0;

  // 1. Direct Topic Synonym / Exact Category Match
  for (const item of MULTILINGUAL_SYNONYMS) {
    const hasMatch = item.matches.some(m => queryLower.includes(m.toLowerCase()));
    if (hasMatch && item.targetDocIds.includes(doc.id)) {
      score += 25.0; // High confidence topic match
    }
  }

  // 2. Keyword & Multi-Lingual Substring Matching
  const combinedSearchContent = [
    doc.id,
    doc.title,
    doc.act,
    doc.section,
    doc.text,
    ...(doc.keywords || []),
    doc.te?.title || '',
    doc.te?.act || '',
    doc.te?.text || '',
    doc.hi?.title || '',
    doc.hi?.act || '',
    doc.hi?.text || ''
  ].join(' ').toLowerCase();

  qTerms.forEach(term => {
    if (combinedSearchContent.includes(term)) {
      score += 3.0;
    }
  });

  return score;
}

/**
 * Retrieves legal documents matching user query from database / knowledge base.
 * Automatically localizes titles, acts, and text to the requested language.
 */
export async function searchKnowledgeBase(query, limit = 4, language = 'en') {
  let docsPool = [...SEEDED_INDIAN_LEGAL_KNOWLEDGE];

  if (isConnected()) {
    try {
      const dbDocs = await LegalKnowledge.find({}).lean();
      docsPool = [...docsPool, ...dbDocs];
    } catch (e) {
      console.warn("Error fetching DB legal docs, using seeded dataset:", e.message);
    }
  } else if (inMemoryDb.legalKnowledge && inMemoryDb.legalKnowledge.length > 0) {
    docsPool = [...docsPool, ...inMemoryDb.legalKnowledge];
  }

  const scoredDocs = docsPool.map(doc => {
    const score = calculateRelevanceScore(query, doc);
    return { ...doc, relevanceScore: score };
  });

  // Filter non-zero matches and sort by relevance score descending
  const rankedDocs = scoredDocs
    .filter(d => d.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  // If no specific match found, intelligently fallback to general tenancy / consumer rights or first statutes
  const finalDocs = rankedDocs.length > 0 ? rankedDocs : docsPool.slice(0, limit);

  // Return strictly localized documents so no foreign language text leaks into client or LLM prompts
  return finalDocs.map(doc => getLocalizedLegalDocument(doc, language));
}
