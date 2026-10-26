import React, { useState, useRef, useCallback } from 'react';
import {
  Home,
  Coins,
  Car,
  Landmark,
  UploadCloud,
  FileText,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Tag,
  BookOpen,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import api from '../services/api';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useLanguage } from '../context/LanguageContext';

// ── Domain definitions ────────────────────────────────────────────────
const DOMAINS = [
  {
    id: 'house',
    icon: Home,
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-50',
    borderColor: 'border-emerald-400',
    textColor: 'text-emerald-700',
    label: { en: 'House / Property', hi: 'मकान / संपत्ति', te: 'ఇల్లు / ఆస్తి', ta: 'வீடு / சொத்து' },
    desc: {
      en: 'Rental agreements, sale deeds, lease, encumbrance certificate',
      hi: 'किराया समझौता, बिक्री पत्र, पट्टा, भार प्रमाण पत्र',
      te: 'అద్దె ఒప్పందం, అమ్మకం పత్రం, లీజు, EC సర్టిఫికేట్',
      ta: 'வாடகை ஒப்பந்தம், விற்பனை பத்திரம், குத்தகை, EC சான்றிதழ்'
    },
    sampleQuestion: {
      en: 'Summarize this house document and list the key terms and my rights.',
      hi: 'इस मकान के दस्तावेज़ का सारांश दें और मेरे अधिकार बताएं।',
      te: 'ఈ ఇంటి పత్రాన్ని సంగ్రహించి ముఖ్యమైన నిబంధనలు చెప్పండి.',
      ta: 'இந்த வீட்டு ஆவணத்தை சுருக்கி முக்கிய விதிமுறைகளை பட்டியலிடுங்கள்.'
    }
  },
  {
    id: 'gold',
    icon: Coins,
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-700',
    label: { en: 'Gold Loan', hi: 'गोल्ड लोन', te: 'గోల్డ్ లోన్', ta: 'தங்கக் கடன்' },
    desc: {
      en: 'Gold pledge, LTV ratio, auction notice, interest terms',
      hi: 'सोने का बंधक, LTV अनुपात, नीलामी नोटिस, ब्याज शर्तें',
      te: 'బంగారు తాకట్టు, LTV నిష్పత్తి, వేలం నోటీసు, వడ్డీ నిబంధనలు',
      ta: 'தங்க அடமானம், LTV விகிதம், ஏல நோட்டீஸ், வட்டி விதிமுறைகள்'
    },
    sampleQuestion: {
      en: 'Summarize this gold loan document and explain my repayment terms and auction rights.',
      hi: 'इस गोल्ड लोन दस्तावेज़ का सारांश दें और नीलामी के नियम समझाएं।',
      te: 'ఈ గోల్డ్ లోన్ పత్రాన్ని సంగ్రహించి చెల్లింపు నిబంధనలు వివరించండి.',
      ta: 'இந்த தங்கக் கடன் ஆவணத்தை சுருக்கி திருப்பிச் செலுத்தும் விதிமுறைகளை விளக்குங்கள்.'
    }
  },
  {
    id: 'vehicle',
    icon: Car,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-700',
    label: { en: 'Vehicle / Car', hi: 'वाहन / कार', te: 'వాహనం / కారు', ta: 'வாகனம் / கார்' },
    desc: {
      en: 'Sale agreement, RC transfer, hypothecation, insurance',
      hi: 'बिक्री समझौता, RC ट्रांसफर, हाइपोथीकेशन, बीमा',
      te: 'అమ్మకం ఒప్పందం, RC బదిలీ, హైపోథికేషన్, బీమా',
      ta: 'விற்பனை ஒப்பந்தம், RC மாற்றம், அடமானம், காப்பீடு'
    },
    sampleQuestion: {
      en: 'Summarize this vehicle document and list key obligations for the buyer and seller.',
      hi: 'इस वाहन दस्तावेज़ का सारांश दें और खरीदार-विक्रेता की जिम्मेदारियां बताएं।',
      te: 'ఈ వాహన పత్రాన్ని సంగ్రహించి కొనుగోలుదారు బాధ్యతలు చెప్పండి.',
      ta: 'இந்த வாகன ஆவணத்தை சுருக்கி வாங்குபவர் மற்றும் விற்பவரின் கடமைகளை பட்டியலிடுங்கள்.'
    }
  },
  {
    id: 'bank',
    icon: Landmark,
    color: 'bg-violet-500',
    lightColor: 'bg-violet-50',
    borderColor: 'border-violet-400',
    textColor: 'text-violet-700',
    label: { en: 'Bank / Finance', hi: 'बैंक / वित्त', te: 'బ్యాంకు / ఫైనాన్స్', ta: 'வங்கி / நிதி' },
    desc: {
      en: 'Loan sanction, EMI schedule, SARFAESI notice, mortgage deed',
      hi: 'ऋण मंजूरी, EMI अनुसूची, SARFAESI नोटिस, बंधक पत्र',
      te: 'లోన్ మంజూరీ, EMI షెడ్యూల్, SARFAESI నోటీసు, మోర్గేజ్ పత్రం',
      ta: 'கடன் அனுமதி, EMI அட்டவணை, SARFAESI நோட்டீஸ், அடமான பத்திரம்'
    },
    sampleQuestion: {
      en: 'Summarize this bank loan document and explain EMI, default clauses, and my rights.',
      hi: 'इस बैंक लोन दस्तावेज़ का सारांश दें और EMI, डिफ़ॉल्ट नियम समझाएं।',
      te: 'ఈ బ్యాంకు లోన్ పత్రాన్ని సంగ్రహించి EMI మరియు డిఫాల్ట్ నిబంధనలు వివరించండి.',
      ta: 'இந்த வங்கிக் கடன் ஆவணத்தை சுருக்கி EMI மற்றும் இயல்புநிலை விதிமுறைகளை விளக்குங்கள்.'
    }
  }
];

// ── Key term badge colours ─────────────────────────────────────────────
const TERM_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-violet-100 text-violet-800 border-violet-200',
  'bg-rose-100 text-rose-800 border-rose-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-teal-100 text-teal-800 border-teal-200',
];

// ── Helpers ───────────────────────────────────────────────────────────
function extractKeyTerms(text) {
  if (!text) return [];
  // Pull out capitalised phrases, currency amounts, section refs, and percentages
  const patterns = [
    /(?:Section|Clause|Article)\s+[\d\w.-]+/gi,
    /(?:Rs\.?|INR|₹)\s?[\d,]+(?:\/-)?/g,
    /\d+(?:\.\d+)?%/g,
    /(?:[A-Z][A-Z\s]{2,30}(?:ACT|CODE|RULE|DEED|AGREEMENT|NOTICE|LOAN|EMI|LTV|NOC|RC|EC|NPA|SARFAESI|MODT|CERSAI|KYC|ROI|MACT|GST|TDS))/g,
    /\b(?:SARFAESI|CERSAI|MODT|hypothecation|encumbrance|foreclosure|subrogation|indemnity|arbitration|lien|pledge|mortgage|collateral|guarantor|surety|tenure|escalation|forfeiture|liquidated damages)\b/gi,
  ];
  const found = new Set();
  patterns.forEach(p => {
    const matches = text.match(p) || [];
    matches.forEach(m => {
      const clean = m.trim();
      if (clean.length > 2 && clean.length < 60) found.add(clean);
    });
  });
  return [...found].slice(0, 20);
}

function splitBullets(text) {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map(l => l.replace(/^[-•*>]\s*/, '').replace(/^\d+\.\s*/, '').trim())
    .filter(l => l.length > 5);
}

// ── Component ─────────────────────────────────────────────────────────
export default function SimpleLegalAssistantPage() {
  const { language } = useLanguage();
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);   // { summary, keyTerms, concerns, rights }
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAllTerms, setShowAllTerms] = useState(false);
  const fileInputRef = useRef(null);

  const { speak, stopSpeaking, isSpeaking, toggleListening, isListening, transcript } = useVoiceAssistant({
    onTranscript: (t) => setQuestion(prev => prev ? `${prev} ${t}` : t)
  });

  // Keep question in sync with interim voice transcript
  React.useEffect(() => {
    if (isListening && transcript) setQuestion(transcript);
  }, [transcript, isListening]);

  const domain = DOMAINS.find(d => d.id === selectedDomain);
  const lang = language || 'en';

  // ── Submit ────────────────────────────────────────────────────────
  const handleAnalyze = useCallback(async () => {
    if (!selectedDomain) { setErrorMsg('Please select a document type first.'); return; }
    if (!file && !question.trim()) { setErrorMsg('Please upload a document or type a question.'); return; }

    setLoading(true);
    setErrorMsg(null);
    setResult(null);
    stopSpeaking();

    try {
      let rawAnswer = '';

      if (file) {
        // Upload + analyze path
        const formData = new FormData();
        formData.append('document', file);
        formData.append('language', lang);
        formData.append('domain', selectedDomain);
        formData.append('simplify', 'true');

        const uploadRes = await api.post('/documents/upload', formData);

        if (uploadRes.data.success) {
          const doc = uploadRes.data.document;
          // Build readable summary from document response
          rawAnswer = doc.summary || doc.executiveSummary || '';
          const termsFromDoc = extractKeyTerms(doc.rawText || rawAnswer);

          setResult({
            summary: rawAnswer,
            keyTerms: termsFromDoc.length ? termsFromDoc : extractKeyTerms(rawAnswer),
            concerns: doc.concerns?.slice(0, 5) || [],
            parties: doc.parties || null,
            financialTerms: doc.financialTerms || null,
          });
          return;
        }
      }

      // Text Q&A path (no file, or file upload fell through)
      const q = question.trim() || (domain?.sampleQuestion?.[lang] ?? domain?.sampleQuestion?.en ?? '');
      const chatRes = await api.post('/chat', {
        message: `[DOMAIN: ${selectedDomain.toUpperCase()} DOCUMENT] ${q} — Please respond in simple, easy-to-understand language. Provide: 1) A plain-language summary. 2) A bullet list of KEY TERMS found. 3) Important rights and obligations for the user.`,
        language: lang
      });

      if (chatRes.data.success) {
        rawAnswer = chatRes.data.answer || '';
        setResult({
          summary: rawAnswer,
          keyTerms: extractKeyTerms(rawAnswer),
          concerns: [],
          parties: null,
          financialTerms: null,
        });
      } else {
        setErrorMsg('Could not get a response. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedDomain, file, question, lang, domain, stopSpeaking]);

  // ── File drag-drop ────────────────────────────────────────────────
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); setErrorMsg(null); }
  };

  const handleFileChange = (e) => {
    const picked = e.target.files[0];
    if (picked) { setFile(picked); setErrorMsg(null); }
  };

  const handleReset = () => {
    setResult(null);
    setFile(null);
    setQuestion('');
    setErrorMsg(null);
    setShowAllTerms(false);
    stopSpeaking();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Voice read-aloud summary ──────────────────────────────────────
  const handleSpeak = () => {
    if (isSpeaking) { stopSpeaking(); return; }
    if (result?.summary) speak(result.summary);
  };

  // ── Labels by language ────────────────────────────────────────────
  const L = {
    title:        { en: 'Legal Document Assistant', hi: 'कानूनी दस्तावेज़ सहायक', te: 'చట్టపరమైన పత్రాల సహాయకుడు', ta: 'சட்ட ஆவண உதவியாளர்' },
    subtitle:     { en: 'Upload or describe your document. Get a plain-language summary, key terms, and important points — instantly.', hi: 'अपना दस्तावेज़ अपलोड करें या प्रश्न पूछें। आसान भाषा में सारांश और मुख्य जानकारी पाएं।', te: 'పత్రాన్ని అప్‌లోడ్ చేయండి లేదా ప్రశ్న అడగండి. సులభమైన భాషలో సారాంశం పొందండి.', ta: 'ஆவணத்தை பதிவேற்றவும் அல்லது கேள்வி கேளுங்கள். எளிமையான மொழியில் சுருக்கம் பெறுங்கள்.' },
    step1:        { en: 'Step 1 — Select document type', hi: 'चरण 1 — दस्तावेज़ का प्रकार चुनें', te: 'దశ 1 — పత్రం రకాన్ని ఎంచుకోండి', ta: 'படி 1 — ஆவண வகையை தேர்ந்தெடுக்கவும்' },
    step2:        { en: 'Step 2 — Upload document or ask a question', hi: 'चरण 2 — दस्तावेज़ अपलोड करें या प्रश्न पूछें', te: 'దశ 2 — పత్రం అప్‌లోడ్ చేయండి లేదా ప్రశ్న అడగండి', ta: 'படி 2 — ஆவணத்தை பதிவேற்றவும் அல்லது கேள்வி கேளுங்கள்' },
    dropHere:     { en: 'Click or drag a PDF / Word document here', hi: 'यहाँ PDF / Word दस्तावेज़ क्लिक करें या खींचें', te: 'PDF / Word పత్రాన్ని ఇక్కడ క్లిక్ చేయండి లేదా లాగండి', ta: 'இங்கே PDF / Word ஆவணத்தை கிளிக் செய்யவும் அல்லது இழுக்கவும்' },
    orAsk:        { en: 'Or type / speak your question', hi: 'या अपना प्रश्न टाइप / बोलें', te: 'లేదా మీ ప్రశ్న టైప్ / మాట్లాడండి', ta: 'அல்லது உங்கள் கேள்வியை தட்டச்சு / பேசுங்கள்' },
    analyze:      { en: 'Analyze Document', hi: 'दस्तावेज़ विश्लेषण करें', te: 'పత్రాన్ని విశ్లేషించండి', ta: 'ஆவணத்தை பகுப்பாய்வு செய்யுங்கள்' },
    analyzing:    { en: 'Analyzing…', hi: 'विश्लेषण हो रहा है…', te: 'విశ్లేషిస్తోంది…', ta: 'பகுப்பாய்வு செய்கிறது…' },
    summary:      { en: 'Plain-Language Summary', hi: 'सरल भाषा सारांश', te: 'సులభమైన భాషలో సారాంశం', ta: 'எளிய மொழி சுருக்கம்' },
    keyTerms:     { en: 'Key Terms Found', hi: 'मुख्य शब्द / शर्तें', te: 'ముఖ్యమైన పదాలు / నిబంధనలు', ta: 'முக்கிய சொற்கள் / விதிமுறைகள்' },
    concerns:     { en: 'Important Points to Watch', hi: 'ध्यान देने योग्य महत्वपूर्ण बिंदु', te: 'గమనించవలసిన ముఖ్యమైన అంశాలు', ta: 'கவனிக்க வேண்டிய முக்கியமான அம்சங்கள்' },
    listenBtn:    { en: 'Listen to Summary', hi: 'सारांश सुनें', te: 'సారాంశం వినండి', ta: 'சுருக்கத்தை கேளுங்கள்' },
    stopBtn:      { en: 'Stop', hi: 'रोकें', te: 'ఆపు', ta: 'நிறுத்து' },
    analyzeAnother: { en: 'Analyze Another', hi: 'दूसरा दस्तावेज़ विश्लेषण करें', te: 'మరొక పత్రాన్ని విశ్లేషించండి', ta: 'மற்றொரு ஆவணத்தை பகுப்பாய்வு செய்யுங்கள்' },
    disclaimer:   { en: 'This is general information, not legal advice. Always consult a qualified legal professional for your specific situation.', hi: 'यह सामान्य जानकारी है, कानूनी सलाह नहीं। अपनी विशेष स्थिति के लिए एक योग्य वकील से परामर्श लें।', te: 'ఇది సాధారణ సమాచారం, చట్టపరమైన సలహా కాదు. మీ నిర్దిష్ట పరిస్థితికి అర్హత కలిగిన న్యాయవాదిని సంప్రదించండి.', ta: 'இது பொதுவான தகவல், சட்ட ஆலோசனை அல்ல. உங்கள் குறிப்பிட்ட நிலைமைக்கு தகுதியான வழக்கறிஞரை அணுகுங்கள்.' },
    showMore:     { en: 'Show all terms', hi: 'सभी शर्तें दिखाएं', te: 'అన్ని నిబంధనలు చూపించు', ta: 'அனைத்து விதிமுறைகளையும் காட்டு' },
    showLess:     { en: 'Show less', hi: 'कम दिखाएं', te: 'తక్కువ చూపించు', ta: 'குறைவாக காட்டு' },
    listening:    { en: 'Listening…', hi: 'सुन रहा है…', te: 'వింటోంది…', ta: 'கேட்கிறது…' },
  };

  const lbl = (key) => L[key]?.[lang] || L[key]?.en || key;

  const summaryBullets = splitBullets(result?.summary || '');
  const visibleTerms = showAllTerms ? result?.keyTerms : result?.keyTerms?.slice(0, 10);

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">

      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-700 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-semibold border border-amber-400/20">
            <BookOpen className="w-3.5 h-3.5" />
            AI Legal Assistant
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-serif tracking-tight">
            {lbl('title')}
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            {lbl('subtitle')}
          </p>
        </div>
        <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
          <BookOpen className="w-32 h-32 text-amber-400" />
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>{lbl('disclaimer')}</span>
      </div>

      {!result ? (
        /* ══════════════ INPUT PANEL ══════════════ */
        <div className="space-y-5">

          {/* Step 1 — Domain selector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold shrink-0">1</span>
              {lbl('step1')}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DOMAINS.map((d) => {
                const Icon = d.icon;
                const active = selectedDomain === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDomain(d.id);
                      setErrorMsg(null);
                      if (!question) setQuestion(d.sampleQuestion?.[lang] || d.sampleQuestion?.en || '');
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                      active
                        ? `${d.lightColor} ${d.borderColor} shadow-sm`
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${active ? d.color : 'bg-slate-200'} flex items-center justify-center transition-colors`}>
                      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <p className={`text-xs font-bold leading-tight ${active ? d.textColor : 'text-slate-700'}`}>
                        {d.label[lang] || d.label.en}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block leading-tight">
                        {d.desc[lang] || d.desc.en}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 — Upload + question */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold shrink-0">2</span>
              {lbl('step2')}
            </h2>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-amber-400 bg-amber-50'
                  : file
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-slate-300 hover:border-amber-300 hover:bg-amber-50/30 bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleFileChange}
              />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-emerald-700 truncate max-w-[260px]">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-amber-500' : 'text-slate-400'}`} />
                  <p className="text-sm font-semibold text-slate-700">{lbl('dropHere')}</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, Word, or TXT — up to 15 MB</p>
                </>
              )}
            </div>

            {/* Question input + voice */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 block">{lbl('orAsk')}</label>
              <div className={`flex items-start gap-2 bg-slate-50 border rounded-xl px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-amber-400 ${
                isListening ? 'border-red-400 ring-2 ring-red-200' : 'border-slate-300 focus-within:border-amber-400'
              }`}>
                <textarea
                  rows={2}
                  className="flex-1 bg-transparent text-sm outline-none text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed"
                  placeholder={
                    domain?.sampleQuestion?.[lang] ||
                    (lang === 'hi' ? 'अपना प्रश्न यहाँ लिखें…' :
                     lang === 'te' ? 'మీ ప్రశ్న ఇక్కడ టైప్ చేయండి…' :
                     lang === 'ta' ? 'உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யுங்கள்…' :
                     'e.g. What are my rights in this agreement?')
                  }
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                {/* Voice input button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-all shrink-0 mt-0.5 ${
                    isListening
                      ? 'bg-red-500 text-white ring-2 ring-red-300'
                      : 'bg-slate-200 text-slate-600 hover:bg-amber-100 hover:text-amber-800'
                  }`}
                  title={isListening ? 'Stop listening' : 'Speak your question'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
              {isListening && (
                <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  {lbl('listening')}
                </p>
              )}
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                {errorMsg}
              </div>
            )}

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || (!file && !question.trim()) || !selectedDomain}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-amber-400 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {lbl('analyzing')}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {lbl('analyze')}
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* ══════════════ RESULTS PANEL ══════════════ */
        <div className="space-y-4">

          {/* Domain badge + actions */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            {domain && (
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${domain.lightColor} ${domain.textColor} border ${domain.borderColor} text-xs font-bold`}>
                {React.createElement(domain.icon, { className: 'w-3.5 h-3.5' })}
                {domain.label[lang] || domain.label.en}
              </div>
            )}
            <div className="flex items-center gap-2">
              {/* Voice read-aloud */}
              <button
                onClick={handleSpeak}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isSpeaking
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:text-amber-700'
                }`}
              >
                {isSpeaking ? (
                  <><VolumeX className="w-3.5 h-3.5" /> {lbl('stopBtn')}</>
                ) : (
                  <><Volume2 className="w-3.5 h-3.5" /> {lbl('listenBtn')}</>
                )}
              </button>
              {/* Reset */}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 bg-white hover:border-slate-300 hover:text-slate-900 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {lbl('analyzeAnother')}
              </button>
            </div>
          </div>

          {/* ── Summary card ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-serif">
              <FileText className="w-4 h-4 text-amber-600" />
              {lbl('summary')}
              {isSpeaking && (
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full animate-pulse ml-1">
                  ♪ Playing…
                </span>
              )}
            </h2>

            {summaryBullets.length > 1 ? (
              <ul className="space-y-2.5">
                {summaryBullets.map((line, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{result.summary}</p>
            )}
          </div>

          {/* ── Key Terms ── */}
          {result.keyTerms?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-serif">
                <Tag className="w-4 h-4 text-violet-600" />
                {lbl('keyTerms')}
                <span className="text-[10px] text-slate-400 font-normal ml-1">({result.keyTerms.length} found)</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {visibleTerms.map((term, i) => (
                  <span
                    key={i}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TERM_COLORS[i % TERM_COLORS.length]}`}
                  >
                    {term}
                  </span>
                ))}
              </div>
              {result.keyTerms.length > 10 && (
                <button
                  onClick={() => setShowAllTerms(v => !v)}
                  className="text-xs text-amber-600 font-semibold flex items-center gap-1 hover:underline mt-1"
                >
                  {showAllTerms ? (
                    <><ChevronUp className="w-3.5 h-3.5" />{lbl('showLess')}</>
                  ) : (
                    <><ChevronDown className="w-3.5 h-3.5" />{lbl('showMore')} ({result.keyTerms.length - 10} more)</>
                  )}
                </button>
              )}
            </div>
          )}

          {/* ── Concerns / Important Points ── */}
          {result.concerns?.length > 0 && (
            <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-amber-900 flex items-center gap-2 font-serif">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                {lbl('concerns')}
              </h2>
              <ul className="space-y-2.5">
                {result.concerns.map((concern, i) => {
                  const text = typeof concern === 'string' ? concern : concern.clauseTitle || concern.concern || JSON.stringify(concern);
                  return (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* ── Parties / Financial summary if from doc upload ── */}
          {(result.parties || result.financialTerms) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.parties && (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Parties Involved</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{result.parties}</p>
                </div>
              )}
              {result.financialTerms && (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Financial Terms</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{result.financialTerms}</p>
                </div>
              )}
            </div>
          )}

          {/* Bottom disclaimer */}
          <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500">
            <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{lbl('disclaimer')}</span>
          </div>

        </div>
      )}
    </div>
  );
}
