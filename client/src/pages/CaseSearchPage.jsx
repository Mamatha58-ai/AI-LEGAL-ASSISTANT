import React, { useState, useEffect } from 'react';
import { Scale, Search, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import LegalDisclaimer from '../components/LegalDisclaimer';

export default function CaseSearchPage() {
  const [query, setQuery] = useState('');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSearch('Arnesh Kumar Puttaswamy Supreme Court');
  }, []);

  const handleSearch = async (searchTerm) => {
    const q = searchTerm !== undefined ? searchTerm : query;
    setLoading(true);

    try {
      const res = await api.get(`/legal/cases/search?q=${encodeURIComponent(q)}`);
      if (res.data.success) {
        setCases(res.data.cases || []);
      }
    } catch (err) {
      console.warn("Case search error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h1 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-600" />
          Supreme Court & High Court Judgment Search
        </h1>
        <p className="text-xs text-slate-500">
          Search landmark case law, binding Supreme Court precedents (Article 141), and judicial interpretations.
        </p>

        <div className="flex gap-2 pt-2">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus-within:border-amber-500">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              className="w-full bg-transparent text-xs md:text-sm outline-none text-slate-900 placeholder:text-slate-400"
              placeholder="Search case name, keyword, or section (e.g. 'Arnesh Kumar', 'Puttaswamy privacy', 'Section 498A arrest')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-semibold px-5 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors shrink-0"
          >
            {loading ? <Sparkles className="w-4 h-4 spin" /> : <Search className="w-4 h-4" />}
            Search Cases
          </button>
        </div>
      </div>

      <LegalDisclaimer />

      {/* Case Feed */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-700 font-serif">
          Landmark Cases & Precedents ({cases.length} Judgments)
        </h2>

        {cases.map((c, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 hover:border-amber-400 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {c.court || 'Supreme Court of India'}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1 font-serif">{c.title}</h3>
              </div>

              <span className="text-xs text-slate-500 font-mono shrink-0">{c.date}</span>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100 font-serif">
              <strong>Summary & Ratio Decidendi:</strong> {c.text}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span><strong>Governing Statute:</strong> {c.act}</span>
              <a href={c.url || 'https://main.sci.gov.in/'} target="_blank" rel="noreferrer" className="text-amber-600 font-semibold hover:underline flex items-center gap-1">
                Official Supreme Court Record <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
