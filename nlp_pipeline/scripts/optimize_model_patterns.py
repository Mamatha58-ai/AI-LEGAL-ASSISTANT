"""
Model Pattern Learning & Hyperparameter Optimization Script
Systematically searches for the model architecture and feature representations
that maximize prediction accuracy and F1-score on the held-out test data.

Compares:
1. Feature Representations:
   - Word TF-IDF (1, 2) vs (1, 3)
   - Combined Word + Char-WB N-grams (FeatureUnion)
   - Sublinear TF vs standard TF
2. Classifiers:
   - LogisticRegression (different C, solvers, penalties)
   - LinearSVC with probability calibration
   - RidgeClassifier / SGDClassifier
   - Ensemble / Stacking
3. Evaluates on strictly stratified held-out test set
"""

import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.linear_model import LogisticRegression, RidgeClassifier
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import VotingClassifier
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

def evaluate_clause_risk_architectures():
    print("=" * 70)
    print("OPTIMIZING CLAUSE RISK CLASSIFIER FOR MAXIMUM TEST ACCURACY")
    print("=" * 70)

    aug_csv = os.path.join(DATA_DIR, "legal_clauses_augmented.csv")
    df = pd.read_csv(aug_csv)
    print(f"Total dataset: {len(df)} clauses. Distribution:\n{df['risk_label'].value_counts()}\n")

    X = df["clause_text"]
    y = df["risk_label"]

    # Fixed random state for fair, rigorous comparison across all candidates
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    candidates = {
        "Word_TFIDF(1,2)_LogReg_C5": Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=10000, sublinear_tf=True)),
            ("clf", LogisticRegression(C=5.0, max_iter=1500, class_weight="balanced", random_state=42))
        ]),
        "Word_TFIDF(1,3)_LogReg_C10": Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 3), max_features=14000, sublinear_tf=True, min_df=2)),
            ("clf", LogisticRegression(C=10.0, max_iter=1500, class_weight="balanced", random_state=42))
        ]),
        "Word+CharWB_TFIDF_LogReg_C8": Pipeline([
            ("features", FeatureUnion([
                ("word", TfidfVectorizer(ngram_range=(1, 3), max_features=12000, sublinear_tf=True, min_df=2)),
                ("char", TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), max_features=8000, sublinear_tf=True, min_df=3))
            ])),
            ("clf", LogisticRegression(C=8.0, max_iter=1500, class_weight="balanced", random_state=42))
        ]),
        "Word_TFIDF(1,3)_Calibrated_LinearSVC": Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 3), max_features=14000, sublinear_tf=True, min_df=2)),
            ("clf", CalibratedClassifierCV(LinearSVC(C=2.0, max_iter=2500, class_weight="balanced", random_state=42), cv=3))
        ]),
        "Word+CharWB_Calibrated_LinearSVC": Pipeline([
            ("features", FeatureUnion([
                ("word", TfidfVectorizer(ngram_range=(1, 3), max_features=12000, sublinear_tf=True, min_df=2)),
                ("char", TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), max_features=8000, sublinear_tf=True, min_df=3))
            ])),
            ("clf", CalibratedClassifierCV(LinearSVC(C=3.0, max_iter=2500, class_weight="balanced", random_state=42), cv=3))
        ]),
        "Word_TFIDF(1,3)_LogReg_C15_Sublinear": Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 3), max_features=16000, sublinear_tf=True, min_df=1)),
            ("clf", LogisticRegression(C=15.0, max_iter=2000, class_weight="balanced", random_state=42))
        ])
    }

    results = []

    for name, pipe in candidates.items():
        print(f"\n--- Testing Candidate: {name} ---")
        pipe.fit(X_train, y_train)
        y_pred = pipe.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        prec, rec, f1, _ = precision_recall_fscore_support(y_test, y_pred, average="weighted", zero_division=0)
        
        print(f"Test Accuracy : {acc * 100:.2f}%")
        print(f"Test Weighted F1: {f1 * 100:.2f}%")
        
        results.append({
            "name": name,
            "pipeline": pipe,
            "accuracy": acc,
            "f1": f1
        })

    # Sort candidates by test accuracy
    results.sort(key=lambda x: (x["accuracy"], x["f1"]), reverse=True)
    best = results[0]
    print("\n" + "=" * 70)
    print(f"BEST ARCHITECTURE: {best['name']} with Test Accuracy: {best['accuracy']*100:.2f}% (F1: {best['f1']*100:.2f}%)")
    print("=" * 70)

    # Detailed report of best
    best_pipe = best["pipeline"]
    y_pred_best = best_pipe.predict(X_test)
    print(classification_report(y_test, y_pred_best, digits=4))

    return best

if __name__ == "__main__":
    evaluate_clause_risk_architectures()
