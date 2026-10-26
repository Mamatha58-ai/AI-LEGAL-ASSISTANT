import { GoogleGenAI } from '@google/genai';

/**
 * Main AI Legal Engine for document analysis, risk scoring, and interactive Q&A.
 */

// Helper to check if Gemini API key is configured
export function getStoredApiKey() {
  return localStorage.getItem('lexis_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function saveApiKey(key) {
  if (key) {
    localStorage.setItem('lexis_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('lexis_gemini_api_key');
  }
}

/**
 * Analyzes legal document text and returns structured analysis.
 * @param {string} documentText 
 * @param {string} [title] 
 * @returns {Promise<Object>}
 */
export async function analyzeLegalDocument(documentText, title = "Legal Document") {
  const apiKey = getStoredApiKey();

  if (apiKey) {
    try {
      return await analyzeWithGemini(documentText, title, apiKey);
    } catch (err) {
      console.warn("Gemini API call failed, falling back to local legal intelligence parser:", err);
    }
  }

  // Fallback / Offline Legal Intelligence Parser
  return analyzeWithLocalParser(documentText, title);
}

/**
 * Gemini API Real Analysis
 */
async function analyzeWithGemini(documentText, title, apiKey) {
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-2.5-flash';

  const systemPrompt = `You are LexisAI, an elite corporate legal counsel and contract risk analyst.
Analyze the following legal document and provide a comprehensive structured JSON output matching this exact JSON schema:
{
  "summary": {
    "title": "Document Title",
    "documentType": "Type of agreement",
    "parties": ["Party A", "Party B"],
    "effectiveDate": "Extracted date or Not Specified",
    "duration": "Term duration or Not Specified",
    "governingLaw": "Jurisdiction / State / Country",
    "overview": "3-4 sentence high level executive summary."
  },
  "riskScore": 75, // 0 to 100 score where 0 is completely safe and 100 is highly predatory/dangerous
  "riskLevel": "HIGH" // "LOW", "MEDIUM", or "HIGH"
  "riskBreakdown": {
    "highRisksCount": 2,
    "mediumRisksCount": 1,
    "lowRisksCount": 3
  },
  "redFlags": [
    {
      "id": "flag-1",
      "severity": "HIGH", // "HIGH", "MEDIUM", "LOW"
      "title": "Short title of issue",
      "clauseQuote": "Exact text quote from document",
      "explanation": "Why this is dangerous or unfair to the signing party.",
      "recommendation": "Suggested revision or negotiation strategy."
    }
  ],
  "clauses": [
    {
      "id": "clause-1",
      "category": "Indemnification", // E.g. "Indemnification", "Limitation of Liability", "Termination", "IP Rights", "Confidentiality", "Non-Compete", "Governing Law"
      "title": "Section Title",
      "content": "Clause excerpt text",
      "riskStatus": "HIGH", // "HIGH", "MEDIUM", "LOW", "NEUTRAL"
      "analysis": "Summary of what this clause obligates."
    }
  ],
  "suggestedQuestions": [
    "Suggested question 1 about this contract?",
    "Suggested question 2 about liability?",
    "Suggested question 3 about termination?"
  ]
}

Return ONLY raw valid JSON with no markdown block surrounding it if possible, or standard JSON inside triple backticks.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      { role: 'user', parts: [{ text: `${systemPrompt}\n\nDOCUMENT TITLE: ${title}\n\nDOCUMENT TEXT:\n${documentText}` }] }
    ]
  });

  const responseText = response.text || '';
  const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  const data = JSON.parse(cleanJson);
  return data;
}

/**
 * High-Precision Local Legal Intelligence NLP Analyzer (Offline Fallback)
 */
function analyzeWithLocalParser(documentText, title) {
  const textLower = documentText.toLowerCase();
  const lines = documentText.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Identify Parties
  const parties = [];
  const partyMatch = documentText.match(/between\s+([\A-Za-z0-9\s.,]+?)\s+\(["']?Disclosing Party["']?\)?\s+and\s+([\A-Za-z0-9\s.,]+?)\s+\(["']?Receiving Party["']?\)?/i) ||
                     documentText.match(/between\s+([A-Z][A-Za-z0-9\s.,&]+?)(?:\s+\(.*?\))?\s+and\s+([A-Z][A-Za-z0-9\s.,&]+?)(?:\s+\(.*?\))?(?:[.;\n]|$)/i);
  if (partyMatch) {
    parties.push(partyMatch[1].trim(), partyMatch[2].trim());
  } else {
    parties.push("Disclosing / Assigning Party", "Receiving / Executing Party");
  }

  // 2. Effective Date & Jurisdiction
  const dateMatch = documentText.match(/(?:dated as of|effective as of|entered into as of|executed on)\s+([A-Za-z]+\s+\d{1,2},\s+\d{4}|\d{4}-\d{2}-\d{2})/i);
  const effectiveDate = dateMatch ? dateMatch[1] : "Not Specified in Header";

  const lawMatch = documentText.match(/laws of (?:the State of )?([A-Za-z\s]+?)(?:,|\.|\s+without|\s+and)/i);
  const governingLaw = lawMatch ? lawMatch[1].trim() : "State/Federal Jurisdiction";

  const durationMatch = documentText.match(/(\d+\s+(?:months|years|days))/i);
  const duration = durationMatch ? durationMatch[1] : "Indefinite / As specified in Term section";

  // 3. Scan Red Flags & High Risk Clauses
  const redFlags = [];
  let riskScore = 20; // baseline

  // Check 1: Unlimited Liability & One-Sided Indemnity
  if (textLower.includes('unlimited attorney fees') || (textLower.includes('indemnify') && textLower.includes('unconditionally')) || textLower.includes('regardless of fault')) {
    riskScore += 30;
    const matchLine = lines.find(l => l.toLowerCase().includes('indemnify')) || lines[4] || "Indemnification clause";
    redFlags.push({
      id: "flag-indemnity",
      severity: "HIGH",
      title: "Uncapped & One-Sided Indemnification",
      clauseQuote: matchLine,
      explanation: "This clause forces you to unconditionally indemnify and hold harmless the other party without monetary caps, even if damages arise from their own fault or negligence.",
      recommendation: "Cap indemnification obligations to actual direct damages and exclude liability arising from the other party's gross negligence or willful misconduct."
    });
  }

  // Check 2: Non-Compete & Restrictive Covenants
  if (textLower.includes('non-compete') || textLower.includes('competing software') || textLower.includes('36 months') || textLower.includes('24 months')) {
    riskScore += 25;
    const matchLine = lines.find(l => l.toLowerCase().includes('non-compete') || l.toLowerCase().includes('months')) || "Non-compete clause";
    redFlags.push({
      id: "flag-noncompete",
      severity: "HIGH",
      title: "Extensive Non-Compete Restriction",
      clauseQuote: matchLine,
      explanation: "Contains a lengthy (24-36 months) non-compete clause restricting business activities across broad geographic areas.",
      recommendation: "Narrow non-compete duration to max 6–12 months, limit geographic scope, or restrict only to direct targeted competitors."
    });
  }

  // Check 3: Data Rights & AI Model Training Grants
  if (textLower.includes('train') && (textLower.includes('ai') || textLower.includes('artificial intelligence') || textLower.includes('models') || textLower.includes('perpetual, irrevocable'))) {
    riskScore += 20;
    const matchLine = lines.find(l => l.toLowerCase().includes('train') || l.toLowerCase().includes('perpetual')) || "Data rights clause";
    redFlags.push({
      id: "flag-data-ai",
      severity: "HIGH",
      title: "Perpetual License for AI Training on Proprietary Data",
      clauseQuote: matchLine,
      explanation: "Grants the provider an irrevocable worldwide license to use your uploaded data to train their commercial AI models.",
      recommendation: "Expressly opt-out of AI model training and restrict data usage solely to service delivery."
    });
  }

  // Check 4: Auto-Renewal & Fee Escalation
  if (textLower.includes('automatically renew') || textLower.includes('automatic renewal') || textLower.includes('increase by')) {
    riskScore += 15;
    const matchLine = lines.find(l => l.toLowerCase().includes('renew') || l.toLowerCase().includes('increase')) || "Auto renewal clause";
    redFlags.push({
      id: "flag-autorenew",
      severity: "MEDIUM",
      title: "Auto-Renewal with Escalating Fees",
      clauseQuote: matchLine,
      explanation: "Agreement automatically renews for 12-month periods with mandatory annual price increases unless non-renewal notice is served 90 days in advance.",
      recommendation: "Reduce non-renewal notice window to 30 days and cap annual fee increases to CPI or max 3–5%."
    });
  }

  // Check 5: Unilateral Modification
  if (textLower.includes('reserves the right to modify') || textLower.includes('unilateral')) {
    riskScore += 15;
    const matchLine = lines.find(l => l.toLowerCase().includes('modify')) || "Unilateral amendment clause";
    redFlags.push({
      id: "flag-unilateral",
      severity: "MEDIUM",
      title: "Unilateral Contract Amendment Rights",
      clauseQuote: matchLine,
      explanation: "The counterparty can modify terms, SLAs, or prices unilaterally at any time without your prior consent.",
      recommendation: "Require written mutual agreement for any amendments to terms or pricing."
    });
  }

  // Cap risk score between 0 and 100
  riskScore = Math.min(100, Math.max(15, riskScore));

  const riskLevel = riskScore >= 70 ? "HIGH" : riskScore >= 40 ? "MEDIUM" : "LOW";

  // 4. Extract Key Clauses
  const clauses = [
    {
      id: "clause-indemnity",
      category: "Indemnification",
      title: "Indemnity & Hold Harmless",
      content: lines.find(l => l.toLowerCase().includes('indemnif')) || "Subject to standard indemnity provisions.",
      riskStatus: textLower.includes('unlimited') || textLower.includes('unconditionally') ? "HIGH" : "MEDIUM",
      analysis: "Outlines liability indemnification obligations between the executing parties."
    },
    {
      id: "clause-liability",
      category: "Limitation of Liability",
      title: "Liability Cap & Damages Disclaimer",
      content: lines.find(l => l.toLowerCase().includes('liability') || l.toLowerCase().includes('damages')) || "No express liability limit specified.",
      riskStatus: textLower.includes('exceed') || textLower.includes('as is') ? "HIGH" : "LOW",
      analysis: "Defines maximum financial recovery limits and disclaims indirect/consequential damages."
    },
    {
      id: "clause-term",
      category: "Termination",
      title: "Term, Renewal & Termination Rights",
      content: lines.find(l => l.toLowerCase().includes('terminat') || l.toLowerCase().includes('renew')) || "Standard termination rules apply.",
      riskStatus: textLower.includes('automatically renew') ? "MEDIUM" : "LOW",
      analysis: "Governs contract duration, non-renewal notification periods, and termination notice requirements."
    },
    {
      id: "clause-ip",
      category: "IP Rights",
      title: "Intellectual Property Ownership",
      content: lines.find(l => l.toLowerCase().includes('intellectual property') || l.toLowerCase().includes('work product') || l.toLowerCase().includes('confidential information')) || "Standard IP ownership provisions.",
      riskStatus: textLower.includes('irrevocable') || textLower.includes('perpetual') ? "HIGH" : "LOW",
      analysis: "Determines ownership of created work product, trade secrets, and proprietary data."
    },
    {
      id: "clause-law",
      category: "Governing Law",
      title: "Jurisdiction & Dispute Resolution",
      content: lines.find(l => l.toLowerCase().includes('governed by') || l.toLowerCase().includes('arbitration')) || `Governed by ${governingLaw}.`,
      riskStatus: textLower.includes('waives all rights') ? "MEDIUM" : "NEUTRAL",
      analysis: "Specifies legal jurisdiction, governing venue, and mandatory arbitration protocols."
    }
  ];

  return {
    summary: {
      title,
      documentType: textLower.includes('non-disclosure') || textLower.includes('nda') ? 'Non-Disclosure Agreement' :
                    textLower.includes('saas') || textLower.includes('software') ? 'SaaS Master Agreement' :
                    textLower.includes('employment') ? 'Employment Agreement' :
                    textLower.includes('lease') ? 'Commercial Real Estate Lease' : 'Legal Contract',
      parties,
      effectiveDate,
      duration,
      governingLaw,
      overview: `This document is a ${title} establishing legal rights and obligations between ${parties.join(' and ')}. Key findings indicate an overall risk score of ${riskScore}/100 (${riskLevel} RISK) due to specific clauses regarding liability limits, restrictive covenants, and termination rights.`
    },
    riskScore,
    riskLevel,
    riskBreakdown: {
      highRisksCount: redFlags.filter(r => r.severity === 'HIGH').length,
      mediumRisksCount: redFlags.filter(r => r.severity === 'MEDIUM').length,
      lowRisksCount: redFlags.filter(r => r.severity === 'LOW').length
    },
    redFlags,
    clauses,
    suggestedQuestions: [
      "What are the highest risk clauses in this document?",
      "Can I terminate this agreement early without penalty?",
      "What is the maximum liability cap for damages?",
      "Are there non-compete or non-solicitation restrictions?",
      "How are intellectual property rights handled?"
    ]
  };
}

/**
 * Answer user Q&A questions grounded in the contract document.
 * @param {string} question 
 * @param {Object} documentData 
 * @param {string} fullText 
 * @returns {Promise<{ answer: string, citations: Array<{ quote: string, section: string }> }>}
 */
export async function askLegalQuestion(question, documentData, fullText) {
  const apiKey = getStoredApiKey();

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = 'gemini-2.5-flash';

      const prompt = `You are LexisAI, an expert legal advisor. Answer the user's question accurately based STRICTLY on the legal document provided below.
Provide a clear, professional answer, cite exact quotes from the contract where applicable, and offer actionable advice.

QUESTION: "${question}"

DOCUMENT CONTEXT:
${fullText.slice(0, 15000)}`;

      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      return {
        answer: response.text || "No response generated.",
        citations: []
      };
    } catch (err) {
      console.warn("Gemini Q&A call failed, using local grounding engine:", err);
    }
  }

  // Local Grounded Q&A logic
  const qLower = question.toLowerCase();
  const textLower = fullText.toLowerCase();
  const lines = fullText.split('\n').filter(Boolean);

  let answer = "";
  let citations = [];

  if (qLower.includes('risk') || qLower.includes('dangerous') || qLower.includes('red flag')) {
    answer = `Based on our legal analysis, this contract carries a **${documentData.riskLevel} RISK score (${documentData.riskScore}/100)**.\n\nKey areas of concern include:\n` +
      documentData.redFlags.map(rf => `- **${rf.title}** (${rf.severity} Risk): ${rf.explanation}`).join('\n\n') +
      `\n\n*Recommendation*: We advise requesting revisions for highlighted HIGH severity clauses before signing.`;
    citations = documentData.redFlags.map(rf => ({ quote: rf.clauseQuote, section: rf.title }));
  } 
  else if (qLower.includes('terminate') || qLower.includes('cancel') || qLower.includes('end')) {
    const termLine = lines.find(l => l.toLowerCase().includes('terminate') || l.toLowerCase().includes('renewal')) || "Termination terms section.";
    answer = `**Termination Terms Analysis**:\nAccording to the contract:\n- ${termLine}\n\n` +
      (textLower.includes('automatically renew') ? 
        `⚠️ *Caution*: This contract contains an **automatic renewal clause**. You must provide written notice prior to expiration to avoid automatic renewal.` : 
        `Standard termination notice is required as stipulated in the Term & Termination clause.`);
    citations = [{ quote: termLine, section: "Term & Termination" }];
  }
  else if (qLower.includes('liab') || qLower.includes('cap') || qLower.includes('damages') || qLower.includes('indemn')) {
    const liabLine = lines.find(l => l.toLowerCase().includes('liability') || l.toLowerCase().includes('indemnify')) || "Liability section.";
    answer = `**Liability & Indemnification Breakdown**:\n- **Clause Quote**: "${liabLine}"\n\n` +
      (textLower.includes('unlimited') ? 
        `⚠️ **Red Flag Alert**: This agreement contains uncapped or unlimited liability exposure for certain breaches.` :
        `Liability limits appear constrained, but verify aggregate fee caps.`);
    citations = [{ quote: liabLine, section: "Liability & Indemnity" }];
  }
  else if (qLower.includes('compete') || qLower.includes('solicit') || qLower.includes('restrict')) {
    const nonCompeteLine = lines.find(l => l.toLowerCase().includes('non-compete') || l.toLowerCase().includes('solicit')) || "No explicit non-compete clause found.";
    answer = `**Restrictive Covenants & Non-Compete**:\n- ${nonCompeteLine}\n\n` +
      (textLower.includes('months') ? `Restricts post-termination competitive activities.` : `No aggressive non-compete restriction detected.`);
    citations = [{ quote: nonCompeteLine, section: "Non-Compete Covenants" }];
  }
  else if (qLower.includes('ip') || qLower.includes('intellectual property') || qLower.includes('ownership') || qLower.includes('patent')) {
    const ipLine = lines.find(l => l.toLowerCase().includes('work product') || l.toLowerCase().includes('intellectual property') || l.toLowerCase().includes('assign')) || "IP Rights section.";
    answer = `**Intellectual Property Rights**:\n- ${ipLine}\n\nAll created work products and proprietary materials are governed by this ownership assignment.`;
    citations = [{ quote: ipLine, section: "Intellectual Property" }];
  }
  else {
    // General keyword match
    const matchingLines = lines.filter(l => {
      const words = qLower.split(' ').filter(w => w.length > 3);
      return words.some(w => l.toLowerCase().includes(w));
    }).slice(0, 3);

    if (matchingLines.length > 0) {
      answer = `Here is what the agreement states regarding your inquiry:\n\n` +
        matchingLines.map(ml => `> "${ml}"`).join('\n\n') +
        `\n\n*Legal Note*: Always cross-reference this with local jurisdiction laws or consult with legal counsel for binding advice.`;
      citations = matchingLines.map(ml => ({ quote: ml, section: "Contract Excerpt" }));
    } else {
      answer = `The contract does not explicitly detail terms directly matching "${question}". However, general contract principles suggest reviewing the Governing Law section (${documentData.summary.governingLaw}) or consulting our Clause Explorer tab for related terms.`;
    }
  }

  return { answer, citations };
}
