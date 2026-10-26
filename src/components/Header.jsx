import React from 'react';
import { Scale, Upload, Key, FileText, Download, Mic, Sparkles } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';

export default function Header({
  activeDocId,
  onSelectSample,
  onUploadClick,
  onOpenApiKeyModal,
  onOpenExportModal,
  isRecording,
  onToggleVoice,
  hasApiKey
}) {
  return (
    <header className="app-header">
      <div className="brand-logo">
        <div className="brand-icon">
          <Scale size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 className="brand-title">LEXIS AI</h1>
            <span className="brand-tag">LEGAL COUNSEL</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Autonomous Document Risk & Analysis Platform
          </p>
        </div>
      </div>

      <div className="header-actions">
        {/* Sample Select */}
        <select
          className="sample-select"
          value={activeDocId || ''}
          onChange={(e) => onSelectSample(e.target.value)}
        >
          <option value="" disabled>Load Sample Contract...</option>
          {SAMPLE_DOCUMENTS.map((doc) => (
            <option key={doc.id} value={doc.id}>
              📄 {doc.title}
            </option>
          ))}
        </select>

        {/* Upload Button */}
        <button className="btn-secondary" onClick={onUploadClick}>
          <Upload size={16} />
          Upload Document
        </button>

        {/* API Key Modal Button */}
        <button 
          className="btn-secondary" 
          onClick={onOpenApiKeyModal}
          style={{ borderColor: hasApiKey ? 'var(--accent-emerald)' : 'var(--border-color)' }}
        >
          <Key size={16} color={hasApiKey ? 'var(--accent-emerald)' : 'currentColor'} />
          {hasApiKey ? 'Gemini Active' : 'API Key'}
        </button>

        {/* Voice Recording Button */}
        <button 
          className={`voice-btn ${isRecording ? 'recording' : ''}`}
          onClick={onToggleVoice}
          title={isRecording ? "Listening to voice commands..." : "Click to speak voice commands"}
        >
          <Mic size={20} />
        </button>

        {/* Export Report */}
        <button className="btn-primary" onClick={onOpenExportModal}>
          <Download size={16} />
          Export Report
        </button>
      </div>
    </header>
  );
}
