"""
End-to-End Legal NLP Inference Pipeline
Loads trained NLP models and executes:
1. Text Normalization & Custom Tokenization
2. Document Type Categorization (House Property, Car Documents, Bank Loan, Gold Loan)
3. Clause Segmentation & per-clause Risk Classification (High / Medium / Low)
4. Legal Named Entity Extraction (Parties, Dates, Monetary Amounts, Governing Acts)
5. Extractive & Structured Summary Generation
"""

import os
import sys
import json
import joblib
from typing import Dict, Any, List

try:
    from .nlp_preprocessor import clean_text, extract_legal_entities, segment_clauses
    from .summarizer import generate_extractive_summary, generate_structured_legal_summary
except (ImportError, ValueError):
    from nlp_preprocessor import clean_text, extract_legal_entities, segment_clauses
    from summarizer import generate_extractive_summary, generate_structured_legal_summary


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")


class LegalNLPEngine:
    def __init__(self):
        self.doc_model = None
        self.risk_model = None
        self.type_model = None
        self._load_models()

    def _load_models(self):
        doc_path = os.path.join(MODELS_DIR, "doc_classifier_pipeline.joblib")
        risk_path = os.path.join(MODELS_DIR, "clause_risk_pipeline.joblib")
        type_path = os.path.join(MODELS_DIR, "clause_type_pipeline.joblib")

        if os.path.exists(doc_path):
            self.doc_model = joblib.load(doc_path)
        if os.path.exists(risk_path):
            self.risk_model = joblib.load(risk_path)
        if os.path.exists(type_path):
            self.type_model = joblib.load(type_path)

    def analyze_document(self, raw_text: str, filename: str = "Uploaded Legal Document") -> Dict[str, Any]:
        """
        Executes complete NLP pipeline over document text.
        """
        cleaned = clean_text(raw_text)

        # 1. Document Type Classification
        if self.doc_model:
            doc_type = str(self.doc_model.predict([cleaned])[0])
            doc_probs = self.doc_model.predict_proba([cleaned])[0] if hasattr(self.doc_model, "predict_proba") else None
            confidence = float(max(doc_probs)) if doc_probs is not None else 1.0
        else:
            doc_type = "Legal Document"
            confidence = 0.5

        # 2. Entity & Field Extraction
        entities = extract_legal_entities(raw_text)

        # 3. Clause Segmentation & Risk Analysis
        clauses = segment_clauses(raw_text)
        clause_analyses = []
        high_risk_count = 0
        med_risk_count = 0

        for item in clauses:
            c_title = item.get("title", "Clause")
            c_text = item.get("text", "")
            if not c_text or len(c_text.strip()) < 15:
                continue

            # Predict risk
            if self.risk_model:
                predicted_risk = str(self.risk_model.predict([c_text])[0])
            else:
                predicted_risk = "Low"

            # Predict clause type
            predicted_type = c_title
            if self.type_model is not None:
                try:
                    predicted_type = str(self.type_model.predict([c_text])[0])
                except Exception:
                    pass

            if predicted_risk == "High":
                high_risk_count += 1
            elif predicted_risk == "Medium":
                med_risk_count += 1

            clause_analyses.append({
                "title": c_title,
                "clause_type": predicted_type,
                "risk_level": predicted_risk,
                "text": c_text[:300] + ("..." if len(c_text) > 300 else "")
            })

        # Calculate weighted composite risk score (0-100)
        risk_score = min(100, max(10, 15 + (high_risk_count * 25) + (med_risk_count * 10)))
        risk_level = "HIGH" if risk_score >= 70 else ("MEDIUM" if risk_score >= 40 else "LOW")

        # 4. Extractive & Structured Summary
        extractive_summary = generate_extractive_summary(raw_text, max_sentences=4)
        structured_summary = generate_structured_legal_summary(raw_text, doc_type, risk_level, high_risk_count + med_risk_count)

        return {
            "document_metadata": {
                "filename": filename,
                "predicted_document_type": doc_type,
                "classification_confidence": round(confidence, 4),
                "entities": entities
            },
            "risk_assessment": {
                "overall_risk_score": risk_score,
                "overall_risk_level": risk_level,
                "high_risk_clauses_count": high_risk_count,
                "medium_risk_clauses_count": med_risk_count,
                "total_analyzed_clauses": len(clause_analyses),
                "flagged_clauses": clause_analyses
            },
            "summaries": {
                "extractive_summary": extractive_summary,
                "structured_summary": structured_summary
            }
        }


# Quick CLI test runner
if __name__ == "__main__":
    engine = LegalNLPEngine()

    sample_contract = """
    RESIDENTIAL TENANCY AND LEASE AGREEMENT
    This Lease Agreement executed on 15th August 2024 at Bangalore between Ramesh Kumar (Lessor) and Suresh Rao (Lessee).
    
    1. RENT AND SECURITY DEPOSIT:
    The Lessee covenants to pay a monthly rent of INR 50,000 before 5th of every month. The Lessee has furnished an interest-free refundable deposit of INR 3,00,000.
    
    2. UNCONDITIONAL INDEMNIFICATION:
    The Lessee agrees to unconditionally indemnify, defend and hold harmless the Lessor from any structural damages, neighbor complaints, penalties, or regulatory actions regardless of fault or causation.
    
    3. TERMINATION AND FORFEITURE:
    The Lessor shall have the sole and unfettered discretion to terminate this agreement with 7 days notice without assigning cause, and forfeit 50% of the security deposit.
    """

    print("Running NLP Pipeline on sample contract...")
    result = engine.analyze_document(sample_contract, "Sample_Rental_Agreement.docx")
    print(json.dumps(result, indent=2))
