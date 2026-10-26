import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import DocumentViewer from './components/DocumentViewer';
import RiskDashboard from './components/RiskDashboard';
import ChatAssistant from './components/ChatAssistant';
import VoiceController from './components/VoiceController';
import ApiKeyModal from './components/ApiKeyModal';
import ExportReportModal from './components/ExportReportModal';
import { SAMPLE_DOCUMENTS } from './data/sampleDocuments';
import { parseDocument } from './services/documentParser';
import { analyzeLegalDocument, getStoredApiKey } from './services/legalAiEngine';
import { voiceService } from './services/voiceService';
import { ShieldAlert, MessageSquareText, BarChart3, Sparkles } from 'lucide-react';

export default function App() {
  const [activeDocId, setActiveDocId] = useState('mutual-nda');
  const [docText, setDocText] = useState('');
  const [docData, setDocData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [highlightQuote, setHighlightQuote] = useState('');
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'chat'

  // Voice States
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceInputText, setVoiceInputText] = useState('');

  // Modals
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileInputRef = useRef(null);

  // Load default sample contract on launch
  useEffect(() => {
    handleSelectSample('mutual-nda');
    setHasApiKey(!!getStoredApiKey());
  }, []);

  const runAnalysis = async (text, title) => {
    setIsAnalyzing(true);
    try {
      const data = await analyzeLegalDocument(text, title);
      setDocData(data);
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSample = (sampleId) => {
    const sample = SAMPLE_DOCUMENTS.find(d => d.id === sampleId);
    if (sample) {
      setActiveDocId(sampleId);
      setDocText(sample.content);
      setFileName(sample.title);
      setHighlightQuote('');
      runAnalysis(sample.content, sample.title);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await parseDocument(file);
      setActiveDocId('');
      setDocText(parsed.text);
      setFileName(parsed.fileName);
      setHighlightQuote('');
      runAnalysis(parsed.text, parsed.fileName);
    } catch (err) {
      alert(`Error reading file: ${err.message}`);
    }
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      voiceService.stopListening();
      setIsRecording(false);
    } else {
      setVoiceTranscript('');
      setIsRecording(true);

      voiceService.startListening({
        onResult: ({ transcript, isFinal }) => {
          setVoiceTranscript(transcript);

          if (isFinal) {
            setIsRecording(false);
            const cmd = voiceService.parseCommand(transcript);

            if (cmd.type === 'ANALYZE_DOC') {
              runAnalysis(docText, fileName);
              setActiveTab('analytics');
            } else if (cmd.type === 'SHOW_RISKS') {
              setActiveTab('analytics');
            } else if (cmd.type === 'SHOW_SUMMARY') {
              setActiveTab('analytics');
            } else if (cmd.type === 'READ_ALOUD') {
              if (docData?.summary?.overview) {
                voiceService.speak(docData.summary.overview);
              }
            } else if (cmd.type === 'STOP_AUDIO') {
              voiceService.stopSpeaking();
            } else if (cmd.type === 'CLEAR_DOC') {
              setDocText('');
              setDocData(null);
              setFileName('');
            } else {
              // Pass speech to Chat Input
              setVoiceInputText(transcript);
              setActiveTab('chat');
            }
          }
        },
        onError: (err) => {
          console.warn("Voice error:", err);
          setIsRecording(false);
        },
        onEnd: () => {
          setIsRecording(false);
        }
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.docx,.doc,.txt,.md"
        style={{ display: 'none' }}
      />

      {/* App Header */}
      <Header
        activeDocId={activeDocId}
        onSelectSample={handleSelectSample}
        onUploadClick={() => fileInputRef.current?.click()}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isRecording={isRecording}
        onToggleVoice={handleToggleVoice}
        hasApiKey={hasApiKey}
      />

      {/* Main Workspace Layout */}
      <main className="app-container">
        {/* Left Pane: Interactive Document Reader */}
        <DocumentViewer
          docData={docData}
          docText={docText}
          fileName={fileName}
          onFileUpload={() => fileInputRef.current?.click()}
          highlightQuote={highlightQuote}
        />

        {/* Right Pane: AI Risk Analytics & Interactive Q&A Workspace */}
        <div className="glass-panel analytics-pane">
          {/* Navigation Tabs */}
          <div className="tabs-bar">
            <button
              className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 size={16} />
              Risk Dashboard & Red Flags
              {docData?.riskScore !== undefined && (
                <span className={`risk-badge ${docData.riskLevel}`} style={{ marginLeft: '4px', fontSize: '0.65rem' }}>
                  {docData.riskScore}/100
                </span>
              )}
            </button>

            <button
              className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquareText size={16} />
              Interactive Legal Q&A
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="tab-content">
            {isAnalyzing ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--accent-gold)' }}>
                <Sparkles size={40} className="spin" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Performing Deep Legal Analysis...</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Extracting key clauses, checking indemnifications, calculating risk scores, and evaluating liabilities.
                </p>
              </div>
            ) : activeTab === 'analytics' ? (
              <RiskDashboard
                docData={docData}
                onHighlightQuote={(quote) => setHighlightQuote(quote)}
              />
            ) : (
              <ChatAssistant
                docData={docData}
                docText={docText}
                onHighlightQuote={(quote) => setHighlightQuote(quote)}
                isRecording={isRecording}
                onToggleVoice={handleToggleVoice}
                voiceInputText={voiceInputText}
              />
            )}
          </div>
        </div>
      </main>

      {/* Voice Recording Waveform Overlay */}
      <VoiceController
        isRecording={isRecording}
        transcript={voiceTranscript}
        onClose={() => {
          voiceService.stopListening();
          setIsRecording(false);
        }}
      />

      {/* Api Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaved={() => setHasApiKey(!!getStoredApiKey())}
      />

      {/* Export PDF Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        docData={docData}
        fileName={fileName}
      />
    </div>
  );
}
