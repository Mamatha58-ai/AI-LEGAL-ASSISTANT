import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, ExternalLink, X, Save, Trash2 } from 'lucide-react';
import { getStoredApiKey, saveApiKey } from '../services/legalAiEngine';

export default function ApiKeyModal({ isOpen, onClose, onSaved }) {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveApiKey(apiKey);
    onSaved();
    onClose();
  };

  const handleClear = () => {
    saveApiKey('');
    setApiKey('');
    onSaved();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '8px', background: 'rgba(212, 175, 55, 0.15)', borderRadius: '8px', color: 'var(--accent-gold)' }}>
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Configure Gemini AI API Key</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enable live cloud AI legal reasoning</p>
            </div>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
          By default, LexisAI includes a built-in offline Legal NLP Engine. To power analysis with <strong>Google Gemini AI</strong>, enter your Gemini API Key below. Your key is stored securely in your local browser storage.
        </p>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-gold)', display: 'block', marginBottom: '0.4rem' }}>
            GEMINI API KEY:
          </label>
          <input
            type="password"
            className="chat-input"
            style={{ width: '100%' }}
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>
          <ShieldCheck size={16} />
          <span>Need an API key? Get one free at Google AI Studio.</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {getStoredApiKey() && (
            <button className="btn-secondary" style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.3)' }} onClick={handleClear}>
              <Trash2 size={15} /> Remove Key
            </button>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>
              <Save size={16} /> Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
