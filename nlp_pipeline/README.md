# Legal NLP Pipeline & Model Architecture

This directory contains the NLP dataset, preprocessing pipelines, model training and cross-validation workflows, evaluation metrics, and inference engines for the Indian Legal Assistant project.

---

## 📁 Directory Structure

```
nlp_pipeline/
├── data/
│   ├── legal_documents_dataset.csv   # 117 labeled documents across 4 Indian legal domains
│   ├── legal_clauses_dataset.csv     # 438 labeled clauses with domain & risk ratings (High/Medium/Low)
│   └── dataset_metadata.json         # Dataset distribution statistics and schema definition
│
├── models/
│   ├── doc_classifier_pipeline.joblib   # Serialized Document Type Classifier (TF-IDF + Linear Classifier)
│   ├── clause_risk_pipeline.joblib      # Serialized Clause Risk Classifier (TF-IDF + Logistic Regression)
│   ├── clause_type_pipeline.joblib      # Serialized Clause Category Classifier (TF-IDF + LinearSVC)
│   └── portable_nlp_weights.json        # Exported vocabulary, IDF weights, and coefficients for Node.js
│
├── evaluation/
│   └── metrics_summary.json             # Cross-validation and test set precision/recall/F1 metrics
│
└── scripts/
    ├── dataset_generator.py             # Generates labeled Indian legal datasets & clauses
    ├── nlp_preprocessor.py              # Text cleaning, legal tokenization, NER, & clause segmentation
    ├── summarizer.py                    # Extractive TF-IDF centroid summarizer & structured synthesis
    ├── train_nlp_models.py              # 5-fold CV training, model export, & portable JSON weights sync
    ├── evaluate_nlp_models.py           # Standalone model evaluation & confusion matrix generator
    └── nlp_infer.py                     # End-to-end Python inference engine & CLI
```

---

## 🎯 4 Target Legal Document Domains

1. **House Property**: Residential Lease / Rental Agreements, Mortgage Deeds, Absolute Sale Deeds, Builder-Buyer Agreements.
2. **Car Documents**: Used Vehicle Sale Agreements, Hypothecation Deeds, RC Transfer Deeds, Commercial Fleet Leases.
3. **Bank Loan Agreement**: Personal Loans, MSME Business Loans, Home Loan Sanction Letters, Secured Credit Facilities.
4. **Gold Loan Agreement**: Agricultural Gold Loans, Ornaments Pledge Deeds, Bullet Repayment Overdrafts.

### Indian Statutory Grounding:
- *Transfer of Property Act 1882*
- *Registration Act 1908 & Indian Stamp Act 1899*
- *Motor Vehicles Act 1988*
- *SARFAESI Act 2002 & Banking Regulation Act 1949*
- *RBI Master Directions on Gold Loans & Loan-to-Value (LTV) Norms*
- *Arbitration and Conciliation Act 1996*
- *RERA 2016*

---

## 🚀 How to Run the NLP Pipeline

### 1. Generate / Refresh Datasets
```bash
python nlp_pipeline/scripts/dataset_generator.py
```

### 2. Train & Export NLP Models (5-Fold Stratified Cross Validation)
```bash
python nlp_pipeline/scripts/train_nlp_models.py
```
*Outputs `.joblib` model artifacts and exports `portable_nlp_weights.json` synced to `server/services/documents/`.*

### 3. Evaluate NLP Models
```bash
python nlp_pipeline/scripts/evaluate_nlp_models.py
```
*Outputs classification reports, per-class F1-scores, and confusion matrices for both Document and Clause Risk classifiers.*

### 4. Run End-to-End Document Inference CLI
```bash
python nlp_pipeline/scripts/nlp_infer.py
```

---

## ⚡ Multi-Format Document Ingestion
The fullstack backend supports:
- **PDF files** (`.pdf`) via `pdf-parse`
- **Word Documents** (`.docx`, `.doc`) via `mammoth`
- **Plain Text / Markdown** (`.txt`, `.md`) via UTF-8 buffer parsing
