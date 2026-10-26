import React from 'react';
import { AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * LegalDisclaimer
 *
 * Props:
 *   text       — override the disclaimer body text (optional)
 *   isHighRisk — use amber "important notice" styling (default: false)
 *   compact    — reduce vertical padding for inline use (default: false)
 */
export default function LegalDisclaimer({ text, isHighRisk = false, compact = false }) {
  const { t, language } = useLanguage();

  // Resolve the display text
  let displayText = t('disclaimerDefault');

  if (text) {
    const lower = text.toLowerCase();
    if (
      lower.includes('not a substitute for advice') ||
      lower.includes('general legal information grounded')
    ) {
      displayText = t('disclaimerDefault');
    } else if (lower.includes('system error notice')) {
      displayText =
        language === 'te'
          ? 'సిస్టమ్ ఎర్రర్ నోటీసు: సర్వర్ నుండి సమాచారాన్ని పొందడంలో అంతరాయం ఏర్పడింది.'
          : language === 'hi'
          ? 'सिस्टम त्रुटि सूचना: सर्वर से जानकारी प्राप्त करने में त्रुटि हुई।'
          : 'System Error Notice: An issue occurred while contacting the legal server.';
    } else if (lower.includes('criminal') || lower.includes('arrest') || lower.includes('urgent')) {
      displayText =
        language === 'te'
          ? 'ముఖ్యమైన గమనిక: అరెస్ట్ లేదా క్రిమినల్ కేసుల్లో వెంటనే అర్హత కలిగిన క్రిమినల్ లాయర్‌ను లేదా జిల్లా లీగల్ సర్వీసెస్ అథారిటీ (DLSA)ని సంప్రదించండి.'
          : language === 'hi'
          ? 'महत्वपूर्ण सूचना: गिरफ्तारी या आपराधिक मामलों में तत्काल किसी आपराधिक अधिवक्ता या जिला कानूनी सेवा प्राधिकरण (DLSA) से संपर्क करें।'
          : text;
    } else {
      displayText = text;
    }
  }

  if (isHighRisk) {
    return (
      <div
        className={`flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 ${
          compact ? 'p-3' : 'p-4'
        }`}
        role="alert"
      >
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold block mb-0.5">{t('disclaimerImportant')}</span>
          <span>{displayText}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 text-slate-600 ${
        compact ? 'p-3' : 'p-4'
      }`}
      role="note"
    >
      <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="text-xs leading-relaxed">
        <span className="font-semibold text-slate-700 block mb-0.5">{t('disclaimerPrefix')}</span>
        <span>{displayText}</span>
      </div>
    </div>
  );
}
