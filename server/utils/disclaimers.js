/**
 * Legal Safety Disclaimers & Caution Warnings for LexAI
 */

export const GENERAL_LEGAL_DISCLAIMER = 
  "LexAI provides general legal information grounded in Indian law and is not a substitute for advice from a qualified legal professional or advocate.";

export const HIGH_RISK_LEGAL_DISCLAIMER = 
  "IMPORTANT: This query involves high-risk or sensitive legal matters (e.g. criminal charges, court summons, or urgent notices). LexAI provides informational guidance only. You should immediately consult a practicing advocate or seek emergency legal aid.";

export const DRAFT_DOCUMENT_DISCLAIMER = 
  "AI-generated draft — review by a qualified legal professional before use.";

export function getDisclaimerForIntent(intent) {
  if (intent === 'DOCUMENT_DRAFTING') {
    return DRAFT_DOCUMENT_DISCLAIMER;
  }
  if (intent === 'HIGH_RISK_CRIMINAL' || intent === 'COURT_NOTICE') {
    return HIGH_RISK_LEGAL_DISCLAIMER;
  }
  return GENERAL_LEGAL_DISCLAIMER;
}
