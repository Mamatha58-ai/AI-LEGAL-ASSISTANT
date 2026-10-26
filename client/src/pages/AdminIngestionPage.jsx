import React, { useState } from 'react';
import { Database, UploadCloud, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../services/api';
import LegalDisclaimer from '../components/LegalDisclaimer';

export default function AdminIngestionPage() {
  const [docTitle, setDocTitle] = useState('');
  const [actName, setActName] = useState('');
  const [sectionNum, setSectionNum] = useState('');
  const [documentType, setDocumentType] = useState('Act');
  const [docText, setDocText] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleIngest = async () => {
    if (!docText.trim() || loading) return;

    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await api.post('/admin/ingest', {
        title: docTitle || 'Ingested Legal Code',
        act: actName || 'General Statute',
        section: sectionNum,
        documentType,
        text: docText
      });

      if (res.data.success) {
        setStatusMsg({ type: 'success', text: res.data.message });
        setDocText('');
        setDocTitle('');
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-purple-700 bg-purple-50 px-3 py-1 rounded-full text-xs font-bold w-fit border border-purple-200">
          <Database className="w-3.5 h-3.5" /> ADMIN RAG KNOWLEDGE BASE INGESTION PIPELINE
        </div>
        <h1 className="text-xl font-bold text-slate-900 font-serif">
          Upload & Index Trusted Legal Documents
        </h1>
        <p className="text-xs text-slate-500">
          Ingest new statutes, amendments, Supreme Court judgments, or official notifications into the LexAI RAG Vector Store.
        </p>
      </div>

      <LegalDisclaimer />

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
        {statusMsg && (
          <div className={`p-3 rounded-lg flex items-center gap-2 font-semibold ${
            statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <ShieldCheck className="w-4 h-4 text-red-600" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Document Title</label>
            <input
              type="text"
              className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-amber-500"
              placeholder="e.g. Bharatiya Nagarik Suraksha Sanhita (BNSS) Section 479"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Act / Statute Name</label>
            <input
              type="text"
              className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-amber-500"
              placeholder="e.g. BNSS 2023 / CrPC"
              value={actName}
              onChange={(e) => setActName(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Section / Article</label>
            <input
              type="text"
              className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-amber-500"
              placeholder="e.g. Section 479"
              value={sectionNum}
              onChange={(e) => setSectionNum(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-amber-500 font-semibold"
            >
              <option value="Act">Act</option>
              <option value="Section">Section</option>
              <option value="Rule">Rule</option>
              <option value="Judgment">Judgment</option>
              <option value="Notification">Notification</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Statute Text Content</label>
          <textarea
            className="w-full h-48 p-3 border border-slate-300 rounded-md font-mono text-slate-800 outline-none focus:border-amber-500"
            placeholder="Paste full raw text of the statute or judgment to be embedded and indexed..."
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
          />
        </div>

        <button
          onClick={handleIngest}
          disabled={!docText.trim() || loading}
          className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-2.5 px-6 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? <Sparkles className="w-4 h-4 spin" /> : <UploadCloud className="w-4 h-4" />}
          Process, Embed & Index Document
        </button>
      </div>
    </div>
  );
}
