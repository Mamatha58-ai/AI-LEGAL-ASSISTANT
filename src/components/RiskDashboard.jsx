import React from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, FileText, CheckCircle2, ChevronRight, Scale, Info, ArrowUpRight } from 'lucide-react';

export default function RiskDashboard({ docData, onHighlightQuote }) {
  if (!docData) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
        <Scale size={48} color="var(--accent-gold)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
        <h3>No Analysis Data Available</h3>
        <p style={{ fontSize: '0.9rem' }}>Please select or upload a document to perform AI legal analysis.</p>
      </div>
    );
  }

  const { summary, riskScore, riskLevel, riskBreakdown, redFlags, clauses } = docData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Risk Meter Summary Card */}
      <div className="risk-meter-card">
        <div className={`risk-circle ${riskLevel}`} style={{ '--score': riskScore }}>
          <span className="risk-score-num">{riskScore}</span>
          <span className="risk-score-label">RISK SCORE</span>
        </div>

        <div className="risk-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className={`risk-badge ${riskLevel}`}>{riskLevel} RISK ASSESSMENT</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ({redFlags.length} Red Flags Detected)
            </span>
          </div>
          <h2 className="risk-title">{summary.documentType || "Contract Analysis"}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {summary.overview}
          </p>
        </div>
      </div>

      {/* Key Executive Contract Metadata */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={16} /> Executive Contract Metadata
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Key Parties</span>
            <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{summary.parties ? summary.parties.join(' & ') : 'Not Specified'}</strong>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Effective Date</span>
            <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{summary.effectiveDate}</strong>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Jurisdiction</span>
            <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{summary.governingLaw}</strong>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Term Duration</span>
            <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{summary.duration}</strong>
          </div>
        </div>
      </div>

      {/* Critical Red Flags Section */}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
          <AlertTriangle size={18} color="var(--accent-rose)" /> Critical Red Flags & Unfair Clauses
        </h3>

        {redFlags.length === 0 ? (
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--accent-emerald)' }}>
            <ShieldCheck size={32} style={{ marginBottom: '0.5rem' }} />
            <p>No critical predatory clauses or high-risk red flags were detected.</p>
          </div>
        ) : (
          redFlags.map((flag) => (
            <div key={flag.id} className="red-flag-card">
              <div className="flag-header">
                <span className="flag-title">
                  <ShieldAlert size={16} /> {flag.title}
                </span>
                <span className={`risk-badge ${flag.severity}`}>
                  {flag.severity} RISK
                </span>
              </div>

              <div className="flag-quote">
                "{flag.clauseQuote}"
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {flag.explanation}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                <div className="flag-rec">
                  <CheckCircle2 size={15} color="var(--accent-emerald)" style={{ shrink: 0, marginTop: '2px' }} />
                  <span><strong>Recommendation:</strong> {flag.recommendation}</span>
                </div>

                <button
                  className="chat-citation-btn"
                  onClick={() => onHighlightQuote(flag.clauseQuote)}
                >
                  Locate Clause <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Categorized Clause Breakdown */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={16} color="var(--accent-cyan)" /> Categorized Clause Explorer
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {clauses.map((clause) => (
            <div
              key={clause.id}
              style={{
                background: 'var(--bg-card)',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--accent-gold)' }}>
                  {clause.category}: {clause.title}
                </strong>
                <span className={`risk-badge ${clause.riskStatus}`}>
                  {clause.riskStatus}
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {clause.analysis}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
