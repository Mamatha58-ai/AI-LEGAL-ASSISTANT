import React from 'react';
import { Languages, Globe, Check } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

export default function LanguageSwitcher({ variant = 'tabs', className = '' }) {
  const { language, setLanguage } = useLanguage();

  if (variant === 'pills') {
    return (
      <div className={`flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 ${className}`}>
        {LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>{lang.nativeLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${className}`}>
        {LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/40 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{lang.flag}</span>
                {isActive && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold shadow-sm">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{lang.nativeLabel}</p>
                <p className="text-xs text-slate-500">{lang.label}</p>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Default: Elegant Segmented Tabs
  return (
    <div className={`inline-flex items-center bg-slate-100/90 border border-slate-200/80 p-1 rounded-xl shadow-inner ${className}`}>
      <div className="flex items-center pl-2 pr-1.5 text-slate-400 hidden sm:flex">
        <Languages className="w-3.5 h-3.5" />
      </div>
      <div className="flex items-center gap-1">
        {LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`relative px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 select-none flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
              title={`Switch language to ${lang.label}`}
            >
              <span className="text-xs">{lang.flag}</span>
              <span>{lang.nativeLabel}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 hidden md:inline-block"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
