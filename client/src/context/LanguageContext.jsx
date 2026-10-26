import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🇮🇳' }
];

export const translations = {
  en: {
    // Brand & Header
    brandTagline: 'INDIAN LAW',
    groundedInLaw: 'Grounded in Indian Law (BNS 2023 / Constitution / CPC)',
    generalInfo: 'General Legal Information',
    
    // Navigation
    navDashboard: 'Dashboard',
    navChat: 'AI Legal Assistant',
    navResearch: 'Legal Research',
    navDocuments: 'Document Analyzer',
    navCases: 'Case & Judgment Search',
    navDrafts: 'Draft Documents',
    navHistory: 'History',
    navAdmin: 'Admin Ingestion',
    navSettings: 'Settings',
    navLogout: 'Log out',

    // Language switcher
    language: 'Language',
    selectLanguage: 'Select Language',

    // Dashboard
    dashboardWelcome: 'Welcome back',
    dashboardTagline: 'Your specialized AI legal research assistant grounded in Indian Law, BNS 2023, Constitution, and Supreme Court judgments.',
    coreServices: 'Core Legal Services',
    exploreFeature: 'Explore Feature',
    suggestedInquiries: 'Suggested Legal Inquiries',
    
    serviceChatTitle: 'AI Legal Assistant',
    serviceChatDesc: 'Ask questions regarding tenant rights, BNS 2023, or legal notices.',
    serviceDocTitle: 'Analyze Agreement',
    serviceDocDesc: 'Upload contracts or leases to detect hidden risks and red flags.',
    serviceResearchTitle: 'Legal Research',
    serviceResearchDesc: 'Search Indian Acts, BNS, CrPC, Evidence Act & Statutes.',
    serviceDraftTitle: 'Draft Legal Notice',
    serviceDraftDesc: 'Generate formal legal notice drafts, agreements, or complaints.',
    serviceCaseTitle: 'Search Supreme Court Cases',
    serviceCaseDesc: 'Explore landmark Supreme Court judgments & case precedents.',

    // Chat Page
    newQuery: 'New Legal Query',
    recentQueries: 'Recent Queries',
    noChatHistory: 'No previous history',
    chatPlaceholder: 'Ask any legal question grounded in Indian Law...',
    chatCounselTitle: 'LexAI Legal Counsel',
    chatCounselDesc: 'Ask any question regarding Indian Law, BNS 2023, tenant rights, or legal procedures.',
    exampleQuestionsHeader: 'Example Questions:',
    sourcesCited: 'CITED STATUTORY SOURCES & PRECEDENTS:',
    searchingContext: 'Searching Indian Acts, Section precedents & retrieving RAG context...',
    you: 'You',
    counsel: 'LexAI Counsel',

    // Legal Research
    researchTitle: 'Statutory Legal Research',
    researchDesc: 'Explore Indian statutes, penal codes, civil procedure, and constitutional articles.',
    searchStatutes: 'Search Acts, sections, or legal terms...',
    allCategories: 'All Categories',

    // Document Analyzer
    docAnalyzerTitle: 'PDF Legal Document Risk Analyzer',
    docAnalyzerDesc: 'Upload contracts, rental agreements, or court notices for automated summary, concern detection, and grounded Q&A.',
    uploadDoc: 'Upload PDF / DOCX',
    analyzingDoc: 'Analyzing Document...',
    analyzeAnother: 'Analyze Another',
    dropzoneTitle: 'Click or Drag PDF Document to Upload',
    dropzoneActive: 'Drop PDF here to Analyze',
    dropzoneSubtitle: 'Supports Rental Agreements, NDAs, Employment Contracts, Loan Sanctions, and Affidavits (PDF, DOCX, TXT up to 15MB).',
    dropzoneBadge: 'Extracts Text • Detects High-Risk Clauses • Answers Legal Q&A',
    sampleAgreementsTitle: 'Or Try One-Click Sample Legal Agreements',
    sampleRentalAgreement: 'Residential Rental Agreement',
    sampleMutualNda: 'Mutual Non-Disclosure Agreement',
    sampleEmploymentContract: 'Executive Employment Contract',
    sampleDesc: 'Test risk scoring & clauses',
    tabSummary: 'Summary & Concern Analysis',
    tabQA: 'Ask Document Questions',
    overallRiskAssessment: 'Overall Risk Assessment',
    concernLevel: 'Concern Level',
    importantParties: 'Important Parties',
    effectiveDate: 'Effective Date',
    financialTerms: 'Financial Terms',
    terminationNotice: 'Termination Notice',
    identifiedConcerns: 'Identified Potential Concerns & Clause Risks',
    noConcernsFound: 'No critical predatory or unusual high-risk clauses were identified in this document.',
    clauseAnalysis: 'Analysis:',
    clauseRecommendation: 'Recommendation:',
    askDocumentHeader: 'Ask Questions Grounded in',
    suggestedQuestions: 'Suggested Questions:',
    relevantClause: 'Relevant Clause:',
    page: 'Page:',
    askPlaceholder: 'e.g. What is the notice period for early termination?',
    askBtn: 'Ask',
    processingDocTitle: 'Processing & Extracting Document Text...',
    processingDocDesc: 'Parsing document structure, extracting clauses, calculating legal risk scores, and generating contextual summaries.',
    errorTitle: 'Unable to process document',
    errorTip: 'Tip: Ensure the PDF has selectable text and is not a password-protected or blank scan. You can also test with the sample contracts below.',
    dismiss: 'Dismiss',

    // Case Search
    caseSearchTitle: 'Landmark Case Law & Judgment Search',
    caseSearchDesc: 'Search Supreme Court and High Court precedents with ratio decidendi.',
    searchCases: 'Search judgments, citations, or case topics...',

    // Document Drafter
    draftTitle: 'Legal Notice & Agreement Drafter',
    draftDesc: 'Generate structured legal notice drafts, eviction notices, and consumer complaints.',
    generateDraft: 'Generate Legal Draft',

    // History
    historyTitle: 'Legal Conversation & Query History',
    historyDesc: 'Review your past AI legal queries, grounded citations, and contract analyses.',
    noHistory: 'No previous legal conversations found.',

    // Settings
    settingsTitle: 'LexAI Settings & Platform Configuration',
    settingsDesc: 'User profile, legal jurisdiction parameters, language selection, and AI model preferences.',
    languagePreference: 'Interface & AI Language Preference',
    languagePreferenceDesc: 'Choose your preferred language for the interface and AI legal consultations.',
    userProfile: 'User Profile Information',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    accountRole: 'Account Role',
    jurisdiction: 'Primary Jurisdiction',
    jurisdictionVal: 'India (Union Statutes & High Courts)',
    complianceTitle: 'Legal Compliance & Data Protection',

    // Disclaimer
    disclaimerPrefix: 'Legal Disclaimer:',
    disclaimerImportant: 'IMPORTANT LEGAL NOTICE:',
    disclaimerDefault: 'LexAI provides general legal information grounded in Indian law and is not a substitute for advice from a qualified legal professional.'
  },

  hi: {
    // Brand & Header
    brandTagline: 'भारतीय कानून',
    groundedInLaw: 'भारतीय कानून पर आधारित (BNS 2023 / संविधान / CPC)',
    generalInfo: 'सामान्य कानूनी जानकारी',
    
    // Navigation
    navDashboard: 'डैशबोर्ड',
    navChat: 'AI कानूनी सहायक',
    navResearch: 'कानूनी अनुसंधान',
    navDocuments: 'दस्तावेज़ विश्लेषक',
    navCases: 'केस और निर्णय खोज',
    navDrafts: 'दस्तावेज़ ड्राफ्ट करें',
    navHistory: 'इतिहास',
    navAdmin: 'एडमिन डेटा',
    navSettings: 'सेटिंग्स',
    navLogout: 'लॉग आउट',

    // Language switcher
    language: 'भाषा',
    selectLanguage: 'भाषा चुनें',

    // Dashboard
    dashboardWelcome: 'स्वागत है',
    dashboardTagline: 'भारतीय कानून, BNS 2023, संविधान और सुप्रीम कोर्ट के निर्णयों पर आधारित आपका कानूनी AI सहायक।',
    coreServices: 'प्रमुख कानूनी सेवाएं',
    exploreFeature: 'सुविधा देखें',
    suggestedInquiries: 'सुझाए गए कानूनी प्रश्न',
    
    serviceChatTitle: 'AI कानूनी सहायक',
    serviceChatDesc: 'किरायेदार अधिकार, BNS 2023, या कानूनी नोटिस के संबंध में प्रश्न पूछें।',
    serviceDocTitle: 'अनुबंध का विश्लेषण करें',
    serviceDocDesc: 'छिपे हुए जोखिमों और कानूनी कमियों को खोजने के लिए अनुबंध अपलोड करें।',
    serviceResearchTitle: 'कानूनी अनुसंधान',
    serviceResearchDesc: 'भारतीय अधिनियम, BNS, CrPC, साक्ष्य अधिनियम और धाराएं खोजें।',
    serviceDraftTitle: 'कानूनी नोटिस ड्राफ्ट करें',
    serviceDraftDesc: 'औपचारिक कानूनी नोटिस, अनुबंध या शिकायत पत्र तैयार करें।',
    serviceCaseTitle: 'सुप्रीम कोर्ट केस खोजें',
    serviceCaseDesc: 'सुप्रीम कोर्ट के ऐतिहासिक फैसलों और न्यायिक उदाहरणों को देखें।',

    // Chat Page
    newQuery: 'नया कानूनी प्रश्न',
    recentQueries: 'हाल के प्रश्न',
    noChatHistory: 'कोई पूर्व इतिहास नहीं',
    chatPlaceholder: 'भारतीय कानून से संबंधित कोई भी प्रश्न पूछें...',
    chatCounselTitle: 'LexAI कानूनी सलाहकार',
    chatCounselDesc: 'भारतीय कानून, BNS 2023, किरायेदार अधिकार या अदालती प्रक्रियाओं पर सवाल पूछें।',
    exampleQuestionsHeader: 'उदाहरण प्रश्न:',
    sourcesCited: 'उद्धृत वैधानिक स्रोत और न्यायिक निर्णय:',
    searchingContext: 'भारतीय अधिनियमों, कानूनी धाराओं और संदर्भ की खोज की जा रही है...',
    you: 'आप',
    counsel: 'LexAI सलाहकार',

    // Legal Research
    researchTitle: 'वैधानिक कानूनी अनुसंधान',
    researchDesc: 'भारतीय संहिताओं, दंड संहिताओं, नागरिक प्रक्रिया और संवैधानिक अनुच्छेदों को खोजें।',
    searchStatutes: 'अधिनियम, धाराएं या कानूनी शब्द खोजें...',
    allCategories: 'सभी श्रेणियां',

    // Document Analyzer
    docAnalyzerTitle: 'पीडीएफ कानूनी दस्तावेज़ जोखिम विश्लेषक',
    docAnalyzerDesc: 'स्वचालित सारांश, जोखिम पहचान और दस्तावेज़ आधारित प्रश्नों के लिए अनुबंध, किराये के समझौते या कानूनी नोटिस अपलोड करें।',
    uploadDoc: 'पीडीएफ / डॉक्स अपलोड करें',
    analyzingDoc: 'दस्तावेज़ का विश्लेषण जारी है...',
    analyzeAnother: 'अन्य दस्तावेज़ का विश्लेषण करें',
    dropzoneTitle: 'अपलोड करने के लिए पीडीएफ दस्तावेज़ पर क्लिक करें या यहां खींचें',
    dropzoneActive: 'विश्लेषण के लिए पीडीएफ यहां छोड़ें',
    dropzoneSubtitle: 'किराया समझौते, एनडीए, रोजगार अनुबंध, बैंक ऋण और हलफनामे समर्थित हैं (15MB तक)।',
    dropzoneBadge: 'टेक्स्ट निकालता है • उच्च जोखिम वाली धाराएं खोजता है • कानूनी प्रश्नों के उत्तर देता है',
    sampleAgreementsTitle: 'या एक क्लिक में नमूना कानूनी अनुबंध आज़माएं',
    sampleRentalAgreement: 'आवासीय किराया समझौता',
    sampleMutualNda: 'पारस्परिक गैर-प्रकटीकरण समझौता (NDA)',
    sampleEmploymentContract: 'कार्यकारी रोजगार अनुबंध',
    sampleDesc: 'जोखिम स्कोर और धाराओं का परीक्षण करें',
    tabSummary: 'सारांश एवं जोखिम विश्लेषण',
    tabQA: 'दस्तावेज़ से संबंधित प्रश्न पूछें',
    overallRiskAssessment: 'कुल जोखिम मूल्यांकन',
    concernLevel: 'जोखिम स्तर',
    importantParties: 'महत्वपूर्ण पक्ष',
    effectiveDate: 'प्रभावी तिथि',
    financialTerms: 'वित्तीय शर्तें',
    terminationNotice: 'समाप्ति नोटिस अवधि',
    identifiedConcerns: 'पहचाने गए संभावित जोखिम एवं धाराएं',
    noConcernsFound: 'इस दस्तावेज़ में कोई महत्वपूर्ण या असामान्य उच्च जोखिम वाली धाराएं नहीं पाई गईं।',
    clauseAnalysis: 'विश्लेषण:',
    clauseRecommendation: 'सिफारिश / सलाह:',
    askDocumentHeader: 'दस्तावेज़ पर आधारित प्रश्न पूछें:',
    suggestedQuestions: 'सुझाए गए प्रश्न:',
    relevantClause: 'प्रासंगिक धारा:',
    page: 'पृष्ठ:',
    askPlaceholder: 'उदा. समय से पहले समाप्ति के लिए नोटिस अवधि क्या है?',
    askBtn: 'पूछें',
    processingDocTitle: 'दस्तावेज़ से टेक्स्ट निकाला जा रहा है...',
    processingDocDesc: 'दस्तावेज़ संरचना का विश्लेषण, कानूनी जोखिम स्कोर की गणना और सारांश तैयार किया जा रहा है।',
    errorTitle: 'दस्तावेज़ संसाधित करने में असमर्थ',
    errorTip: 'सुझाव: सुनिश्चित करें कि पीडीएफ में चयन योग्य टेक्स्ट है और यह पासवर्ड संरक्षित या रिक्त स्कैन नहीं है। आप नीचे दिए गए नमूना अनुबंधों का भी परीक्षण कर सकते हैं।',
    dismiss: 'हटाएं',

    // Case Search
    caseSearchTitle: 'ऐतिहासिक केस कानून एवं निर्णय खोज',
    caseSearchDesc: 'सुप्रीम कोर्ट और उच्च न्यायालयों के फैसलों और उदाहरणों को खोजें।',
    searchCases: 'निर्णय, केस संख्या या कानूनी विषय खोजें...',

    // Document Drafter
    draftTitle: 'कानूनी नोटिस और ड्राफ्टिंग सहायक',
    draftDesc: 'कानूनी नोटिस, बेदखली नोटिस और उपभोक्ता शिकायतें तैयार करें।',
    generateDraft: 'कानूनी ड्राफ्ट तैयार करें',

    // History
    historyTitle: 'कानूनी बातचीत और प्रश्न इतिहास',
    historyDesc: 'अपने पूर्व AI कानूनी प्रश्नों और अनुबंध विश्लेषणों की समीक्षा करें।',
    noHistory: 'कोई पूर्व कानूनी बातचीत नहीं मिली।',

    // Settings
    settingsTitle: 'LexAI सेटिंग्स एवं प्लेटफ़ॉर्म कॉन्फ़िगरेशन',
    settingsDesc: 'उपयोगकर्ता प्रोफ़ाइल, क्षेत्राधिकार, भाषा प्राथमिकता और AI मॉडल सेटिंग्स।',
    languagePreference: 'इंटरफ़ेस और AI भाषा प्राथमिकता',
    languagePreferenceDesc: 'इंटरफ़ेस और कानूनी परामर्श के लिए अपनी पसंदीदा भाषा चुनें।',
    userProfile: 'उपयोगकर्ता प्रोफ़ाइल जानकारी',
    fullName: 'पूरा नाम',
    emailAddress: 'ईमेल पता',
    accountRole: 'खाता भूमिका',
    jurisdiction: 'प्राथमिक क्षेत्राधिकार',
    jurisdictionVal: 'भारत (केंद्रीय कानून और उच्च न्यायालय)',
    complianceTitle: 'कानूनी अनुपालन और डेटा सुरक्षा',

    // Disclaimer
    disclaimerPrefix: 'कानूनी अस्वीकरण:',
    disclaimerImportant: 'महत्वपूर्ण कानूनी सूचना:',
    disclaimerDefault: 'LexAI भारतीय कानून पर आधारित सामान्य जानकारी प्रदान करता है और यह किसी योग्य अधिवक्ता की सलाह का विकल्प नहीं है।'
  },

  te: {
    // Brand & Header
    brandTagline: 'భారతీయ చట్టం',
    groundedInLaw: 'భారతీయ చట్టం ఆధారితం (BNS 2023 / రాజ్యాంగం / CPC)',
    generalInfo: 'సాధారణ చట్టపరమైన సమాచారం',
    
    // Navigation
    navDashboard: 'డ్యాష్‌బోర్డ్',
    navChat: 'AI చట్టపరమైన సహాయకుడు',
    navResearch: 'చట్టపరమైన పరిశోధన',
    navDocuments: 'పత్రాల విశ్లేషణ',
    navCases: 'కేసులు & తీర్పుల శోధన',
    navDrafts: 'చట్టపరమైన ముసాయిదా',
    navHistory: 'చరిత్ర',
    navAdmin: 'అడ్మిన్ డేటా',
    navSettings: 'సెట్టింగ్‌లు',
    navLogout: 'లాగ్ అవుట్',

    // Language switcher
    language: 'భాష',
    selectLanguage: 'భాషను ఎంచుకోండి',

    // Dashboard
    dashboardWelcome: 'స్వాగతం',
    dashboardTagline: 'భారతీయ చట్టం, BNS 2023, రాజ్యాంగం మరియు సుప్రీం కోర్టు తీర్పుల ఆధారంగా మీ AI చట్టపరమైన పరిశోధనా సహాయకుడు.',
    coreServices: 'ముఖ్యమైన చట్టపరమైన సేవలు',
    exploreFeature: 'ఫీచర్‌ని చూడండి',
    suggestedInquiries: 'సూచించబడిన చట్టపరమైన ప్రశ్నలు',
    
    serviceChatTitle: 'AI చట్టపరమైన సహాయకుడు',
    serviceChatDesc: 'అద్దెదారు హక్కులు, BNS 2023, లేదా లీగల్ నోటీసులపై ప్రశ్నలు అడగండి.',
    serviceDocTitle: 'ఒప్పంద పత్రాల విశ్లేషణ',
    serviceDocDesc: 'ఒప్పందాలలో దాగి ఉన్న నష్టాలను గుర్తించడానికి పత్రాలను అప్‌లోడ్ చేయండి.',
    serviceResearchTitle: 'చట్టపరమైన పరిశోధన',
    serviceResearchDesc: 'భారతీయ చట్టాలు, BNS, CrPC, సాక్ష్యాల చట్టం మరియు సెక్షన్లను శోధించండి.',
    serviceDraftTitle: 'లీగల్ నోటీసు ముసాయిదా',
    serviceDraftDesc: 'అధికారిక చట్టపరమైన నోటీసులు, ఒప్పందాలు లేదా ఫిర్యాదులను రూపొందించండి.',
    serviceCaseTitle: 'సుప్రీం కోర్టు కేసుల శోధన',
    serviceCaseDesc: 'సుప్రీం కోర్టు చారిత్రాత్మక తీర్పులు మరియు పూర్వోదాహరణలను అన్వేషించండి.',

    // Chat Page
    newQuery: 'కొత్త చట్టపరమైన ప్రశ్న',
    recentQueries: 'ఇటీవలి ప్రశ్నలు',
    noChatHistory: 'మునుపటి చరిత్ర లేదు',
    chatPlaceholder: 'భారతీయ చట్టానికి సంబంధించిన ఏ చట్టపరమైన ప్రశ్నైనా అడగండి...',
    chatCounselTitle: 'LexAI లీగల్ కౌన్సెల్',
    chatCounselDesc: 'భారతీయ చట్టం, BNS 2023, అద్దెదారు హక్కులు లేదా కోర్టు ప్రక్రియల గురించి అడగండి.',
    exampleQuestionsHeader: 'ఉదాహరణ ప్రశ్నలు:',
    sourcesCited: 'ప్రస్తావించబడిన చట్టబద్ధమైన మూలాలు & తీర్పులు:',
    searchingContext: 'భారతీయ చట్టాలు, సెక్షన్లు మరియు RAG సమాచారాన్ని శోధిస్తోంది...',
    you: 'మీరు',
    counsel: 'LexAI కౌన్సెల్',

    // Legal Research
    researchTitle: 'చట్టబద్ధమైన లీగల్ రీసెర్చ్',
    researchDesc: 'భారతీయ శిక్షాస్మృతి, సివిల్ ప్రొసీజర్ మరియు రాజ్యాంగ అధికరణలను అన్వేషించండి.',
    searchStatutes: 'చట్టాలు, సెక్షన్లు లేదా చట్టపరమైన పదాలను శోధించండి...',
    allCategories: 'అన్ని వర్గాలు',

    // Document Analyzer
    docAnalyzerTitle: 'పీడీఎఫ్ చట్టపరమైన పత్రాల రిస్క్ ఎనలైజర్',
    docAnalyzerDesc: 'ఆటోమేటెడ్ సారాంశం, నష్టభయాల గుర్తింపు మరియు చట్టబద్ధమైన ప్రశ్నల కోసం ఒప్పందాలు, అద్దె ఒప్పందాలు లేదా కోర్టు నోటీసులను అప్‌లోడ్ చేయండి.',
    uploadDoc: 'పీడీఎఫ్ / డాక్స్ అప్‌లోడ్ చేయండి',
    analyzingDoc: 'పత్రాన్ని విశ్లేషిస్తోంది...',
    analyzeAnother: 'మరొక పత్రాన్ని విశ్లేషించండి',
    dropzoneTitle: 'అప్‌లోడ్ చేయడానికి పీడీఎఫ్ పత్రాన్ని క్లిక్ చేయండి లేదా ఇక్కడ లాగండి',
    dropzoneActive: 'విశ్లేషణ కోసం పీడీఎఫ్‌ను ఇక్కడ వదలండి',
    dropzoneSubtitle: 'అద్దె ఒప్పందాలు, ఎన్‌డీఏలు, ఉపాధి ఒప్పందాలు, లోన్ మంజూరు మరియు అఫిడవిట్‌లు సపోర్ట్ చేయబడతాయి (15MB వరకు).',
    dropzoneBadge: 'వచనాన్ని సంగ్రహిస్తుంది • అధిక-రిస్క్ నిబంధనలను గుర్తిస్తుంది • చట్టపరమైన ప్రశ్నలకు సమాధానమిస్తుంది',
    sampleAgreementsTitle: 'లేదా ఒక్క క్లిక్‌తో నమూనా చట్టపరమైన ఒప్పందాలను ప్రయత్నించండి',
    sampleRentalAgreement: 'నివాస అద్దె ఒప్పందం',
    sampleMutualNda: 'పరస్పర గోప్యతా ఒప్పందం (NDA)',
    sampleEmploymentContract: 'ఎగ్జిక్యూటివ్ ఉపాధి ఒప్పందం',
    sampleDesc: 'రిస్క్ స్కోర్ మరియు నిబంధనలను పరీక్షించండి',
    tabSummary: 'సారాంశం & నష్టభయాల విశ్లేషణ',
    tabQA: 'పత్రం ఆధారంగా ప్రశ్నలు అడగండి',
    overallRiskAssessment: 'మొత్తం రిస్క్ అంచనా',
    concernLevel: 'రిస్క్ స్థాయి',
    importantParties: 'ముఖ్యమైన పక్షాలు',
    effectiveDate: 'అమలు తేదీ',
    financialTerms: 'ఆర్థిక నిబంధనలు',
    terminationNotice: 'రద్దు నోటీసు గడువు',
    identifiedConcerns: 'గుర్తించబడిన సంభావ్య ఆందోళనలు & నిబంధనల నష్టాలు',
    noConcernsFound: 'ఈ పత్రంలో ఎటువంటి క్లిష్టమైన లేదా అసాధారణమైన అధిక రిస్క్ నిబంధనలు కనుగొనబడలేదు.',
    clauseAnalysis: 'విశ్లేషణ:',
    clauseRecommendation: 'సిఫార్సు / సలహా:',
    askDocumentHeader: 'ఆధారంగా ప్రశ్నలు అడగండి:',
    suggestedQuestions: 'సూచించబడిన ప్రశ్నలు:',
    relevantClause: 'సంబంధిత నిబంధన:',
    page: 'పేజీ:',
    askPlaceholder: 'ఉదా: ముందుగా రద్దు చేయడానికి నోటీసు కాలం ఎంత?',
    askBtn: 'అడగండి',
    processingDocTitle: 'పత్రం నుండి వచనాన్ని సంగ్రహించి విశ్లేషిస్తోంది...',
    processingDocDesc: 'పత్రం నిర్మాణం, చట్టపరమైన రిస్క్ స్కోర్ గణన మరియు సందర్భోచిత సారాంశం రూపొందించబడుతోంది.',
    errorTitle: 'పత్రాన్ని ప్రాసెస్ చేయడం సాధ్యపడలేదు',
    errorTip: 'చిట్కా: పీడీఎఫ్‌లో ఎంచుకోదగిన వచనం ఉందని మరియు అది పాస్‌వర్డ్ రక్షిత లేదా ఖాళీ స్కాన్ కాదని నిర్ధారించుకోండి. మీరు దిగువన ఉన్న నమూనా ఒప్పందాలను కూడా పరీక్షించవచ్చు.',
    dismiss: 'తీసివేయి',

    // Case Search
    caseSearchTitle: 'ల్యాండ్‌మార్క్ కేసులు & తీర్పుల శోధన',
    caseSearchDesc: 'సుప్రీం కోర్టు మరియు హైకోర్టు తీర్పులు మరియు నిర్ణయాలను శోధించండి.',
    searchCases: 'తీర్పులు, కేసు నంబర్లు లేదా చట్టపరమైన అంశాలను శోధించండి...',

    // Document Drafter
    draftTitle: 'లీగల్ నోటీసులు & ఒప్పందాల డ్రాఫ్టింగ్',
    draftDesc: 'చట్టపరమైన నోటీసులు, ఖాళీ నోటీసులు మరియు వినియోగదారుల ఫిర్యాదులను తయారు చేయండి.',
    generateDraft: 'లీగల్ డ్రాఫ్ట్ రూపొందించండి',

    // History
    historyTitle: 'చట్టపరమైన సంభాషణ & ప్రశ్న చరిత్ర',
    historyDesc: 'మీ మునుపటి AI చట్టపరమైన ప్రశ్నలు మరియు ఒప్పంద విశ్లేషణలను సమీక్షించండి.',
    noHistory: 'మునుపటి చట్టపరమైన సంభాషణలు ఏవీ కనుగొనబడలేదు.',

    // Settings
    settingsTitle: 'LexAI సెట్టింగ్‌లు & కాన్ఫిగరేషన్',
    settingsDesc: 'యూజర్ ప్రొఫైల్, అధికార పరిధి, భాష ప్రాధాన్యత మరియు AI మోడల్ ఎంపికలు.',
    languagePreference: 'ఇంటర్‌ఫేస్ మరియు AI భాష ప్రాధాన్యత',
    languagePreferenceDesc: 'ఇంటర్‌ఫేస్ మరియు AI చట్టపరమైన సంప్రదింపుల కోసం మీ ప్రాధాన్య భాషను ఎంచుకోండి.',
    userProfile: 'వినియోగదారు ప్రొఫైల్ సమాచారం',
    fullName: 'పూర్తి పేరు',
    emailAddress: 'ఈమెయిల్ చిరునామా',
    accountRole: 'ఖాతా పాత్ర',
    jurisdiction: 'ప్రాథమిక అధికార పరిధి',
    jurisdictionVal: 'భారతదేశం (కేంద్ర చట్టాలు మరియు హైకోర్టులు)',
    complianceTitle: 'చట్టపరమైన సమ్మతి & డేటా రక్షణ',

    // Disclaimer
    disclaimerPrefix: 'చట్టపరమైన నిరాకరణ:',
    disclaimerImportant: 'ముఖ్యమైన చట్టపరమైన నోటీసు:',
    disclaimerDefault: 'LexAI భారతీయ చట్టంపై ఆధారపడిన సాధారణ సమాచారాన్ని అందిస్తుంది మరియు ఇది అర్హత కలిగిన న్యాయవాది సలహాకు ప్రత్యామ్నాయం కాదు.'
  },

  ta: {
    // Brand & Header
    brandTagline: 'இந்திய சட்டம்',
    groundedInLaw: 'இந்திய சட்டத்தின் அடிப்படையில் (BNS 2023 / அரசியலமைப்பு / CPC)',
    generalInfo: 'பொது சட்ட தகவல்',
    
    // Navigation
    navDashboard: 'முகப்பு பலகை',
    navChat: 'AI சட்ட உதவியாளர்',
    navResearch: 'சட்ட ஆராய்ச்சி',
    navDocuments: 'ஆவண பகுப்பாய்வி',
    navCases: 'வழக்கு மற்றும் தீர்ப்பு தேடல்',
    navDrafts: 'ஆவண வரைவு',
    navHistory: 'வரலாறு',
    navAdmin: 'நிர்வாக தரவு',
    navSettings: 'அமைப்புகள்',
    navLogout: 'வெளியேறு',

    // Language switcher
    language: 'மொழி',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',

    // Dashboard
    dashboardWelcome: 'மீண்டும் நல்வரவு',
    dashboardTagline: 'இந்திய சட்டம், BNS 2023, அரசியலமைப்பு மற்றும் உச்ச நீதிமன்ற தீர்ப்புகளின் அடிப்படையில் உங்கள் பிரத்யேக AI சட்ட ஆராய்ச்சி உதவியாளர்.',
    coreServices: 'முக்கிய சட்ட சேவைகள்',
    exploreFeature: 'சேவையைத் திறக்கவும்',
    suggestedInquiries: 'பரிந்துரைக்கப்பட்ட சட்ட வினவல்கள்',
    
    serviceChatTitle: 'AI சட்ட உதவியாளர்',
    serviceChatDesc: 'குத்தகைதாரர் உரிமைகள், BNS 2023 அல்லது சட்ட அறிவிப்புகள் குறித்த கேள்விகளைக் கேளுங்கள்.',
    serviceDocTitle: 'ஒப்பந்த பகுப்பாய்வு',
    serviceDocDesc: 'மறைக்கப்பட்ட அபாயங்கள் மற்றும் சிக்கல்களைக் கண்டறிய ஒப்பந்தங்கள் அல்லது குத்தகை ஆவணங்களைப் பதிவேற்றவும்.',
    serviceResearchTitle: 'சட்ட ஆராய்ச்சி',
    serviceResearchDesc: 'இந்திய சட்டங்கள், BNS, CrPC, சான்றியல் சட்டம் ஆகியவற்றைத் தேடுங்கள்.',
    serviceDraftTitle: 'சட்ட அறிவிப்பு வரைவு',
    serviceDraftDesc: 'முறைப்படியான சட்ட அறிவிப்புகள், ஒப்பந்தங்கள் அல்லது புகார்களை உருவாக்கவும்.',
    serviceCaseTitle: 'உச்ச நீதிமன்ற வழக்குகளைத் தேடுங்கள்',
    serviceCaseDesc: 'முக்கிய உச்ச நீதிமன்ற தீர்ப்புகளை ஆராயுங்கள்.',

    // Chat Page
    newQuery: 'புதிய சட்ட வினவல்',
    recentQueries: 'சமீபத்திய வினவல்கள்',
    noChatHistory: 'முந்தைய வரலாறு இல்லை',
    chatPlaceholder: 'இந்திய சட்டம் குறித்த ஏதேனும் கேள்வியைக் கேளுங்கள்...',
    chatCounselTitle: 'LexAI சட்ட ஆலோசனை',
    chatCounselDesc: 'இந்திய சட்டம், வாடகை உரிமைகள் மற்றும் சட்ட நடைமுறைகள் குறித்து கேளுங்கள்.',
    exampleQuestionsHeader: 'மாதிரி கேள்விகள்:',
    sourcesCited: 'மேற்கோள் காட்டப்பட்ட சட்டப் பிரிவுகள் & முன்மாதிரிகள்:',
    searchingContext: 'சட்ட பிரிவுகள் மற்றும் RAG தரவுகளைத் தேடுகிறது...',
    you: 'நீங்கள்',
    counsel: 'LexAI வழக்கறிஞர்',

    // Legal Research
    researchTitle: 'சட்டப்பூர்வ ஆராய்ச்சி',
    researchDesc: 'இந்திய சட்டங்கள், குற்றவியல் மற்றும் உரிமையியல் நடைமுறைகளை ஆராயுங்கள்.',
    searchStatutes: 'சட்டங்கள் அல்லது பிரிவுகளைத் தேடுங்கள்...',
    allCategories: 'அனைத்து பிரிவுகளும்',

    // Document Analyzer
    docAnalyzerTitle: 'சட்ட ஆவண இடர் பகுப்பாய்வி',
    docAnalyzerDesc: 'ஒப்பந்தங்கள் அல்லது அறிவிப்புகளைப் பதிவேற்றி சுருக்கம் மற்றும் இடர் எச்சரிக்கைகளைப் பெறுங்கள்.',
    uploadDoc: 'ஆவணத்தைப் பதிவேற்றவும் (PDF/DOCX/TXT)',
    analyzingDoc: 'ஆவணம் பகுப்பாய்வு செய்யப்படுகிறது...',
    analyzeAnother: 'மற்றொரு ஆவணத்தை பகுப்பாய்வு செய்க',
    dropzoneTitle: 'ஆவணத்தை இங்கே பதிவேற்ற கிளிக் செய்யவும் அல்லது இழுத்து விடவும்',
    dropzoneActive: 'ஆவணத்தை பகுப்பாய்வு செய்ய இங்கே விடவும்',
    dropzoneSubtitle: 'வாடகை ஒப்பந்தங்கள், வேலைவாய்ப்பு ஒப்பந்தங்கள், கடன் ஆவணங்களை ஆதரிக்கிறது.',
    dropzoneBadge: 'உரையைப் பிரித்தெடுக்கிறது • அதிக ஆபத்துள்ள விதிகளைக் கண்டறிகிறது',
    sampleAgreementsTitle: 'மாதிரி சட்ட ஒப்பந்தங்களை முயற்சிக்கவும்',
    sampleRentalAgreement: 'குடியிருப்பு வாடகை ஒப்பந்தம்',
    sampleMutualNda: 'ரகசியத்தன்மை ஒப்பந்தம் (NDA)',
    sampleEmploymentContract: 'வேலைவாய்ப்பு ஒப்பந்தம்',
    sampleDesc: 'இடர் மதிப்பீட்டை சோதிக்கவும்',
    tabSummary: 'சுருக்கம் & இடர் பகுப்பாய்வு',
    tabQA: 'ஆவணக் கேள்விகளைக் கேளுங்கள்',
    overallRiskAssessment: 'ஒட்டுமொத்த இடர் மதிப்பீடு',
    concernLevel: 'இடர் நிலை',
    importantParties: 'முக்கிய தரப்பினர்',
    effectiveDate: 'நடைமுறை தேதி',
    financialTerms: 'நிதி விதிமுறைகள்',
    terminationNotice: 'முடிவு அறிவிப்பு',
    identifiedConcerns: 'கண்டறியப்பட்ட சட்ட அபாயங்கள்',
    noConcernsFound: 'இந்த ஆவணத்தில் முக்கியமான ஆபத்துகள் எதுவும் கண்டறியப்படவில்லை.',
    clauseAnalysis: 'பகுப்பாய்வு:',
    clauseRecommendation: 'பரிந்துரை:',
    askDocumentHeader: 'ஆவணத்தின் அடிப்படையில் கேள்விகளைக் கேளுங்கள்:',
    suggestedQuestions: 'பரிந்துரைக்கப்பட்ட கேள்விகள்:',
    relevantClause: 'தொடர்புடைய விதிமுறை:',
    page: 'பக்கம்:',
    askPlaceholder: 'எ.கா. ஒப்பந்தத்தை முன்கூட்டியே முடிக்க அறிவிப்பு காலம் என்ன?',
    askBtn: 'கேள்',
    processingDocTitle: 'ஆவண உரை செயலாக்கப்படுகிறது...',
    processingDocDesc: 'ஆவண பகுப்பாய்வு மற்றும் இடர் மதிப்பெண் கணக்கிடப்படுகிறது.',
    errorTitle: 'ஆவணத்தைச் செயலாக்க முடியவில்லை',
    errorTip: 'உதவிக்குறிப்பு: PDF-ல் படிக்கக்கூடிய உரை இருப்பதை உறுதிப்படுத்தவும்.',
    dismiss: 'விலக்கு',

    // Case Search
    caseSearchTitle: 'முக்கிய வழக்குகள் மற்றும் தீர்ப்புகள் தேடல்',
    caseSearchDesc: 'உச்ச நீதிமன்ற மற்றும் உயர் நீதிமன்ற முன்மாதிரிகளைத் தேடுங்கள்.',
    searchCases: 'தீர்ப்புகள் அல்லது மேற்கோள்களைத் தேடுங்கள்...',

    // Document Drafter
    draftTitle: 'சட்ட அறிவிப்பு & ஒப்பந்த வரைவாளர்',
    draftDesc: 'முறைப்படியான சட்ட அறிவிப்புகள் மற்றும் புகார்களை உருவாக்குங்கள்.',
    generateDraft: 'வரைவை உருவாக்கவும்',

    // History
    historyTitle: 'சட்ட வினவல் வரலாறு',
    historyDesc: 'உங்கள் முந்தைய AI கேள்விகள் மற்றும் பகுப்பாய்வுகளை மதிப்பாய்வு செய்யவும்.',
    noHistory: 'முந்தைய வரலாறு எதுவும் இல்லை.',

    // Settings
    settingsTitle: 'LexAI அமைப்புகள்',
    settingsDesc: 'பயனர் விவரக்குறிப்பு, மொழி விருப்பம் மற்றும் அமைப்புகள்.',
    languagePreference: 'மொழி விருப்பம்',
    languagePreferenceDesc: 'பயன்பாட்டுக்கான மொழியைத் தேர்ந்தெடுக்கவும்.',
    userProfile: 'பயனர் சுயவிவரம்',
    fullName: 'முழு பெயர்',
    emailAddress: 'மின்னஞ்சல் முகவரி',
    accountRole: 'கணக்கு பங்கு',
    jurisdiction: 'சட்ட வரம்பு',
    jurisdictionVal: 'இந்தியா (மத்திய சட்டங்கள் மற்றும் உயர் நீதிமன்றங்கள்)',
    complianceTitle: 'சட்ட இணக்கம் & தரவு பாதுகாப்பு',

    // Disclaimer
    disclaimerPrefix: 'சட்ட மறுப்பு:',
    disclaimerImportant: 'முக்கியமான சட்ட அறிவிப்பு:',
    disclaimerDefault: 'LexAI இந்திய சட்டத்தை அடிப்படையாகக் கொண்ட பொதுவான தகவல்களை மட்டுமே வழங்குகிறது, இது வழக்கறிஞரின் சட்ட ஆலோசனைக்கு மாற்றாகாது.'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('lexai_lang') || localStorage.getItem('lexai_language') || 'en';
  });

  const setLanguage = (langCode) => {
    if (['en', 'hi', 'te', 'ta'].includes(langCode)) {
      setLanguageState(langCode);
      localStorage.setItem('lexai_lang', langCode);
      localStorage.setItem('lexai_language', langCode);
    }
  };

  const t = (key, fallback = '') => {
    const langObj = translations[language] || translations.en;
    return langObj[key] || translations.en[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
