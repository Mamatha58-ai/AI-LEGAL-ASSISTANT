"""
Ingestion & Harmonization Script for 6 Hugging Face Legal & Indic Datasets:
1. transitionGap/propertyregistration-india-prefered-dataset-prep-small (Property Registration)
2. transitionGap/buildingplan-india-prefered-dataset-prep-small (Building Plan Approval)
3. transitionGap/rto-india-prefered-dataset-prep-small (RTO Vehicle Procedures)
4. theatticusproject/cuad (Contract Understanding Atticus Dataset - 41 Clause Types)
5. WhissleAI/omni-400k-with-meta (Voice/Conversational QA)
6. ai4bharat/Indic-Rag-Suite (Multilingual Indic RAG in en, hi, te)

Extracts and exports:
- nlp_pipeline/data/legal_documents_augmented.csv
- nlp_pipeline/data/legal_clauses_augmented.csv
- server/services/legal-search/huggingface_rag_knowledge.json
"""

import os
import json
import re
import requests
import pandas as pd
import pyarrow.parquet as pq
import fsspec

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
SERVER_LEGAL_SEARCH_DIR = os.path.join(os.path.dirname(BASE_DIR), "server", "services", "legal-search")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(SERVER_LEGAL_SEARCH_DIR, exist_ok=True)

# Risk mapping heuristics for CUAD 41 legal clause categories
CUAD_RISK_MAP = {
    # High Risk: Financial liability, restrictive covenants, uncapped exposure, litigation risks
    "Uncapped Liability": "High",
    "Liquidated Damages": "High",
    "Non-Compete": "High",
    "Exclusivity": "High",
    "No-Solicit Of Customers": "High",
    "No-Solicit Of Employees": "High",
    "Covenant Not To Sue": "High",
    "Post-Termination Services": "High",
    "Price Restriction": "High",
    "Minimum Commitment": "High",
    "Ip Ownership Assignment": "High",
    "Warranty Duration": "High",

    # Medium Risk: Operational constraints, conditional termination, audit, indemnification
    "Termination For Convenience": "Medium",
    "Audit Rights": "Medium",
    "Indemnity": "Medium",
    "Change Of Control": "Medium",
    "Revenue/Profit Sharing": "Medium",
    "Anti-Assignment": "Medium",
    "Insurance": "Medium",
    "Rofr/Rofo/Rofn": "Medium",
    "Volume Restriction": "Medium",
    "Affiliate License-Licensor": "Medium",
    "Affiliate License-Licensee": "Medium",
    "Source Code Escrow": "Medium",

    # Low Risk: Standard boilerplate, notices, definitions, governing law
    "Governing Law": "Low",
    "Effective Date": "Low",
    "Expiration Date": "Low",
    "Document Name": "Low",
    "Parties": "Low",
    "Notice Period To Terminate Renewal": "Low",
    "Third Party Beneficiary": "Low",
    "Severability": "Low",
    "Entire Agreement": "Low",
    "Counterparts": "Low",
    "Waiver": "Low"
}

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def ingest_cuad(max_clauses=2500):
    print("=" * 60)
    print("1. INGESTING theatticusproject/cuad")
    print("=" * 60)
    url = "https://huggingface.co/datasets/theatticusproject/cuad/resolve/main/CUAD_v1/CUAD_v1.json"
    print(f"Downloading CUAD JSON from {url}...")
    resp = requests.get(url, timeout=60)
    if resp.status_code != 200:
        raise RuntimeError(f"Failed to fetch CUAD: HTTP {resp.status_code}")
    
    data = resp.json()
    contracts = data.get("data", [])
    print(f"Loaded {len(contracts)} commercial contracts from CUAD.")

    extracted_clauses = []
    seen_texts = set()

    for contract in contracts:
        contract_title = contract.get("title", "Commercial Agreement")
        for para in contract.get("paragraphs", []):
            for qa in para.get("qas", []):
                qid = qa.get("id", "")
                cat_raw = qid.split("__")[-1] if "__" in qid else qa.get("question", "")
                cat = cat_raw.replace("-", " ").title().strip()
                
                # Determine risk level
                risk = CUAD_RISK_MAP.get(cat, "Medium")
                for key, val in CUAD_RISK_MAP.items():
                    if key.lower() in cat.lower():
                        risk = val
                        break

                for ans in qa.get("answers", []):
                    c_text = clean_text(ans.get("text", ""))
                    if len(c_text) >= 30 and c_text not in seen_texts:
                        seen_texts.add(c_text)
                        extracted_clauses.append({
                            "clause_id": f"CUAD-{len(extracted_clauses)+1:05d}",
                            "document_type": "Commercial Contract",
                            "clause_title": f"{cat} Clause ({contract_title[:40]})",
                            "clause_type": cat,
                            "risk_label": risk,
                            "clause_text": c_text
                        })
                        if len(extracted_clauses) >= max_clauses:
                            break
                if len(extracted_clauses) >= max_clauses:
                    break
            if len(extracted_clauses) >= max_clauses:
                break
        if len(extracted_clauses) >= max_clauses:
            break

    print(f"Extracted {len(extracted_clauses)} real annotated clauses from CUAD across {len(set(c['clause_type'] for c in extracted_clauses))} categories.")
    return extracted_clauses


def ingest_transitiongap_datasets():
    print("\n" + "=" * 60)
    print("2. INGESTING transitionGap Indian Legal Datasets")
    print("=" * 60)

    urls = {
        "property": ("https://huggingface.co/datasets/transitionGap/propertyregistration-india-prefered-dataset-prep-small/resolve/main/data/train-00000-of-00001.parquet", "House Property"),
        "building": ("https://huggingface.co/datasets/transitionGap/buildingplan-india-prefered-dataset-prep-small/resolve/main/data/train-00000-of-00001.parquet", "House Property"),
        "rto": ("https://huggingface.co/datasets/transitionGap/rto-india-prefered-dataset-prep-small/resolve/main/data/train-00000-of-00001.parquet", "Car Documents")
    }

    doc_records = []
    clause_records = []
    rag_records = []

    for key, (url, doc_type) in urls.items():
        print(f"Loading {key} from {url}...")
        df = pd.read_parquet(url)
        print(f"Loaded {len(df)} rows for {key}.")

        for idx, row in df.iterrows():
            q = clean_text(row.get("question", ""))
            resp = clean_text(row.get("response", ""))
            if not q or not resp:
                continue

            # 1. RAG Knowledge record
            rag_records.append({
                "id": f"hf-{key}-{idx+1}",
                "domain": doc_type,
                "dataset_source": f"transitionGap/{key}",
                "title": q[:100],
                "act": "Indian Regulatory & Statutory Framework (Registration Act / Motor Vehicles Act / Municipal By-Laws)",
                "section": "Statutory Compliance",
                "text": f"Question: {q}\n\nLegal Guidance: {resp}",
                "keywords": [w.lower() for w in re.findall(r'\b[A-Za-z]{3,}\b', q)[:8]],
                "en": {
                    "title": q[:100],
                    "act": "Indian Regulatory Framework",
                    "text": resp
                }
            })

            # 2. Synthesize Document records for Document Type Classifier
            if idx % 10 == 0:  # Sample documents
                doc_records.append({
                    "doc_id": f"DOC-HF-{key.upper()}-{idx+1:04d}",
                    "document_type": doc_type,
                    "title": f"Indian Legal Procedure: {q[:60]}",
                    "parties": "Applicant / Sub-Registrar / Municipal Authority / Transport Authority",
                    "date": "2026-01-01",
                    "amount": "Statutory Fees / Stamp Duty",
                    "clause_type": "Regulatory Compliance",
                    "risk_label": "Low",
                    "summary_text": q,
                    "full_text": f"SUBJECT: {q}\n\nSTATUTORY GUIDELINES AND REGULATORY COMPLIANCE:\n{resp}"
                })

            # 3. Synthesize clause records
            sentences = [s.strip() for s in resp.split(". ") if len(s.strip()) > 35]
            for s_idx, sent in enumerate(sentences[:2]):
                risk = "Low"
                c_type = "Statutory Compliance"
                if any(w in sent.lower() for w in ["penalty", "punishable", "imprisonment", "fine", "reject", "cancel", "forfeit"]):
                    risk = "High"
                    c_type = "Penalties & Rejection"
                elif any(w in sent.lower() for w in ["mandatory", "required", "obligation", "must", "inspection", "noc"]):
                    risk = "Medium"
                    c_type = "Mandatory Requirement"

                clause_records.append({
                    "clause_id": f"TG-{key.upper()}-{len(clause_records)+1:05d}",
                    "document_type": doc_type,
                    "clause_title": f"{key.title()} Clause: {q[:40]}",
                    "clause_type": c_type,
                    "risk_label": risk,
                    "clause_text": sent + ("." if not sent.endswith(".") else "")
                })

    print(f"Extracted {len(doc_records)} documents, {len(clause_records)} clauses, and {len(rag_records)} RAG entries from transitionGap datasets.")
    return doc_records, clause_records, rag_records


def ingest_indic_rag_suite(max_samples=600):
    print("\n" + "=" * 60)
    print("3. INGESTING ai4bharat/Indic-Rag-Suite (en, hi, te)")
    print("=" * 60)

    indic_rag_records = []
    languages = [("en", "English"), ("hi", "Hindi"), ("te", "Telugu")]

    for lang_code, lang_name in languages:
        url = f"https://huggingface.co/datasets/ai4bharat/Indic-Rag-Suite/resolve/main/data/{lang_code}_data.parquet"
        print(f"Streaming {lang_name} ({lang_code}) from {url}...")
        try:
            fs = fsspec.filesystem("http")
            with fs.open(url, "rb") as f:
                pf = pq.ParquetFile(f)
                tbl = pf.read_row_group(0, columns=["question", "answer", "paragraph", "title"])
                df = tbl.to_pandas()
                print(f"Read {len(df)} rows for {lang_code}.")

                count = 0
                for idx, row in df.iterrows():
                    q = clean_text(str(row.get("question", "")))
                    ans = clean_text(str(row.get("answer", "")))
                    para = clean_text(str(row.get("paragraph", "")))
                    title = clean_text(str(row.get("title", "")))

                    if not q or not ans or len(q) < 10:
                        continue

                    entry = {
                        "id": f"indic-rag-{lang_code}-{idx+1}",
                        "domain": "General Legal & Governance",
                        "dataset_source": "ai4bharat/Indic-Rag-Suite",
                        "language": lang_code,
                        "title": title or q[:80],
                        "act": "Indian Information & Governance Context",
                        "section": "Informational Retrieval",
                        "text": f"Question: {q}\nAnswer: {ans}\nContext: {para[:300]}",
                        "keywords": [w.lower() for w in re.findall(r'\b\w{3,}\b', q)[:6]]
                    }

                    if lang_code == "hi":
                        entry["hi"] = {"title": title or q[:80], "act": "भारतीय सूचना संदर्भ", "text": f"{ans} {para[:200]}"}
                    elif lang_code == "te":
                        entry["te"] = {"title": title or q[:80], "act": "భారతీయ సమాచార సందర్భం", "text": f"{ans} {para[:200]}"}
                    else:
                        entry["en"] = {"title": title or q[:80], "act": "Indian Information Context", "text": f"{ans} {para[:200]}"}

                    indic_rag_records.append(entry)
                    count += 1
                    if count >= max_samples // 3:
                        break
        except Exception as e:
            print(f"Warning: Error processing {lang_code}: {e}")

    print(f"Extracted {len(indic_rag_records)} multilingual RAG records from Indic-Rag-Suite.")
    return indic_rag_records


def ingest_omni_qa(max_samples=300):
    print("\n" + "=" * 60)
    print("4. INGESTING WhissleAI/omni-400k-with-meta")
    print("=" * 60)
    url = "https://huggingface.co/datasets/WhissleAI/omni-400k-with-meta/resolve/main/data/train-00000-of-00116.parquet"
    print(f"Reading text columns from {url}...")
    omni_records = []
    try:
        fs = fsspec.filesystem("http")
        with fs.open(url, "rb") as f:
            pf = pq.ParquetFile(f)
            # Read first row group text columns
            tbl = pf.read_row_group(0, columns=["question_text", "answer_text"])
            df = tbl.to_pandas()
            print(f"Read {len(df)} rows from Omni-400k row group 0.")

            for idx, row in df.iterrows():
                q = clean_text(str(row.get("question_text", "")))
                ans = clean_text(str(row.get("answer_text", "")))
                if q and ans and len(q) > 15:
                    omni_records.append({
                        "id": f"omni-{idx+1}",
                        "domain": "Conversational Legal AI",
                        "dataset_source": "WhissleAI/omni-400k-with-meta",
                        "title": q[:80],
                        "act": "Procedural AI Assistance",
                        "section": "Voice & Chat Interaction",
                        "text": f"Question: {q}\nAnswer: {ans}",
                        "keywords": [w.lower() for w in re.findall(r'\b[A-Za-z]{3,}\b', q)[:6]],
                        "en": {"title": q[:80], "act": "AI Assistant Guidelines", "text": ans}
                    })
                    if len(omni_records) >= max_samples:
                        break
    except Exception as e:
        print(f"Warning: Error processing WhissleAI/omni-400k-with-meta: {e}")

    print(f"Extracted {len(omni_records)} records from WhissleAI/omni-400k-with-meta.")
    return omni_records


def main():
    print("STARTING HUGGING FACE DATASETS INGESTION PIPELINE")
    
    # 1. Ingest CUAD
    cuad_clauses = ingest_cuad(max_clauses=2200)

    # 2. Ingest transitionGap (Property, Building, RTO)
    tg_docs, tg_clauses, tg_rag = ingest_transitiongap_datasets()

    # 3. Ingest Indic-Rag-Suite (en, hi, te)
    indic_rag = ingest_indic_rag_suite(max_samples=600)

    # 4. Ingest WhissleAI Omni QA
    omni_rag = ingest_omni_qa(max_samples=250)

    # 5. Merge with existing datasets
    existing_docs_path = os.path.join(DATA_DIR, "legal_documents_dataset.csv")
    existing_clauses_path = os.path.join(DATA_DIR, "legal_clauses_dataset.csv")

    df_base_docs = pd.read_csv(existing_docs_path) if os.path.exists(existing_docs_path) else pd.DataFrame()
    df_base_clauses = pd.read_csv(existing_clauses_path) if os.path.exists(existing_clauses_path) else pd.DataFrame()

    print("\n" + "=" * 60)
    print("5. MERGING & EXPORTING AUGMENTED DATASETS")
    print("=" * 60)

    # Documents
    df_tg_docs = pd.DataFrame(tg_docs)
    df_merged_docs = pd.concat([df_base_docs, df_tg_docs], ignore_index=True)
    aug_docs_path = os.path.join(DATA_DIR, "legal_documents_augmented.csv")
    df_merged_docs.to_csv(aug_docs_path, index=False, encoding="utf-8")
    print(f" Exported augmented documents: {len(df_merged_docs)} rows -> {aug_docs_path}")
    print(f" Document type distribution:\n{df_merged_docs['document_type'].value_counts()}")

    # Clauses
    df_new_clauses = pd.DataFrame(cuad_clauses + tg_clauses)
    df_merged_clauses = pd.concat([df_base_clauses, df_new_clauses], ignore_index=True)
    aug_clauses_path = os.path.join(DATA_DIR, "legal_clauses_augmented.csv")
    df_merged_clauses.to_csv(aug_clauses_path, index=False, encoding="utf-8")
    print(f"\n Exported augmented clauses: {len(df_merged_clauses)} rows -> {aug_clauses_path}")
    print(f" Clause risk distribution:\n{df_merged_clauses['risk_label'].value_counts()}")
    print(f" Total clause categories: {df_merged_clauses['clause_type'].nunique()}")

    # RAG Knowledge Base
    all_rag = tg_rag + indic_rag + omni_rag
    rag_json_path = os.path.join(SERVER_LEGAL_SEARCH_DIR, "huggingface_rag_knowledge.json")
    with open(rag_json_path, "w", encoding="utf-8") as f:
        json.dump(all_rag, f, indent=2, ensure_ascii=False)
    print(f"\n Exported RAG knowledge base: {len(all_rag)} entries -> {rag_json_path}")
    print("\nSUCCESSFULLY COMPLETED HUGGING FACE DATASET INGESTION!")

if __name__ == "__main__":
    main()
