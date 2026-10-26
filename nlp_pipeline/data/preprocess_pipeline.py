"""
Indian Legal NLP Pipeline: Preprocessing & Feature Extraction
=============================================================
This module provides a specialized NLP preprocessing and feature extraction pipeline
tailored for Indian legal documents and contracts (House Property, Car Documents,
Bank Loan Agreements, Gold Loan Agreements).

Key Capabilities:
1. Legal Text Cleaning & Normalization:
   - Preserves legal section numbering, Acts, citations (e.g., "Sec. 138", "u/s 420")
   - Retains Indian currency notations (INR, Rs., Lakhs, Crores)
   - Normalizes legal boilerplate whitespace and formatting
2. Domain-Aware Legal Tokenizer & Stopword Filter:
   - Preserves critical legal modal verbs & condition markers ("shall", "must", "not", "liable", "indemnify", "forfeiture")
3. Lexical & Syntactic Feature Extraction:
   - Readability indices (Flesch-Kincaid, Gunning Fog, Average Sentence Length)
   - Risk indicator signal densities (Unilateral termination, penalty rates, indemnity exposure)
4. Vectorization & Feature Matrices:
   - TF-IDF with custom legal n-grams (unigrams + bigrams + trigrams)
   - Structured metadata features (amounts, dates, clause type encodings)
"""

import re
import json
import math
import os
from typing import List, Dict, Tuple, Any, Optional
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder

# ==========================================
# Domain-Specific Legal Stopwords & Keywords
# ==========================================

# Standard English stopwords minus crucial legal modals & condition words
BASE_ENGLISH_STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "can", "can't", "cannot", "could",
    "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down",
    "during", "each", "few", "for", "from", "further", "had", "hadn't", "has",
    "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her",
    "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's",
    "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it",
    "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "no",
    "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our",
    "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll",
    "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's",
    "the", "their", "theirs", "them", "themselves", "then", "there", "there's",
    "these", "they", "they'd", "they'll", "they're", "they've", "this", "those",
    "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we",
    "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when",
    "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why",
    "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're",
    "you've", "your", "yours", "yourself", "yourselves"
}

# Words with legal significance that MUST NOT be stripped during stopword removal
LEGAL_PRESERVE_WORDS = {
    "not", "no", "nor", "against", "under", "between", "before", "after",
    "shall", "must", "may", "will", "cannot", "only", "all", "any", "without",
    "sole", "unilateral", "default", "liable", "indemnify", "forfeit", "terminate"
}

LEGAL_STOPWORDS = BASE_ENGLISH_STOPWORDS - LEGAL_PRESERVE_WORDS

# High-Risk Legal Markers for Indian contracts
HIGH_RISK_MARKERS = [
    r"unilateral\s+termination",
    r"without\s+cause",
    r"without\s+prior\s+notice",
    r"forfeit(?:ure|ed)?\s+(?:of\s+)?(?:the\s+)?(?:security\s+)?deposit",
    r"sole\s+discretion",
    r"indemnify\s+and\s+hold\s+harmless",
    r"compound\s+interest",
    r"penal(?:ty)?\s+interest",
    r"auction\s+without\s+(?:further\s+)?notice",
    r"repossession\s+without",
    r"margin\s+call\s+within\s+24\s+hours",
    r"immediate\s+forfeiture",
    r"as\s+is\s+where\s+is",
    r"non-refundable",
    r"lock-in\s+period"
]

MEDIUM_RISK_MARKERS = [
    r"escalation\s+clause",
    r"grace\s+period",
    r"prepayment\s+penalty",
    r"arbitration\s+clause",
    r"hypothecation",
    r"subvention",
    r"cure\s+period",
    r"written\s+notice\s+of\s+\d+\s+days"
]


class LegalTextPreprocessor:
    """
    Dedicated Preprocessor for Indian Legal Documents and Clauses.
    """

    def __init__(self, preserve_legal_terms: bool = True, lowercase: bool = True):
        self.preserve_legal_terms = preserve_legal_terms
        self.lowercase = lowercase
        self.stopwords = LEGAL_STOPWORDS if preserve_legal_terms else BASE_ENGLISH_STOPWORDS

    def clean_text(self, text: str) -> str:
        """
        Normalizes spacing, removes redundant formatting while protecting legal citations and currency.
        """
        if not isinstance(text, str):
            return ""

        # Normalize unicode quotes and dashes
        text = re.sub(r'[\u2018\u2019\u201a\u201b]', "'", text)
        text = re.sub(r'[\u201c\u201d\u201e\u201f]', '"', text)
        text = re.sub(r'[\u2013\u2014]', '-', text)

        # Standardize Indian currency representations
        text = re.sub(r'(?i)\brs\.?\s*', 'INR ', text)
        text = re.sub(r'₹\s*', 'INR ', text)

        # Protect abbreviations like "Sec.", "Art.", "No.", "v.", "vs.", "u/s"
        text = re.sub(r'(?i)\bu/s\b', 'under_section', text)
        text = re.sub(r'(?i)\bsec\.\s*(\d+)', r'Section_\1', text)
        text = re.sub(r'(?i)\bart\.\s*(\d+)', r'Article_\1', text)
        text = re.sub(r'(?i)\bno\.\s*(\d+)', r'Number_\1', text)
        text = re.sub(r'(?i)\bv/s\b|\bvs\.?\b', 'versus', text)

        # Replace excessive newlines and tabs with single space
        text = re.sub(r'[\r\n\t]+', ' ', text)
        text = re.sub(r'\s{2,}', ' ', text).strip()

        return text

    def tokenize(self, text: str) -> List[str]:
        """
        Splits text into legal domain tokens, filtering out non-essential punctuation and stopwords.
        """
        cleaned = self.clean_text(text)
        if self.lowercase:
            cleaned = cleaned.lower()

        # Tokenize words, hyphens within compound legal words, and section identifiers
        tokens = re.findall(r'\b[a-zA-Z0-9_\-]+(?:\.[a-zA-Z0-9]+)?\b', cleaned)

        # Filter stopwords
        filtered_tokens = [
            tok for tok in tokens 
            if tok not in self.stopwords and len(tok) > 1 and not tok.isdigit()
        ]
        return filtered_tokens

    def get_sentences(self, text: str) -> List[str]:
        """
        Splits text into sentences, accounting for legal numbering like 'CLAUSE 1.' or '1.1'.
        """
        cleaned = self.clean_text(text)
        # Protect known abbreviations with placeholder
        abbrevs = ["Mr.", "Mrs.", "Ms.", "Dr.", "Adv.", "Sec.", "Art.", "No.", "INR.", "vs.", "v."]
        temp = cleaned
        for idx, abb in enumerate(abbrevs):
            temp = temp.replace(abb, f"__ABBR{idx}__")
        
        # Split on period, exclamation, or question mark followed by whitespace and capital/digit
        parts = re.split(r'[.!?]\s+(?=[A-Z0-9])', temp)
        
        # Restore abbreviations
        sentences = []
        for part in parts:
            restored = part
            for idx, abb in enumerate(abbrevs):
                restored = restored.replace(f"__ABBR{idx}__", abb)
            if len(restored.strip()) > 5:
                sentences.append(restored.strip())
        return sentences if sentences else [cleaned]


class LegalFeatureExtractor:
    """
    Extracts lexical, syntactic, domain-specific risk signals, and entities from legal texts.
    """

    @staticmethod
    def count_syllables(word: str) -> int:
        """Approximates syllable count for readability formulas."""
        word = word.lower()
        if len(word) <= 3:
            return 1
        word = re.sub(r'(?:[^laeiouy]|ed|es|e)$', '', word)
        word = re.sub(r'^y', '', word)
        matches = re.findall(r'[aeiouy]{1,2}', word)
        return max(1, len(matches))

    def extract_readability_metrics(self, text: str) -> Dict[str, float]:
        """
        Calculates legal complexity metrics:
        - Word Count, Sentence Count, Average Sentence Length
        - Complex Word Ratio (words with >= 3 syllables)
        - Flesch Reading Ease & Flesch-Kincaid Grade Level
        """
        if not text or not isinstance(text, str):
            return {
                "word_count": 0, "sentence_count": 0, "avg_sentence_length": 0.0,
                "complex_word_ratio": 0.0, "flesch_reading_ease": 0.0, "flesch_kincaid_grade": 0.0
            }

        preprocessor = LegalTextPreprocessor(lowercase=False)
        sentences = preprocessor.get_sentences(text)
        sentence_count = max(1, len(sentences))

        words = re.findall(r'\b[a-zA-Z]+\b', text)
        word_count = max(1, len(words))

        syllables = [self.count_syllables(w) for w in words]
        total_syllables = sum(syllables)
        complex_words = sum(1 for s in syllables if s >= 3)

        avg_sentence_len = word_count / sentence_count
        avg_syllables_per_word = total_syllables / word_count
        complex_ratio = complex_words / word_count

        # Flesch Reading Ease: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
        flesch_ease = 206.835 - (1.015 * avg_sentence_len) - (84.6 * avg_syllables_per_word)
        # Flesch-Kincaid Grade Level: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
        fk_grade = (0.39 * avg_sentence_len) + (11.8 * avg_syllables_per_word) - 15.59

        return {
            "word_count": word_count,
            "sentence_count": sentence_count,
            "avg_sentence_length": round(avg_sentence_len, 2),
            "complex_word_ratio": round(complex_ratio, 4),
            "flesch_reading_ease": round(max(0.0, min(100.0, flesch_ease)), 2),
            "flesch_kincaid_grade": round(max(0.0, fk_grade), 2)
        }

    def extract_risk_signals(self, text: str) -> Dict[str, Any]:
        """
        Scans text for explicit high-risk and medium-risk legal clauses and calculates risk indicator score.
        """
        if not text or not isinstance(text, str):
            return {"high_risk_signals": 0, "medium_risk_signals": 0, "risk_indicator_score": 0.0, "detected_triggers": []}

        detected = []
        high_risk_count = 0
        for pattern in HIGH_RISK_MARKERS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                high_risk_count += len(matches)
                detected.extend(matches)

        med_risk_count = 0
        for pattern in MEDIUM_RISK_MARKERS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                med_risk_count += len(matches)
                detected.extend(matches)

        # Risk indicator score normalized between 0.0 and 1.0
        risk_score = min(1.0, (high_risk_count * 0.35) + (med_risk_count * 0.15))

        return {
            "high_risk_signals": high_risk_count,
            "medium_risk_signals": med_risk_count,
            "risk_indicator_score": round(risk_score, 3),
            "detected_triggers": list(set([str(d).strip().lower() for d in detected]))
        }

    def extract_entities_regex(self, text: str) -> Dict[str, Any]:
        """
        Lightweight Rule-based Entity and Metadata Extraction for Indian Contracts:
        - Financial Amounts (INR, Lakhs, Crores, % interest)
        - Dates (DDth Month YYYY, DD/MM/YYYY)
        - Legal Sections / Acts
        """
        if not text or not isinstance(text, str):
            return {"amounts": [], "percentages": [], "dates": [], "acts_sections": []}

        # Amounts (INR 45,000, INR 2.5 Lakhs, Rs 50,00,000)
        amount_patterns = re.findall(r'(?:INR|Rs\.?|₹)\s*[\d,]+(?:\.\d+)?(?:\s*(?:Lakhs?|Crores?|Lakh|Cr|per\s+month))?', text, re.IGNORECASE)
        # Percentages (10% per annum, 24% penal interest)
        percentage_patterns = re.findall(r'\d+(?:\.\d+)?%\s*(?:p\.?a\.?|per\s+annum|penalty)?', text, re.IGNORECASE)
        # Dates (15th June 2024, 01/04/2023, 12-08-2024)
        date_patterns = re.findall(r'\b(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b', text, re.IGNORECASE)
        # Acts and Sections (Sec. 138, Section 24, Transfer of Property Act)
        acts_sections = re.findall(r'(?:Section\s+\d+|Transfer\ of\ Property\ Act|Motor\ Vehicles\ Act|Negotiable\ Instruments\ Act|SARFAESI\ Act|Arbitration\ and\ Conciliation\ Act|Indian\ Contract\ Act)', text, re.IGNORECASE)

        return {
            "amounts": list(set(amount_patterns)),
            "percentages": list(set(percentage_patterns)),
            "dates": list(set(date_patterns)),
            "acts_sections": list(set(acts_sections))
        }


class LegalNLPPipeline:
    """
    End-to-End NLP Pipeline integrating Preprocessing, Feature Extraction,
    and TF-IDF N-gram Vectorization.
    """

    def __init__(self, max_features: int = 1000, ngram_range: Tuple[int, int] = (1, 3)):
        self.preprocessor = LegalTextPreprocessor()
        self.feature_extractor = LegalFeatureExtractor()
        self.tfidf_vectorizer = TfidfVectorizer(
            tokenizer=self.preprocessor.tokenize,
            token_pattern=None,
            ngram_range=ngram_range,
            max_features=max_features,
            sublinear_tf=True
        )
        self.label_encoders: Dict[str, LabelEncoder] = {}
        self.is_fitted = False

    def transform_dataframe(self, df: pd.DataFrame, text_col: str = "clause_text") -> pd.DataFrame:
        """
        Processes a dataframe with legal texts, adding cleaned tokens, readability metrics,
        and risk indicator features.
        """
        result_df = df.copy()

        # 1. Text Cleaning & Tokenization
        result_df["cleaned_text"] = result_df[text_col].apply(self.preprocessor.clean_text)
        result_df["tokens"] = result_df[text_col].apply(self.preprocessor.tokenize)
        result_df["token_count"] = result_df["tokens"].apply(len)

        # 2. Readability Metrics
        readability_data = result_df[text_col].apply(self.feature_extractor.extract_readability_metrics).tolist()
        readability_df = pd.DataFrame(readability_data)
        for col in readability_df.columns:
            result_df[f"read_{col}"] = readability_df[col]

        # 3. Risk Signal Detection
        risk_data = result_df[text_col].apply(self.feature_extractor.extract_risk_signals).tolist()
        risk_df = pd.DataFrame(risk_data)
        result_df["high_risk_signals"] = risk_df["high_risk_signals"]
        result_df["medium_risk_signals"] = risk_df["medium_risk_signals"]
        result_df["risk_indicator_score"] = risk_df["risk_indicator_score"]
        result_df["detected_triggers"] = risk_df["detected_triggers"]

        # 4. Entity Extraction
        entity_data = result_df[text_col].apply(self.feature_extractor.extract_entities_regex).tolist()
        result_df["extracted_amounts"] = [e["amounts"] for e in entity_data]
        result_df["extracted_percentages"] = [e["percentages"] for e in entity_data]
        result_df["extracted_dates"] = [e["dates"] for e in entity_data]
        result_df["extracted_acts"] = [e["acts_sections"] for e in entity_data]

        return result_df

    def fit_transform_tfidf(self, texts: List[str]) -> np.ndarray:
        """Fits TF-IDF vectorizer and returns feature matrix."""
        matrix = self.tfidf_vectorizer.fit_transform(texts)
        self.is_fitted = True
        return matrix.toarray()

    def transform_tfidf(self, texts: List[str]) -> np.ndarray:
        """Transforms texts using fitted TF-IDF vectorizer."""
        if not self.is_fitted:
            raise ValueError("TF-IDF Vectorizer has not been fitted yet.")
        return self.tfidf_vectorizer.transform(texts).toarray()

    def get_feature_names(self) -> List[str]:
        """Returns vocabulary feature names from TF-IDF."""
        if not self.is_fitted:
            return []
        return self.tfidf_vectorizer.get_feature_names_out().tolist()


# ==========================================
# Main Execution / Benchmark Script
# ==========================================

def run_pipeline(data_dir: str = "."):
    clauses_path = os.path.join(data_dir, "legal_clauses_dataset.csv")
    docs_path = os.path.join(data_dir, "legal_documents_dataset.csv")

    print(f"[*] Initializing Legal NLP Preprocessing Pipeline...")
    pipeline = LegalNLPPipeline(max_features=500, ngram_range=(1, 2))

    # Process Clauses Dataset
    if os.path.exists(clauses_path):
        print(f"[*] Loading clauses dataset from {clauses_path}...")
        clauses_df = pd.read_csv(clauses_path)
        print(f"    - Total clauses loaded: {len(clauses_df)}")

        processed_clauses = pipeline.transform_dataframe(clauses_df, text_col="clause_text")
        tfidf_features = pipeline.fit_transform_tfidf(processed_clauses["cleaned_text"].tolist())

        output_clauses_path = os.path.join(data_dir, "processed_legal_clauses.csv")
        # Drop list column or format for CSV saving
        save_df = processed_clauses.copy()
        save_df["tokens"] = save_df["tokens"].apply(lambda x: " ".join(x))
        save_df["detected_triggers"] = save_df["detected_triggers"].apply(lambda x: "; ".join(x))
        save_df["extracted_amounts"] = save_df["extracted_amounts"].apply(lambda x: "; ".join(x))
        save_df["extracted_percentages"] = save_df["extracted_percentages"].apply(lambda x: "; ".join(x))
        save_df["extracted_dates"] = save_df["extracted_dates"].apply(lambda x: "; ".join(x))
        save_df["extracted_acts"] = save_df["extracted_acts"].apply(lambda x: "; ".join(x))

        save_df.to_csv(output_clauses_path, index=False)
        print(f"[OK] Processed clauses saved to: {output_clauses_path}")
        print(f"    - TF-IDF Feature matrix shape: {tfidf_features.shape}")
        print(f"    - Sample Top TF-IDF n-grams: {pipeline.get_feature_names()[:15]}")

    # Process Documents Dataset
    if os.path.exists(docs_path):
        print(f"\n[*] Loading documents dataset from {docs_path}...")
        docs_df = pd.read_csv(docs_path)
        print(f"    - Total documents loaded: {len(docs_df)}")

        processed_docs = pipeline.transform_dataframe(docs_df, text_col="full_text")
        output_docs_path = os.path.join(data_dir, "processed_legal_documents.csv")

        save_docs_df = processed_docs.copy()
        save_docs_df["tokens"] = save_docs_df["tokens"].apply(lambda x: " ".join(x))
        save_docs_df["detected_triggers"] = save_docs_df["detected_triggers"].apply(lambda x: "; ".join(x))
        save_docs_df["extracted_amounts"] = save_docs_df["extracted_amounts"].apply(lambda x: "; ".join(x))
        save_docs_df["extracted_percentages"] = save_docs_df["extracted_percentages"].apply(lambda x: "; ".join(x))
        save_docs_df["extracted_dates"] = save_docs_df["extracted_dates"].apply(lambda x: "; ".join(x))
        save_docs_df["extracted_acts"] = save_docs_df["extracted_acts"].apply(lambda x: "; ".join(x))

        save_docs_df.to_csv(output_docs_path, index=False)
        print(f"[OK] Processed documents saved to: {output_docs_path}")

    # Save features metadata
    feature_meta_path = os.path.join(data_dir, "features_metadata.json")
    metadata = {
        "pipeline_version": "1.0.0",
        "tfidf_vocabulary_size": len(pipeline.get_feature_names()),
        "top_features_sample": pipeline.get_feature_names()[:30],
        "readability_metrics_included": [
            "read_word_count", "read_sentence_count", "read_avg_sentence_length",
            "read_complex_word_ratio", "read_flesch_reading_ease", "read_flesch_kincaid_grade"
        ],
        "risk_signals_included": [
            "high_risk_signals", "medium_risk_signals", "risk_indicator_score", "detected_triggers"
        ],
        "extracted_entity_fields": [
            "extracted_amounts", "extracted_percentages", "extracted_dates", "extracted_acts"
        ]
    }
    with open(feature_meta_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"[OK] Features metadata saved to: {feature_meta_path}")
    print("\n[SUCCESS] Pipeline execution complete.")


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    run_pipeline(current_dir)
