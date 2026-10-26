import { GoogleGenAI } from '@google/genai';
import { searchKnowledgeBase } from '../rag/vectorStore.js';
import { detectIntent } from './intentDetector.js';

/**
 * Localized disclaimer text for LexAI responses
 */
function getLocalizedDisclaimer(intent, language = 'en') {
  if (language === 'te') {
    if (intent === 'HIGH_RISK_CRIMINAL' || intent === 'COURT_NOTICE') {
      return "ముఖ్యమైన గమనిక: ఇది అత్యవసర లేదా క్రిమినల్ వ్యవహారం. లెక్స్-ఏఐ కేవలం ప్రాథమిక చట్టపరమైన సమాచారాన్ని మాత్రమే అందిస్తుంది. వెంటనే అనుభవజ్ఞుడైన క్రిమినల్ లాయర్‌ను లేదా జిల్లా న్యాయ సేవాధికార సంస్థ (DLSA)ను సంప్రదించండి.";
    }
    return "లెక్స్-ఏఐ (LexAI) భారతీయ చట్టాల ఆధారంగా ప్రాథమిక చట్టపరమైన సమాచారాన్ని అందిస్తుంది. ఇది అర్హత కలిగిన న్యాయవాది లేదా న్యాయ నిపుణుడి సలహాకు ప్రత్యామ్నాయం కాదు.";
  }

  if (language === 'hi') {
    if (intent === 'HIGH_RISK_CRIMINAL' || intent === 'COURT_NOTICE') {
      return "महत्वपूर्ण सूचना: यह आपराधिक या अदालत से संबंधित संवेदनशील मामला है। LexAI केवल प्रारंभिक कानूनी जानकारी प्रदान करता है। कृपया तत्काल किसी योग्य अधिवक्ता या जिला कानूनी सेवा प्राधिकरण (DLSA) से परामर्श लें।";
    }
    return "LexAI भारतीय कानूनों पर आधारित सामान्य कानूनी जानकारी प्रदान करता है। यह किसी योग्य अधिवक्ता या कानूनी विशेषज्ञ की आधिकारिक कानूनी सलाह का विकल्प नहीं है।";
  }

  if (intent === 'HIGH_RISK_CRIMINAL' || intent === 'COURT_NOTICE') {
    return "IMPORTANT: This query involves high-risk or sensitive legal matters (e.g. criminal charges, court summons, or urgent notices). LexAI provides informational guidance only. You should immediately consult a practicing advocate or seek emergency legal aid.";
  }
  return "LexAI provides general legal information grounded in Indian law and is not a substitute for advice from a qualified legal professional or advocate.";
}

/**
 * Executes AI Legal RAG Pipeline
 * @param {string} userQuestion 
 * @param {Array} [conversationHistory] 
 * @param {string} [language='en']
 * @returns {Promise<{ answer: string, sources: Array, disclaimer: string, intent: string }>}
 */
export async function processLegalQuery(userQuestion, conversationHistory = [], language = 'en') {
  const intent = detectIntent(userQuestion);
  const disclaimer = getLocalizedDisclaimer(intent, language);

  // 1. Multilingual RAG Retrieval Step (strictly localized)
  const retrievedSources = await searchKnowledgeBase(userQuestion, 4, language);

  // Format RAG context for prompt in target language
  const contextSnippet = retrievedSources.map((s, i) => `
[${language === 'te' ? 'మూలం' : language === 'hi' ? 'स्रोत' : 'SOURCE'} ${i + 1}]
Title: ${s.title}
Act/Statute: ${s.act} (${s.section || 'General Provision'})
Jurisdiction: ${s.jurisdiction || 'India'}
Text: ${s.text}
`).join('\n\n');

  const langInstruction = language === 'te'
    ? 'CRITICAL MANDATE: You MUST generate the ENTIRE answer in TELUGU language (తెలుగు లిపి). Do NOT include English sentences or paragraphs. Use accurate Telugu legal terms throughout the response.'
    : language === 'hi'
    ? 'CRITICAL MANDATE: You MUST generate the ENTIRE answer in HINDI language (हिन्दी देवनागरी लिपि). Do NOT include English sentences or paragraphs. Use accurate Hindi legal terms throughout the response.'
    : 'Provide the answer in clear, authoritative English.';

  const apiKey = process.env.LLM_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = 'gemini-2.5-flash';

      const systemPrompt = `You are LexAI, a knowledgeable Indian Law AI assistant. Your job is to answer the user's SPECIFIC question directly and accurately.

LANGUAGE: ${langInstruction}

RULES:
1. Answer ONLY what the user asked — do not give generic overviews when a specific question is asked.
2. If the user asks about a specific section, form, term, or procedure — explain ONLY that.
3. If the user asks a follow-up question, answer that follow-up — use the conversation history for context.
4. Use simple, plain language. No unnecessary legal jargon.
5. Structure: short direct answer first, then numbered details if needed.
6. Ground your answer in the retrieved context below when relevant.

RETRIEVED LEGAL CONTEXT (use when relevant):
${contextSnippet || 'No specific context retrieved — use your training on Indian law.'}`;

      // Build multi-turn conversation for Gemini
      const contents = [];

      // Add prior conversation turns for context
      if (conversationHistory && conversationHistory.length > 0) {
        for (const msg of conversationHistory) {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          });
        }
      }

      // Add the current question with system prompt prepended to first user message
      if (contents.length === 0) {
        contents.push({
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nQuestion: ${userQuestion}` }]
        });
      } else {
        contents.push({
          role: 'user',
          parts: [{ text: `[Context reminder: ${systemPrompt.slice(0, 300)}...]\n\nQuestion: ${userQuestion}` }]
        });
      }

      const response = await ai.models.generateContent({ model, contents });

      return {
        answer: response.text || "No legal response generated.",
        sources: retrievedSources,
        disclaimer,
        intent
      };

    } catch (err) {
      console.warn("Gemini API call failed in LLM service, using local grounded reasoning fallback:", err.message);
    }
  }

  // Local Grounded Legal Reasoning Fallback Engine
  const answer = generateLocalLegalResponse(userQuestion, intent, retrievedSources, language);

  return {
    answer,
    sources: retrievedSources,
    disclaimer,
    intent
  };
}

/**
 * Direct specific question answerer for zero-irrelevant-answer policy
 */
function getDirectSpecificAnswer(q, intent, sources, language = 'en') {
  const formatSingleSource = (srcList, lang) => {
    if (!srcList || srcList.length === 0) return '';
    const heading = lang === 'te' ? '### సంబంధిత చట్టబద్ధమైన మూలం:' : lang === 'hi' ? '### संबंधित कानूनी स्रोत:' : '### Relevant Statutory Authority:';
    const s = srcList[0];
    const actPrefix = lang === 'te' ? 'చట్టం/సెక్షన్' : lang === 'hi' ? 'अधिनियम/धारा' : 'Act/Section';
    const snippet = s.text ? s.text.slice(0, 240).replace(/\n/g, ' ') : '';
    return `\n\n${heading}\n#### ${s.title}\n- **${actPrefix}**: ${s.act} (${s.section || (lang === 'te' ? 'సాధారణ' : lang === 'hi' ? 'सामान्य' : 'General')})\n- ${snippet}...`;
  };

  // 1. Painting / Wear and Tear Deductions
  const isPainting = q.includes('paint') || q.includes('రంగు') || q.includes('పుత') || q.includes('पेंट') || q.includes('पुताई') || q.includes('रंगाई') || q.includes('wear and tear') || q.includes('అరుగుదల') || q.includes('टूट-फूट');
  if (isPainting && (q.includes('deduct') || q.includes('cut') || q.includes('deposit') || q.includes('డిపాజిట్') || q.includes('కోత') || q.includes('కట్') || q.includes('कटौती') || q.includes('पैसे') || q.includes('वापसी') || q.includes('రెంట్') || q.includes('rent'))) {
    if (language === 'te') {
      return `### రంగుల (Painting) ఖర్చుల కోత & అద్దెదారు చట్టపరమైన రక్షణ

భారతీయ అద్దె చట్టాలు మరియు **మోడల్ టెనెన్సీ చట్టం (Model Tenancy Act 2021)** ప్రకారం:

- **రంగుల ఖర్చు కోత చట్టవిరుద్ధం**: ఇంటి సాధారణ రంగులు (Routine Painting) లేదా సాధారణ అరుగుదల (Normal Wear and Tear) కోసం యజమాని సెక్యూరిటీ డిపాజిట్ నుండి డబ్బులు కట్ చేయడానికి **చట్టబద్ధమైన అనుమతి లేదు**.
- **యజమాని బాధ్యత**: ఇల్లు కాలానుగుణంగా రంగులు వేయడం మరియు అరుగుదలను సరిచేయడం ఇంటి యజమాని యొక్క ప్రాథమిక నిర్వహణ బాధ్యత.
- **అనుమతించబడిన కోతలు మాత్రమే**: అద్దెదారు కావాలని చేసిన భౌతిక నష్టం, పగిలిన వస్తువులు లేదా పెండింగ్ విద్యుత్/నీటి బిల్లులకు మాత్రమే డిపాజిట్ నుండి మినహాయింపు చేయవచ్చు.
- **చట్టపరమైన పరిష్కారం**: యజమాని రంగుల పేరుతో డిపాజిట్ నిలిపివేస్తే, ఆస్తి బదిలీ చట్టం సెక్షన్ 106 కింద లీగల్ నోటీసు పంపవచ్చు మరియు స్థానిక రెంట్ అథారిటీ లేదా జిల్లా వినియోగదారుల ఫోరమ్‌లో వడ్డీతో సహా వాపసు కోసం పిటిషన్ దాఖలు చేయవచ్చు.${formatSingleSource(sources, 'te')}`;
    }
    if (language === 'hi') {
      return `### पेंटिंग (पुताई) और सामान्य टूट-फूट पर कानूनी नियम

**मॉडल टेनेंसी एक्ट 2021 (Model Tenancy Act)** एवं भारतीय कानून के तहत:

- **पेंटिंग कटौती गैरकानूनी**: मकान मालिक नियमित रंगाई-पुताई (Routine Painting) या सामान्य टूट-फूट (Normal Wear & Tear) के नाम पर सिक्योरिटी डिपॉजिट से पैसे **नहीं काट सकता**।
- **मकान मालिक का दायित्व**: समय के साथ दीवार के रंग का फीका पड़ना या मकान की सामान्य उम्र बढ़ना मकान मालिक के अनिवार्य रखरखाव के अंतर्गत आता है।
- **वैध कटौतियां**: केवल किरायेदार द्वारा किए गए वास्तविक संरचनात्मक नुकसान, टूटी हुई फिटिंग या बकाया बिजली/पानी के बिलों की ही कटौती संभव है।
- **कानूनी उपाय**: यदि मकान मालिक अवैध कटौती करता है, तो धारा 106 संपत्ति अंतरण अधिनियम के तहत कानूनी नोटिस भेजकर रेंट कोर्ट या उपभोक्ता फोरम में ब्याज सहित पूरी राशि वसूली जा सकती है।${formatSingleSource(sources, 'hi')}`;
    }
    return `### Landlord Deductions for Painting & Normal Wear and Tear

Under Indian tenancy jurisprudence and the **Model Tenancy Act 2021**:

- **No Painting Deduction Allowed**: A landlord **CANNOT** deduct security deposit money for routine painting or ordinary wear and tear.
- **Landlord's Statutory Obligation**: Routine repainting and normal aging of premises are statutory maintenance obligations of the property owner, not the tenant.
- **Permissible Deductions**: Deductions are legally restricted solely to verified tenant-inflicted physical damage, broken fixtures, or unpaid utility bills.
- **Legal Remedy**: If a landlord unlawfully withholds deposit funds for painting, serve a formal legal notice under Section 106 Transfer of Property Act and approach the Rent Authority or District Consumer Commission for a full refund with 12-18% interest.${formatSingleSource(sources, 'en')}`;
  }

  // 2. Security Deposit Cap (How many months deposit)
  const isDepositCap = (q.includes('how many month') || q.includes('deposit limit') || q.includes('maximum deposit') || q.includes('deposit cap') || q.includes('ఎన్ని నెలల') || q.includes('గరిష్ట డిపాజిట్') || q.includes('कितने महीने') || q.includes('डिपॉजिट सीमा')) && (q.includes('rent') || q.includes('deposit') || q.includes('అద్దె') || q.includes('కిరాయి') || q.includes('किराया'));
  if (isDepositCap) {
    if (language === 'te') {
      return `### సెక్యూరిటీ డిపాజిట్ గరిష్ట చట్టబద్ధ పరిమితి

కేంద్ర **మోడల్ టెనెన్సీ చట్టం 2021 (Model Tenancy Act)** ప్రకారం:

- **నివాస గృహాలు (Residential)**: గరిష్టంగా **2 నెలల అద్దె మాత్రమే** సెక్యూరిటీ డిపాజిట్‌గా తీసుకోవడానికి చట్టం అనుమతిస్తుంది.
- **వాణిజ్య ప్రాంగణాలు (Commercial)**: దుకాణాలు లేదా కార్యాలయాలకు గరిష్టంగా **6 నెలల అద్దె** డిపాజిట్‌గా తీసుకోవచ్చు.
- **చట్టవిరుద్ధ డిమాండ్**: 5 లేదా 10 నెలల అద్దెను డిపాజిట్‌గా డిమాండ్ చేయడం చట్టవిరుద్ధం.${formatSingleSource(sources, 'te')}`;
    }
    if (language === 'hi') {
      return `### सुरक्षा जमा (सिक्योरिटी डिपॉजिट) की कानूनी सीमा

**मॉडल टेनेंसी एक्ट 2021 (Model Tenancy Act)** के अनुसार:

- **आवासीय संपत्तियां (Residential)**: मकान मालिक अधिकतम **2 महीने का किराया ही** सिक्योरिटी डिपॉजिट के रूप में ले सकता है।
- **व्यावसायिक संपत्तियां (Commercial)**: दुकानों या कार्यालयों के लिए अधिकतम **6 महीने का किराया** लिया जा सकता है।
- **अवैध मांग**: 5 से 10 महीने का एडवांस डिपॉजिट मांगना कानूनन वर्जित है।${formatSingleSource(sources, 'hi')}`;
    }
    return `### Statutory Cap on Rental Security Deposit

Under the **Model Tenancy Act 2021**:

- **Residential Leases**: The security deposit is strictly capped at a maximum of **2 months' rent**.
- **Commercial Leases**: For non-residential/commercial premises, the deposit is capped at a maximum of **6 months' rent**.
- **Unlawful Demands**: Demanding 6-10 months of deposit for residential apartments is legally impermissible.${formatSingleSource(sources, 'en')}`;
  }

  // 3. Deposit Refund Timeline (30 Days)
  const isRefundTime = (q.includes('refund time') || q.includes('how long') || q.includes('return deposit') || q.includes('when refund') || q.includes('వాపసు గడువు') || q.includes('ఎప్పుడు ఇవ్వాలి') || q.includes('कब वापस') || q.includes('रिफंड समय')) && (q.includes('deposit') || q.includes('డిపాజిట్') || q.includes('जमा'));
  if (isRefundTime) {
    if (language === 'te') {
      return `### సెక్యూరిటీ డిపాజిట్ వాపసు గడువు నిబంధన

- **30 రోజుల తప్పనిసరి గడువు**: అద్దెదారు ఇంటిని ఖాళీ చేసి, తాళాలు యజమానికి అప్పగించిన నాటి నుండి **30 రోజుల్లోగా** సెక్యూరిటీ డిపాజిట్‌ను యజమాని పూర్తిగా తిరిగి చెల్లించాలి.
- **స్పందించకపోతే**: 30 రోజులు దాటిన తర్వాత డిపాజిట్ ఇవ్వకపోతే, 12% నుండి 18% వార్షిక వడ్డీతో పాటు సొమ్మును తిరిగి చెల్లించాల్సి ఉంటుంది.${formatSingleSource(sources, 'te')}`;
    }
    if (language === 'hi') {
      return `### सिक्योरिटी डिपॉजिट वापसी की समय-सीमा

- **30 दिनों की कानूनी समय-सीमा**: किरायेदार द्वारा परिसर खाली कर चाबियां सौंपने के **30 दिनों के भीतर** मकान मालिक को पूरी जमा राशि वापस करना अनिवार्य है।
- **वापस न करने पर**: यदि 30 दिनों में राशि नहीं लौटाई जाती, तो मकान मालिक पर 12% से 18% वार्षिक ब्याज और हर्जाने की देनदारी बनती है।${formatSingleSource(sources, 'hi')}`;
    }
    return `### Statutory Timeline for Security Deposit Refund

- **Mandatory 30-Day Window**: The landlord is legally bound to refund the security deposit within **30 days** from the date the tenant vacates the premises and hands over possession.
- **Default Liability**: Failure to refund within 30 days entitles the tenant to claim the amount with 12% to 18% interest and damages before the Rent Authority or Consumer Forum.${formatSingleSource(sources, 'en')}`;
  }

  // 4. 11-Month Rental Agreement vs Registration
  const is11Month = q.includes('11 month') || q.includes('11 నెలల') || q.includes('11 महीने') || (q.includes('why 11') || q.includes('11 vs 12'));
  if (is11Month) {
    if (language === 'te') {
      return `### 11 నెలల అద్దె ఒప్పందం - చట్టపరమైన కారణం

- **రిజిస్ట్రేషన్ చట్టం 1908 సెక్షన్ 17**: 12 నెలలు లేదా అంతకంటే ఎక్కువ కాలపరిమితి ఉన్న లీజు ఒప్పందాలకు సబ్-రిజిస్ట్రార్ వద్ద తప్పనిసరి రిజిస్ట్రేషన్ మరియు స్టాంప్ డ్యూటీ అవసరం.
- **11 నెలల వెసులుబాటు**: 11 నెలల కాలపరిమితి ఒప్పందానికి సబ్-రిజిస్ట్రార్ వద్ద రిజిస్ట్రేషన్ అవసరం లేదు; స్టాంప్ పేపర్‌పై నోటరీ చేయిస్తే చట్టబద్ధంగా సరిపోతుంది.${formatSingleSource(sources, 'te')}`;
    }
    if (language === 'hi') {
      return `### 11 महीने के किराया समझौते का कानूनी कारण

- **पंजीकरण अधिनियम 1908 की धारा 17**: 12 महीने या उससे अधिक अवधि के लीज समझौतों का सब-रजिस्ट्रार कार्यालय में अनिवार्य पंजीकरण और स्टाम्प शुल्क आवश्यक होता है।
- **11 महीने की छूट**: 11 महीने के एग्रीमेंट पर अनिवार्य रजिस्ट्री की आवश्यकता नहीं होती; यह स्टाम्प पेपर पर नोटरी द्वारा कानूनी रूप से मान्य रहता है।${formatSingleSource(sources, 'hi')}`;
    }
    return `### Legal Basis for 11-Month Rental Agreements

- **Section 17 of the Registration Act, 1908**: Leases for 12 months or longer mandatorily require formal registration with the Sub-Registrar and heavy state stamp duty payment.
- **11-Month Exemption**: An 11-month tenancy agreement is exempt from mandatory registration under Section 17, saving registration fees while remaining valid and legally enforceable on stamp paper.${formatSingleSource(sources, 'en')}`;
  }

  // 5. Specific Form 29 Inquiries
  const isForm29Only = (q.includes('form 29') || q.includes('ఫారమ్ 29') || q.includes('फॉर्म 29')) && !q.includes('form 30') && !q.includes('form 35');
  if (isForm29Only) {
    if (language === 'te') {
      return `### ఫారమ్ 29 (Form 29) - వాహన విక్రయ నోటీసు

మోటారు వాహనాల చట్టం 1988 నిబంధన 55 ప్రకారం:
- **ప్రయోజనం**: ఫారమ్ 29 అనేది వాహనాన్ని విక్రయించినట్లు విక్రేత (Seller) సంబంధిత RTO కార్యాలయానికి ఇచ్చే అధికారిక **యాజమాన్య బదిలీ నోటీసు (Notice of Transfer)**.
- **సమర్పణ**: 2 కాపీలలో సంతకం చేసి ఒక కాపీని RTOకి, మరొక కాపీని కొనుగోలుదారునికి అందజేయాలి.${formatSingleSource(sources, 'te')}`;
    }
    if (language === 'hi') {
      return `### फॉर्म 29 (Form 29) - वाहन स्वामित्व अंतरण नोटिस

केंद्रीय मोटर वाहन नियम 55 के अंतर्गत:
- **उद्देश्य**: फॉर्म 29 विक्रेता द्वारा RTO को दी जाने वाली **स्वामित्व अंतरण की औपचारिक सूचना (Notice of Transfer)** है कि वाहन बेचकर क्रेता को सौंप दिया गया है।
- **प्रक्रिया**: इसकी 2 प्रतियां हस्ताक्षरित कर एक RTO को भेजी जाती है और दूसरी क्रेता को दी जाती है।${formatSingleSource(sources, 'hi')}`;
    }
    return `### Form 29 - Notice of Transfer of Vehicle Ownership

Under Rule 55 of the Central Motor Vehicles Rules, 1989:
- **Statutory Purpose**: Form 29 is the mandatory **Notice of Transfer of Ownership** submitted by the vehicle seller to the RTO, officially intimating that the vehicle has been sold and physical possession transferred.
- **Execution**: Prepared in duplicate, signed by the seller, and submitted to the registered RTO within 14 days of vehicle transfer.${formatSingleSource(sources, 'en')}`;
  }

  // 6. Specific Form 30 Inquiries
  const isForm30Only = (q.includes('form 30') || q.includes('ఫారమ్ 30') || q.includes('फॉर्म 30')) && !q.includes('form 29') && !q.includes('form 35');
  if (isForm30Only) {
    if (language === 'te') {
      return `### ఫారమ్ 30 (Form 30) - RC యాజమాన్య బదిలీ దరఖాస్తు

- **ప్రయోజనం**: ఫారమ్ 30 అనేది వాహన కొనుగోలుదారు మరియు విక్రేత ఇద్దరూ సంయుక్తంగా సంతకం చేసి RTOలో RC బదిలీ కోసం దాఖలు చేసే అధికారిక దరఖాస్తు (Application for Transfer of Ownership).
- **సమయ పరిమితి**: వాహన కొనుగోలు జరిగిన **14 రోజుల్లోగా** RTOకి సమర్పించాలి (రాష్ట్రం దాటితే 45 రోజులు).${formatSingleSource(sources, 'te')}`;
    }
    if (language === 'hi') {
      return `### फॉर्म 30 (Form 30) - आरसी ट्रांसफर आवेदन

- **उद्देश्य**: फॉर्म 30 क्रेता और विक्रेता दोनों द्वारा संयुक्त रूप से हस्ताक्षरित **स्वामित्व हस्तांतरण आवेदन** है जिसके आधार पर RTO वाहन की आरसी (RC) को नए मालिक के नाम पर दर्ज करता है।
- **समय-सीमा**: लेन-देन के **14 दिनों के भीतर** इसे RTO में जमा करना अनिवार्य है।${formatSingleSource(sources, 'hi')}`;
    }
    return `### Form 30 - Application for Vehicle Ownership Transfer

Under Rule 55 of the Central Motor Vehicles Rules, 1989:
- **Statutory Purpose**: Form 30 is the joint **Application for Intimation and Transfer of Ownership** executed by both the buyer and seller to formally record the buyer as the registered owner on the RC.
- **Statutory Time Limit**: Must be lodged with the RTO within **14 days** of sale (or 45 days if vehicle transfer involves another state).${formatSingleSource(sources, 'en')}`;
  }

  // 7. Specific Form 35 Inquiries (Hypothecation Cancellation)
  const isForm35Only = q.includes('form 35') || q.includes('ఫారమ్ 35') || q.includes('फॉर्म 35') || q.includes('hypothecation') || q.includes('హైపోథికేషన్') || q.includes('हाइपोथीकेशन');
  if (isForm35Only) {
    if (language === 'te') {
      return `### ఫారమ్ 35 & బ్యాంక్ లోన్ రద్దు (Hypothecation Removal)

- **ప్రయోజనం**: కారు లేదా బైక్ రుణం (Vehicle Loan) పూర్తిగా చెల్లించిన తర్వాత, RC బుక్ నుండి బ్యాంక్ పేరును తొలగించడానికి (Cancellation of Hypothecation) ఫారమ్ 35 అవసరం.
- **ప్రక్రియ**: బ్యాంక్ సంతకం చేసిన ఫారమ్ 35 (2 కాపీలు) మరియు బ్యాంక్ ఇచ్చిన No Objection Certificate (NOC)లను RTOకి సమర్పించి క్లియర్ చేయించాలి.${formatSingleSource(sources, 'te')}`;
    }
    if (language === 'hi') {
      return `### फॉर्म 35 एवं वाहन लोन समाप्ति (हाइपोथीकेशन हटाना)

- **उद्देश्य**: गाड़ी का पूरा लोन चुकता होने के बाद आरसी (RC) से बैंक का नाम हटाने (Hypothecation Cancellation) के लिए फॉर्म 35 RTO में जमा किया जाता है।
- **आवश्यक दस्तावेज**: बैंक द्वारा हस्ताक्षरित फॉर्म 35 (दो प्रतियां) और बैंक का एनओसी (No Objection Certificate / No Dues Certificate)।${formatSingleSource(sources, 'hi')}`;
    }
    return `### Form 35 - Cancellation of Vehicle Hypothecation

Under Rule 61 of the Central Motor Vehicles Rules, 1989:
- **Statutory Purpose**: Form 35 is the application for **Cancellation of Endorsement of Hypothecation / Hire Purchase** on the Registration Certificate (RC) after full repayment of the vehicle loan.
- **Mandatory Filings**: Submit 2 copies of signed Form 35 along with the lender's original No Objection Certificate (NOC) to the RTO to issue a clean RC in your name alone.${formatSingleSource(sources, 'en')}`;
  }

  // 8. Specific Encumbrance Certificate (EC) / Nil EC / Form 16 Inquiries
  const isECOnly = q.includes('form 16') || q.includes('nil ec') || q.includes('encumbrance certificate') || q.includes('భార రహిత') || q.includes('भारमुक्त प्रमाण पत्र') || ((q.includes('ec') || q.includes('ఈసీ')) && (q.includes('what is') || q.includes('property') || q.includes('ఆస్తి') || q.includes('जमीन')));
  if (isECOnly) {
    if (language === 'te') {
      return `### ఎన్‌కంబరెన్స్ సర్టిఫికేట్ (EC) & ఫారమ్ 16 (Nil EC) వివరణ

రిజిస్ట్రేషన్ చట్టం 1908 ప్రకారం సబ్-రిజిస్ట్రార్ ఇచ్చే కీలక పత్రం:
- **ఫారమ్ 16 (Nil EC)**: సంబంధిత అన్వేషణ కాలంలో ఆస్తిపై ఎటువంటి బ్యాంక్ లోన్లు, తనఖా లేదా రిజిస్టర్డ్ కోర్టు వివాదాలు లేవని రుజువు చేస్తుంది (ఆస్తి భార రహితమైనది).
- **ఫారమ్ 15**: ఆస్తిపై గతంలో రిజిస్టర్ అయిన అన్ని లావాదేవీలు, క్రయవిక్రయాలు మరియు తాకట్టుల పూర్తి చరిత్రను చూపుతుంది.${formatSingleSource(sources, 'te')}`;
    }
    if (language === 'hi') {
      return `### भारमुक्त प्रमाण पत्र (EC) एवं फॉर्म 16 (Nil EC)

पंजीकरण अधिनियम 1908 के अंतर्गत सब-रजिस्ट्रार द्वारा जारी प्रमाण पत्र:
- **फॉर्म 16 (Nil EC)**: यह प्रमाणित करता है कि खोजी गई अवधि के दौरान संपत्ति पर कोई पंजीकृत बैंक लोन, बंधक या अदालती विवाद नहीं है (संपत्ति पूर्णतः भारमुक्त है)।
- **फॉर्म 15**: संपत्ति पर पूर्व में हुए सभी पंजीकृत लेन-देन और विलेखों का विवरण प्रदर्शित करता है।${formatSingleSource(sources, 'hi')}`;
    }
    return `### Encumbrance Certificate (EC) & Form 16 (Nil EC)

Under the Registration Act 1908:
- **Form 16 (Nil EC)**: Issued by the Sub-Registrar certifying that the property has NO registered mortgages, liens, financial liabilities, or court attachments during the search period.
- **Form 15**: Issued when registered encumbrances or prior transaction deeds exist on the property, detailing dates, parties, and volume references.${formatSingleSource(sources, 'en')}`;
  }

  // 9. Specific Cheque Bounce / Section 138 NI Act Inquiries
  const isCheque = q.includes('cheque') || q.includes('check bounce') || q.includes('138 ni act') || q.includes('చెక్ బౌన్స్') || q.includes('चेक बाउंस');
  if (isCheque) {
    if (language === 'te') {
      return `### చెక్ బౌన్స్ & సెక్షన్ 138 NI చట్టం నిబంధనలు

నెగోషియబుల్ ఇన్‌స్ట్రుమెంట్స్ చట్టం 1881 సెక్షన్ 138 కింద:
- **1. బ్యాంక్ మెమో & 30 రోజుల నోటీసు**: చెక్ బౌన్స్ అయినట్లు బ్యాంక్ మెమో అందిన **30 రోజుల్లోగా** చెక్ జారీ చేసిన వ్యక్తికి లీగల్ డిమాండ్ నోటీసు పంపాలి.
- **2. 15 రోజుల గడువు**: నోటీసు అందిన నాటి నుండి డబ్బు చెల్లించడానికి 15 రోజుల గడువు ఇవ్వాలి.
- **3. కోర్టు కేసు**: 15 రోజుల్లో చెల్లించకపోతే, తర్వాతి **30 రోజుల్లోగా** జ్యుడీషియల్ మేజిస్ట్రేట్ కోర్టులో క్రిమినల్ ఫిర్యాదు దాఖలు చేయాలి.
- **శిక్ష**: 2 సంవత్సరాల వరకు జైలు శిక్ష లేదా చెక్ మొత్తానికి రెట్టింపు జరిమానా విధించవచ్చు.${formatSingleSource(sources, 'te')}`;
    }
    if (language === 'hi') {
      return `### चेक बाउंस और धारा 138 परक्राम्य लिखत अधिनियम (NI Act)

परक्राम्य लिखत अधिनियम 1881 की धारा 138 के अंतर्गत:
- **1. 30 दिनों में कानूनी नोटिस**: बैंक से चेक अनादर (बाउंस) मेमो मिलने के **30 दिनों के भीतर** देनदार को कानूनी डिमांड नोटिस भेजना अनिवार्य है।
- **2. 15 दिनों की मोहलत**: नोटिस मिलने के बाद भुगतान के लिए 15 दिनों का समय दिया जाता है।
- **3. परिवाद दायर करना**: 15 दिन में भुगतान न होने पर अगले **30 दिनों के भीतर** सक्षम मजिस्ट्रेट अदालत में आपराधिक केस दर्ज करें।
- **सजा का प्रावधान**: 2 वर्ष तक का कारावास अथवा चेक राशि का दोगुना तक जुर्माना।${formatSingleSource(sources, 'hi')}`;
    }
    return `### Cheque Bounce Procedure under Section 138 NI Act

Under Section 138 of the Negotiable Instruments Act, 1881:
- **1. 30-Day Demand Notice**: Payee must issue a formal legal demand notice to the drawer within **30 days** of receiving the cheque return memo from the bank.
- **2. Mandatory 15-Day Cure Period**: The drawer is granted exactly 15 days from notice receipt to make full payment.
- **3. Criminal Complaint within 30 Days**: If the drawer fails to pay within 15 days, a criminal complaint must be instituted before the Judicial/Metropolitan Magistrate within **30 days**.
- **Statutory Penalty**: Imprisonment up to 2 years, or a fine up to twice the cheque amount, or both.${formatSingleSource(sources, 'en')}`;
  }

  // 10. Specific Bharatiya Nyaya Sanhita (BNS) Section Lookups
  if (q.includes('bns') || q.includes('nyaya sanhita') || q.includes('న్యాయ సంహిత')) {
    if (q.includes('103')) {
      return language === 'te'
        ? `### సెక్షన్ 103 BNS 2023 (హత్య / Murder)\n\nభారతీయ న్యాయ సంహిత (BNS) సెక్షన్ 103 పాత IPC సెక్షన్ 302 స్థానంలో వచ్చింది. హత్య చేసిన వ్యక్తికి మరణశిక్ష లేదా యావజ్జీవ కారాగార శిక్ష మరియు జరిమానా విధించబడుతుంది.`
        : language === 'hi'
        ? `### धारा 103 भारतीय न्याय संहिता 2023 (हत्या)\n\nBNS की धारा 103 पूर्ववर्ती IPC की धारा 302 को प्रतिस्थापित करती है। इसके तहत हत्या के दोषी को मृत्युदंड या आजीवन कारावास तथा जुर्माने की सजा का प्रावधान है।`
        : `### Section 103 Bharatiya Nyaya Sanhita (BNS) 2023 - Punishment for Murder\n\nSection 103 BNS replaces erstwhile Section 302 IPC. It prescribes that whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.`;
    }
    if (q.includes('318')) {
      return language === 'te'
        ? `### సెక్షన్ 318 BNS 2023 (మోసం / Cheating)\n\nభారతీయ న్యాయ సంహిత సెక్షన్ 318 పాత IPC సెక్షన్ 415 మరియు 420 స్థానంలో వచ్చింది. సాధారణ మోసానికి 3 సంవత్సరాల వరకు జైలు శిక్ష, మరియు ఆస్తిని కాజేసే మోసానికి (Section 318(4)) 7 సంవత్సరాల వరకు జైలు శిక్ష మరియు జరిమానా విధించబడుతుంది.`
        : language === 'hi'
        ? `### धारा 318 भारतीय न्याय संहिता 2023 (धोखाधड़ी / Cheating)\n\nBNS की धारा 318 पूर्ववर्ती IPC 415 और 420 का स्थान लेती है। सामान्य धोखाधड़ी पर 3 वर्ष तक की कैद तथा संपत्ति हड़पने की धोखाधड़ी (318(4)) में 7 वर्ष तक के कारावास और जुर्माने का प्रावधान है।`
        : `### Section 318 Bharatiya Nyaya Sanhita (BNS) 2023 - Cheating\n\nSection 318 BNS replaces Sections 415 & 420 IPC. Simple cheating is punishable with imprisonment up to 3 years; aggravated cheating involving dishonestly inducing delivery of property (Section 318(4)) is punishable with imprisonment up to 7 years and fine.`;
    }
    if (q.includes('303')) {
      return language === 'te'
        ? `### సెక్షన్ 303 BNS 2023 (దొంగతనం / Theft)\n\nభారతీయ న్యాయ సంహిత సెక్షన్ 303 పాత IPC సెక్షన్ 378 & 379 స్థానంలో వచ్చింది. దొంగతనానికి 3 సంవత్సరాల వరకు జైలు శిక్ష లేదా జరిమానా లేదా సమాజ సేవ (Community Service) శిక్షగా విధించబడుతుంది.`
        : language === 'hi'
        ? `### धारा 303 भारतीय न्याय संहिता 2023 (चोरी / Theft)\n\nBNS की धारा 303 पूर्ववर्ती IPC 378/379 का स्थान लेती है। इसके तहत चोरी के अपराध में 3 वर्ष तक का कारावास अथवा जुर्माना या सामुदायिक सेवा (Community Service) की सजा हो सकती है।`
        : `### Section 303 Bharatiya Nyaya Sanhita (BNS) 2023 - Theft\n\nSection 303 BNS replaces Sections 378 & 379 IPC. Theft is punishable with imprisonment up to 3 years, or with fine, or both, and for first-time petty theft, community service may be ordered.`;
    }
  }

  // 11. Top RAG Match Direct Extraction
  if (sources && sources.length > 0 && sources[0].text && sources[0].title) {
    const s = sources[0];
    const sTitleWords = s.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const matchCount = sTitleWords.filter(w => q.includes(w)).length;
    if (matchCount >= 2 || (s.section && q.includes(s.section.toLowerCase()))) {
      if (language === 'te') {
        return `### ${s.title}\n\n**చట్టపరమైన సెక్షన్**: ${s.act} (${s.section || 'సాధారణ నిబంధన'})\n\n${s.text.slice(0, 450)}...\n\n${formatSingleSource(sources, 'te')}`;
      }
      if (language === 'hi') {
        return `### ${s.title}\n\n**कानूनी धारा**: ${s.act} (${s.section || 'सामान्य प्रावधान'})\n\n${s.text.slice(0, 450)}...\n\n${formatSingleSource(sources, 'hi')}`;
      }
      return `### ${s.title}\n\n**Statutory Provision**: ${s.act} (${s.section || 'General Provision'})\n\n${s.text.slice(0, 450)}...\n\n${formatSingleSource(sources, 'en')}`;
    }
  }

  return null;
}

/**
 * Smart offline fallback — tries to give a specific answer to the exact question
 * using RAG sources + keyword matching. Much more targeted than a generic block.
 */
function generateLocalLegalResponse(question, intent, sources, language = 'en') {
  const q = question.toLowerCase();

  // 1. Try the direct specific answer dispatcher first
  const direct = getDirectSpecificAnswer(q, intent, sources, language);
  if (direct) return direct;

  // 2. Build answer from top RAG source if it closely matches
  if (sources && sources.length > 0) {
    const topSource = sources[0];
    const sourceText = topSource.text || '';

    // If source is relevant enough (has decent length), use it directly
    if (sourceText.length > 100) {
      const intro = language === 'te'
        ? `మీ ప్రశ్న: **"${question}"**\n\nమా చట్టపరమైన నాలెడ్జ్ బేస్ నుండి సంబంధిత సమాచారం:\n\n`
        : language === 'hi'
        ? `आपका प्रश्न: **"${question}"**\n\nहमारे कानूनी ज्ञान आधार से प्रासंगिक जानकारी:\n\n`
        : `You asked: **"${question}"**\n\nHere's what our legal knowledge base says:\n\n`;

      const sourceBlock = language === 'te'
        ? `**${topSource.title}** (${topSource.act})\n\n${sourceText.slice(0, 600)}`
        : language === 'hi'
        ? `**${topSource.title}** (${topSource.act})\n\n${sourceText.slice(0, 600)}`
        : `**${topSource.title}** (${topSource.act})\n\n${sourceText.slice(0, 600)}`;

      const tip = language === 'te'
        ? `\n\n> ⚠️ ఈ సమాచారం సాధారణ మార్గదర్శకత్వానికి మాత్రమే. మీ నిర్దిష్ట పరిస్థితికి అర్హత కలిగిన న్యాయవాదిని సంప్రదించండి.`
        : language === 'hi'
        ? `\n\n> ⚠️ यह सामान्य मार्गदर्शन है। अपनी विशेष परिस्थिति के लिए किसी योग्य अधिवक्ता से परामर्श लें।`
        : `\n\n> ⚠️ This is general guidance only. For your specific situation, consult a qualified legal professional.`;

      return intro + sourceBlock + tip;
    }
  }

  // 3. Generic helpful response when nothing matches
  if (language === 'te') {
    return `మీ ప్రశ్న అర్థమైంది: **"${question}"**\n\nఈ విషయంలో మీకు సహాయపడటానికి, దయచేసి మీ ప్రశ్నను కొంచెం వివరంగా అడగండి. ఉదాహరణకు:\n- "అద్దె డిపాజిట్ వాపసు నిబంధనలు ఏమిటి?"\n- "కారు RC బదిలీకి ఏ ఫారమ్‌లు అవసరం?"\n- "సెక్షన్ 138 చెక్ బౌన్స్ నోటీసు గురించి చెప్పండి"`;
  }
  if (language === 'hi') {
    return `आपका प्रश्न समझ आया: **"${question}"**\n\nआपकी सहायता के लिए, कृपया अपना प्रश्न थोड़ा और स्पष्ट करें। जैसे:\n- "किराया डिपॉजिट वापसी के क्या नियम हैं?"\n- "कार RC ट्रांसफर के लिए कौन से फॉर्म चाहिए?"\n- "धारा 138 चेक बाउंस नोटिस के बारे में बताएं"`;
  }
  return `I understood your question: **"${question}"**\n\nTo give you the most accurate answer, could you be a bit more specific? For example:\n- "What are the rules for security deposit refund?"\n- "What forms are needed for car RC transfer?"\n- "Explain Section 138 cheque bounce notice procedure"\n\nThe more specific your question, the better I can help you.`;
}
