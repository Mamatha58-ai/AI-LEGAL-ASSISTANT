# -*- coding: utf-8 -*-
"""
Build Complete Review 2 PowerPoint Presentation for Aditya University:
Natural Language Processing Project Review - 2
Project: AI LEGAL ASSISTANT (LexAI)
"""

import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_presentation(output_paths):
    prs = pptx.Presentation()
    # Dimensions identical to template: 10058400 x 7772400 (approx 10.48 x 8.10 inches)
    prs.slide_width = 10058400
    prs.slide_height = 7772400
    blank_layout = prs.slide_layouts[6]

    logo_header_path = "assets_ppt/logo_header.png"
    logo_corner_path = "assets_ppt/logo_corner.png"

    # Color Palette matching template
    ORANGE_PILL = RGBColor(255, 106, 13)       # #FF6A0D
    WHITE = RGBColor(255, 255, 255)
    BLACK = RGBColor(20, 20, 20)
    DARK_GRAY = RGBColor(60, 60, 60)
    GREEN = RGBColor(0, 128, 0)
    OLIVE = RGBColor(88, 87, 25)
    RED = RGBColor(210, 30, 30)
    BLUE = RGBColor(0, 112, 192)
    PURPLE = RGBColor(112, 48, 160)
    NAVY = RGBColor(15, 45, 95)
    LIGHT_BG = RGBColor(248, 249, 250)

    def add_header(slide, title_text):
        """Adds corner logo and orange capsule header banner"""
        if os.path.exists(logo_corner_path):
            slide.shapes.add_picture(logo_corner_path, 274320, 182880, 1188720, 434340)

        # Rounded rectangle pill shape
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, 2468880, 274320, 5120640, 457200)
        pill.fill.solid()
        pill.fill.fore_color.rgb = ORANGE_PILL
        pill.line.fill.background()
        tf = pill.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = title_text.upper()
        run.font.name = "Times New Roman"
        run.font.size = Pt(19)
        run.font.bold = True
        run.font.color.rgb = WHITE

    # ========================================================
    # SLIDE 1: TITLE SLIDE
    # ========================================================
    slide1 = prs.slides.add_slide(blank_layout)
    if os.path.exists(logo_header_path):
        slide1.shapes.add_picture(logo_header_path, 2651760, 182880, 4572000, 590702)

    txBox1 = slide1.shapes.add_textbox(914400, 1180000, 8229600, 1100000)
    tf1 = txBox1.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.alignment = PP_ALIGN.CENTER
    r1 = p1.add_run()
    r1.text = "Natural Language Processing Project"
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(24)
    r1.font.bold = True
    r1.font.color.rgb = OLIVE

    p2 = tf1.add_paragraph()
    p2.alignment = PP_ALIGN.CENTER
    r2 = p2.add_run()
    r2.text = "REVIEW - 2"
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(22)
    r2.font.bold = True
    r2.font.color.rgb = GREEN

    txBox2 = slide1.shapes.add_textbox(822960, 2500000, 8400000, 650000)
    tf2 = txBox2.text_frame
    tf2.word_wrap = True
    p3 = tf2.paragraphs[0]
    p3.alignment = PP_ALIGN.CENTER
    r3 = p3.add_run()
    r3.text = "AI LEGAL ASSISTANT"
    r3.font.name = "Times New Roman"
    r3.font.size = Pt(26)
    r3.font.bold = True
    r3.font.color.rgb = GREEN

    p3_sub = tf2.add_paragraph()
    p3_sub.alignment = PP_ALIGN.CENTER
    r3_sub = p3_sub.add_run()
    r3_sub.text = "(LexAI: Intelligent Document Risk Analyzer & Legal Summarizer)"
    r3_sub.font.name = "Times New Roman"
    r3_sub.font.size = Pt(16)
    r3_sub.font.color.rgb = DARK_GRAY

    txBox3 = slide1.shapes.add_textbox(914400, 3500000, 8229600, 450000)
    tf3 = txBox3.text_frame
    p4 = tf3.paragraphs[0]
    p4.alignment = PP_ALIGN.CENTER
    r4 = p4.add_run()
    r4.text = "Presented by"
    r4.font.name = "Times New Roman"
    r4.font.size = Pt(22)
    r4.font.bold = True
    r4.font.color.rgb = RED

    txBox4 = slide1.shapes.add_textbox(2900000, 4100000, 4700000, 1650000)
    tf4 = txBox4.text_frame
    members = [
        "G. Krishna (24B11CS127)",
        "K. Mamatha (24B11CS229)",
        "V. Brunda (24B11CS485)",
        "G. Jahnavi (24B11CS512)"
    ]
    for idx, m in enumerate(members):
        p = tf4.paragraphs[0] if idx == 0 else tf4.add_paragraph()
        p.alignment = PP_ALIGN.LEFT
        r = p.add_run()
        r.text = m
        r.font.name = "Times New Roman"
        r.font.size = Pt(20)
        r.font.bold = True
        r.font.color.rgb = BLACK

    txBox5 = slide1.shapes.add_textbox(914400, 6150000, 8229600, 457200)
    tf5 = txBox5.text_frame
    p5 = tf5.paragraphs[0]
    p5.alignment = PP_ALIGN.CENTER
    r5 = p5.add_run()
    r5.text = "Department of Computer Science And Engineering"
    r5.font.name = "Times New Roman"
    r5.font.size = Pt(22)
    r5.font.bold = True
    r5.font.color.rgb = BLUE

    # ========================================================
    # HELPER: ADD BULLET CONTENT SLIDE
    # ========================================================
    def create_content_slide(title, paragraphs):
        slide = prs.slides.add_slide(blank_layout)
        add_header(slide, title)
        tb = slide.shapes.add_textbox(731520, 1150000, 8595360, 6150000)
        tf = tb.text_frame
        tf.word_wrap = True

        for idx, item in enumerate(paragraphs):
            p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
            p.space_after = Pt(item.get("space_after", 6))
            
            # Label / Header
            if "label" in item and item["label"]:
                r_lbl = p.add_run()
                r_lbl.text = item["label"]
                r_lbl.font.name = "Times New Roman"
                r_lbl.font.size = Pt(item.get("size", 16))
                r_lbl.font.bold = True
                r_lbl.font.color.rgb = item.get("label_color", BLACK)
            
            # Text body
            if "text" in item and item["text"]:
                r_txt = p.add_run()
                r_txt.text = item["text"]
                r_txt.font.name = "Times New Roman"
                r_txt.font.size = Pt(item.get("size", 16))
                r_txt.font.bold = item.get("bold", False)
                r_txt.font.color.rgb = item.get("text_color", DARK_GRAY)

        return slide

    # ========================================================
    # SLIDE 2: PROJECT OVERVIEW & RECAP
    # ========================================================
    create_content_slide("PROJECT OVERVIEW & RECAP", [
        {"label": "The AI Legal Assistant (LexAI): ", "text": "An NLP-driven intelligent legal decision-support system designed to simplify complex Indian legal documents for everyday citizens and businesses.", "label_color": NAVY, "size": 17},
        {"label": "Core Problem Addressed: ", "text": "Legal instruments (House Leases, Vehicle Sale Deeds, Bank Loans, Gold Loan Pledges) contain dense legalese, hidden liability traps, and obscure statutory penalties that ordinary users cannot easily understand.", "label_color": BLACK, "size": 17},
        {"label": "Review 1 Accomplishments: ", "text": "Finalized problem formulation, dataset design across 4 primary Indian legal domains, baseline architecture, and technology stack.", "label_color": BLACK, "size": 17},
        {"label": "Review 2 Scope & Objectives: ", "text": "", "label_color": ORANGE_PILL, "size": 17.5},
        {"label": "  * Demonstration of Completed Modules: ", "text": "Showcase functional ingestion, preprocessing, classification, and summarization pipelines.", "label_color": NAVY, "size": 16.5},
        {"label": "  * Code Walkthrough & Real Outputs: ", "text": "Explain core functions, mathematical models, and actual system outputs.", "label_color": NAVY, "size": 16.5},
        {"label": "  * Demonstration of NLTK Concepts: ", "text": "Detail custom tokenization, deontic stopword preservation, n-grams, and TF-IDF centroid summarization.", "label_color": NAVY, "size": 16.5},
        {"label": "  * Member Contributions: ", "text": "Present individual tasks completed and future roadmap.", "label_color": NAVY, "size": 16.5}
    ])

    # ========================================================
    # SLIDE 3: COMPLETED MODULES ARCHITECTURE
    # ========================================================
    create_content_slide("COMPLETED MODULES ARCHITECTURE", [
        {"label": "1. Multi-Format Document Ingestion Module: ", "text": "Ingests PDF, DOCX, DOC, TXT, and Markdown contracts via stream buffer parsing and text extraction engines.", "label_color": NAVY, "size": 16},
        {"label": "2. Legal NLP Preprocessing Engine: ", "text": "Performs Unicode NFKD normalization, legal whitespace collapsing, custom tokenization, and sentence boundary segmentation.", "label_color": NAVY, "size": 16},
        {"label": "3. Legal Entity & Metadata Extractor: ", "text": "Extracts contracting parties, execution dates, monetary considerations (INR), interest rates, and statutory references.", "label_color": NAVY, "size": 16},
        {"label": "4. Document Domain Classifier: ", "text": "Automatically categorizes documents into 4 Indian domains (House Property, Car Documents, Bank Loan, Gold Loan) using Sublinear TF-IDF + Logistic Regression.", "label_color": NAVY, "size": 16},
        {"label": "5. Clause Risk Assessment Engine: ", "text": "Classifies individual clauses into High, Medium, or Low Risk levels using multi-ngram TF-IDF and balanced classification.", "label_color": NAVY, "size": 16},
        {"label": "6. Clause Category Classifier: ", "text": "Multi-class classifier sorting provisions into 25 distinct legal categories (Indemnity, Repossession, Forfeiture, Subvention, etc.).", "label_color": NAVY, "size": 16},
        {"label": "7. Extractive Centroid Summarizer: ", "text": "Employs TF-IDF sentence centroid cosine similarity with legal deontic weighting to generate concise executive abstracts.", "label_color": NAVY, "size": 16},
        {"label": "8. Full-Stack Interactive UI Dashboard: ", "text": "React + Vite frontend providing live upload, real-time risk gauges, clause breakdown, and PDF export.", "label_color": NAVY, "size": 16}
    ])

    # ========================================================
    # SLIDE 4: MODULE 1 & 2 - INGESTION & PREPROCESSING
    # ========================================================
    create_content_slide("INGESTION & PREPROCESSING", [
        {"label": "Multi-Format Document Ingestion Module:", "text": "", "label_color": ORANGE_PILL, "size": 17},
        {"label": "  * PDF Ingestion: ", "text": "Utilizes stream buffer parsing to extract raw text layers from unencrypted legal agreements, deeds, and sanction letters.", "label_color": NAVY, "size": 15.5},
        {"label": "  * Word Documents (.docx/.doc): ", "text": "Integrated Mammoth XML parser extracting clean structural body paragraphs while stripping proprietary Office XML artifacts.", "label_color": NAVY, "size": 15.5},
        {"label": "  * Plain Text & Markdown: ", "text": "Direct UTF-8 buffer ingestion supporting raw contracts and typed drafts.", "label_color": NAVY, "size": 15.5},
        {"label": "Legal Text Preprocessing Pipeline:", "text": "", "label_color": ORANGE_PILL, "size": 17},
        {"label": "  * Unicode NFKD Normalization: ", "text": "Converts special typographic quotation marks, long dashes, and ligatures to standard ASCII.", "label_color": NAVY, "size": 15.5},
        {"label": "  * Whitespace Regularization: ", "text": "Collapses arbitrary tabulations, multiple line breaks, and page-footer artifacts common in scanned legal documents.", "label_color": NAVY, "size": 15.5},
        {"label": "  * Custom Legal Stopword Management: ", "text": "Standard NLTK stopword filters discard modal verbs. Our pipeline selectively retains binding legal modal auxiliaries ('shall', 'must', 'liable', 'default', 'indemnify') critical for legal meaning.", "label_color": NAVY, "size": 15.5},
        {"label": "  * Clause Boundary Delimitation: ", "text": "Employs lookbehind regex to distinguish statutory citations (e.g., 'Sec. 138', 'Cl. 4.2') from true sentence termination periods.", "label_color": NAVY, "size": 15.5}
    ])

    # ========================================================
    # SLIDE 5: MODULE 3 - DOCUMENT DOMAIN CLASSIFIER
    # ========================================================
    create_content_slide("DOCUMENT TYPE CLASSIFIER", [
        {"label": "Objective: ", "text": "Automatically categorize any uploaded Indian legal instrument into its respective legal jurisdiction and statutory category.", "label_color": BLACK, "size": 16},
        {"label": "4 Target Legal Domains Covered:", "text": "", "label_color": ORANGE_PILL, "size": 16.5},
        {"label": "  1. House Property: ", "text": "Residential Leases, Absolute Sale Deeds, Mortgage Deeds, Builder-Buyer Agreements under Transfer of Property Act 1882 & RERA 2016.", "label_color": NAVY, "size": 15.5},
        {"label": "  2. Car Documents: ", "text": "Used Vehicle Sale Agreements, Hypothecation Deeds, and RC Transfer Agreements under Motor Vehicles Act 1988.", "label_color": NAVY, "size": 15.5},
        {"label": "  3. Bank Loan Agreement: ", "text": "Personal Loan Agreements, Secured Business Facilities, and Sanction Letters under SARFAESI Act 2002 & Banking Regulation Act 1949.", "label_color": NAVY, "size": 15.5},
        {"label": "  4. Gold Loan Agreement: ", "text": "Agricultural Gold Loans, Ornaments Pledge Deeds, and Bullet Repayment Overdrafts under RBI Master Directions.", "label_color": NAVY, "size": 15.5},
        {"label": "NLP Pipeline Architecture:", "text": "", "label_color": ORANGE_PILL, "size": 16.5},
        {"label": "  * Feature Extraction: ", "text": "Sublinear TF-IDF Vectorizer with unigrams & bigrams (ngram_range=(1,2)), max_features=5,000.", "label_color": NAVY, "size": 15.5},
        {"label": "  * Classification Model: ", "text": "Logistic Regression with L2 regularization (C=10.0, max_iter=1000).", "label_color": NAVY, "size": 15.5},
        {"label": "  * Cross-Validation: ", "text": "5-Fold Stratified Cross-Validation yielding 100% mean weighted F1-score across 117 curated documents.", "label_color": NAVY, "size": 15.5}
    ])

    # ========================================================
    # SLIDE 6: MODULE 4 & 5 - CLAUSE RISK & TYPE CLASSIFIER
    # ========================================================
    create_content_slide("CLAUSE RISK & TYPE CLASSIFICATION", [
        {"label": "Clause Risk Classifier (High / Medium / Low):", "text": "", "label_color": ORANGE_PILL, "size": 16.5},
        {"label": "  * Training Corpus: ", "text": "438 labeled Indian legal clauses annotated by risk severity across all 4 document domains.", "label_color": NAVY, "size": 15.5},
        {"label": "  * High Risk Provisions: ", "text": "Uncapped indemnity, immediate repossession without cure notice, unilateral interest rate revision, forfeiture of entire security deposit.", "label_color": RED, "size": 15.5},
        {"label": "  * Medium Risk Provisions: ", "text": "Ambiguous maintenance escalation, joint and several liability, restrictive pre-closure lock-in.", "label_color": DARK_GRAY, "size": 15.5},
        {"label": "  * Low Risk Provisions: ", "text": "Standard High Court jurisdiction, mutual 30-day notice period, receipt acknowledgements.", "label_color": GREEN, "size": 15.5},
        {"label": "  * Algorithm & Metrics: ", "text": "Sublinear TF-IDF (1 to 3 n-grams, 8,000 features) + Balanced Multinomial Logistic Regression. 5-Fold Stratified CV achieved 98.46% Weighted F1; 100% Test Set F1.", "label_color": NAVY, "size": 15.5},
        {"label": "Clause Category Classification (25 Standard Types):", "text": "", "label_color": ORANGE_PILL, "size": 16.5},
        {"label": "  * Multi-Class Categorization: ", "text": "Sorts clauses into: Arbitration & Jurisdiction, Indemnity & Liability, Maintenance & Escalation, Repossession & Hypothecation, Title & Encumbrance, Prepayment & Penalties, etc.", "label_color": NAVY, "size": 15.5},
        {"label": "  * User Value: ", "text": "Powers the Risk Dashboard by grouping clauses under recognizable legal topics for immediate audit.", "label_color": BLACK, "size": 15.5}
    ])

    # ========================================================
    # SLIDE 7: MODULE 6 - EXTRACTIVE CENTROID SUMMARIZER
    # ========================================================
    create_content_slide("EXTRACTIVE TF-IDF SUMMARIZER", [
        {"label": "The Challenge in Legal Summarization: ", "text": "Generic generative LLMs frequently hallucinate clause terms, alter financial numbers, or misquote party obligations. An extractive centroid approach guarantees 100% factual fidelity.", "label_color": BLACK, "size": 16},
        {"label": "Extractive Centroid Summarization Pipeline:", "text": "", "label_color": ORANGE_PILL, "size": 16.5},
        {"label": "  1. Sentence Segmentation: ", "text": "Deconstructs normalized contract text into discrete candidate sentences, filtering short fragments (< 30 chars).", "label_color": NAVY, "size": 15.5},
        {"label": "  2. Vector Space Projection: ", "text": "Fits TF-IDF vectorizer across candidate sentences to construct a document-level aggregate centroid vector: D_vec = sum(S_i).", "label_color": NAVY, "size": 15.5},
        {"label": "  3. Cosine Salience Scoring: ", "text": "Measures the cosine similarity between each sentence vector S_i and the overall document centroid D_vec: Score(S_i) = (S_i . D_vec) / (||S_i|| * ||D_vec||).", "label_color": NAVY, "size": 15.5},
        {"label": "  4. Legal Deontic Keyword Boosting: ", "text": "Boosts sentence salience by 1.35x if the clause contains key operational markers: 'shall', 'indemnify', 'deposit', 'default', 'interest', 'terminate', 'repossess'.", "label_color": NAVY, "size": 15.5},
        {"label": "  5. Chronological Assembly: ", "text": "Selects the top N highest-scoring sentences and restores their original document order to maintain narrative cohesion.", "label_color": NAVY, "size": 15.5},
        {"label": "Structured Synthesis: ", "text": "Generates an Executive Legal Brief combining extractive summary, party roles, consideration amount, and statutory grounding.", "label_color": BLACK, "size": 16}
    ])

    # ========================================================
    # SLIDE 8: NLTK CONCEPTS USED (PART 1)
    # ========================================================
    create_content_slide("NLTK CONCEPTS USED: PART 1", [
        {"label": "Demonstrating Core NLTK Concepts in LexAI:", "text": "", "label_color": BLACK, "size": 17},
        {"label": "1. Custom Word Tokenization & Boundary Preservation:", "text": "", "label_color": ORANGE_PILL, "size": 16.5},
        {"label": "  * Theoretical Concept: ", "text": "Breaking continuous legal text into discrete linguistic units (tokens) for downstream frequency and feature extraction.", "label_color": NAVY, "size": 15.5},
        {"label": "  * Project Application: ", "text": "Standard tokenizers break alphanumeric statutory sections and compound legal terms. We implemented a specialized regex tokenizer: r'\\b[a-zA-Z0-9_\\-\\.]{2,}\\b' that preserves statutory citations (e.g., 'Sec-138', 'BNS-2023', 'CrPC-1973') and hyphenated legal terms ('lock-in', 'pre-closure', 'sub-judice').", "label_color": DARK_GRAY, "size": 15.5},
        {"label": "2. Selective Stopword Filtering & Deontic Marker Preservation:", "text": "", "label_color": ORANGE_PILL, "size": 16.5},
        {"label": "  * Theoretical Concept: ", "text": "Removing high-frequency function words that contribute little semantic information to classification.", "label_color": NAVY, "size": 15.5},
        {"label": "  * Project Application: ", "text": "In standard NLTK stopword lists, modal verbs ('shall', 'must', 'should', 'not', 'no', 'cannot') are stripped. However, in legal texts, modal verbs denote legal obligation, prohibition, and liability. We engineered a domain-specific stopword set that removes boilerplate while retaining critical deontic markers.", "label_color": DARK_GRAY, "size": 15.5}
    ])

    # ========================================================
    # SLIDE 9: NLTK CONCEPTS USED (PART 2)
    # ========================================================
    create_content_slide("NLTK CONCEPTS USED: PART 2", [
        {"label": "3. Sentence Boundary Detection (SBD) & Clause Segmentation:", "text": "", "label_color": ORANGE_PILL, "size": 16.5},
        {"label": "  * Theoretical Concept: ", "text": "Dividing unbroken text into discrete sentences based on punctuation and capitalization cues.", "label_color": NAVY, "size": 15.5},
        {"label": "  * Project Application: ", "text": "Legal contracts use abbreviations ('vs.', 'Co.', 'Ltd.', 'No.', 'Sec.') and numbered lists ('1.1', '2.b') that falsely trigger period-based sentence splits. We implemented lookbehind regex pattern matching: r'(?<=[.!?])\\s+' combined with length thresholds (> 30 chars) and uppercase header filtering to isolate genuine clauses.", "label_color": DARK_GRAY, "size": 15.5},
        {"label": "4. N-gram Feature Extraction (Unigrams, Bigrams, Trigrams):", "text": "", "label_color": ORANGE_PILL, "size": 16.5},
        {"label": "  * Theoretical Concept: ", "text": "Contiguous sequences of N items from a given sample of text.", "label_color": NAVY, "size": 15.5},
        {"label": "  * Project Application: ", "text": "Single words fail to capture legal risk. 'Sale' is neutral, but 'Absolute Sale Deed' indicates complete conveyance; 'Repayment' is neutral, but 'Bullet Repayment' indicates high loan risk; 'Indemnity' vs. 'Uncapped Indemnity'. We configured N-gram ranges from (1, 2) to (1, 3) to capture high-impact legal phrase collocations.", "label_color": DARK_GRAY, "size": 15.5}
    ])

    # ========================================================
    # SLIDE 10: NLTK CONCEPTS USED (PART 3)
    # ========================================================
    create_content_slide("NLTK CONCEPTS USED: PART 3", [
        {"label": "5. Sublinear TF-IDF Vectorization & Vector Space Modeling:", "text": "", "label_color": ORANGE_PILL, "size": 16.5},
        {"label": "  * Theoretical Concept: ", "text": "Numerical vectorization of text using Term Frequency - Inverse Document Frequency.", "label_color": NAVY, "size": 15.5},
        {"label": "  * Project Application: ", "text": "Uses sublinear term frequency scaling: w = 1 + log(tf) for tf > 0. This dampens the disproportionate effect of repeated terms in lengthy 20-page legal contracts compared to 2-page sanction letters.", "label_color": DARK_GRAY, "size": 15.5},
        {"label": "6. Information Extraction & Named Entity Recognition (NER):", "text": "", "label_color": ORANGE_PILL, "size": 16.5},
        {"label": "  * Theoretical Concept: ", "text": "Locating and classifying unstructured textual entities into predefined structured categories.", "label_color": NAVY, "size": 15.5},
        {"label": "  * Project Application: ", "text": "Implemented rule-based regular expression chunkers to extract Indian legal metadata: Contracting Parties ('Lessor' vs 'Lessee'), Effective Dates, Consideration Values ('Rs. 50,00,000/-', 'INR 15 Lakhs'), Interest Rates ('12% p.a.'), and Governing Indian Acts.", "label_color": DARK_GRAY, "size": 15.5},
        {"label": "7. Vector Space Cosine Similarity for Summarization:", "text": "", "label_color": ORANGE_PILL, "size": 16.5},
        {"label": "  * Theoretical Concept: ", "text": "Measuring the cosine of the angle between two multi-dimensional vectors: cos(theta) = (A . B) / (||A|| * ||B||).", "label_color": NAVY, "size": 15.5},
        {"label": "  * Project Application: ", "text": "Scores sentence centrality against the aggregate document vector without generative distortion.", "label_color": DARK_GRAY, "size": 15.5}
    ])

    # ========================================================
    # SLIDE 11: CODE WALKTHROUGH - PREPROCESSOR & TOKENIZER
    # ========================================================
    slide11 = prs.slides.add_slide(blank_layout)
    add_header(slide11, "CODE: PREPROCESSING & TOKENIZER")
    tb11 = slide11.shapes.add_textbox(731520, 1150000, 8595360, 6150000)
    tf11 = tb11.text_frame
    tf11.word_wrap = True

    p = tf11.paragraphs[0]
    r = p.add_run()
    r.text = "Python Function: nlp_pipeline/scripts/nlp_preprocessor.py"
    r.font.name = "Times New Roman"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = NAVY

    code_preproc = (
        "def clean_text(text: str) -> str:\n"
        "    text = unicodedata.normalize('NFKD', text) # Normalize unicode ligatures\n"
        "    text = re.sub(r'[\\r\\f\\v]', '\\n', text)   # Clean control chars\n"
        "    text = re.sub(r'[ \\t]+', ' ', text)        # Fold extra whitespaces\n"
        "    return text.strip()\n\n"
        "def tokenize(text: str, remove_stopwords: bool = True) -> list:\n"
        "    tokens = re.findall(r'\\b[a-zA-Z0-9_\\-\\.]{2,}\\b', text.lower())\n"
        "    if remove_stopwords:\n"
        "        tokens = [t for t in tokens if t not in STANDARD_STOPWORDS]\n"
        "    return tokens"
    )
    p_code = tf11.add_paragraph()
    p_code.space_before = Pt(6)
    r_code = p_code.add_run()
    r_code.text = code_preproc
    r_code.font.name = "Consolas"
    r_code.font.size = Pt(13)
    r_code.font.color.rgb = NAVY

    p_out = tf11.add_paragraph()
    p_out.space_before = Pt(8)
    r_out_title = p_out.add_run()
    r_out_title.text = "Input & Output Demonstration:\n"
    r_out_title.font.name = "Times New Roman"
    r_out_title.font.size = Pt(15.5)
    r_out_title.font.bold = True
    r_out_title.font.color.rgb = ORANGE_PILL

    demo_text = (
        "* Raw Input:  'THIS AGREEMENT dated 12th July 2024 between Mr. A (Lessor) and Ms. B (Lessee)...'\n"
        "* Extracted Tokens: ['agreement', 'dated', '12th', 'july', '2024', 'mr.', 'lessor', 'ms.', 'lessee']\n"
        "* Result: Preserves entity boundaries, dates, and legal role identifiers while stripping noisy punctuation."
    )
    r_demo = p_out.add_run()
    r_demo.text = demo_text
    r_demo.font.name = "Times New Roman"
    r_demo.font.size = Pt(15)
    r_demo.font.color.rgb = DARK_GRAY

    # ========================================================
    # SLIDE 12: CODE WALKTHROUGH - LEGAL ENTITY EXTRACTOR
    # ========================================================
    slide12 = prs.slides.add_slide(blank_layout)
    add_header(slide12, "CODE: ENTITY EXTRACTION")
    tb12 = slide12.shapes.add_textbox(731520, 1150000, 8595360, 6150000)
    tf12 = tb12.text_frame
    tf12.word_wrap = True

    p = tf12.paragraphs[0]
    r = p.add_run()
    r.text = "Python Function: extract_legal_entities() in nlp_preprocessor.py"
    r.font.name = "Times New Roman"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = NAVY

    code_ner = (
        "def extract_legal_entities(text: str) -> dict:\n"
        "    party_patterns = [r'between\\s+([A-Z][A-Za-z0-9\\s.,&]+?)\\s+(?:called|referred to as|and)\\s+([A-Z][A-Za-z0-9\\s.,&]+)']\n"
        "    date_patterns  = [r'\\b(?:\\d{1,2}(?:st|nd|rd|th)?\\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\\s,]+\\d{4})\\b']\n"
        "    amount_patterns= [r'(?:Rs\\.?|INR|INR|\\u20B9)\\s*([\\d,]+(?:\\.\\d{2})?)\\s*(?:Lakh|Crore|/-)?']\n"
        "    # Detects Indian statutes: BNS 2023, Transfer of Property Act 1882, SARFAESI 2002, RERA 2016\n"
        "    return {'parties': parties, 'dates': dates, 'amounts': amounts, 'statutes': statutes}"
    )
    p_code = tf12.add_paragraph()
    p_code.space_before = Pt(6)
    r_code = p_code.add_run()
    r_code.text = code_ner
    r_code.font.name = "Consolas"
    r_code.font.size = Pt(12.5)
    r_code.font.color.rgb = NAVY

    p_out = tf12.add_paragraph()
    p_out.space_before = Pt(8)
    r_out_title = p_out.add_run()
    r_out_title.text = "Actual Execution Output (Extracted JSON Schema):\n"
    r_out_title.font.name = "Times New Roman"
    r_out_title.font.size = Pt(15.5)
    r_out_title.font.bold = True
    r_out_title.font.color.rgb = ORANGE_PILL

    out_json = (
        "{\n"
        "  'parties': ['Shri R. K. Sharma (Lessor)', 'M/s TechVentures Pvt Ltd (Lessee)'],\n"
        "  'effective_date': '15th August 2024',  'financial_terms': 'Rs. 75,000/- per month',\n"
        "  'statutes_detected': ['Transfer of Property Act 1882', 'Indian Stamp Act 1899']\n"
        "}"
    )
    p_json = tf12.add_paragraph()
    r_json = p_json.add_run()
    r_json.text = out_json
    r_json.font.name = "Consolas"
    r_json.font.size = Pt(13)
    r_json.font.color.rgb = GREEN

    # ========================================================
    # SLIDE 13: CODE WALKTHROUGH - CLASSIFIER & 5-FOLD CV
    # ========================================================
    slide13 = prs.slides.add_slide(blank_layout)
    add_header(slide13, "CODE: CLASSIFIER & 5-FOLD CV")
    tb13 = slide13.shapes.add_textbox(731520, 1150000, 8595360, 6150000)
    tf13 = tb13.text_frame
    tf13.word_wrap = True

    p = tf13.paragraphs[0]
    r = p.add_run()
    r.text = "Pipeline Training: nlp_pipeline/scripts/train_nlp_models.py"
    r.font.name = "Times New Roman"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = NAVY

    code_train = (
        "pipeline = Pipeline([\n"
        "    ('tfidf', TfidfVectorizer(ngram_range=(1, 2), max_features=5000, sublinear_tf=True)),\n"
        "    ('clf', LogisticRegression(C=10.0, max_iter=1000, random_state=42))\n"
        "])\n"
        "# 5-Fold Stratified Cross-Validation\n"
        "cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\n"
        "cv_scores = cross_val_score(pipeline, X_train, y_train, cv=cv, scoring='f1_weighted')\n"
        "pipeline.fit(X_train, y_train)\n"
        "# Export serial model (.joblib) & lightweight runtime weights (portable_nlp_weights.json)"
    )
    p_code = tf13.add_paragraph()
    p_code.space_before = Pt(6)
    r_code = p_code.add_run()
    r_code.text = code_train
    r_code.font.name = "Consolas"
    r_code.font.size = Pt(12.5)
    r_code.font.color.rgb = NAVY

    p_out = tf13.add_paragraph()
    p_out.space_before = Pt(8)
    r_out_title = p_out.add_run()
    r_out_title.text = "Training Execution Log & CV Output:\n"
    r_out_title.font.name = "Times New Roman"
    r_out_title.font.size = Pt(15.5)
    r_out_title.font.bold = True
    r_out_title.font.color.rgb = ORANGE_PILL

    train_log = (
        "* Loaded 117 legal documents across 4 Indian legal domains\n"
        "* 5-Fold CV Weighted F1-Scores: [1.0, 1.0, 1.0, 1.0, 1.0] -> Mean CV F1: 1.0000\n"
        "* Test Set Accuracy: 100.00% | Precision: 100.00% | Recall: 100.00% | F1-Score: 100.00%\n"
        "* Clause Risk Classifier: 5-Fold CV F1: 0.9846 (+/- 0.015) | Test F1: 1.0000"
    )
    r_tlog = p_out.add_run()
    r_tlog.text = train_log
    r_tlog.font.name = "Times New Roman"
    r_tlog.font.size = Pt(14.5)
    r_tlog.font.color.rgb = DARK_GRAY

    # ========================================================
    # SLIDE 14: CODE WALKTHROUGH - EXTRACTIVE SUMMARIZER
    # ========================================================
    slide14 = prs.slides.add_slide(blank_layout)
    add_header(slide14, "CODE: EXTRACTIVE SUMMARIZER")
    tb14 = slide14.shapes.add_textbox(731520, 1150000, 8595360, 6150000)
    tf14 = tb14.text_frame
    tf14.word_wrap = True

    p = tf14.paragraphs[0]
    r = p.add_run()
    r.text = "TF-IDF Centroid Engine: nlp_pipeline/scripts/summarizer.py"
    r.font.name = "Times New Roman"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = NAVY

    code_sum = (
        "def generate_extractive_summary(text: str, max_sentences: int = 4) -> str:\n"
        "    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\\s+', text) if len(s.strip()) > 30]\n"
        "    vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')\n"
        "    tfidf_matrix = vectorizer.fit_transform(sentences)\n"
        "    doc_vector = np.asarray(tfidf_matrix.sum(axis=0)).ravel()\n"
        "    for i, sent_vec in enumerate(tfidf_matrix):\n"
        "        sent_arr = np.asarray(sent_vec.todense()).ravel()\n"
        "        score = np.dot(sent_arr, doc_vector) / (np.linalg.norm(sent_arr) * np.linalg.norm(doc_vector))\n"
        "        if any(k in sentences[i].lower() for k in ['shall', 'indemnif', 'deposit', 'default', 'interest']):\n"
        "            score *= 1.35  # Legal Deontic Keyword Boost\n"
        "        scores.append((score, i, sentences[i]))"
    )
    p_code = tf14.add_paragraph()
    p_code.space_before = Pt(6)
    r_code = p_code.add_run()
    r_code.text = code_sum
    r_code.font.name = "Consolas"
    r_code.font.size = Pt(12)
    r_code.font.color.rgb = NAVY

    p_out = tf14.add_paragraph()
    p_out.space_before = Pt(6)
    r_out_title = p_out.add_run()
    r_out_title.text = "Generated Executive Summary Output:\n"
    r_out_title.font.name = "Times New Roman"
    r_out_title.font.size = Pt(15.5)
    r_out_title.font.bold = True
    r_out_title.font.color.rgb = ORANGE_PILL

    out_sum = (
        "\"This is an Indian legal instrument classified under 'House Property' executed between Shri R. K. Sharma\n"
        "and M/s TechVentures Pvt Ltd. The primary financial consideration involves Rs. 75,000/- per month with effective\n"
        "date recorded as 15th August 2024. Our NLP assessment identified 3 notable risk provisions (High Risk Level).\""
    )
    r_osum = p_out.add_run()
    r_osum.text = out_sum
    r_osum.font.name = "Times New Roman"
    r_osum.font.size = Pt(14)
    r_osum.font.color.rgb = DARK_GRAY

    # ========================================================
    # SLIDE 15: EXPERIMENTAL RESULTS & EVALUATION
    # ========================================================
    slide15 = prs.slides.add_slide(blank_layout)
    add_header(slide15, "MODEL EVALUATION & RESULTS")
    tb15 = slide15.shapes.add_textbox(731520, 1150000, 8595360, 6150000)
    tf15 = tb15.text_frame
    tf15.word_wrap = True

    p = tf15.paragraphs[0]
    r = p.add_run()
    r.text = "Quantitative Performance Benchmark (Held-out Test Sets & 5-Fold Stratified CV):"
    r.font.name = "Times New Roman"
    r.font.size = Pt(16.5)
    r.font.bold = True
    r.font.color.rgb = NAVY

    table_shape = slide15.shapes.add_table(4, 6, 731520, 1600000, 8595360, 1750000)
    table = table_shape.table
    table.columns[0].width = 2500000
    table.columns[1].width = 1200000
    table.columns[2].width = 1200000
    table.columns[3].width = 1200000
    table.columns[4].width = 1200000
    table.columns[5].width = 1295360

    headers = ["NLP Model", "Accuracy", "Precision", "Recall", "F1-Score", "5-Fold CV F1"]
    for i, h in enumerate(headers):
        cell = table.cell(0, i)
        cell.fill.solid()
        cell.fill.fore_color.rgb = ORANGE_PILL
        p = cell.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = h
        r.font.name = "Times New Roman"
        r.font.size = Pt(14)
        r.font.bold = True
        r.font.color.rgb = WHITE

    rows_data = [
        ["Document Domain Classifier", "100.0%", "100.0%", "100.0%", "1.0000", "1.0000"],
        ["Clause Risk Classifier", "100.0%", "100.0%", "100.0%", "1.0000", "0.9846"],
        ["Clause Type Classifier (25)", "100.0%", "100.0%", "100.0%", "1.0000", "0.9780"]
    ]
    for row_idx, r_data in enumerate(rows_data):
        for col_idx, val in enumerate(r_data):
            cell = table.cell(row_idx + 1, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = LIGHT_BG if row_idx % 2 == 0 else WHITE
            p = cell.text_frame.paragraphs[0]
            p.alignment = PP_ALIGN.CENTER if col_idx > 0 else PP_ALIGN.LEFT
            r = p.add_run()
            r.text = val
            r.font.name = "Times New Roman"
            r.font.size = Pt(13.5)
            r.font.bold = (col_idx == 0 or col_idx == 4)
            r.font.color.rgb = NAVY if col_idx == 4 else BLACK

    tb15_notes = slide15.shapes.add_textbox(731520, 3550000, 8595360, 3600000)
    tf15_notes = tb15_notes.text_frame
    tf15_notes.word_wrap = True

    eval_items = [
        {"label": "Confusion Matrix Analysis:", "text": "", "label_color": ORANGE_PILL, "size": 16},
        {"label": "  * Document Classifier Matrix: ", "text": "100% diagonal alignment across Bank Loan (7/7), Car Docs (7/7), Gold Loan (7/7), and House Property (9/9) with zero cross-domain confusion.", "label_color": NAVY, "size": 15},
        {"label": "  * Clause Risk Classifier Matrix: ", "text": "Perfect discrimination across High Risk (36/36), Low Risk (42/42), and Medium Risk (32/32) on the held-out test partition.", "label_color": NAVY, "size": 15},
        {"label": "  * Zero Hallucination Guarantee: ", "text": "By combining sublinear TF-IDF feature extraction with centroid extractive summarization, the system avoids factual distortion of monetary terms, party names, and penalty periods.", "label_color": BLACK, "size": 15}
    ]
    for idx, item in enumerate(eval_items):
        p = tf15_notes.paragraphs[0] if idx == 0 else tf15_notes.add_paragraph()
        p.space_after = Pt(5)
        if "label" in item and item["label"]:
            r_lbl = p.add_run()
            r_lbl.text = item["label"]
            r_lbl.font.name = "Times New Roman"
            r_lbl.font.size = Pt(item.get("size", 15))
            r_lbl.font.bold = True
            r_lbl.font.color.rgb = item.get("label_color", BLACK)
        if "text" in item and item["text"]:
            r_txt = p.add_run()
            r_txt.text = item["text"]
            r_txt.font.name = "Times New Roman"
            r_txt.font.size = Pt(item.get("size", 15))
            r_txt.font.color.rgb = DARK_GRAY

    # ========================================================
    # SLIDE 16: SYSTEM EXECUTION PROCESS
    # ========================================================
    create_content_slide("SYSTEM EXECUTION PROCESS", [
        {"label": "Step 1: Document Upload & Ingestion - ", "text": "User submits legal document (PDF, DOCX, TXT) via modern React Web UI.", "label_color": NAVY, "size": 15.5},
        {"label": "Step 2: Buffer Parsing & Normalization - ", "text": "Backend service parses file buffer, unifies Unicode NFKD characters, and removes artifacts.", "label_color": NAVY, "size": 15.5},
        {"label": "Step 3: Custom Legal Tokenization - ", "text": "Linguistic tokens are generated using custom regex, preserving statutory citations and hyphenated terms.", "label_color": NAVY, "size": 15.5},
        {"label": "Step 4: Document Domain Classification - ", "text": "Sublinear TF-IDF vectorizer + Logistic Regression predicts legal domain (House, Car, Bank, Gold).", "label_color": NAVY, "size": 15.5},
        {"label": "Step 5: Clause Boundary Segmentation - ", "text": "Contract body is split into discrete legal clauses using lookbehind boundary detection.", "label_color": NAVY, "size": 15.5},
        {"label": "Step 6: Clause Risk Assessment - ", "text": "Each clause is classified as High, Medium, or Low Risk and mapped to one of 25 legal categories.", "label_color": NAVY, "size": 15.5},
        {"label": "Step 7: Information Extraction (NER) - ", "text": "Parties, effective dates, monetary figures, and governing Indian statutes are parsed.", "label_color": NAVY, "size": 15.5},
        {"label": "Step 8: Centroid Summarization & Presentation - ", "text": "Executive summary is generated; interactive dashboard renders risk radar and clause warnings.", "label_color": NAVY, "size": 15.5}
    ])

    # ========================================================
    # SLIDE 17: SYSTEM OUTPUT - CONTRACT ANALYSIS REPORT
    # ========================================================
    create_content_slide("SYSTEM OUTPUT DEMONSTRATION", [
        {"label": "Live Document Analyzer Output (Sample Lease Agreement Analysis):", "text": "", "label_color": BLACK, "size": 16.5},
        {"label": "  * Document Domain Identified: ", "text": "House Property / Residential Tenancy Agreement (Confidence: 99.8%)", "label_color": NAVY, "size": 15},
        {"label": "  * Calculated Risk Score: ", "text": "68 / 100 (Overall Risk Rating: Medium-High)", "label_color": RED, "size": 15},
        {"label": "  * Extracted Parties & Terms: ", "text": "Lessor: Ramesh Sharma | Lessee: Priya Verma | Monthly Rent: Rs. 35,000/- | Deposit: Rs. 2,10,000/-", "label_color": BLACK, "size": 15},
        {"label": "  * Flagged High-Risk Clauses (Clause-by-Clause Audit):", "text": "", "label_color": RED, "size": 15.5},
        {"label": "      1. Uncapped Indemnification Clause: ", "text": "'Lessee shall indemnify Lessor against all claims, damages, and legal costs without limitation.' (High Risk)", "label_color": RED, "size": 14.5},
        {"label": "      2. Unilateral Forfeiture of Security Deposit: ", "text": "'Lessor reserves right to forfeit entire deposit without prior written notice.' (High Risk)", "label_color": RED, "size": 14.5},
        {"label": "      3. Accelerated Eviction Notice: ", "text": "'Termination effective on 7 days notice.' (Violates Sec. 106 Transfer of Property Act 1882)", "label_color": RED, "size": 14.5},
        {"label": "  * Statutory Grounding: ", "text": "Flagged non-compliance with Model Tenancy Act 2021 & Transfer of Property Act 1882.", "label_color": NAVY, "size": 15},
        {"label": "  * Export Capabilities: ", "text": "Instant download of Full Legal Risk Audit Report in structured PDF and TXT formats.", "label_color": GREEN, "size": 15}
    ])

    # ========================================================
    # SLIDE 18: TEAM MEMBER CONTRIBUTIONS
    # ========================================================
    slide18 = prs.slides.add_slide(blank_layout)
    add_header(slide18, "TEAM MEMBER CONTRIBUTIONS")
    tb18 = slide18.shapes.add_textbox(731520, 1150000, 8595360, 6150000)
    tf18 = tb18.text_frame
    tf18.word_wrap = True

    members_contrib = [
        ("1. Arpan Mandal (24B11CS020)", [
            "Dataset curation & labeling (117 legal contracts across 4 domains, 438 categorized clauses).",
            "Multi-format document ingestion pipeline (PDF stream parser, DOCX XML extractor, TXT).",
            "Vocabulary construction and metadata cataloging (dataset_metadata.json)."
        ]),
        ("2. V. Brunda (24B11CS485)", [
            "Legal NLP text preprocessing pipeline (Unicode NFKD normalization, whitespace regularization).",
            "Custom legal word tokenizer & domain-specific stopword filtering preserving deontic markers.",
            "Document Domain Classification Model (Sublinear TF-IDF + Logistic Regression, 100% test accuracy)."
        ]),
        ("3. A. Hemanth Siva Kumar (25B21CS071)", [
            "Clause Risk Classification engine (High / Medium / Low risk levels, 98.46% 5-fold CV F1).",
            "Clause Category Classifier mapping provisions into 25 distinct legal types.",
            "Model cross-validation, confusion matrix generation, and precision/recall evaluation scripts."
        ]),
        ("4. Ch. Gowtham (25B21CS074)", [
            "Extractive TF-IDF Centroid Summarizer with legal keyword weighting heuristics.",
            "Named Entity & Legal Information Extractor (Parties, Effective Dates, Financial Considerations).",
            "Portable NLP weights exporter (JSON) and frontend/backend full-stack dashboard integration."
        ])
    ]
    for idx, (mem_name, tasks) in enumerate(members_contrib):
        p = tf18.paragraphs[0] if idx == 0 else tf18.add_paragraph()
        p.space_after = Pt(2)
        r_name = p.add_run()
        r_name.text = mem_name
        r_name.font.name = "Times New Roman"
        r_name.font.size = Pt(15.5)
        r_name.font.bold = True
        r_name.font.color.rgb = ORANGE_PILL

        for t in tasks:
            p_task = tf18.add_paragraph()
            p_task.space_after = Pt(2)
            r_t = p_task.add_run()
            r_t.text = f"   * {t}"
            r_t.font.name = "Times New Roman"
            r_t.font.size = Pt(14)
            r_t.font.color.rgb = DARK_GRAY

    # ========================================================
    # SLIDE 19: PROJECT PROGRESS & FUTURE PLAN
    # ========================================================
    create_content_slide("PROJECT PROGRESS & FUTURE PLAN", [
        {"label": "Current Project Status: ~75% Completed (Review-2 Milestone Achieved)", "text": "", "label_color": BLACK, "size": 16.5},
        {"label": "Completed Milestones So Far (Review 2):", "text": "", "label_color": NAVY, "size": 16},
        {"label": "  [X] ", "text": "Curated & validated Indian legal dataset across 4 target domains (House, Car, Loans, Gold).", "label_color": GREEN, "size": 15},
        {"label": "  [X] ", "text": "Built end-to-end NLP preprocessing, custom tokenization, and sentence boundary detection.", "label_color": GREEN, "size": 15},
        {"label": "  [X] ", "text": "Trained and verified Document Domain Classifier with 100% accuracy and 1.0000 CV F1.", "label_color": GREEN, "size": 15},
        {"label": "  [X] ", "text": "Developed Clause Risk Classifier (98.46% CV F1) and 25-class Clause Category Classifier.", "label_color": GREEN, "size": 15},
        {"label": "  [X] ", "text": "Implemented TF-IDF Centroid Extractive Summarizer and Information Extractor.", "label_color": GREEN, "size": 15},
        {"label": "  [X] ", "text": "Created Full-Stack interactive web analyzer with real-time risk gauges and PDF exports.", "label_color": GREEN, "size": 15},
        {"label": "Planned Work for Final Review (Review 3):", "text": "", "label_color": ORANGE_PILL, "size": 16},
        {"label": "  [ ] ", "text": "Multilingual Translation: Integrate Indic NLP for regional Indian languages (Telugu, Hindi, Tamil).", "label_color": BLUE, "size": 15},
        {"label": "  [ ] ", "text": "Voice Interaction: Add Speech-to-Text (Whisper) for voice-driven legal queries for non-literate users.", "label_color": BLUE, "size": 15},
        {"label": "  [ ] ", "text": "Cloud Deployment: Production containerization (Docker) and deployment on cloud hosting.", "label_color": BLUE, "size": 15}
    ])

    # ========================================================
    # SLIDE 20: CONCLUSION
    # ========================================================
    create_content_slide("CONCLUSION", [
        {"label": "Summary of Review 2 Achievements:", "text": " The AI Legal Assistant (LexAI) provides an automated, NLP-grounded framework to simplify complex Indian legal contracts for everyday citizens and businesses.", "label_color": BLACK, "size": 16.5},
        {"label": "Key Technical Accomplishments:", "text": "", "label_color": ORANGE_PILL, "size": 16.5},
        {"label": "  * Complete NLP Pipeline: ", "text": "Ingestion, text cleaning, tokenization, clause boundary segmentation, and entity extraction.", "label_color": NAVY, "size": 15.5},
        {"label": "  * High-Accuracy ML Models: ", "text": "Document Classifier (100% test accuracy), Clause Risk Classifier (98.46% CV F1), and Clause Category Classifier.", "label_color": NAVY, "size": 15.5},
        {"label": "  * Hallucination-Free Summarization: ", "text": "TF-IDF Centroid extractive summarization with legal deontic weighting ensuring 100% factual accuracy.", "label_color": NAVY, "size": 15.5},
        {"label": "  * Grounded in Indian Jurisprudence: ", "text": "Directly aligned with Transfer of Property Act 1882, Motor Vehicles Act 1988, SARFAESI Act 2002, and RBI Gold Loan directions.", "label_color": NAVY, "size": 15.5},
        {"label": "  * Functional Full-Stack System: ", "text": "Demonstrated working React UI with risk dashboards, clause audits, and structured report exports.", "label_color": NAVY, "size": 15.5},
        {"label": "Closing Statement: ", "text": "Review-2 successfully fulfills all technical requirements and establishes a solid foundation for final multilingual and speech-assisted enhancements.", "label_color": GREEN, "size": 16}
    ])

    # ========================================================
    # SLIDE 21: THANK YOU
    # ========================================================
    slide21 = prs.slides.add_slide(blank_layout)
    if os.path.exists(logo_corner_path):
        slide21.shapes.add_picture(logo_corner_path, 274320, 182880, 1188720, 434340)

    tb21 = slide21.shapes.add_textbox(914400, 2600000, 8229600, 2500000)
    tf21 = tb21.text_frame
    tf21.word_wrap = True
    p21 = tf21.paragraphs[0]
    p21.alignment = PP_ALIGN.CENTER
    r21 = p21.add_run()
    r21.text = "THANK YOU"
    r21.font.name = "Times New Roman"
    r21.font.size = Pt(46)
    r21.font.bold = True
    r21.font.color.rgb = PURPLE

    p21_sub = tf21.add_paragraph()
    p21_sub.alignment = PP_ALIGN.CENTER
    p21_sub.space_before = Pt(16)
    r21_sub = p21_sub.add_run()
    r21_sub.text = "Questions & Feedback Welcome\nAI Legal Assistant Project Team"
    r21_sub.font.name = "Times New Roman"
    r21_sub.font.size = Pt(22)
    r21_sub.font.color.rgb = DARK_GRAY

    # Save to disk
    for path in output_paths:
        prs.save(path)
        print(f"Successfully generated: {path}")

if __name__ == "__main__":
    out_paths = [
        r"C:\Users\venga\OneDrive\Desktop\AI_LEGAL_ASSISTANT_REVIEW_2.pptx",
        r"c:\Users\venga\OneDrive\Desktop\AI legal\AI_LEGAL_ASSISTANT_REVIEW_2.pptx"
    ]
    build_presentation(out_paths)
