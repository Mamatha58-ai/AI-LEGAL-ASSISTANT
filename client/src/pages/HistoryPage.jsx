import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, MessageSquare, Trash2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function HistoryPage() {
  const { t } = useLanguage();
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      if (res.data.success) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.warn("Failed to load history:", err.message);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/conversations/${id}`);
      fetchConversations();
    } catch (err) {
      alert("Error deleting conversation");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <h1 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
          <History className="w-5 h-5 text-amber-600" />
          {t('historyTitle')}
        </h1>
        <p className="text-xs text-slate-500">
          {t('historyDesc')}
        </p>
      </div>

      <div className="space-y-3">
        {conversations.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400 text-xs">
            {t('noHistory')}
          </div>
        ) : (
          conversations.map((c) => (
            <div
              key={c._id}
              onClick={() => navigate('/chat', { state: { conversationId: c._id } })}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-amber-400 cursor-pointer flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors font-serif">{c.title}</h3>
                  <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleDelete(c._id, e)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

