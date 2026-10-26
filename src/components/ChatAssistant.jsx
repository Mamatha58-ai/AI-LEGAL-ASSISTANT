import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, VolumeX, Sparkles, Scale, ExternalLink, Bot, User } from 'lucide-react';
import { askLegalQuestion } from '../services/legalAiEngine';
import { voiceService } from '../services/voiceService';

export default function ChatAssistant({
  docData,
  docText,
  onHighlightQuote,
  isRecording,
  onToggleVoice,
  voiceInputText
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello! I am your AI Legal Assistant. Upload a document or select a sample contract, and ask me any legal questions regarding risks, obligations, termination, or indemnification.`,
      citations: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState(null);
  const messagesEndRef = useRef(null);

  // Sync voice input from parent VoiceController
  useEffect(() => {
    if (voiceInputText) {
      setInput(voiceInputText);
    }
  }, [voiceInputText]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (questionText) => {
    const q = (questionText || input).trim();
    if (!q || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askLegalQuestion(q, docData || {}, docText || '');
      
      const assistantMsg = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        citations: response.citations || []
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `An error occurred while answering your question: ${err.message}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextToSpeech = (msgId, text) => {
    if (isSpeakingId === msgId) {
      voiceService.stopSpeaking();
      setIsSpeakingId(null);
    } else {
      setIsSpeakingId(msgId);
      voiceService.speak(text, {
        onEnd: () => setIsSpeakingId(null)
      });
    }
  };

  const suggestedPrompts = docData?.suggestedQuestions || [
    "What are the highest risk clauses in this document?",
    "Can I terminate this agreement early without penalty?",
    "What is the maximum liability cap for damages?",
    "Are there non-compete or non-solicitation restrictions?"
  ];

  return (
    <div className="chat-container">
      {/* Messages Feed */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontWeight: '700', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: msg.sender === 'user' ? '#fff' : 'var(--accent-gold)' }}>
                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                {msg.sender === 'user' ? 'You' : 'LexisAI Counsel'}
              </span>

              {msg.sender === 'assistant' && (
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  onClick={() => handleTextToSpeech(msg.id, msg.text)}
                  title="Read answer out loud"
                >
                  {isSpeakingId === msg.id ? <VolumeX size={15} color="var(--accent-rose)" /> : <Volume2 size={15} />}
                </button>
              )}
            </div>

            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>

            {/* Citations */}
            {msg.citations && msg.citations.length > 0 && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  DOCUMENT CITATIONS & QUOTES:
                </span>
                {msg.citations.map((cite, idx) => (
                  <button
                    key={idx}
                    className="chat-citation-btn"
                    onClick={() => onHighlightQuote(cite.quote)}
                  >
                    <span>Section: {cite.section}</span>
                    <ExternalLink size={12} />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="chat-bubble assistant">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}>
              <Sparkles size={16} className="spin" /> Analyzing contract text and preparing legal counsel...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="quick-prompts">
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', width: '100%', display: 'block' }}>
          SUGGESTED QUICK QUESTIONS:
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button key={idx} className="prompt-chip" onClick={() => handleSend(prompt)}>
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="chat-input-bar">
        <input
          type="text"
          className="chat-input"
          placeholder={isRecording ? "Listening to voice input..." : "Ask any question about this document or legal risks..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />

        {/* Voice Trigger */}
        <button
          className={`voice-btn ${isRecording ? 'recording' : ''}`}
          onClick={onToggleVoice}
          title={isRecording ? "Stop voice listening" : "Speak question hands-free"}
        >
          <Mic size={18} />
        </button>

        {/* Send Button */}
        <button
          className="btn-primary"
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          style={{ padding: '0.6rem 1rem' }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
