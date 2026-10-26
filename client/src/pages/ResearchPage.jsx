import React, { useState, useEffect } from 'react';
import { Search, BookOpenCheck, Scale, FileText, Gavel, BookOpen, X, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedSource } from '../utils/sourceLocalizer';

// ── Category filter pills ─────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',        label: 'All',              icon: BookOpenCheck },
  { id: 'act',        label: 'Acts & Codes',     icon: BookOpen      },
  { id: 'section',    label: 'Sections',         icon: FileText      },
  { id: 'judgment',   label: 'Judgments',        icon: Gavel         },
  { id: 'rule',       label: 'Rules & Regs',     icon: Scale         },
];

// ── Quick search suggestions ──────────────────────────────────────────
const QUICK_SEARCHES = [
  'Bharatiya Nyaya Sanhita 2023',
  'Tenant Rights',
  'Consumer Protection Act',
  'Section 138 Cheque Bounce',
  'SARFAESI Act',
  'Motor Vehicles Act',
  'Gold Loan RBI Rules',
  'RTI Act 2005',
];

// ── Document type badge ───────────────────────────────────────────────
function TypeBadge({ type }) {
  const map = {
    Act:        'bg-blue-100 text-blue-700 border-blue-200',
    Section:    'bg-violet-100 text-violet-700 border-violet-200',
    Judgment:   'bg-amber-100 text-amber-700 border-amber-200',
    Rule:       'bg-emerald-100 text-emerald-700 border-emerald-200',
    Statute:    'bg-slate-100 text-slate-700 border-slate-200',
    Notification: 'bg-orange-100 text-orange-700 border-orange-200',
  };
  const cls = map[type] || map.Statute;
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls} uppercase tracking-wide`}>
      {type || 'Statute'}
    </span>
  );
}

export default function ResearchPage() {
  const { language } = useLanguage();
  const [query, setQuery]           = useState('');
  const [category, setCategory]     = useState('all');
  const [results, setResults]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [searched, setSearched]     = useState('');   // what was last searched
  const [expandedIdx, setExpandedIdx] = useState(null);

  // Load default results on mount
  useEffect(() => {
    runSearch('Bharatiya Nyaya Sanhita 2023 tenant consumer');
  }, []);

  const runSearch = async (term) => {
    const q = (term ?? query).trim();
    if (!q) return;
    setLoading(true);
    setExpandedIdx(null);
    try {
      const res = await api.get(`/legal/search?q=${encodeURIComponent(q)}`);
      if (res.data.success) {
        setResults(res.data.results || []);
        setSearched(q);
      }
    } catch (err) {
      console.warn('Legal search error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  // Filter by category client-side
  const filtered = category === 'all'
    ? results
    : results.filter(r => {
        const t = (r.documentType || '').toLowerCase();
        if (category === 'act')      return t === 'act' || t === 'statute' || t === 'code';
        if (category === 'section')  return t === 'section';
        if (category === 'judgment') return t === 'judgment';
        if (category === 'rule')     return t === 'rule' || t === 'notification';
        return true;
      });

  const clearSearch = () => { setQuery(''); setResults([]); setSearched(''); };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-8">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Search className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-900">Legal Search</h1>
        </div>
        <p className="text-xs text-slate-500 mb-5 ml-10">
          Search Indian laws, sections, acts, judgments and regulations in plain language.
        </p>

        {/* Search input */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <div className={`flex-1 flex items-center gap-2 bg-slate-50 border rounded-xl px-4 py-3 transition-all ${
              loading ? 'border-blue-300' : 'border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100'
            }`}>
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                className="flex-1 bg-transparent text-sm outline-none text-slate-800 placeholder:text-slate-400"
                placeholder="e.g. tenant rights, Section 138, gold loan rules..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button type="button" onClick={clearSearch} className="text-slate-400 hover:text-slate-600 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 shrink-0 transition-colors"
            >
              {loading ? <Sparkles className="w-4 h-4 spin" /> : <Search className="w-4 h-4" />}
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </form>

        {/* Quick search pills */}
        <div className="mt-4">
          <p className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wide">Quick searches</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_SEARCHES.map((s) => (
              <button
                key={s}
                onClick={() => { setQuery(s); runSearch(s); }}
                className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-full transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category filter pills ──────────────────────────────────── */}
      {results.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const active = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  active
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {c.label}
              </button>
            );
          })}
          {searched && (
            <span className="ml-auto text-xs text-slate-400">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "<strong className="text-slate-600">{searched}</strong>"
            </span>
          )}
        </div>
      )}

      {/* ── Loading state ──────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Sparkles className="w-8 h-8 text-blue-500 spin" />
          <p className="text-sm font-semibold text-slate-600">Searching Indian statutes…</p>
          <p className="text-xs text-slate-400">Checking Acts, Sections, and Judgments</p>
        </div>
      )}

      {/* ── Empty state ────────────────────────────────────────────── */}
      {!loading && searched && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500">No results found</p>
          <p className="text-xs text-slate-400 mt-1">Try a different keyword or select "All" category</p>
          <button
            onClick={() => setCategory('all')}
            className="mt-4 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Show all categories
          </button>
        </div>
      )}

      {/* ── Results list ──────────────────────────────────────────── */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((item, idx) => {
            const loc    = getLocalizedSource(item, language);
            const isOpen = expandedIdx === idx;
            const text   = loc.text || '';
            const SHORT  = 200;
            const needsMore = text.length > SHORT;

            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Card header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <TypeBadge type={loc.documentType} />
                      {loc.act && (
                        <span className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">
                          {loc.act}
                        </span>
                      )}
                    </div>
                    {/* Jurisdiction */}
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">
                      {loc.jurisdiction || 'India'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">
                    {loc.title}
                  </h3>

                  {/* Text preview */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isOpen || !needsMore ? text : `${text.slice(0, SHORT)}…`}
                  </p>

                  {/* Show more / less */}
                  {needsMore && (
                    <button
                      onClick={() => setExpandedIdx(isOpen ? null : idx)}
                      className="mt-2 text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {isOpen ? 'Show less' : 'Read more'}
                      <ArrowRight className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Card footer */}
                <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {loc.court || 'Supreme Court / Parliament of India'}
                  </span>
                  <a
                    href="https://main.sci.gov.in/"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Official Source <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
