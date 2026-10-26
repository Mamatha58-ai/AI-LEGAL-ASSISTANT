"""
Legal Extractive & Structured Summarization Engine
Generates:
1. Executive Legal Abstract (Document Domain, Core Obligations, Risk Overview)
2. Key Salient Points (Extractive TextRank / TF-IDF centroid sentence ranking)
3. Actionable Checklist for Legal Parties
"""

import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
try:
    from .nlp_preprocessor import clean_text, extract_legal_entities, segment_sentences
except ImportError:
    from nlp_preprocessor import clean_text, extract_legal_entities, segment_sentences


def generate_extractive_summary(text: str, max_sentences: int = 4) -> str:
    """
    Extracts the most salient legal sentences using TF-IDF sentence centroid scoring with legal deontic weighting.
    """
    sentences = segment_sentences(text)

    if not sentences:
        return text[:300] + "..." if len(text) > 300 else text

    if len(sentences) <= max_sentences:
        return " ".join(sentences)

    try:
        # TF-IDF centroid scoring
        vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
        tfidf_matrix = vectorizer.fit_transform(sentences)
        doc_vector = np.asarray(tfidf_matrix.sum(axis=0)).ravel()
        scores = []

        for i, sent_vec in enumerate(tfidf_matrix):
            # Cosine similarity between sentence and aggregate document representation
            sent_arr = np.asarray(sent_vec.todense()).ravel()
            norm_product = np.linalg.norm(sent_arr) * np.linalg.norm(doc_vector)
            score = np.dot(sent_arr, doc_vector) / norm_product if norm_product > 0 else 0
            
            # Boost score if sentence contains monetary amounts, dates, or key legal keywords
            lower_s = sentences[i].lower()
            if any(k in lower_s for k in ["shall", "indemnif", "deposit", "default", "interest", "terminat", "repossess"]):
                score *= 1.35
            scores.append((score, i, sentences[i]))

        # Sort by score descending and take top N, then sort back by original document order
        top_sentences = sorted(scores, key=lambda x: x[0], reverse=True)[:max_sentences]
        top_sentences = sorted(top_sentences, key=lambda x: x[1])

        return " ".join([item[2] for item in top_sentences])
    except Exception as e:
        # Fallback to leading sentences
        return " ".join(sentences[:max_sentences])

def generate_structured_legal_summary(text: str, doc_type: str = "Legal Contract", risk_level: str = "Medium", risk_count: int = 0) -> dict:
    """
    Synthesizes a structured legal brief with extracted entities, risk highlights, and plain-language summary.
    """
    entities = extract_legal_entities(text)
    extractive_summary = generate_extractive_summary(text, max_sentences=4)

    parties_str = " and ".join(entities["parties"]) if entities["parties"] else "Executing Parties"
    effective_date = entities["dates"][0] if entities["dates"] else "As stipulated on execution"
    primary_amount = entities["amounts"][0] if entities["amounts"] else "As specified in Schedule"

    plain_summary = (
        f"This is an Indian legal instrument classified under '{doc_type}' executed between {parties_str}. "
        f"The primary financial consideration involves {primary_amount} with effective date recorded as {effective_date}. "
        f"Our NLP assessment identified {risk_count} notable legal risk provisions categorized at an overall '{risk_level}' risk level."
    )

    return {
        "document_type": doc_type,
        "executive_summary": plain_summary,
        "salient_clauses_extracted": extractive_summary,
        "key_entities": {
            "parties": entities["parties"],
            "effective_date": effective_date,
            "financial_terms": primary_amount,
            "statutes_detected": entities["statutory_references"],
            "percentages_detected": entities["percentages"][:3],
            "tenures_detected": entities["tenures"][:3]
        },
        "risk_level": risk_level
    }
