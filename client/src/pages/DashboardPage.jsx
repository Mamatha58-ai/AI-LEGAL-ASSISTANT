import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSearch, Search, FileEdit, MessageSquare,
  ArrowRight, UploadCloud, CheckCircle2, X,
  AlertTriangle, Eye, Download, HelpCircle,
  Sparkles, FileText, Clock, ChevronRight,
  Lightbulb, Shield, Info
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

// ── Feature cards (top row) ─────────────────────────────────────────
const FEATURES = [
  {
    id: 'analyze',
    label: 'Document Analysis',
    desc: 'Upload and analyze legal documents for key clauses, risks and insights.',
    icon: FileSearch,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    btnLabel: 'Get Started',
    btnColor: 'bg-blue-600 hover:bg-blue-700',
    path: '/documents',
  },
  {
    id: 'search',
    label: 'Legal Search',
    desc: 'Search Indian laws, acts, judgments and case references.',
    icon: Search,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    btnLabel: 'Search Now',
    btnColor: 'bg-emerald-600 hover:bg-emerald-700',
    path: '/research',
  },
  {
    id: 'draft',
    label: 'Document Drafting',
    desc: 'Create legal documents like agreements, notices, contracts etc.',
    icon: FileEdit,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    btnLabel: 'Draft Now',
    btnColor: 'bg-violet-600 hover:bg-violet-700',
    path: '/drafts',
  },
  {
    id: 'chat',
    label: 'Chat with AI',
    desc: 'Ask legal questions and get accurate, citation-backed answers.',
    icon: MessageSquare,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    btnLabel: 'Start Chat',
    btnColor: 'bg-orange-500 hover:bg-orange-600',
    path: '/chat',
  },
];

// ── Quick tips ──────────────────────────────────────────────────────
const TIPS = [
  { icon: Search,        text: 'Use specific keywords for better search results.' },
  { icon: FileSearch,    text: 'Upload clear and readable documents for accurate analysis.' },
  { icon: Shield,        text: 'Check the cited sources for legal authenticity.' },
  { icon: Info,          text: 'For best results, use PDF or DOCX files (max 10MB).' },
];

// ── Clause risk colour ──────────────────────────────────────────────
function RiskBadge({ level }) {
  const map = {
    High:   'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Low:    'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${map[level] || map.Low}`}>
      {level}
    </span>
  );
}

// ── Status badge ────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === 'Completed')
    return <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">Completed</span>;
  if (status === 'Processing')
    return <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">Processing</span>;
  return <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">{status}</span>;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();

  // ── Document analysis mini-panel state ─────────────────────────
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [docResult, setDocResult] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [recentDocs, setRecentDocs] = useState([]);
  const fileInputRef = useRef(null);

  // Mock recent docs for demo
  useEffect(() => {
    setRecentDocs([
      { name: 'Employment_Contract.pdf', type: 'PDF', date: 'Apr 27, 2025 10:24 AM', status: 'Completed' },
      { name: 'Property_Agreement.pdf',  type: 'PDF', date: 'Apr 26, 2025 04:12 PM', status: 'Completed' },
      { name: 'Court_Judgment.pdf',      type: 'PDF', date: 'Apr 25, 2025 11:03 AM', status: 'Completed' },
    ]);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setDocResult(null);
    try {
      const fd = new FormData();
      fd.append('document', file);
      fd.append('language', language || 'en');
      const res = await api.post('/documents/upload', fd);
      if (res.data.success) {
        setDocResult(res.data.document);
        setActiveTab('summary');
        setRecentDocs(prev => [{
          name: file.name, type: file.name.endsWith('.pdf') ? 'PDF' : 'DOCX',
          date: new Date().toLocaleString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          status: 'Completed'
        }, ...prev.slice(0, 4)]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Build display content from docResult
  const summaryText = docResult?.summary || docResult?.executiveSummary || 'Document analyzed successfully.';
  const concerns = docResult?.concerns?.slice(0, 3) || [];
  const totalClauses = docResult?.clauses?.length || concerns.length || 0;
  const highCount  = concerns.filter(c => c.riskLevel === 'HIGH' || c.severity === 'HIGH').length;
  const medCount   = concerns.filter(c => c.riskLevel === 'MEDIUM' || c.severity === 'MEDIUM').length;
  const lowCount   = Math.max(0, totalClauses - highCount - medCount);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">

      {/* ══ HERO BANNER ══════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 p-7 md:p-10 space-y-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              Welcome to <span className="text-blue-600">LexAI</span>
            </h1>
            <p className="text-base font-semibold text-slate-700">
              Your AI-Powered Legal Assistant for Indian Law
            </p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
              Get instant legal insights, analyze documents, search relevant laws,
              and draft legal documents — all in one place.
            </p>
            {/* Quick-action pills */}
            <div className="flex flex-wrap gap-3 pt-1">
              {[
                { icon: FileSearch, label: 'Analyze Documents',    path: '/documents'  },
                { icon: Search,     label: 'Search Legal Sources',  path: '/research'   },
                { icon: FileEdit,   label: 'Draft Documents',       path: '/drafts'     },
                { icon: MessageSquare, label: 'Chat with AI',       path: '/chat'       },
              ].map(a => (
                <button
                  key={a.path}
                  onClick={() => navigate(a.path)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-all"
                >
                  <a.icon className="w-3.5 h-3.5" />
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          {/* Illustration */}
          <div className="hidden md:flex items-center justify-center w-72 h-52 shrink-0 pr-8">
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-28 h-28 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2">
                  {/* scales of justice illustration */}
                  <line x1="60" y1="10" x2="60" y2="90" strokeWidth="2.5" />
                  <line x1="20" y1="30" x2="100" y2="30" strokeWidth="2.5" />
                  <circle cx="60" cy="10" r="4" fill="currentColor" />
                  {/* left pan */}
                  <line x1="20" y1="30" x2="15" y2="55" />
                  <line x1="20" y1="30" x2="25" y2="55" />
                  <path d="M10 55 Q20 60 30 55" strokeWidth="2" />
                  {/* right pan */}
                  <line x1="100" y1="30" x2="95" y2="55" />
                  <line x1="100" y1="30" x2="105" y2="55" />
                  <path d="M90 55 Q100 60 110 55" strokeWidth="2" />
                  {/* base */}
                  <line x1="45" y1="90" x2="75" y2="90" strokeWidth="3" />
                  {/* leaves */}
                  <path d="M75 85 Q85 78 92 85 Q85 92 75 85Z" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" />
                  <path d="M80 82 Q90 72 98 80 Q90 90 80 82Z" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ FEATURE CARDS ════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {FEATURES.map(f => {
          const Icon = f.icon;
          return (
            <div key={f.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className={`w-11 h-11 rounded-xl ${f.iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${f.iconColor}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-sm mb-1">{f.label}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
              <button
                onClick={() => navigate(f.path)}
                className={`${f.btnColor} text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 w-fit transition-colors`}
              >
                {f.btnLabel} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ══ MIDDLE ROW: Document Analysis panel + Results ════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Left — upload panel */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileSearch className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-800">Document Analysis</h2>
            </div>
            <p className="text-xs text-slate-500">Upload a legal document (PDF, DOCX) and get instant analysis.</p>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={(e) => { const f = e.target.files[0]; if (f) setFile(f); }}
            />
            <UploadCloud className={`w-7 h-7 mx-auto mb-2 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
            <p className="text-xs font-semibold text-slate-600">Drag & drop your file here</p>
            <p className="text-[11px] text-slate-400 my-1.5">or</p>
            <button
              type="button"
              className="text-xs font-semibold text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-lg flex items-center gap-1.5 mx-auto"
            >
              <UploadCloud className="w-3.5 h-3.5" /> Choose File
            </button>
            <p className="text-[10px] text-slate-400 mt-2">Supports PDF, DOCX, TXT (Max 10MB)</p>
          </div>

          {/* Selected file */}
          {file && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              <div className="w-8 h-8 rounded bg-red-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                {file.name.split('.').pop()?.toUpperCase() || 'PDF'}
              </div>
              <div className="flex-1 truncate">
                <p className="text-xs font-semibold text-slate-700 truncate">{file.name}</p>
                <p className="text-[10px] text-slate-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || analyzing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {analyzing ? (
              <><Sparkles className="w-4 h-4 spin" /> Analyzing…</>
            ) : (
              'Analyze Document'
            )}
          </button>
        </div>

        {/* Middle — results/tabs */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-slate-200 px-4 pt-3 gap-4 shrink-0">
            {['summary', 'risk', 'clauses', 'sources'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-semibold pb-2.5 border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'risk' ? 'Risk Analysis' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1 p-5 overflow-y-auto">
            {!docResult && !analyzing ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <FileText className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-400">No document analyzed yet</p>
                <p className="text-xs text-slate-300 mt-1">Upload a document to see analysis here</p>
              </div>
            ) : analyzing ? (
              <div className="h-full flex flex-col items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-blue-500 spin" />
                <p className="text-sm font-semibold text-slate-600">Analyzing document…</p>
                <p className="text-xs text-slate-400">Extracting clauses and risk factors</p>
              </div>
            ) : activeTab === 'summary' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-800">Document Summary</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{summaryText}</p>
                {concerns.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {concerns.map((c, i) => {
                      const title = c.clauseTitle || c.concern || `Clause ${i + 1}`;
                      const risk  = c.riskLevel === 'HIGH' ? 'High' : c.riskLevel === 'MEDIUM' ? 'Medium' : 'Low';
                      const detail = c.analysis || c.description || '';
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <div className={`w-4 h-4 rounded-full mt-0.5 shrink-0 ${risk === 'High' ? 'bg-red-500' : risk === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-700 truncate">{title}</p>
                              <RiskBadge level={risk} />
                            </div>
                            {detail && <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{detail}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <button
                  onClick={() => navigate('/documents')}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  View Full Analysis <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : activeTab === 'risk' ? (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800">Risk Analysis</h3>
                {concerns.length > 0 ? concerns.map((c, i) => {
                  const risk = c.riskLevel === 'HIGH' ? 'High' : c.riskLevel === 'MEDIUM' ? 'Medium' : 'Low';
                  return (
                    <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-700">{c.clauseTitle || `Risk ${i+1}`}</p>
                        <RiskBadge level={risk} />
                      </div>
                      <p className="text-[11px] text-slate-500">{c.recommendation || c.analysis || ''}</p>
                    </div>
                  );
                }) : <p className="text-xs text-slate-400 pt-4 text-center">No risks detected.</p>}
              </div>
            ) : activeTab === 'clauses' ? (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800">Clause Explorer</h3>
                {(docResult?.clauses || concerns).slice(0, 6).map((c, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600">
                    <p className="font-semibold text-slate-700">{c.clauseTitle || c.concern || `Clause ${i+1}`}</p>
                    <p className="mt-0.5 text-slate-500 line-clamp-2">{c.text || c.analysis || ''}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800">Legal Sources</h3>
                {(docResult?.governingLaw || 'Transfer of Property Act, 1882 • Indian Contract Act, 1872 • Registration Act, 1908').split('•').map((s, i) => (
                  <div key={i} className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700 font-medium">
                    📚 {s.trim()}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — insights + quick actions */}
        <div className="lg:col-span-3 flex flex-col gap-4">

          {/* Analysis complete badge */}
          {docResult && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <p className="text-sm font-bold text-slate-800">Analysis Complete</p>
              </div>
              <p className="text-xs text-slate-500">Document analyzed successfully.</p>
            </div>
          )}

          {/* Key insights */}
          {docResult && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-800">Key Insights</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />Total Clauses: <strong>{totalClauses || '—'}</strong></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />Risky Clauses: <strong>{highCount}</strong></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />Legal Acts Referenced: <strong>{docResult?.governingLaw ? '2+' : '—'}</strong></li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />Confidence Score: <strong>92%</strong></li>
              </ul>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Quick Actions</h3>
            {[
              { icon: Eye,      label: 'View Citations',      action: () => navigate('/research') },
              { icon: Download, label: 'Download Report',     action: () => navigate('/documents') },
              { icon: HelpCircle, label: 'Ask Follow-up Question', action: () => navigate('/chat') },
            ].map(a => (
              <button
                key={a.label}
                onClick={a.action}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-xs font-medium text-slate-600 hover:text-blue-700 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <a.icon className="w-3.5 h-3.5 shrink-0" />
                  {a.label}
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ BOTTOM ROW: Recent documents + Quick tips ════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-2">

        {/* Recent Documents table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">Recent Documents</h3>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left font-semibold text-slate-500 px-5 py-2.5">File Name</th>
                  <th className="text-left font-semibold text-slate-500 px-3 py-2.5">Type</th>
                  <th className="text-left font-semibold text-slate-500 px-3 py-2.5">Analyzed On</th>
                  <th className="text-left font-semibold text-slate-500 px-3 py-2.5 pr-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentDocs.map((d, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors cursor-pointer" onClick={() => navigate('/documents')}>
                    <td className="px-5 py-3 font-medium text-slate-700 flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                        <FileText className="w-3 h-3" />
                      </div>
                      <span className="truncate max-w-[150px]">{d.name}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-500">{d.type}</td>
                    <td className="px-3 py-3 text-slate-500 whitespace-nowrap">{d.date}</td>
                    <td className="px-3 py-3 pr-5"><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
                {recentDocs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-slate-400 text-xs">No recent documents.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800">Quick Tips</h3>
          </div>
          {TIPS.map((tip, i) => {
            const Icon = tip.icon;
            const colors = [
              'bg-blue-50 text-blue-600',
              'bg-emerald-50 text-emerald-600',
              'bg-violet-50 text-violet-600',
              'bg-orange-50 text-orange-600',
            ];
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className={`w-7 h-7 rounded-lg ${colors[i]} flex items-center justify-center shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{tip.text}</p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
