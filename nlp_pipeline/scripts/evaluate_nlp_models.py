"""
Comprehensive Model Evaluation & Validation Suite
Evaluates:
- Document Type Classifier
- Clause Risk Level Classifier
- Clause Category Classifier

Performs:
- Performance evaluation on full augmented datasets
- Confusion Matrix Visualization (ASCII / Summary)
- Detailed per-class Precision, Recall, F1-Score, and Support
"""

import os
import joblib
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_recall_fscore_support

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")
EVAL_DIR = os.path.join(BASE_DIR, "evaluation")

os.makedirs(EVAL_DIR, exist_ok=True)


def print_ascii_matrix(cm, labels, title="Confusion Matrix"):
    print(f"\n--- {title} ---")
    header = f"{'True \\ Pred':<25} | " + " | ".join([f"{l[:10]:<10}" for l in labels])
    print(header)
    print("-" * len(header))
    for i, row_label in enumerate(labels):
        row_str = f"{row_label[:25]:<25} | " + " | ".join([f"{cm[i][j]:<10}" for j in range(len(labels))])
        print(row_str)


def evaluate_all():
    print("=" * 70)
    print("        LEGAL NLP PIPELINE - COMPREHENSIVE EVALUATION SUITE        ")
    print("=" * 70)

    # 1. Document Type Classifier Evaluation
    doc_model_path = os.path.join(MODELS_DIR, "doc_classifier_pipeline.joblib")
    if os.path.exists(doc_model_path):
        doc_pipe = joblib.load(doc_model_path)
        aug_doc = os.path.join(DATA_DIR, "legal_documents_augmented.csv")
        base_doc = os.path.join(DATA_DIR, "legal_documents_dataset.csv")
        doc_path = aug_doc if os.path.exists(aug_doc) else base_doc
        doc_df = pd.read_csv(doc_path)

        X_docs = doc_df["full_text"]
        y_docs = doc_df["document_type"]

        preds = doc_pipe.predict(X_docs)
        classes = list(doc_pipe.classes_)
        cm = confusion_matrix(y_docs, preds, labels=classes)
        acc = accuracy_score(y_docs, preds)
        prec, rec, f1, _ = precision_recall_fscore_support(y_docs, preds, average="weighted", zero_division=0)

        print("\n" + "=" * 50)
        print("1. DOCUMENT TYPE CLASSIFICATION RESULTS")
        print("=" * 50)
        print(f"Dataset Evaluated: {os.path.basename(doc_path)}")
        print(f"Total Evaluated Documents: {len(doc_df)}")
        print(f"Accuracy : {acc * 100:.2f}%")
        print(f"Precision: {prec * 100:.2f}%")
        print(f"Recall   : {rec * 100:.2f}%")
        print(f"F1-Score : {f1 * 100:.2f}%\n")

        print(classification_report(y_docs, preds, target_names=classes, digits=4, zero_division=0))
        print_ascii_matrix(cm, classes, "Document Classifier Confusion Matrix")
    else:
        print("Doc model not found. Run train_nlp_models.py first.")

    # 2. Clause Risk Classifier Evaluation
    risk_model_path = os.path.join(MODELS_DIR, "clause_risk_pipeline.joblib")
    if os.path.exists(risk_model_path):
        risk_pipe = joblib.load(risk_model_path)
        aug_clause = os.path.join(DATA_DIR, "legal_clauses_augmented.csv")
        base_clause = os.path.join(DATA_DIR, "legal_clauses_dataset.csv")
        clause_path = aug_clause if os.path.exists(aug_clause) else base_clause
        clause_df = pd.read_csv(clause_path)

        X_clauses = clause_df["clause_text"]
        y_risk = clause_df["risk_label"]

        preds_risk = risk_pipe.predict(X_clauses)
        classes_risk = list(risk_pipe.classes_)
        cm_risk = confusion_matrix(y_risk, preds_risk, labels=classes_risk)
        acc_risk = accuracy_score(y_risk, preds_risk)
        prec_r, rec_r, f1_r, _ = precision_recall_fscore_support(y_risk, preds_risk, average="weighted", zero_division=0)

        print("\n" + "=" * 50)
        print("2. CLAUSE RISK CLASSIFICATION RESULTS")
        print("=" * 50)
        print(f"Dataset Evaluated: {os.path.basename(clause_path)}")
        print(f"Total Evaluated Clauses: {len(clause_df)}")
        print(f"Accuracy : {acc_risk * 100:.2f}%")
        print(f"Precision: {prec_r * 100:.2f}%")
        print(f"Recall   : {rec_r * 100:.2f}%")
        print(f"F1-Score : {f1_r * 100:.2f}%\n")

        print(classification_report(y_risk, preds_risk, target_names=classes_risk, digits=4, zero_division=0))
        print_ascii_matrix(cm_risk, classes_risk, "Clause Risk Confusion Matrix")

    # 3. Clause Type Classifier Evaluation
    type_model_path = os.path.join(MODELS_DIR, "clause_type_pipeline.joblib")
    if os.path.exists(type_model_path):
        type_pipe = joblib.load(type_model_path)
        aug_clause = os.path.join(DATA_DIR, "legal_clauses_augmented.csv")
        base_clause = os.path.join(DATA_DIR, "legal_clauses_dataset.csv")
        clause_path = aug_clause if os.path.exists(aug_clause) else base_clause
        clause_df = pd.read_csv(clause_path)

        valid_mask = clause_df["clause_type"].isin(type_pipe.classes_)
        df_valid = clause_df[valid_mask]

        X_type = df_valid["clause_text"]
        y_type = df_valid["clause_type"]

        preds_type = type_pipe.predict(X_type)
        classes_type = list(type_pipe.classes_)
        acc_type = accuracy_score(y_type, preds_type)
        prec_t, rec_t, f1_t, _ = precision_recall_fscore_support(y_type, preds_type, average="weighted", zero_division=0)

        print("\n" + "=" * 50)
        print("3. CLAUSE CATEGORY CLASSIFICATION RESULTS")
        print("=" * 50)
        print(f"Total Evaluated Clauses: {len(df_valid)} across {len(classes_type)} categories")
        print(f"Accuracy : {acc_type * 100:.2f}%")
        print(f"Precision: {prec_t * 100:.2f}%")
        print(f"Recall   : {rec_t * 100:.2f}%")
        print(f"F1-Score : {f1_t * 100:.2f}%\n")

    print("\n" + "=" * 70)
    print("                      EVALUATION COMPLETE                          ")
    print("=" * 70)


if __name__ == "__main__":
    evaluate_all()
