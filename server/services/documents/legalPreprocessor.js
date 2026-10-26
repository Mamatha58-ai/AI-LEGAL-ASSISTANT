/**
 * Legal NLP Preprocessing & Entity Extraction Engine
 * Features:
 * 1. Unicode NFKD Normalization
 * 2. Legal Whitespace Collapsing
 * 3. Custom Legal Tokenization
 * 4. Sentence Boundary Segmentation (protecting legal abbreviations & citations)
 * 5. Legal Entity & Metadata Extraction (Parties, Dates, INR Consideration, Rates, Statutes)
 * 6. Extractive Centroid Summarization with Deontic Modal Weighting
 */

// Standard and legal stopwords
export const LEGAL_STOPWORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had",
  "has", "have", "having", "he", "her", "here", "hers", "herself", "him", "himself", "his", "how",
  "i", "if", "in", "into", "is", "it", "its", "itself", "me", "more", "most", "my", "myself",
  "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "our", "ours", "ourselves",
  "out", "over", "own", "same", "she", "so", "some", "such", "than", "that", "the", "their",
  "theirs", "them", "themselves", "then", "there", "these", "they", "this", "those", "through",
  "to", "too", "under", "until", "up", "very", "was", "we", "were", "what", "when", "where",
  "which", "while", "who", "whom", "why", "with", "you", "your", "yours", "yourself", "yourselves"
]);

// Protected legal abbreviations to prevent premature sentence segmentation
const LEGAL_ABBREVIATIONS = [
  /Hon'ble/gi,
  /Sec\./gi,
  /Cl\./gi,
  /Art\./gi,
  /No\./gi,
  /vs\./gi,
  /v\./gi,
  /para\./gi,
  /sub-sec\./gi,
  /Pvt\./gi,
  /Ltd\./gi,
  /LLP\./gi,
  /Inc\./gi,
  /Govt\./gi,
  /Dept\./gi,
  /Rs\./gi,
  /p\.a\./gi,
  /i\.e\./gi,
  /e\.g\./gi,
  /etc\./gi,
  /w\.e\.f\./gi,
  /u\/s\./gi,
  /Shri\./gi,
  /Smt\./gi,
  /Dr\./gi,
  /Adv\./gi
];

/**
 * 1. Unicode NFKD Normalization
 * Normalizes all unicode characters, ligatures (fi, fl), smart quotes, en/em dashes
 */
export function normalizeLegalUnicode(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    // Apply Unicode Normalization Form KD (Compatibility Decomposition)
    .normalize('NFKD')
    // Normalize typographical smart quotes and apostrophes
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    // Normalize en-dashes, em-dashes, hyphens
    .replace(/[\u2013\u2014\u2015]/g, '-')
    // Normalize ligatures
    .replace(/\uFB01/g, 'fi')
    .replace(/\uFB02/g, 'fl')
    .replace(/\uFB00/g, 'ff')
    .replace(/\uFB03/g, 'ffi')
    .replace(/\uFB04/g, 'ffl')
    // Normalize zero-width and non-breaking spaces
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ');
}

/**
 * 2. Legal Whitespace Collapsing
 * Collapses non-standard line feeds, excess tabs, trailing spaces while preserving legal paragraph structure
 */
export function collapseLegalWhitespace(text) {
  if (!text) return '';
  return text
    // Replace carriage returns, form feeds, vertical tabs with standard newlines
    .replace(/[\r\f\v]/g, '\n')
    // Collapse horizontal whitespace (spaces/tabs) to a single space
    .replace(/[ \t]+/g, ' ')
    // Remove whitespace at the start and end of individual lines
    .replace(/^[ \t]+|[ \t]+$/gm, '')
    // Collapse 3 or more consecutive newlines to 2 (preserving clause paragraph breaks)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Full Legal Text Preprocessing
 * Combines Unicode NFKD normalization and legal whitespace collapsing
 */
export function cleanLegalText(text) {
  return collapseLegalWhitespace(normalizeLegalUnicode(text));
}

/**
 * 3. Custom Legal Tokenization
 * Extracts alphanumeric terms, hyphenated statutory markers, preserving case options and filtering stopwords
 */
export function tokenizeLegalText(text, options = { removeStopwords: false, lowercase: true }) {
  if (!text) return [];
  let processed = options.lowercase ? text.toLowerCase() : text;
  // Match words, hyphenated terms, statutory citations, and numeric percentages
  const tokens = processed.match(/\b[a-zA-Z0-9_\-\.]{2,}\b/g) || [];
  if (options.removeStopwords) {
    return tokens.filter(t => !LEGAL_STOPWORDS.has(t.toLowerCase()));
  }
  return tokens;
}

/**
 * 4. Sentence Boundary Segmentation
 * Accurately segments legal documents into sentences without breaking on legal abbreviations (Sec., No., vs., Hon'ble, etc.)
 */
export function segmentSentences(text) {
  if (!text) return [];
  let cleaned = cleanLegalText(text);

  // Mask protected abbreviations with unique placeholders
  const placeholderMap = [];
  cleaned = cleaned.replace(/(Hon'ble|Sec\.\s*\d+|Sec\.|Cl\.\s*[\d\.]+|Cl\.|Art\.|No\.|vs\.|v\.|para\.|sub-sec\.|Pvt\.|Ltd\.|LLP\.|Inc\.|Govt\.|Dept\.|Rs\.|p\.a\.|i\.e\.|e\.g\.|etc\.|w\.e\.f\.|u\/s\.|Shri\.|Smt\.|Dr\.|Adv\.)/gi, (match) => {
    const key = `__LEGAL_ABBR_${placeholderMap.length}__`;
    placeholderMap.push({ key, value: match });
    return key;
  });

  // Protect monetary decimals like 45,000.00 or 8.75% and numbered clauses like 1.1 or 2.b
  cleaned = cleaned.replace(/(\d+)\.(\d+)/g, '$1__DECIMAL_POINT__$2');
  cleaned = cleaned.replace(/(\d+)\.([a-zA-Z])/g, '$1__CLAUSE_SUB__$2');

  // Split on sentence terminators followed by whitespace or uppercase letter
  const rawSplits = cleaned.split(/(?<=[.!?])\s+(?=[A-Z0-9\(\"\'•\d])/);

  const sentences = [];
  for (let raw of rawSplits) {
    let s = raw.trim();
    // Restore protected abbreviations
    for (const item of placeholderMap) {
      s = s.split(item.key).join(item.value);
    }
    // Restore decimal points and clause subs
    s = s.split('__DECIMAL_POINT__').join('.');
    s = s.split('__CLAUSE_SUB__').join('.');

    if (s.length >= 25 && !/^[0-9\s\.\:\-]+$/.test(s)) {
      sentences.push(s);
    }
  }

  return sentences;
}

/**
 * 5. Legal Entity & Metadata Extractor
 * Extracts:
 * - Contracting Parties & Roles (Lessor/Lessee, Vendor/Purchaser, Lender/Borrower, etc.)
 * - Execution & Effective Dates
 * - Monetary Considerations (INR, Rupees, Lakhs, Crores)
 * - Interest Rates & Penalty Percentages
 * - Statutory References (Transfer of Property Act, SARFAESI, Motor Vehicles Act, etc.)
 * - Tenures & Notice Periods
 */
export function extractLegalEntities(text) {
  const norm = cleanLegalText(text);

  const entities = {
    parties: [],
    primaryRole: "Contracting Parties",
    executionDate: "As stipulated on execution",
    monetaryTerms: "As specified in Agreement Schedule",
    monetaryBreakdown: [],
    interestRates: [],
    tenures: [],
    noticePeriods: [],
    statutesDetected: []
  };

  // 1. Contracting Parties Extraction with Role Classification
  const partyPatterns = [
    // Standard role pairs
    { regex: /LESSOR:\s*([A-Z][A-Za-z\s.]+?)(?:,|\n|\s+residing|\s+having|$)(?:[\s\S]*?)LESSEE:\s*([A-Z][A-Za-z\s.]+?)(?:,|\n|\s+residing|\s+having|$)/i, role: "Lessor & Lessee" },
    { regex: /SELLER:\s*([A-Z][A-Za-z\s.]+?)(?:,|\n|\s+residing|\s+having|$)(?:[\s\S]*?)BUYER:\s*([A-Z][A-Za-z\s.]+?)(?:,|\n|\s+residing|\s+having|$)/i, role: "Seller & Buyer" },
    { regex: /LENDER:\s*([A-Z][A-Za-z\s.]+?)(?:,|\n|\s+residing|\s+having|$)(?:[\s\S]*?)BORROWER:\s*([A-Z][A-Za-z\s.]+?)(?:,|\n|\s+residing|\s+having|$)/i, role: "Lender & Borrower" },
    { regex: /([A-Z][A-Za-z\s.,]+?)\s*\((?:the\s+)?['"]?(Lessor|Landlord)['"]?\)\s*(?:and|&)\s*([A-Z][A-Za-z\s.,]+?)\s*\((?:the\s+)?['"]?(Lessee|Tenant)['"]?\)/i, role: "Lessor & Lessee" },
    { regex: /([A-Z][A-Za-z\s.,]+?)\s*\((?:the\s+)?['"]?(Vendor|Seller)['"]?\)\s*(?:and|&)\s*([A-Z][A-Za-z\s.,]+?)\s*\((?:the\s+)?['"]?(Purchaser|Buyer)['"]?\)/i, role: "Vendor & Purchaser" },
    { regex: /([A-Z][A-Za-z\s.,]+?)\s*\((?:the\s+)?['"]?(Lender|Bank)['"]?\)\s*(?:and|&)\s*([A-Z][A-Za-z\s.,]+?)\s*\((?:the\s+)?['"]?(Borrower|Pledgor)['"]?\)/i, role: "Lender & Borrower" },
    { regex: /([A-Z][A-Za-z\s.,]+?)\s*\((?:the\s+)?['"]?(Employer|Company)['"]?\)\s*(?:and|&)\s*([A-Z][A-Za-z\s.,]+?)\s*\((?:the\s+)?['"]?(Employee|Executive)['"]?\)/i, role: "Employer & Executive" },
    { regex: /([A-Z][A-Za-z\s.,]+?)\s*\((?:the\s+)?['"]?(Disclosing\s+Party)['"]?\)\s*(?:and|&)\s*([A-Z][A-Za-z\s.,]+?)\s*\((?:the\s+)?['"]?(Receiving\s+Party)['"]?\)/i, role: "Disclosing & Receiving Party" },
    { regex: /between\s+([A-Z][A-Za-z0-9\s.,&]+?)\s+(?:called|referred to as|and)\s+([A-Z][A-Za-z0-9\s.,&]+?)(?:[.;\n]|$)/i, role: "Executing Parties" },
    { regex: /PARTY ONE:\s*([^\n,]+)[\s\S]*?PARTY TWO:\s*([^\n,]+)/i, role: "Executing Parties" }
  ];

  for (const { regex, role } of partyPatterns) {
    const match = norm.match(regex);
    if (match) {
      const p1 = match[1].trim().replace(/^the\s+/i, '');
      const p2 = (match[2] && match[3] ? match[3] : match[2]).trim().replace(/^the\s+/i, '');
      if (p1.length > 2 && p2.length > 2) {
        entities.parties = [p1, p2];
        entities.primaryRole = role;
        break;
      }
    }
  }

  if (entities.parties.length === 0) {
    // Secondary fallback
    const names = norm.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g);
    if (names && names.length >= 2) {
      entities.parties = [names[0], names[1]];
    } else {
      entities.parties = ["Executing Party A", "Executing Party B"];
    }
  }

  // 2. Execution Date Extraction
  const datePatterns = [
    /\b(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:day of\s+)?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,]+\d{4})\b/i,
    /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/,
    /(?:dated|effective|executed on|entered into on)\s+([A-Za-z0-9\s,]+?\d{4})/i
  ];
  for (const pattern of datePatterns) {
    const match = norm.match(pattern);
    if (match) {
      entities.executionDate = (match[1] || match[0]).trim();
      break;
    }
  }

  // 3. Monetary Consideration Extraction (INR)
  const amountPatterns = [
    /(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d{2})?(?:\s*(?:lakhs?|crores?|thousand|million))?)/gi,
    /\b(\d[\d,]*\s*(?:rupees|lakhs|crores))\b/gi
  ];
  const detectedAmounts = new Set();
  for (const pattern of amountPatterns) {
    let m;
    while ((m = pattern.exec(norm)) !== null) {
      const amtStr = m[0].trim();
      if (amtStr.length > 2 && !detectedAmounts.has(amtStr)) {
        detectedAmounts.add(amtStr);
      }
    }
  }
  const amountsArray = Array.from(detectedAmounts);
  if (amountsArray.length > 0) {
    entities.monetaryTerms = amountsArray.join(" | ");
    entities.monetaryBreakdown = amountsArray;
  }

  // 4. Interest Rates / Penalties Extraction
  const ratePatterns = /\b(\d+(?:\.\d+)?\s*%\s*(?:p\.a\.|per annum|compound|simple|penal|default)?)\b/gi;
  let rMatch;
  const ratesSet = new Set();
  while ((rMatch = ratePatterns.exec(norm)) !== null) {
    ratesSet.add(rMatch[0].trim());
  }
  entities.interestRates = Array.from(ratesSet);

  // 5. Tenures & Notice Periods
  const tenureMatches = norm.match(/\b(\d+\s*(?:months?|years?|days?|weeks?))\b/gi) || [];
  const uniqueTenures = Array.from(new Set(tenureMatches.map(t => t.trim())));
  entities.tenures = uniqueTenures.filter(t => !t.toLowerCase().includes('day'));
  entities.noticePeriods = uniqueTenures.filter(t => t.toLowerCase().includes('day'));

  // 6. Indian Statutory References
  const KNOWN_ACTS = [
    "Model Tenancy Act",
    "Transfer of Property Act",
    "SARFAESI Act",
    "Motor Vehicles Act",
    "Registration Act",
    "Indian Stamp Act",
    "Indian Contract Act",
    "Arbitration and Conciliation Act",
    "RERA",
    "Negotiable Instruments Act",
    "Banking Regulation Act",
    "RBI Master Directions",
    "Consumer Protection Act"
  ];
  for (const act of KNOWN_ACTS) {
    if (new RegExp('\\b' + act + '\\b', 'i').test(norm)) {
      entities.statutesDetected.push(act);
    }
  }

  return entities;
}

/**
 * 7. Extractive Centroid Summarizer
 * Employs TF-IDF sentence centroid cosine similarity with legal deontic weighting
 * to generate concise, highly accurate executive abstracts.
 */
export function generateExtractiveCentroidSummary(text, maxSentences = 4) {
  const sentences = segmentSentences(text);
  if (!sentences || sentences.length === 0) {
    return cleanLegalText(text).slice(0, 300) + '...';
  }

  if (sentences.length <= maxSentences) {
    return sentences.join(' ');
  }

  // 1. Build Term Frequencies for each sentence
  const sentenceTokens = sentences.map(s => tokenizeLegalText(s, { removeStopwords: true, lowercase: true }));
  
  // Document-wide Document Frequencies (DF)
  const docFreq = {};
  const N = sentences.length;
  sentenceTokens.forEach(tokens => {
    const unique = new Set(tokens);
    unique.forEach(term => {
      docFreq[term] = (docFreq[term] || 0) + 1;
    });
  });

  // Calculate TF-IDF vectors
  const sentenceVectors = [];
  const centroidVector = {};

  sentenceTokens.forEach((tokens, sentIdx) => {
    const tf = {};
    tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });

    const vector = {};
    let sumSq = 0;
    for (const [term, freq] of Object.entries(tf)) {
      const idf = Math.log(1 + (N / (docFreq[term] || 1)));
      const weight = (1 + Math.log(freq)) * idf;
      vector[term] = weight;
      sumSq += weight * weight;
      // Accumulate into centroid
      centroidVector[term] = (centroidVector[term] || 0) + weight / N;
    }

    // L2 Normalize sentence vector
    const norm = Math.sqrt(sumSq) || 1.0;
    for (const term in vector) {
      vector[term] /= norm;
    }
    sentenceVectors.push(vector);
  });

  // Centroid norm
  let centroidSumSq = 0;
  for (const term in centroidVector) {
    centroidSumSq += centroidVector[term] * centroidVector[term];
  }
  const centroidNorm = Math.sqrt(centroidSumSq) || 1.0;

  // 2. Score each sentence: Cosine similarity with Centroid + Legal Deontic Weighting
  const scoredSentences = sentences.map((sent, idx) => {
    const vec = sentenceVectors[idx];
    let dotProduct = 0;
    for (const [term, val] of Object.entries(vec)) {
      if (centroidVector[term]) {
        dotProduct += val * centroidVector[term];
      }
    }
    let simScore = dotProduct / centroidNorm;

    const lower = sent.toLowerCase();

    // Legal Deontic Modal Weighting
    // A. Mandatory Deontic Markers (High boost x1.40)
    if (/\b(shall|must|undertakes|warrants|covenants|hereby agrees|required to|bound to)\b/.test(lower)) {
      simScore *= 1.40;
    }
    // B. Prohibitive Deontic Markers (Boost x1.35)
    if (/\b(shall not|prohibited|forbidden|in no event|not permitted)\b/.test(lower)) {
      simScore *= 1.35;
    }
    // C. Enforcement, Liability & Remedy Markers (Boost x1.30)
    if (/\b(indemnif|liable|default|terminat|forfeit|repossess|accelerat|penalty|sarfaesi)\b/.test(lower)) {
      simScore *= 1.30;
    }
    // D. Consideration & Statutory grounding (Boost x1.20)
    if (/\b(inr|rs\.?|₹|deposit|rent|interest|act\s+\d{4})\b/.test(lower)) {
      simScore *= 1.20;
    }

    return {
      sentence: sent,
      index: idx,
      score: simScore
    };
  });

  // Select top N sentences by score
  const topRanked = [...scoredSentences]
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences);

  // Re-sort selected sentences chronologically to retain natural document flow
  topRanked.sort((a, b) => a.index - b.index);

  return topRanked.map(item => item.sentence).join(' ');
}
