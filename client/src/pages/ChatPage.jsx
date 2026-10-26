import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Send, Plus, Trash2, Copy, Check,
  Bot, User, MessageSquare, Mic, MicOff,
  Volume2, VolumeX, RotateCw, X,
  Home, Car, FileCheck, Coins, Scale
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

// ── Language selector (uses context directly) ─────────────────────────
function LangSelect() {
  const { language, setLanguage } = useLanguage();
  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="hidden sm:block text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-600 outline-none focus:border-blue-400"
    >
      <option value="en">EN</option>
      <option value="hi">हि</option>
      <option value="te">తె</option>
      <option value="ta">த</option>
    </select>
  );
}
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { getLocalizedSource } from '../utils/sourceLocalizer';
import FormattedLegalMessage from '../components/FormattedLegalMessage';

// ── Suggested starter prompts ─────────────────────────────────────────
const STARTERS = [
  { icon: Home,      label: 'Tenant Rights',    prompt: 'What are my rights as a tenant if the landlord does not return my security deposit?' },
  { icon: Car,       label: 'Car Transfer',     prompt: 'What documents are needed to transfer a car ownership in India? Explain Form 29, 30 and RC transfer.' },
  { icon: FileCheck, label: 'Home Loan',        prompt: 'Explain SARFAESI Act notice procedure if I default on a home loan EMI.' },
  { icon: Coins,     label: 'Gold Loan',        prompt: 'What are my rights under RBI rules if the bank wants to auction my gold loan pledge?' },
  { icon: Scale,     label: 'Consumer Rights',  prompt: 'How do I file a consumer complaint under Consumer Protection Act 2019?' },
];

// ── Typing indicator (3 animated dots) ───────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-slate-400 inline-block animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
        />
      ))}
    </div>
  );
}

// ── Format timestamp ──────────────────────────────────────────────────
function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatPage() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { t, language } = useLanguage();

  const [conversations, setConversations]   = useState([]);
  const [activeConvId, setActiveConvId]     = useState(null);
  const [messages, setMessages]             = useState([]);
  const [input, setInput]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const [copiedIdx, setCopiedIdx]           = useState(null);
  const [speakingIdx, setSpeakingIdx]       = useState(null);
  const [sidebarOpen, setSidebarOpen]       = useState(true);

  const messagesEndRef  = useRef(null);
  const inputRef        = useRef(null);
  const prevLangRef     = useRef(language);

  const { isListening, transcript, toggleListening, speak, stopSpeaking, isSpeaking } =
    useVoiceAssistant({
      onTranscript: (text) => setInput(prev => prev ? `${prev} ${text}` : text),
    });

  // sync voice interim text
  useEffect(() => {
    if (isListening && transcript) setInput(transcript);
  }, [transcript, isListening]);

  // auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // load on mount
  useEffect(() => {
    fetchConversations();
    if (location.state?.initialPrompt) {
      handleSend(location.state.initialPrompt);
    } else if (location.state?.conversationId) {
      loadConversation(location.state.conversationId);
    }
  }, []);

  // auto-translate on language change
  useEffect(() => {
    if (prevLangRef.current !== language) {
      prevLangRef.current = language;
      if (messages.length > 0) translateConversation(language);
    }
  }, [language]);

  // ── API calls ─────────────────────────────────────────────────────
  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      if (res.data.success) setConversations(res.data.conversations);
    } catch {}
  };

  const loadConversation = async (id) => {
    try {
      setActiveConvId(id);
      const res = await api.get(`/chat/conversations/${id}`);
      if (res.data.success) setMessages(res.data.conversation.messages || []);
    } catch {}
  };

  const handleNewChat = () => {
    stopSpeaking();
    setActiveConvId(null);
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
  };

  const handleDeleteChat = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/conversations/${id}`);
      if (activeConvId === id) handleNewChat();
      fetchConversations();
    } catch {}
  };

  const handleSend = async (customPrompt) => {
    const q = (customPrompt ?? input).trim();
    if (!q || loading) return;
    stopSpeaking();

    setMessages(prev => [...prev, { role: 'user', content: q, timestamp: new Date() }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: q, conversationId: activeConvId, language });
      if (res.data.success) {
        setActiveConvId(res.data.conversationId);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: res.data.answer,
          sources: res.data.sources,
          timestamp: new Date(),
        }]);
        fetchConversations();
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Something went wrong. Please check your connection and try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const translateConversation = async (targetLang) => {
    try {
      const res = await api.post('/chat/translate-conversation', {
        messages, targetLanguage: targetLang, conversationId: activeConvId,
      });
      if (res.data.success && res.data.messages) setMessages(res.data.messages);
    } catch {}
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSpeak = (text, idx) => {
    if (speakingIdx === idx && isSpeaking) { stopSpeaking(); setSpeakingIdx(null); }
    else { setSpeakingIdx(idx); speak(text); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-64px)] -m-4 md:-m-6 overflow-hidden">

      {/* ══ LEFT SIDEBAR — conversation history ══════════════════════ */}
      <div className={`${sidebarOpen ? 'w-60' : 'w-0'} shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden transition-all duration-200 hidden lg:flex`}>
        <div className="p-3 border-b border-slate-100 shrink-0">
          <button
            onClick={handleNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-2">
            Recent Chats
          </p>
          {conversations.length === 0 ? (
            <p className="text-xs text-slate-400 px-3 py-2 italic">No conversations yet</p>
          ) : (
            conversations.map(c => (
              <div
                key={c._id}
                onClick={() => loadConversation(c._id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                  activeConvId === c._id
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{c.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(c._id, e)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 rounded shrink-0 ml-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ══ MAIN CHAT AREA ═══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-hidden">

        {/* Top bar */}
        <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-none">LexAI Legal Assistant</p>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Online · Indian Law
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Language selector */}
            <LangSelect />
            <button
              onClick={handleNewChat}
              className="text-xs text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>
        </div>

        {/* ── Messages area ── */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.length === 0 ? (
            /* Empty state — welcome screen */
            <div className="max-w-2xl mx-auto space-y-8 pt-4">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">How can I help you today?</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Ask me anything about Indian law — tenant rights, vehicle documents, loans, consumer protection, and more.
                </p>
              </div>

              {/* Starter prompt cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {STARTERS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.label}
                      onClick={() => handleSend(s.prompt)}
                      className="group text-left p-4 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md rounded-xl transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-xs font-bold text-slate-700 mb-1">{s.label}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{s.prompt}</p>
                    </button>
                  );
                })}
              </div>

              <p className="text-center text-[11px] text-slate-400">
                ⚖️ Answers are grounded in Indian law — BNS 2023, Constitution, and Supreme Court precedents.
              </p>
            </div>
          ) : (
            /* Message bubbles */
            <>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} max-w-3xl ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'} w-full`}>

                  {/* AI avatar */}
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className="flex flex-col gap-1 max-w-[85%]">
                    {/* Bubble */}
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <FormattedLegalMessage content={msg.content} language={language} />
                      )}
                    </div>

                    {/* Timestamp + actions */}
                    <div className={`flex items-center gap-2 px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] text-slate-400">{formatTime(msg.timestamp)}</span>

                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1">
                          {/* Listen */}
                          <button
                            onClick={() => handleSpeak(msg.content, idx)}
                            className={`p-1 rounded-md text-slate-400 hover:text-blue-600 transition-colors ${speakingIdx === idx && isSpeaking ? 'text-blue-600' : ''}`}
                            title="Read aloud"
                          >
                            {speakingIdx === idx && isSpeaking
                              ? <VolumeX className="w-3.5 h-3.5" />
                              : <Volume2 className="w-3.5 h-3.5" />}
                          </button>
                          {/* Copy */}
                          <button
                            onClick={() => handleCopy(msg.content, idx)}
                            className="p-1 rounded-md text-slate-400 hover:text-blue-600 transition-colors"
                            title="Copy response"
                          >
                            {copiedIdx === idx
                              ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                              : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Sources */}
                    {msg.role === 'assistant' && msg.sources?.length > 0 && (
                      <div className="mt-1 space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Sources</p>
                        {msg.sources.slice(0, 3).map((src, si) => {
                          const loc = getLocalizedSource(src, language);
                          return (
                            <div key={si} className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 text-xs">
                              <p className="font-semibold text-blue-800 truncate">📜 {loc.title}</p>
                              <p className="text-blue-600 text-[10px] mt-0.5 truncate">{loc.act}</p>
                              {loc.text && <p className="text-slate-500 mt-1 line-clamp-2 text-[11px]">{loc.text}</p>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* User avatar */}
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-3 justify-start max-w-3xl w-full">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <TypingDots />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input bar ── */}
        <div className="bg-white border-t border-slate-200 px-4 py-3 shrink-0">
          {/* Disclaimer */}
          <p className="text-[10px] text-slate-400 text-center mb-2">
            LexAI provides general legal information, not professional legal advice. Always consult a qualified lawyer.
          </p>

          <div className={`flex items-end gap-2 bg-slate-50 border rounded-2xl px-4 py-3 transition-all ${
            isListening ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100'
          }`}>
            <textarea
              ref={inputRef}
              rows={1}
              className="flex-1 bg-transparent text-sm outline-none text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed max-h-32 overflow-y-auto"
              placeholder={
                isListening ? '🎤 Listening...' :
                language === 'hi' ? 'कानूनी प्रश्न पूछें...' :
                language === 'te' ? 'చట్టపరమైన ప్రశ్న అడగండి...' :
                language === 'ta' ? 'சட்ட கேள்வி கேளுங்கள்...' :
                'Ask a legal question...'
              }
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // auto-resize
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
              onKeyDown={handleKeyDown}
            />

            <div className="flex items-center gap-2 shrink-0">
              {/* Voice button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-red-500 text-white ring-2 ring-red-200'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title={isListening ? 'Stop listening' : 'Speak your question'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send button */}
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                title="Send message"
              >
                {loading
                  ? <RotateCw className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
