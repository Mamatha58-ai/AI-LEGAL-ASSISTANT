"""
Legal NLP Text Preprocessor & Feature Extraction Pipeline
Performs:
- Legal text normalization & cleaning
- Custom legal tokenization & stopword removal
- Regex-based Named Entity / Field Extractor (Parties, Dates, Amounts, Percentages)
- Clause boundary segmentation
"""

import re
import string
import unicodedata

# Domain-specific legal stopwords to retain meaningful legal modifiers while removing pure boilerplate
STANDARD_STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
    "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing",
    "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
    "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
    "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is",
    "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
    "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
    "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so",
    "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
    "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to",
    "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
    "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's",
    "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've",
    "your", "yours", "yourself", "yourselves"
}

def clean_text(text: str) -> str:
    """Normalizes whitespace, unicode characters, and common legal artifacts."""
    if not isinstance(text, str):
        return ""
    # Normalize unicode
    text = unicodedata.normalize("NFKD", text)
    # Replace non-breaking spaces and redundant tabs/newlines
    text = re.sub(r'[\r\f\v]', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def tokenize(text: str, remove_stopwords: bool = True, lowercase: bool = True) -> list:
    """Tokenizes text into word tokens, retaining alphanumeric and legal terms."""
    if lowercase:
        text = text.lower()
    # Extract alphanumeric tokens and hyphenated terms
    tokens = re.findall(r'\b[a-zA-Z0-9_\-\.]{2,}\b', text)
    if remove_stopwords:
        tokens = [t for t in tokens if t not in STANDARD_STOPWORDS]
    return tokens

def segment_sentences(text: str) -> list:
    """
    Sentence Boundary Segmentation:
    Accurately segments legal documents into sentences without breaking on legal abbreviations (Sec., No., vs., Hon'ble, Rs., etc.)
    """
    if not isinstance(text, str):
        return []
    cleaned = clean_text(text)
    
    # Mask protected abbreviations
    abbr_patterns = r'(Hon\'ble|Sec\.|Cl\.|Art\.|No\.|vs\.|v\.|para\.|sub-sec\.|Pvt\.|Ltd\.|LLP\.|Inc\.|Govt\.|Dept\.|Rs\.|p\.a\.|i\.e\.|e\.g\.|etc\.|w\.e\.f\.|u\/s\.|Shri\.|Smt\.|Dr\.|Adv\.)'
    placeholders = []
    
    def repl(m):
        idx = len(placeholders)
        placeholders.append(m.group(0))
        return f"__LEGAL_ABBR_{idx}__"
        
    cleaned = re.sub(abbr_patterns, repl, cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'(\d+)\.(\d+)', r'\1__DECIMAL_POINT__\2', cleaned)
    
    raw_splits = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9\(\"\'•\d])', cleaned)
    sentences = []
    for raw in raw_splits:
        s = raw.strip()
        for idx, val in enumerate(placeholders):
            s = s.replace(f"__LEGAL_ABBR_{idx}__", val)
        s = s.replace("__DECIMAL_POINT__", ".")
        if len(s) >= 25 and not re.match(r'^[0-9\s\.\:\-]+$', s):
            sentences.append(s)
            
    return sentences

def extract_legal_entities(text: str) -> dict:
    """
    NLP Information Extraction for Structured Legal Metadata:
    - Parties (Vendor/Purchaser, Lessor/Lessee, Lender/Borrower)
    - Effective Dates
    - Monetary Amounts (INR / Lakhs / Crores / USD)
    - Interest Rates / Penalty Percentages
    - Tenures / Durations
    """
    entities = {
        "parties": [],
        "dates": [],
        "amounts": [],
        "percentages": [],
        "tenures": [],
        "statutory_references": []
    }

    # 1. Parties Extraction
    party_patterns = [
        r'LESSOR:\s*([A-Z][A-Za-z\s.]+?)(?:,|\n|\s+residing|\s+having|$)(?:[\s\S]*?)LESSEE:\s*([A-Z][A-Za-z\s.]+?)(?:,|\n|\s+residing|\s+having|$)',
        r'SELLER:\s*([A-Z][A-Za-z\s.]+?)(?:,|\n|\s+residing|\s+having|$)(?:[\s\S]*?)BUYER:\s*([A-Z][A-Za-z\s.]+?)(?:,|\n|\s+residing|\s+having|$)',
        r'LENDER:\s*([A-Z][A-Za-z\s.]+?)(?:,|\n|\s+residing|\s+having|$)(?:[\s\S]*?)BORROWER:\s*([A-Z][A-Za-z\s.]+?)(?:,|\n|\s+residing|\s+having|$)',
        r'between\s+([A-Z][A-Za-z0-9\s.,&]+?)\s+(?:called|referred to as|and)\s+([A-Z][A-Za-z0-9\s.,&]+?)(?:[.;\n]|$)',
        r'PARTY ONE:\s*([^\n,]+)[\s\S]*?PARTY TWO:\s*([^\n,]+)',
        r'([A-Z][A-Za-z\s]+)\s+\((?:Lessor|Vendor|Lender|Seller|Promoter)\)\s+and\s+([A-Z][A-Za-z\s]+)\s+\((?:Lessee|Purchaser|Borrower|Buyer|Allottee)\)'
    ]
    for pattern in party_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            p1 = match.group(1).strip()
            p2 = match.group(2).strip()
            if len(p1) > 2 and len(p2) > 2:
                entities["parties"] = [p1, p2]
                break

    if not entities["parties"]:
        # Fallback party finder
        named_entities = re.findall(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b', text)
        if len(named_entities) >= 2:
            entities["parties"] = [named_entities[0], named_entities[1]]
        else:
            entities["parties"] = ["Executing Party", "Counterparty"]

    # 2. Dates Extraction
    date_patterns = [
        r'\b(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,]+\d{4})\b',
        r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',
        r'(?:dated|effective|executed on)\s+([A-Za-z0-9\s,]+?\d{4})'
    ]
    for pattern in date_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for m in matches:
            d_str = m.strip() if isinstance(m, str) else m[0].strip()
            if d_str not in entities["dates"] and len(d_str) > 5:
                entities["dates"].append(d_str)

    # 3. Monetary Amounts
    amt_patterns = [
        r'(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d{2})?(?:\s*(?:lakhs?|crores?|thousand|million))?(?:\s*[\/\-]*))',
        r'\b(\d[\d,]*\s*(?:rupees|lakhs|crores))\b',
        r'\bINR\s+[\d,]+'
    ]
    for pattern in amt_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for m in matches:
            val = m.strip() if isinstance(m, str) else m[0].strip()
            if val and val not in entities["amounts"]:
                entities["amounts"].append(val if "INR" in val or "Rs" in val or "₹" in val else f"INR {val}")

    # 4. Interest / Percentages
    pct_matches = re.findall(r'\b(\d+(?:\.\d+)?\s*%\s*(?:p\.a\.|per annum|compound|simple)?)\b', text, re.IGNORECASE)
    for p in pct_matches:
        if p not in entities["percentages"]:
            entities["percentages"].append(p.strip())

    # 5. Durations / Tenures
    tenure_matches = re.findall(r'\b(\d+\s*(?:months?|years?|days?|weeks?))\b', text, re.IGNORECASE)
    for t in tenure_matches:
        if t not in entities["tenures"]:
            entities["tenures"].append(t.strip())

    # 6. Statutory References
    acts = [
        "Model Tenancy Act", "Transfer of Property Act", "Registration Act", "Motor Vehicles Act",
        "SARFAESI Act", "Indian Contract Act", "Arbitration and Conciliation Act",
        "RERA", "Negotiable Instruments Act", "RBI Master Directions"
    ]
    for act in acts:
        if re.search(r'\b' + re.escape(act) + r'\b', text, re.IGNORECASE):
            entities["statutory_references"].append(act)

    return entities

def segment_clauses(text: str) -> list:
    """
    Segments a full legal agreement into discrete clauses with header and body text.
    """
    clauses = []
    # Pattern to find numbered clauses or articles: CLAUSE 1. TITLE: ...
    clause_split_pattern = r'(?=(?:CLAUSE|ARTICLE|SECTION|PARAGRAPH|\d+\.)\s*[\d\w]*[\.\:\-\s])'
    chunks = re.split(clause_split_pattern, text, flags=re.IGNORECASE)

    for chunk in chunks:
        chunk = chunk.strip()
        if len(chunk) < 25:
            continue
        lines = chunk.split('\n')
        title = lines[0].strip()
        body = "\n".join(lines[1:]).strip() if len(lines) > 1 else lines[0]
        clauses.append({
            "title": title[:80],
            "text": chunk
        })

    if not clauses:
        # Fallback to paragraph splitting
        paras = text.split('\n\n')
        for p in paras:
            p = p.strip()
            if len(p) > 30:
                clauses.append({
                    "title": p[:50] + "...",
                    "text": p
                })

    return clauses
