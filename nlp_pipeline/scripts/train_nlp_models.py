"""
Model Training & Validation Script
Trains:
1. Document Type Classifier (House Property, Car Documents, Bank Loan Agreement, Gold Loan Agreement, Commercial Contract)
2. Clause Risk Classifier (High, Medium, Low) trained on 5,200+ CUAD and Indian legal clauses
3. Clause Type Classifier (Categorization of legal clauses)

Outputs:
- Serialized model artifacts (.joblib)
- Portable model weights & vocabularies (.json) for Node.js / Browser integration
- Validation & Cross-Validation Metrics
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score, precision_recall_fscore_support, confusion_matrix

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")
EVAL_DIR = os.path.join(BASE_DIR, "evaluation")

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(EVAL_DIR, exist_ok=True)

def train_document_classifier():
    print("=" * 60)
    print("1. TRAINING DOCUMENT TYPE CLASSIFIER")
    print("=" * 60)

    aug_csv = os.path.join(DATA_DIR, "legal_documents_augmented.csv")
    base_csv = os.path.join(DATA_DIR, "legal_documents_dataset.csv")
    doc_csv = aug_csv if os.path.exists(aug_csv) else base_csv
    
    df = pd.read_csv(doc_csv)
    print(f"Loaded {len(df)} documents from {os.path.basename(doc_csv)} across {df['document_type'].nunique()} categories.")
    print("Category distribution:\n", df['document_type'].value_counts())

    X = df["full_text"]
    y = df["document_type"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    # Sublinear TF-IDF + Logistic Regression
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=6000,
            sublinear_tf=True,
            token_pattern=r'(?u)\b\w+\b'
        )),
        ("clf", LogisticRegression(C=10.0, max_iter=1000, class_weight="balanced", random_state=42))
    ])

    # 5-Fold Stratified Cross-Validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(pipeline, X_train, y_train, cv=cv, scoring="f1_weighted")
    print(f"\n5-Fold CV Weighted F1-Scores: {[round(s, 4) for s in cv_scores]}")
    print(f"Mean CV F1-Score: {np.mean(cv_scores):.4f} (+/- {np.std(cv_scores):.4f})")

    # Fit on training set
    pipeline.fit(X_train, y_train)

    # Evaluate on held-out test set
    y_pred = pipeline.predict(X_test)
    test_acc = accuracy_score(y_test, y_pred)
    prec, rec, f1, _ = precision_recall_fscore_support(y_test, y_pred, average="weighted", zero_division=0)
    report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

    print(f"\nTest Set Accuracy : {test_acc * 100:.2f}%")
    print(f"Test Set Precision: {prec * 100:.2f}%")
    print(f"Test Set Recall   : {rec * 100:.2f}%")
    print(f"Test Set F1-Score : {f1 * 100:.2f}%")

    # Save Joblib Model
    joblib_path = os.path.join(MODELS_DIR, "doc_classifier_pipeline.joblib")
    joblib.dump(pipeline, joblib_path)
    print(f" Saved document classifier model to: {joblib_path}")

    return {
        "model_name": "Document_Type_Classifier",
        "dataset_source": os.path.basename(doc_csv),
        "total_samples": len(df),
        "accuracy": float(test_acc),
        "precision": float(prec),
        "recall": float(rec),
        "f1": float(f1),
        "cv_mean_f1": float(np.mean(cv_scores)),
        "classes": list(pipeline.classes_),
        "classification_report": report,
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist()
    }


def train_clause_risk_classifier():
    print("\n" + "=" * 60)
    print("2. TRAINING CLAUSE RISK CLASSIFIER")
    print("=" * 60)

    aug_csv = os.path.join(DATA_DIR, "legal_clauses_augmented.csv")
    base_csv = os.path.join(DATA_DIR, "legal_clauses_dataset.csv")
    clause_csv = aug_csv if os.path.exists(aug_csv) else base_csv

    df = pd.read_csv(clause_csv)
    print(f"Loaded {len(df)} clauses from {os.path.basename(clause_csv)} across {df['risk_label'].nunique()} risk levels.")
    print("Risk label distribution:\n", df['risk_label'].value_counts())

    X = df["clause_text"]
    y = df["risk_label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 3),
            max_features=15000,
            sublinear_tf=True,
            min_df=2
        )),
        ("clf", LogisticRegression(C=12.0, max_iter=2000, class_weight="balanced", random_state=42))
    ])

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(pipeline, X_train, y_train, cv=cv, scoring="f1_weighted")
    print(f"\n5-Fold CV Weighted F1-Scores: {[round(s, 4) for s in cv_scores]}")
    print(f"Mean CV F1-Score: {np.mean(cv_scores):.4f} (+/- {np.std(cv_scores):.4f})")

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    test_acc = accuracy_score(y_test, y_pred)
    prec, rec, f1, _ = precision_recall_fscore_support(y_test, y_pred, average="weighted", zero_division=0)
    report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

    print(f"\nTest Set Accuracy : {test_acc * 100:.2f}%")
    print(f"Test Set Precision: {prec * 100:.2f}%")
    print(f"Test Set Recall   : {rec * 100:.2f}%")
    print(f"Test Set F1-Score : {f1 * 100:.2f}%")

    joblib_path = os.path.join(MODELS_DIR, "clause_risk_pipeline.joblib")
    joblib.dump(pipeline, joblib_path)
    print(f" Saved clause risk model to: {joblib_path}")

    return {
        "model_name": "Clause_Risk_Classifier",
        "dataset_source": os.path.basename(clause_csv),
        "total_samples": len(df),
        "accuracy": float(test_acc),
        "precision": float(prec),
        "recall": float(rec),
        "f1": float(f1),
        "cv_mean_f1": float(np.mean(cv_scores)),
        "classes": list(pipeline.classes_),
        "classification_report": report,
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist()
    }


def train_clause_type_classifier():
    print("\n" + "=" * 60)
    print("3. TRAINING CLAUSE CATEGORY CLASSIFIER")
    print("=" * 60)

    aug_csv = os.path.join(DATA_DIR, "legal_clauses_augmented.csv")
    base_csv = os.path.join(DATA_DIR, "legal_clauses_dataset.csv")
    clause_csv = aug_csv if os.path.exists(aug_csv) else base_csv

    df = pd.read_csv(clause_csv)

    # Filter categories with at least 8 samples for stratified train/test and cross validation
    counts = df["clause_type"].value_counts()
    valid_types = counts[counts >= 8].index
    df_filtered = df[df["clause_type"].isin(valid_types)]
    print(f"Filtered to {len(df_filtered)} clauses across {len(valid_types)} valid categories (min 8 samples).")

    X = df_filtered["clause_text"]
    y = df_filtered["clause_type"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=8000, sublinear_tf=True)),
        ("clf", LogisticRegression(C=5.0, max_iter=1500, class_weight="balanced", random_state=42))
    ])

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    test_acc = accuracy_score(y_test, y_pred)
    prec, rec, f1, _ = precision_recall_fscore_support(y_test, y_pred, average="weighted", zero_division=0)
    report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

    print(f"\nTest Set Accuracy : {test_acc * 100:.2f}%")
    print(f"Test Set Precision: {prec * 100:.2f}%")
    print(f"Test Set Recall   : {rec * 100:.2f}%")
    print(f"Test Set F1-Score : {f1 * 100:.2f}%")

    joblib_path = os.path.join(MODELS_DIR, "clause_type_pipeline.joblib")
    joblib.dump(pipeline, joblib_path)
    print(f" Saved clause type model to: {joblib_path}")

    return {
        "model_name": "Clause_Type_Classifier",
        "dataset_source": os.path.basename(clause_csv),
        "total_samples": len(df_filtered),
        "categories_count": len(valid_types),
        "accuracy": float(test_acc),
        "precision": float(prec),
        "recall": float(rec),
        "f1": float(f1),
        "classes": list(pipeline.classes_),
        "classification_report": report
    }


def export_portable_model_weights(doc_metrics, risk_metrics, type_metrics=None):
    """
    Exports vocabulary, IDF values, and logistic regression coefficients to JSON.
    This enables Node.js / React frontend to execute the EXACT trained ML models
    instantly in production without requiring Python subprocess overhead.
    """
    doc_pipe = joblib.load(os.path.join(MODELS_DIR, "doc_classifier_pipeline.joblib"))
    risk_pipe = joblib.load(os.path.join(MODELS_DIR, "clause_risk_pipeline.joblib"))
    type_pipe = joblib.load(os.path.join(MODELS_DIR, "clause_type_pipeline.joblib"))

    # Extract Document Classifier parameters
    doc_tfidf = doc_pipe.named_steps["tfidf"]
    doc_clf = doc_pipe.named_steps["clf"]

    # Extract Risk Classifier parameters
    risk_tfidf = risk_pipe.named_steps["tfidf"]
    risk_clf = risk_pipe.named_steps["clf"]

    # Extract Clause Type Classifier parameters
    type_tfidf = type_pipe.named_steps["tfidf"]
    type_clf = type_pipe.named_steps["clf"]

    portable_payload = {
        "generated_at": pd.Timestamp.now().isoformat(),
        "document_classifier": {
            "classes": list(doc_clf.classes_),
            "vocabulary": {k: int(v) for k, v in doc_tfidf.vocabulary_.items()},
            "idf": [float(val) for val in doc_tfidf.idf_],
            "intercept": [float(b) for b in doc_clf.intercept_],
            "coefficients": [[float(c) for c in row] for row in doc_clf.coef_]
        },
        "risk_classifier": {
            "classes": list(risk_clf.classes_),
            "vocabulary": {k: int(v) for k, v in risk_tfidf.vocabulary_.items()},
            "idf": [float(val) for val in risk_tfidf.idf_],
            "intercept": [float(b) for b in risk_clf.intercept_],
            "coefficients": [[float(c) for c in row] for row in risk_clf.coef_]
        },
        "clause_type_classifier": {
            "classes": list(type_clf.classes_),
            "vocabulary": {k: int(v) for k, v in type_tfidf.vocabulary_.items()},
            "idf": [float(val) for val in type_tfidf.idf_],
            "intercept": [float(b) for b in type_clf.intercept_],
            "coefficients": [[float(c) for c in row] for row in type_clf.coef_]
        }
    }

    json_path = os.path.join(MODELS_DIR, "portable_nlp_weights.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(portable_payload, f)
    print(f"\n Exported portable JSON model weights to: {json_path}")

    # Also copy into server/services/documents for direct Node.js import
    server_dest = os.path.join(os.path.dirname(BASE_DIR), "server", "services", "documents", "portable_nlp_weights.json")
    if os.path.exists(os.path.dirname(server_dest)):
        with open(server_dest, "w", encoding="utf-8") as f:
            json.dump(portable_payload, f)
        print(f" Synced portable model to server: {server_dest}")


def main():
    print("STARTING ADVANCED MODEL TRAINING PIPELINE")
    doc_res = train_document_classifier()
    risk_res = train_clause_risk_classifier()
    type_res = train_clause_type_classifier()

    export_portable_model_weights(doc_res, risk_res, type_res)

    # Save summary evaluation metrics
    all_metrics = {
        "document_type_classifier": doc_res,
        "clause_risk_classifier": risk_res,
        "clause_type_classifier": type_res
    }

    summary_json = os.path.join(EVAL_DIR, "metrics_summary.json")
    with open(summary_json, "w", encoding="utf-8") as f:
        json.dump(all_metrics, f, indent=2)
    print(f"\nAll training metrics saved to: {summary_json}")
    print("MODEL TRAINING COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
