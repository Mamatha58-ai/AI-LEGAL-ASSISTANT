import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ onMenuToggle }) {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/chat?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6">

      {/* Mobile hamburger */}
      <button
        onClick={onMenuToggle}
        className="md:hidden p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 shrink-0"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400"
            placeholder="Search for laws, cases, or ask a question..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
      </form>

      <div className="flex items-center gap-3 shrink-0 ml-auto">
        {/* Language selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="hidden sm:block text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 outline-none focus:border-blue-400 cursor-pointer"
        >
          <option value="en">🇬🇧 EN</option>
          <option value="hi">🇮🇳 HI</option>
          <option value="te">🇮🇳 TE</option>
          <option value="ta">🇮🇳 TA</option>
        </select>

        {/* Bell */}
        <button className="relative p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User */}
        <button className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white font-bold text-xs flex items-center justify-center shrink-0">
            {user?.name?.slice(0, 2)?.toUpperCase() || 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">Hello, {user?.name?.split(' ')[0] || 'User'}</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
        </button>
      </div>
    </header>
  );
}
