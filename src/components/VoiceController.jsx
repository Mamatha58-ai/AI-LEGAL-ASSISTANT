import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, X } from 'lucide-react';

export default function VoiceController({ isRecording, transcript, onClose, onExecuteCommand }) {
  if (!isRecording) return null;

  return (
    <div className="glass-panel gold-glow" style={{
      position: 'fixed',
      bottom: '90px',
      right: '2rem',
      width: '340px',
      padding: '1.25rem',
      zIndex: 900,
      background: 'rgba(11, 17, 32, 0.95)',
      border: '1px solid var(--accent-gold)',
      borderRadius: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}>
          <Mic size={18} className="pulse" />
          <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>VOICE LISTENING ACTIVE</span>
        </div>
        <button
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          onClick={onClose}
        >
          <X size={16} />
        </button>
      </div>

      {/* Waveform Visualizer Animation */}
      <div className="waveform-container" style={{ margin: '1rem 0', justifyContent: 'center' }}>
        <div className="waveform-bar"></div>
        <div className="waveform-bar"></div>
        <div className="waveform-bar"></div>
        <div className="waveform-bar"></div>
        <div className="waveform-bar"></div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.75rem', borderRadius: '6px', minHeight: '38px', fontStyle: transcript ? 'normal' : 'italic' }}>
        {transcript || "Listening... Try saying 'What are the risks?' or 'Analyze document'..."}
      </p>

      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
        Voice Commands: "Analyze", "Show Risks", "Summary", "Clear"
      </div>
    </div>
  );
}
