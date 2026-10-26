/**
 * Intent Classifier for LexAI Legal Pipeline
 */

export function detectIntent(userPrompt) {
  const p = userPrompt.toLowerCase().trim();

  if (p.includes('draft') || p.includes('template') || p.includes('write legal notice') || p.includes('rental agreement draft') || p.includes('create affidavit')) {
    return 'DOCUMENT_DRAFTING';
  }

  if (p.includes('analyze document') || p.includes('upload contract') || p.includes('summary of this document') || p.includes('risk analysis')) {
    return 'DOCUMENT_ANALYSIS';
  }

  if (p.includes('case') || p.includes('judgment') || p.includes('supreme court precedent') || p.includes('v. state') || p.includes('versus')) {
    return 'CASE_SEARCH';
  }

  if (p.includes('section') || p.includes('bns') || p.includes('ipc') || p.includes('crpc') || p.includes('bnss') || p.includes('act') || p.includes('article')) {
    return 'LAW_SEARCH';
  }

  if (p.includes('murder') || p.includes('arrest') || p.includes('fir') || p.includes('bail') || p.includes('police summons') || p.includes('498a')) {
    return 'HIGH_RISK_CRIMINAL';
  }

  return 'LEGAL_QUESTION';
}
