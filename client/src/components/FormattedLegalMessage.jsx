import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  AlertTriangle, 
  HelpCircle, 
  ShieldAlert, 
  ArrowRight, 
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

/**
 * High-Clarity Visual Legal Formatter & Layperson Signal Box
 * 
 * Specifically designed so that anyone—including laypeople, non-lawyers,
 * or uneducated persons—can immediately identify:
 * 1. 🟢 / 🔴 / 📄 Traffic-Light Status Signal (Is it Allowed? Illegal? Mandatory Paper?)
 * 2. 🗣️ "Everyday Simple Words" 1-line plain takeaway without jargon
 * 3. 📋 Clean, icon-driven action steps (no raw ###, **, or messy markdown dashes)
 */

export default function FormattedLegalMessage({ content, language = 'en' }) {
  if (!content) return null;

  // Detect signal type from content keywords across en, te, hi
  const textLower = content.toLowerCase();

  const isIllegal = 
    textLower.includes('చట్టవిరుద్ధం') || 
    textLower.includes('गैरकानूनी') || 
    textLower.includes('illegal') || 
    textLower.includes('cannot deduct') || 
    textLower.includes('కోత విధించరాదు') ||
    textLower.includes('వర్ధితం') ||
    textLower.includes('prohibited') ||
    textLower.includes('criminal offence') ||
    textLower.includes('క్రిమినల్ నేరం');

  const isMandatoryForm = 
    textLower.includes('ఫారమ్ 29') || 
    textLower.includes('फॉर्म 29') || 
    textLower.includes('form 29') ||
    textLower.includes('ఫారమ్ 30') || 
    textLower.includes('फॉर्म 30') || 
    textLower.includes('form 30') ||
    textLower.includes('ఫారమ్ 35') || 
    textLower.includes('फॉर्म 35') || 
    textLower.includes('form 35') ||
    textLower.includes('ఫారమ్ 16') || 
    textLower.includes('फॉर्म 16') || 
    textLower.includes('form 16');

  // Generate Signal Banner Details
  let signalBadge = null;

  if (textLower.includes('painting') || textLower.includes('పుత') || textLower.includes('రంగుల') || textLower.includes('wear and tear') || textLower.includes('అరుగుదల') || textLower.includes('टूट-फूट')) {
    signalBadge = {
      type: 'danger',
      icon: XCircle,
      title: language === 'te' 
        ? '🔴 పూర్తిగా చట్టవిరుద్ధం — డిపాజిట్ నుండి రంగుల ఖర్చు కోత వేయరాదు!'
        : language === 'hi'
        ? '🔴 पूर्णतः गैरकानूनी — सिक्योरिटी डिपॉजिट से पुताई का पैसा नहीं कट सकता!'
        : '🔴 STRICTLY ILLEGAL — Landlord CANNOT deduct deposit for painting!',
      layperson: language === 'te'
        ? 'సామాన్యుల మాటల్లో: ఇంటి రంగుల ఖర్చు యజమానిదే, మీది కాదు. మీ డిపాజిట్ మొత్తం మీకు తిరిగి ఇవ్వాల్సిందే.'
        : language === 'hi'
        ? 'सरल भाषा में: पुताई और मकान का पुराना होना मकान मालिक का खर्च है। आपका पूरा डिपॉजिट वापस मिलना चाहिए।'
        : 'In Plain Everyday Words: Routine painting and aging are the landlord’s expense, NOT yours. Your deposit must be returned in full.'
    };
  } else if (textLower.includes('form 29') || textLower.includes('ఫారమ్ 29') || textLower.includes('फॉर्म 29')) {
    signalBadge = {
      type: 'document',
      icon: FileText,
      title: language === 'te'
        ? '📄 ఫారమ్ 29 — వాహన అమ్మకందారు తప్పనిసరి నోటీసు (యాక్సిడెంట్ బాధ్యత తప్పించే పత్రం)'
        : language === 'hi'
        ? '📄 फॉर्म 29 — वाहन बिक्री सूचना (भविष्य में किसी चालान/हादसे से बचने का रक्षा कवच)'
        : '📄 Form 29 — Official Seller Notice (Protects you from post-sale accidents/challans)',
      layperson: language === 'te'
        ? 'సామాన్యుల మాటల్లో: కారు అమ్మిన వెంటనే ఈ కాగితంపై సంతకం చేసి RTOకి ఇస్తే, తర్వాత కారుతో ఏ ప్రమాదం జరిగినా మీరు బాధ్యులు కారు.'
        : language === 'hi'
        ? 'सरल भाषा में: गाड़ी बेचते ही इस फॉर्म को RTO में देने से बाद में होने वाले किसी भी चालान या दुर्घटना की जिम्मेदारी आप पर नहीं आएगी।'
        : 'In Plain Everyday Words: Filing Form 29 legally proves you sold the vehicle, so police or courts cannot hold you liable for future incidents.'
    };
  } else if (textLower.includes('form 30') || textLower.includes('ఫారమ్ 30') || textLower.includes('फॉर्म 30')) {
    signalBadge = {
      type: 'alert',
      icon: Clock,
      title: language === 'te'
        ? '📄 ఫారమ్ 30 — RC పేరు మార్పిడి దరఖాస్తు (గడువు: 14 రోజులు)'
        : language === 'hi'
        ? '📄 फॉर्म 30 — आरसी ट्रांसफर आवेदन (समय-सीमा: 14 दिन)'
        : '📄 Form 30 — RC Ownership Transfer Application (Statutory Deadline: 14 Days)',
      layperson: language === 'te'
        ? 'సామాన్యుల మాటల్లో: RC బుక్‌లో కొత్త యజమాని పేరు రావడానికి ఈ దరఖాస్తును 14 రోజుల్లో RTOకి ఇవ్వాలి.'
        : language === 'hi'
        ? 'सरल भाषा में: आरसी (RC) में नए मालिक का नाम चढ़ाने के लिए 14 दिनों के अंदर इसे RTO में जमा करना होगा।'
        : 'In Plain Everyday Words: This is the official form to print the new buyer’s name on the vehicle RC within 14 days.'
    };
  } else if (textLower.includes('form 35') || textLower.includes('ఫారమ్ 35') || textLower.includes('फॉर्म 35')) {
    signalBadge = {
      type: 'success',
      icon: CheckCircle2,
      title: language === 'te'
        ? '🟢 ఫారమ్ 35 — కార్ లోన్ ముగింపు (RC పై బ్యాంక్ పేరు తొలగించే పత్రం)'
        : language === 'hi'
        ? '🟢 फॉर्म 35 — लोन समाप्ति (आरसी से बैंक का नाम हटाकर गाड़ी पूरी तरह अपनी करने का फॉर्म)'
        : '🟢 Form 35 — Vehicle Hypothecation Cancellation (Makes RC 100% Free of Bank Lien)',
      layperson: language === 'te'
        ? 'సామాన్యుల మాటల్లో: లోన్ తీరిపోయిన తర్వాత బ్యాంక్ NOC మరియు ఫారమ్ 35 సమర్పిస్తేనే RC నుండి బ్యాంక్ పేరు తొలగించబడుతుంది.'
        : language === 'hi'
        ? 'सरल भाषा में: गाड़ी की किस्तें पूरी होने पर बैंक से एनओसी और फॉर्म 35 लेकर RTO से बैंक का नाम हटवाएं।'
        : 'In Plain Everyday Words: Loan is finished, but submit Form 35 + NOC to RTO so the car becomes legally 100% yours on papers.'
    };
  } else if (textLower.includes('form 16') || textLower.includes('nil ec') || textLower.includes('నిల్ ec') || textLower.includes('निल ec')) {
    signalBadge = {
      type: 'success',
      icon: CheckCircle2,
      title: language === 'te'
        ? '🟢 ఫారమ్ 16 (Nil EC) — ఆస్తి 100% క్లీన్ (ఎటువంటి బ్యాంక్ లోన్లు లేదా కోర్టు కేసులు లేవు)'
        : language === 'hi'
        ? '🟢 फॉर्म 16 (Nil EC) — संपत्ति 100% साफ (कोई बैंक लोन या अदालती विवाद नहीं)'
        : '🟢 Form 16 (Nil EC) — Property 100% Clean (Zero Registered Debts or Disputes)',
      layperson: language === 'te'
        ? 'సామాన్యుల మాటల్లో: ఈ సర్టిఫికెట్ ఉంటేనే ఇల్లు లేదా స్థలంపై గతంలో ఎవరికీ ఎటువంటి తాకట్టు లేదని నిర్ధారణ అవుతుంది.'
        : language === 'hi'
        ? 'सरल भाषा में: यह सरकारी रसीद साबित करती है कि मकान या जमीन पर पहले से कोई बैंक लोन या लफड़ा नहीं है।'
        : 'In Plain Everyday Words: Confirms the property is totally safe and free from hidden mortgages or legal attachments.'
    };
  } else if (textLower.includes('2 months') || textLower.includes('2 నెలల') || textLower.includes('2 महीने')) {
    signalBadge = {
      type: 'success',
      icon: CheckCircle2,
      title: language === 'te'
        ? '🟢 చట్టబద్ధ నిబంధన: గరిష్టంగా 2 నెలల అద్దె మాత్రమే డిపాజిట్!'
        : language === 'hi'
        ? '🟢 कानूनी नियम: अधिकतम 2 महीने का किराया ही सिक्योरिटी डिपॉजिट!'
        : '🟢 Legal Statutory Rule: Maximum 2 Months Rent as Security Deposit!',
      layperson: language === 'te'
        ? 'సామాన్యుల మాటల్లో: ఇంటి యజమాని నివాసానికి 2 నెలలకు మించి అడ్వాన్స్ అడగడం చట్టవిరుద్ధం.'
        : language === 'hi'
        ? 'सरल भाषा में: मकान मालिक 2 महीने से अधिक का एडवांस डिपॉजिट नहीं मांग सकता।'
        : 'In Plain Everyday Words: Landlord cannot legally demand 5 or 10 months deposit for residential homes.'
    };
  } else if (textLower.includes('cheque bounce') || textLower.includes('చెక్కు బౌన్స్') || textLower.includes('चेक बाउंस') || textLower.includes('138')) {
    signalBadge = {
      type: 'danger',
      icon: ShieldAlert,
      title: language === 'te'
        ? '🔴 నేరపూరిత తప్పు — చెక్కు బౌన్స్ (2 సంవత్సరాల వరకు జైలు శిక్ష)'
        : language === 'hi'
        ? '🔴 आपराधिक जुर्म — चेक बाउंस (2 वर्ष तक की जेल एवं दोगुना जुर्माना)'
        : '🔴 CRIMINAL OFFENCE — Cheque Bounce (Up to 2 Years Jail & Double Fine)',
      layperson: language === 'te'
        ? 'సామాన్యుల మాటల్లో: చెక్కు బౌన్స్ అయితే 30 రోజుల్లో నోటీసు ఇవ్వాలి; 15 రోజుల్లో డబ్బు ఇవ్వకపోతే క్రిమినల్ కేసు అవుతుంది.'
        : language === 'hi'
        ? 'सरल भाषा में: चेक बाउंस होते ही 30 दिन में कानूनी नोटिस भेजें, पैसा न मिलने पर सीधे कोर्ट केस होगा।'
        : 'In Plain Everyday Words: Bank memo gives you right to send 30-day notice; non-payment triggers criminal court trial.'
    };
  }

  // Universal Fallback Signal Badge if none of the specific topics matched
  if (!signalBadge) {
    if (isIllegal) {
      signalBadge = {
        type: 'danger',
        icon: ShieldAlert,
        title: language === 'te'
          ? '🔴 చట్టవిరుద్ధం — చట్ట ప్రకారం ఇది ఆమోదయోగ్యం కాదు'
          : language === 'hi'
          ? '🔴 गैरकानूनी — कानून के तहत यह पूर्णतः वर्जित है'
          : '🔴 ILLEGAL / PROHIBITED — Not legally permissible under Indian law',
        layperson: language === 'te'
          ? 'సామాన్యుల మాటల్లో: చట్టం ప్రకారం దీనికి అనుమతి లేదు, మీరు దీనిపై లీగల్ నోటీసు లేదా ఫిర్యాదు చేయవచ్చు.'
          : language === 'hi'
          ? 'सरल भाषा में: कानून के अनुसार यह गलत है, आप कानूनी नोटिस या शिकायत दर्ज कर सकते हैं।'
          : 'In Plain Everyday Words: This action violates statutory rules. You have the right to challenge it or issue a notice.'
      };
    } else {
      signalBadge = {
        type: 'document',
        icon: FileText,
        title: language === 'te'
          ? '📋 అధికారిక చట్టబద్ధ నిబంధన & మార్గదర్శకం'
          : language === 'hi'
          ? '📋 वैधानिक कानूनी नियम एवं प्रक्रिया'
          : '📋 Statutory Legal Rule & Direct Procedure',
        layperson: language === 'te'
          ? 'సామాన్యుల మాటల్లో: కింద ఇవ్వబడిన నియమాలు మరియు పత్రాలను అనుసరించడం ద్వారా మీ హక్కులను సురక్షితంగా కాపాడుకోవచ్చు.'
          : language === 'hi'
          ? 'सरल भाषा में: नीचे दिए गए नियमों और दस्तावेजों का पालन करके अपने कानूनी अधिकारों को सुरक्षित रखें।'
          : 'In Plain Everyday Words: Follow the numbered steps below to keep your transaction legally safe and protected.'
      };
    }
  }

  // Parse content into structured blocks (paragraphs, lists, tables, tips)
  const renderFormattedMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    let tableRows = [];
    let inTable = false;

    const flushTable = (key) => {
      if (tableRows.length > 0) {
        const header = tableRows[0];
        const rows = tableRows.slice(1);
        elements.push(
          <div key={`table-${key}`} className="my-3 overflow-x-auto border border-slate-200 rounded-lg shadow-2xs">
            <table className="w-full text-xs text-left text-slate-800 divide-y divide-slate-200">
              <thead className="bg-slate-100/80 font-semibold text-slate-700">
                <tr>
                  {header.map((col, cIdx) => (
                    <th key={cIdx} className="px-3 py-2 border-r last:border-r-0 border-slate-200">
                      {col.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-slate-50/50' : ''}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 border-r last:border-r-0 border-slate-100 font-mono text-[11px]">
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushTable(idx);
        return;
      }

      // Check for Markdown Table Rows (| col 1 | col 2 |)
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        // Skip separator row (|---|---|)
        if (/^\|(\s*[-:]+\s*\|)+$/.test(trimmed)) {
          return;
        }
        const cells = trimmed.split('|').slice(1, -1);
        tableRows.push(cells);
        inTable = true;
        return;
      } else if (inTable) {
        flushTable(idx);
      }

      // Tip / Note callout
      if (/^(Tip|Note|గమనిక|सुझाव|सूचना):/i.test(trimmed)) {
        elements.push(
          <div key={idx} className="my-2.5 p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2">
            <span className="font-bold text-amber-700">💡</span>
            <div>
              <span className="font-bold text-amber-900 mr-1.5">{trimmed.split(':')[0]}:</span>
              <span>{trimmed.substring(trimmed.indexOf(':') + 1).replace(/\*\*/g, '').trim()}</span>
            </div>
          </div>
        );
        return;
      }

      // Heading (###, ##, #)
      if (trimmed.startsWith('#')) {
        const headingText = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
        elements.push(
          <h4 key={idx} className="font-bold text-sm text-slate-900 font-serif pt-2 pb-1 border-b border-slate-100">
            {headingText}
          </h4>
        );
        return;
      }

      // Numbered Step (1. 2. 3.)
      const numMatch = trimmed.match(/^(\d+)\.\s*(.+)$/);
      if (numMatch) {
        const stepNum = numMatch[1];
        const stepText = numMatch[2];
        const colonSplit = stepText.match(/^(\*\*[^*]+\*\*|[^—–:-]+)[—–:-]\s*(.+)$/);
        
        elements.push(
          <div key={idx} className="my-1.5 flex items-start gap-2.5 text-xs text-slate-800 leading-relaxed">
            <span className="font-bold text-slate-900 shrink-0 font-mono text-[11px] w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center mt-0.5">
              {stepNum}
            </span>
            <div className="flex-1">
              {colonSplit ? (
                <>
                  <strong className="font-semibold text-slate-950 mr-1">
                    {colonSplit[1].replace(/\*\*/g, '').trim()} —
                  </strong>
                  <span>{colonSplit[2].replace(/\*\*/g, '').trim()}</span>
                </>
              ) : (
                <span>{stepText.replace(/\*\*/g, '')}</span>
              )}
            </div>
          </div>
        );
        return;
      }

      // Bullet Point (- or *)
      if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
        const bulletText = trimmed.replace(/^[-*•]\s*/, '').trim();
        elements.push(
          <div key={idx} className="my-1 flex items-start gap-2 text-xs text-slate-800 leading-relaxed pl-1">
            <span className="text-slate-400 font-bold shrink-0 mt-0.5">•</span>
            <span>{bulletText.replace(/\*\*/g, '')}</span>
          </div>
        );
        return;
      }

      // Regular Paragraph
      elements.push(
        <p key={idx} className="text-xs text-slate-700 leading-relaxed my-1.5">
          {trimmed.replace(/\*\*/g, '')}
        </p>
      );
    });

    flushTable('end');
    return elements;
  };

  return (
    <div className="space-y-3.5">
      {/* 1. Traffic Light Signal Badge (Even an uneducated person immediately understands Allowed / Illegal / Action) */}
      {signalBadge && (
        <div className={`p-3 rounded-xl border flex flex-col gap-2 shadow-xs transition-all ${
          signalBadge.type === 'danger'
            ? 'bg-rose-50 border-rose-300 text-rose-950'
            : signalBadge.type === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : signalBadge.type === 'alert'
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-blue-50 border-blue-300 text-blue-950'
        }`}>
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
            <signalBadge.icon className={`w-4 h-4 shrink-0 ${
              signalBadge.type === 'danger' ? 'text-rose-600' :
              signalBadge.type === 'success' ? 'text-emerald-600' :
              signalBadge.type === 'alert' ? 'text-amber-600' : 'text-blue-600'
            }`} />
            <span>{signalBadge.title}</span>
          </div>

          {/* Layperson / Everyday Plain Words Callout */}
          <div className="bg-white/90 p-2.5 rounded-lg border border-slate-200/80 text-xs flex items-start gap-2 shadow-xs">
            <span className="text-base select-none shrink-0">🗣️</span>
            <div>
              <strong className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                {language === 'te' ? 'సామాన్యుల కోసం సులభమైన వివరణ' : language === 'hi' ? 'सरल भाषा में मुख्य बात' : 'In Everyday Simple Words'}
              </strong>
              <p className="text-slate-800 font-medium text-xs mt-0.5 leading-snug">
                {signalBadge.layperson}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Structured, Clean Content (Numbered steps, tables, tips, zero raw markdown syntax) */}
      <div className="text-slate-800 text-xs md:text-sm">
        {renderFormattedMarkdown(content)}
      </div>
    </div>
  );
}
