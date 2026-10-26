import React, { useState, useRef, useEffect } from 'react';
import { FileText, Search, UploadCloud, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export default function DocumentViewer({
  docData,
  docText,
  fileName,
  onFileUpload,
  highlightQuote
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const docContainerRef = useRef(null);

  // Scroll to citation quote when clicked from chat or red flags
  useEffect(() => {
    if (highlightQuote && docContainerRef.current) {
      setSearchTerm(highlightQuote.slice(0, 30)); // Set partial search term to trigger highlight
      const elements = docContainerRef.current.querySelectorAll('.doc-line');
      for (const el of elements) {
        if (el.textContent.toLowerCase().includes(highlightQuote.toLowerCase().slice(0, 25))) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
        }
      }
    }
  }, [highlightQuote]);

  if (!docText) {
    return (
      <div className="glass-panel document-pane">
        <div className="pane-header">
          <div className="pane-title">
            <FileText size={18} color="var(--accent-gold)" />
            Document Reader & Inspector
          </div>
        </div>

        <div className="dropzone-container" onClick={onFileUpload}>
          <div className="dropzone-icon">
            <UploadCloud size={36} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>
            Upload Legal Document or Contract
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', marginBottom: '1.5rem' }}>
            Drag and drop your PDF, DOCX, or TXT file here, or select a sample contract from the top navigation bar.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} color="var(--accent-emerald)" /> PDF / Word Parsing
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldAlert size={14} color="var(--accent-gold)" /> Risk Detection
            </span>
          </div>
        </div>
      </div>
    );
  }

  const lines = docText.split('\n');

  return (
    <div className="glass-panel document-pane">
      <div className="pane-header">
        <div className="pane-title">
          <FileText size={18} color="var(--accent-gold)" />
          <span style={{ maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {fileName || "Active Legal Document"}
          </span>
          <span className="doc-meta-badge">
            {lines.length} Lines
          </span>
        </div>

        <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={onFileUpload}>
          Change File
        </button>
      </div>

      {/* Search Bar */}
      <div className="doc-search-bar">
        <Search size={16} color="var(--text-muted)" style={{ marginTop: '6px' }} />
        <input
          type="text"
          className="doc-search-input"
          placeholder="Search clause, section, or term..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
            onClick={() => setSearchTerm('')}
          >
            Clear
          </button>
        )}
      </div>

      {/* Document Body View */}
      <div className="doc-body" ref={docContainerRef}>
        {lines.map((line, idx) => {
          const isSearchMatch = searchTerm && line.toLowerCase().includes(searchTerm.toLowerCase());
          
          let highlightClass = "";
          if (isSearchMatch) {
            highlightClass = "highlight-search";
          } else if (docData?.redFlags) {
            const matchedFlag = docData.redFlags.find(rf => rf.clauseQuote && line.toLowerCase().includes(rf.clauseQuote.toLowerCase().slice(0, 20)));
            if (matchedFlag) {
              highlightClass = matchedFlag.severity === 'HIGH' ? "highlight-high" : "highlight-medium";
            }
          }

          return (
            <div key={idx} className={`doc-line ${highlightClass}`}>
              <span style={{ display: 'inline-block', width: '36px', color: 'var(--text-muted)', userSelect: 'none', fontSize: '0.75rem' }}>
                {(idx + 1).toString().padStart(3, ' ')}
              </span>
              <span>{line || ' '}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
