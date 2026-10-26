/**
 * Multi-lingual localization helper for Statutory Sources & Legal Citations
 * Translates source card titles, act badges, and summary text into Telugu and Hindi.
 */

const SOURCE_TRANSLATIONS = {
  // Rent agreement & security deposit refund
  'doc-rent-agreement-deposit': {
    en: {
      title: 'Rental Agreement & Security Deposit Refund Rules (Model Tenancy Act & TPA)',
      act: 'Model Tenancy Act 2021 & Transfer of Property Act 1882',
      text: 'Statutory rules: 1. Max 2 months rent deposit for residential properties, 2. Mandatory refund within 30 days of vacating, 3. No deductions for routine painting or wear and tear, 4. 11-month agreement valid on stamp paper, 5. Mandatory 1-month eviction notice.'
    },
    te: {
      title: 'అద్దె ఒప్పందం & సెక్యూరిటీ డిపాజిట్ వాపసు నిబంధనలు (మోడల్ టెనెన్సీ చట్టం & TPA)',
      act: 'మోడల్ టెనెన్సీ చట్టం 2021 & ఆస్తి బదిలీ చట్టం 1882 (సెక్షన్ 105)',
      text: 'భారతీయ చట్టం ప్రకారం అద్దె ఒప్పందం & సెక్యూరిటీ డిపాజిట్ నిబంధనలు: 1. నివాసానికి గరిష్టంగా 2 నెలల అద్దె డిపాజిట్ పరిమితి, 2. ఇల్లు ఖాళీ చేసిన 30 రోజుల్లో డిపాజిట్ వాపసు తప్పనిసరి, 3. సాధారణ అరుగుదలకు (Normal Wear & Tear) కోత విధించరాదు, 4. 11 నెలల వరకు నోటరీ ఒప్పందం సరిపోతుంది, 5. ఖాళీ చేయించడానికి 1 నెల ముందస్తు నోటీసు ఇవ్వాలి.'
    },
    hi: {
      title: 'किराया समझौता और सुरक्षा जमा वापसी नियम (मॉडल टेनेंसी एक्ट एवं TPA)',
      act: 'मॉडल टेनेंसी एक्ट 2021 एवं संपत्ति अंतरण अधिनियम 1882 (धारा 105)',
      text: 'भारतीय कानून के तहत किराया समझौता एवं सुरक्षा जमा नियम: 1. आवासीय संपत्तियों हेतु अधिकतम 2 महीने का किराया ही सिक्योरिटी डिपॉजिट, 2. मकान खाली करने के 30 दिनों में पूर्ण जमा वापसी, 3. सामान्य टूट-फूट पर कटौती वर्जित, 4. 11 महीने तक नोटरी समझौता मान्य, 5. खाली कराने हेतु 1 महीने का पूर्व लिखित नोटिस।'
    }
  },

  // Car documents
  'doc-car-transfer-forms': {
    en: {
      title: 'Car Documents: Vehicle Ownership Transfer (Form 29, Form 30 & RC)',
      act: 'Motor Vehicles Act 1988 (Section 50)',
      text: 'Mandatory car transfer documents: 1. Registration Certificate (RC), 2. Form 29 (Notice of Transfer by seller), 3. Form 30 (Transfer Application within 14 days), 4. Form 28 (NOC for inter-state), 5. Form 35 (Hypothecation cancellation), 6. Valid Insurance & PUC.'
    },
    te: {
      title: 'కారు పత్రాలు: వాహన యాజమాన్య బదిలీ (ఫారమ్ 29, ఫారమ్ 30 & RC)',
      act: 'మోటారు వాహనాల చట్టం 1988 (సెక్షన్ 50)',
      text: 'భారతీయ చట్టం ప్రకారం అవసరమైన కారు పత్రాలు: 1. రిజిస్ట్రేషన్ సర్టిఫికేట్ (RC), 2. ఫారమ్ 29 (అమ్మకందారు నోటీసు), 3. ఫారమ్ 30 (యజమాని బదిలీ దరఖాస్తు - 14 రోజుల్లో), 4. ఫారమ్ 28 (NOC), 5. ఫారమ్ 35 (హైపోథికేషన్ రద్దు), 6. చెల్లుబాటు అయ్యే ఇన్సూరెన్స్ & PUC.'
    },
    hi: {
      title: 'कार दस्तावेज: वाहन स्वामित्व हस्तांतरण (फॉर्म 29, फॉर्म 30 एवं RC)',
      act: 'मोटर वाहन अधिनियम 1988 (धारा 50)',
      text: 'भारतीय कानून के तहत आवश्यक वाहन दस्तावेज: 1. पंजीकरण प्रमाणपत्र (RC), 2. फॉर्म 29 (विक्रेता नोटिस), 3. फॉर्म 30 (हस्तांतरण आवेदन - 14 दिनों में), 4. फॉर्म 28 (एनओसी), 5. फॉर्म 35 (हाइपोथीकेशन हटाना), 6. वैध बीमा एवं PUC।'
    }
  },
  'doc-car-hypothecation-noc': {
    en: {
      title: 'Car Loan Hypothecation Removal (Form 35 & Bank NOC)',
      act: 'Motor Vehicles Act 1988 (Section 51)',
      text: 'Vehicle hypothecation termination: Upon full repayment of loan, submit bank NOC and 2 signed copies of Form 35 to the RTO to remove bank lien from the RC.'
    },
    te: {
      title: 'కారు లోన్ క్లియరెన్స్: హైపోథికేషన్ రద్దు (ఫారమ్ 35 & బ్యాంక్ NOC)',
      act: 'మోటారు వాహనాల చట్టం, 1988 (సెక్షన్ 51)',
      text: 'వాహనం RC పై హైపోథికేషన్ తొలగింపు: లోన్ పూర్తిగా తీరిన తర్వాత బ్యాంక్ ఇచ్చే NOC మరియు ఫారమ్ 35 పత్రాలను 90 రోజుల్లోగా RTO లో సమర్పించి RC నుండి బ్యాంక్ పేరును తొలగించాలి.'
    },
    hi: {
      title: 'कार लोन समापन: हाइपोथीकेशन रद्दीकरण (फॉर्म 35 एवं बैंक NOC)',
      act: 'मोटर वाहन अधिनियम, 1988 (धारा 51)',
      text: 'वाहन RC से हाइपोथीकेशन हटाना: ऋण चुकता होने पर बैंक से प्राप्त NOC और फॉर्म 35 को 90 दिनों में RTO में जमा कर RC से बैंक का नाम हटवाएं।'
    }
  },

  // House documents
  'doc-house-sale-deed-title': {
    en: {
      title: 'House & Property Documents: Sale Deed, Title Chain & Mutation',
      act: 'Registration Act 1908 (Section 17) & Transfer of Property Act 1882',
      text: 'Core property documents: 1. Registered Sale Deed, 2. 30-year Mother Deed title chain, 3. Encumbrance Certificate (EC), 4. Patta / Khata revenue mutation record, 5. Municipal Sanction Plan & OC.'
    },
    te: {
      title: 'ఇల్లు & స్థిరాస్తి పత్రాలు: సేల్ డీడ్, లింక్ డాక్యుమెంట్లు & మ్యుటేషన్',
      act: 'రిజిస్ట్రేషన్ చట్టం 1908 (సెక్షన్ 17) & ఆస్తి బదిలీ చట్టం 1882',
      text: 'ఇల్లు లేదా స్థలం కొనుగోలుకు అవసరమైన పత్రాలు: 1. అసలు సేల్ డీడ్ (రిజిస్టర్డ్ విక్రయ పత్రం), 2. మదర్ డీడ్ (30 ఏళ్ల లింక్ పత్రాలు), 3. ఎన్‌కంబరెన్స్ సర్టిఫికేట్ (EC), 4. పట్టా / ఖాటా / పహాణి రికార్డులు, 5. మున్సిపల్ అప్రూవల్ ప్లాన్ & OC.'
    },
    hi: {
      title: 'मकान एवं संपत्ति दस्तावेज: सेल डीड, मदर डीड एवं दाखिल-खारिज',
      act: 'पंजीकरण अधिनियम 1908 (धारा 17) एवं संपत्ति अंतरण अधिनियम',
      text: 'मकान या जमीन खरीदने हेतु आवश्यक दस्तावेज: 1. विक्रय विलेख (पंजीकृत बैनामा), 2. 30 वर्षों की मदर डीड श्रृंखला, 3. भारमुक्ति प्रमाण पत्र (EC), 4. दाखिल-खारिज (म्यूटेशन/खतौनी), 5. स्वीकृत नक्शा एवं अधिभोग प्रमाणपत्र (OC)।'
    }
  },
  'doc-house-encumbrance-ec': {
    en: {
      title: 'Encumbrance Certificate (EC) - Form 15 vs Form 16 (Nil EC)',
      act: 'Registration Act 1908 (Section 57)',
      text: 'Encumbrance Certificate rules: Form 15 lists all registered transaction deeds and mortgages. Form 16 (Nil EC) certifies the property is 100% free from any registered loans, mortgages, or court attachments.'
    },
    te: {
      title: 'ఆస్తి భారాన్వేషణ ధృవీకరణ పత్రం (EC) - ఫారమ్ 15 vs ఫారమ్ 16',
      act: 'రిజిస్ట్రేషన్ చట్టం, 1908 (సెక్షన్ 57)',
      text: 'ఎన్‌కంబరెన్స్ సర్టిఫికేట్ ప్రాముఖ్యత: ఫారమ్ 15 (గత లావాదేవీలు మరియు తాకట్టు వివరాలు చూపుతుంది), ఫారమ్ 16 (నిల్ EC - ఆస్తిపై ఎటువంటి బ్యాంక్ రుణాలు లేదా కోర్టు వివాదాలు లేవని ధృవీకరిస్తుంది).'
    },
    hi: {
      title: 'संपत्ति भारमुक्ति प्रमाणपत्र (EC) - फॉर्म 15 बनाम फॉर्म 16',
      act: 'पंजीकरण अधिनियम, 1908 (धारा 57)',
      text: 'भारमुक्ति प्रमाण पत्र का महत्व: फॉर्म 15 (पंजीकृत लेन-देन और बंधक का विवरण), फॉर्म 16 (निल EC - संपत्ति पर कोई ऋण या अदालती कुर्की नहीं होने का प्रमाण)।'
    }
  },

  // Home loan documents
  'doc-home-loan-modt-cersai': {
    en: {
      title: 'Home Loan Documents: Sanction Letter, MODT & CERSAI Registry',
      act: 'SARFAESI Act 2002 & Transfer of Property Act 1882 (Section 58(f))',
      text: 'Home loan safeguards: 1. Loan Sanction Letter (EMI schedule, rate), 2. MODT (Memorandum of Deposit of Title Deeds), 3. CERSAI registration within 30 days to block duplicate loans, 4. 30-day original deed return upon full payment.'
    },
    te: {
      title: 'హోమ్ లోన్ పత్రాలు: శాంక్షన్ లెటర్, MODT & CERSAI రిజిస్ట్రేషన్',
      act: 'SARFAESI చట్టం 2002 & ఆస్తి బదిలీ చట్టం 1882 (సెక్షన్ 58(f))',
      text: 'హోమ్ లోన్ ముఖ్య పత్రాలు: 1. లోన్ శాంక్షన్ లెటర్ (వడ్డీ రేటు, EMI షరతులు), 2. MODT (టైటిల్ డీడ్స్ డిపాజిట్ ద్వారా మార్ట్‌గేజ్), 3. CERSAI రిజిస్ట్రీ (డూప్లికేట్ లోన్ల నిరోధం), 4. లోన్ పూర్తయిన 30 రోజుల్లో అసలు పత్రాలు తిరిగి పొందడం.'
    },
    hi: {
      title: 'होम लोन कानूनी दस्तावेज: स्वीकृति पत्र, MODT एवं CERSAI',
      act: 'सरफेसी (SARFAESI) अधिनियम 2002 एवं संपत्ति अंतरण अधिनियम (धारा 58(f))',
      text: 'होम लोन प्रमुख दस्तावेज: 1. लोन स्वीकृति पत्र (ब्याज दर एवं EMI शर्तें), 2. MODT (मूल दस्तावेज बंधक अनुबंध), 3. CERSAI पंजीकरण (धोखाधड़ी रोकथाम), 4. ऋण समाप्ति पर 30 दिनों में मूल दस्तावेज वापसी।'
    }
  },
  'doc-home-loan-default-sarfaesi': {
    en: {
      title: 'Home Loan Default: SARFAESI Act 2002 & Borrower Protections',
      act: 'SARFAESI Act 2002 (Section 13 & 17)',
      text: 'Borrower rights: 90-day NPA classification, mandatory 60-day demand notice under Section 13(2) before bank can take possession, right to submit written objections and appeal before Debt Recovery Tribunal (DRT).'
    },
    te: {
      title: 'హోమ్ లోన్ డిఫాల్ట్: SARFAESI చట్టం 2002 & రుణగ్రహీత చట్టపరమైన హక్కులు',
      act: 'SARFAESI చట్టం, 2002 (సెక్షన్ 13 & 17)',
      text: 'హోమ్ లోన్ డిఫాల్ట్ హక్కులు: 90 రోజుల తర్వాత NPA వర్గీకరణ, సెక్షన్ 13(2) కింద 60 రోజుల ముందస్తు డిమాండ్ నోటీసు తప్పనిసరి, రుణగ్రహీత అభ్యంతరాలు తెలపవచ్చు మరియు DRT ట్రిబ్యునల్‌లో అప్పీల్ చేసుకోవచ్చు.'
    },
    hi: {
      title: 'होम लोन डिफ़ॉल्ट: SARFAESI अधिनियम 2002 एवं ऋणी के कानूनी अधिकार',
      act: 'SARFAESI अधिनियम, 2002 (धारा 13 एवं 17)',
      text: 'ऋणी के अधिकार: 90 दिनों बाद NPA वर्गीकरण, धारा 13(2) के तहत 60 दिनों का औपचारिक नोटिस अनिवार्य, ऋणी द्वारा आपत्ति दर्ज करने तथा DRT ट्रिब्यूनल में अपील का अधिकार।'
    }
  },

  // Gold loan documents
  'doc-gold-loan-agreement-rbi': {
    en: {
      title: 'Gold Loan Pledge Rules: Purity, 75% LTV Cap & RBI Guidelines',
      act: 'Indian Contract Act 1872 (Section 172-176) & RBI Directions',
      text: 'Gold loan regulations: 1. Pledge Agreement (Section 172), 2. Assay Purity Receipt (BIS 916 Hallmark / HUID), 3. Maximum 75% Loan-to-Value cap, 4. Mandatory 14-day pre-auction registered notice, 5. Surplus auction money return.'
    },
    te: {
      title: 'బంగారు లోన్ పత్రాలు: తాకట్టు ఒప్పందం, స్వచ్ఛత ధృవీకరణ, LTV & RBI నిబంధనలు',
      act: 'భారతీయ కాంట్రాక్ట్ చట్టం 1872 (సెక్షన్ 172-176) & RBI మార్గదర్శకాలు',
      text: 'గోల్డ్ లోన్ పత్రాలు & హక్కులు: 1. ప్లెడ్జ్ అగ్రిమెంట్ (సెక్షన్ 172), 2. అప్రైజర్ రసీదు (BIS 916 హాల్‌మార్క్ / HUID), 3. గరిష్ట 75% LTV పరిమితి, 4. వేలం ముందు 14 రోజుల రిజిస్టర్డ్ నోటీసు తప్పనిసరి, 5. మిగులు సొమ్ము వాపసు.'
    },
    hi: {
      title: 'गोल्ड लोन दस्तावेज: गिरवी अनुबंध, शुद्धता रसीद, LTV एवं RBI नियम',
      act: 'भारतीय अनुबंध अधिनियम 1872 (धारा 172-176) एवं RBI दिशानिर्देश',
      text: 'गोल्ड लोन कानूनी ढांचा: 1. गिरवी अनुबंध (धारा 172), 2. शुद्धता जांच रसीद (BIS 916 हॉलमार्क / HUID), 3. अधिकतम 75% LTV सीमा, 4. नीलामी पूर्व 14-दिवसीय लिखित नोटिस अनिवार्य, 5. अतिरिक्त नीलामी राशि वापसी।'
    }
  },
  'doc-gold-hallmark-bis': {
    en: {
      title: 'Gold Purity Authenticity: BIS Hallmark (6-Digit HUID) & Invoice',
      act: 'Bureau of Indian Standards (BIS) Act 2016',
      text: 'Gold buyer rights: Genuine jewellery must carry BIS Logo, Karat mark (22K916) and 6-digit alphanumeric HUID code verifiable on the official BIS Care App.'
    },
    te: {
      title: 'బంగారు స్వచ్ఛత & కొనుగోలు పత్రాలు: BIS హాల్‌మార్క్ (6-అంకెల HUID) & బిల్లు',
      act: 'బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ చట్టం, 2016',
      text: 'బంగారం స్వచ్ఛత హక్కులు: అసలైన బంగారంపై BIS లోగో, క్యారెట్ మార్క్ (22K916) మరియు 6-అంకెల HUID తప్పనిసరి. BIS Care App ద్వారా HUID ధృవీకరించవచ్చు.'
    },
    hi: {
      title: 'सोने की शुद्धता दस्तावेज: BIS हॉलमार्क (6-अंकीय HUID) एवं रसीद',
      act: 'भारतीय मानक ब्यूरो (BIS) अधिनियम, 2016',
      text: 'सोना खरीद में उपभोक्ता अधिकार: असली सोने पर BIS लोगो, शुद्धता (22K916) और 6-अंकों का HUID कोड अनिवार्य है जिसे BIS Care App पर जांचा जा सकता है।'
    }
  },

  // General Law & Penal Codes
  'leg-bns-318': {
    en: {
      title: 'Bharatiya Nyaya Sanhita (BNS 2023): Cheating & Fraud',
      act: 'Bharatiya Nyaya Sanhita, 2023 (Section 318)',
      text: 'Under Section 318 BNS, cheating and dishonest inducement to deliver property carries imprisonment up to 7 years and fine.'
    },
    te: {
      title: 'భారతీయ న్యాయ సంహిత (BNS 2023): మోసం & చీటింగ్',
      act: 'భారతీయ న్యాయ సంహిత, 2023 (సెక్షన్ 318)',
      text: 'BNS సెక్షన్ 318 కింద మోసం, తప్పుడు హామీలు, మరియు ఆర్థిక మోసాలకు గరిష్టంగా 7 సంవత్సరాల జైలు శిక్ష మరియు జరిమానా విధించబడుతుంది.'
    },
    hi: {
      title: 'भारतीय न्याय संहिता (BNS 2023): धोखाधड़ी एवं छल',
      act: 'भारतीय न्याय संहिता, 2023 (धारा 318)',
      text: 'BNS धारा 318 के तहत धोखाधड़ी और वित्तीय गबन के अपराध में अधिकतम 7 वर्ष का कारावास और जुर्माना प्रावधानित है।'
    }
  },
  'leg-ni-138': {
    en: {
      title: 'Negotiable Instruments Act 1881 - Section 138 (Cheque Bounce)',
      act: 'Negotiable Instruments Act, 1881',
      text: 'Cheque bounce: Payee must issue a formal legal demand notice within 30 days of bank memo. Drawer gets 15 days to pay; if unpaid, criminal case filed in Magistrate court within 30 days.'
    },
    te: {
      title: 'నెగోషియబుల్ ఇన్‌స్ట్రుమెంట్స్ చట్టం, 1881 - సెక్షన్ 138 (చెక్కు బౌన్స్)',
      act: 'నెగోషియబుల్ ఇన్‌స్ట్రుమెంట్స్ చట్టం, 1881',
      text: 'ఖాతాలో తగినంత సొమ్ము లేక చెక్కు బౌన్స్ అయితే 30 రోజుల్లో లీగల్ నోటీసు పంపాలి. 15 రోజుల్లో చెల్లించకపోతే క్రిమినల్ కేసు దాఖలు చేయవచ్చు.'
    },
    hi: {
      title: 'परक्राम्य लिखत अधिनियम 1881 - धारा 138 (चेक बाउंस)',
      act: 'परक्राम्य लिखत अधिनियम, 1881',
      text: 'चेक बाउंस अपराध: बैंक मेमो मिलने के 30 दिनों के भीतर वैधानिक मांग नोटिस भेजना अनिवार्य है। 15 दिनों में भुगतान न होने पर परिवाद दर्ज करें।'
    }
  },
  'leg-copra-35': {
    en: {
      title: 'Consumer Protection Act 2019: Service Deficiency & Compensation',
      act: 'Consumer Protection Act, 2019 (Section 35)',
      text: 'Consumer remedies: If a builder, landlord, bank, or vendor provides deficient service or withholds money unfairly, file a complaint in District Consumer Commission for refund and damages.'
    },
    te: {
      title: 'వినియోగదారుల రక్షణ చట్టం 2019: సేవా లోపం & పరిహారం',
      act: 'వినియోగదారుల రక్షణ చట్టం, 2019 (సెక్షన్ 35)',
      text: 'వినియోగదారుల హక్కులు: బ్యాంకింగ్, రియల్ ఎస్టేట్, అద్దె డిపాజిట్ లేదా వస్తువులలో లోపం ఉన్నప్పుడు జిల్లా వినియోగదారుల ఫోరమ్‌లో నష్టపరిహారం కోరవచ్చు.'
    },
    hi: {
      title: 'उपभोक्ता संरक्षण अधिनियम 2019: सेवा में कमी एवं क्षतिपूर्ति',
      act: 'उपभोक्ता संरक्षण अधिनियम, 2019 (धारा 35)',
      text: 'उपभोक्ता अधिकार: बैंकिंग, वाहन, या मकान मालिक की सेवा में कमी होने पर जिला उपभोक्ता फोरम में शिकायत दर्ज कर मुआवजा प्राप्त किया जा सकता है।'
    }
  }
};

/**
 * Returns localized source properties (title, act, text) based on target language code.
 */
export function getLocalizedSource(source, language = 'en') {
  if (!source) return source;

  // 1. Direct match in local catalog by id
  if (source.id && SOURCE_TRANSLATIONS[source.id]) {
    const translation = SOURCE_TRANSLATIONS[source.id][language];
    if (translation) {
      return {
        ...source,
        title: translation.title,
        act: translation.act,
        text: translation.text
      };
    }
  }

  // Check matching by title keywords if id wasn't an exact match
  const tLower = (source.title || '').toLowerCase();
  if (SOURCE_TRANSLATIONS['doc-car-transfer-forms'][language] && 
      (tLower.includes('कार') || tLower.includes('కారు') || tLower.includes('car')) &&
      (tLower.includes('29') || tLower.includes('30') || tLower.includes('हस्तांतरण') || tLower.includes('transfer') || tLower.includes('స్వామిత్వ'))) {
    return { ...source, ...SOURCE_TRANSLATIONS['doc-car-transfer-forms'][language] };
  }
  if (SOURCE_TRANSLATIONS['doc-car-hypothecation-noc'][language] && 
      (tLower.includes('कार') || tLower.includes('కారు') || tLower.includes('car')) &&
      (tLower.includes('35') || tLower.includes('हाइपोथीकेशन') || tLower.includes('hypothecation') || tLower.includes('లోన్ సమాపన') || tLower.includes('రద్దు'))) {
    return { ...source, ...SOURCE_TRANSLATIONS['doc-car-hypothecation-noc'][language] };
  }
  if (SOURCE_TRANSLATIONS['doc-rent-agreement-deposit'][language] && 
      (tLower.includes('किराया') || tLower.includes('అద్దె') || tLower.includes('rent') || tLower.includes('deposit') || tLower.includes('painting') || tLower.includes('రంగుల') || tLower.includes('पुताई'))) {
    return { ...source, ...SOURCE_TRANSLATIONS['doc-rent-agreement-deposit'][language] };
  }
  if (SOURCE_TRANSLATIONS['doc-house-sale-deed-title'][language] && 
      (tLower.includes('मकान') || tLower.includes('ఇల్లు') || tLower.includes('sale deed') || tLower.includes('बैनामा') || tLower.includes('దస్తావేజు') || tLower.includes('మదర్ డీడ్') || tLower.includes('mother deed'))) {
    return { ...source, ...SOURCE_TRANSLATIONS['doc-house-sale-deed-title'][language] };
  }
  if (SOURCE_TRANSLATIONS['doc-house-encumbrance-ec'][language] && 
      (tLower.includes('भारमुक्त') || tLower.includes('భారాన్వేషణ') || tLower.includes('encumbrance') || tLower.includes('form 16') || tLower.includes('nil ec') || tLower.includes('ఫారమ్ 16') || tLower.includes('फॉर्म 16'))) {
    return { ...source, ...SOURCE_TRANSLATIONS['doc-house-encumbrance-ec'][language] };
  }

  // 2. Direct embedded localization from server
  if (language === 'te' && source.te) {
    return {
      ...source,
      title: source.te.title || source.title,
      act: source.te.act || source.act,
      text: source.te.text || source.text
    };
  }
  if (language === 'hi' && source.hi) {
    return {
      ...source,
      title: source.hi.title || source.title,
      act: source.hi.act || source.act,
      text: source.hi.text || source.text
    };
  }
  if (language === 'en' && source.en) {
    return {
      ...source,
      title: source.en.title || source.title,
      act: source.en.act || source.act,
      text: source.en.text || source.text
    };
  }

  // 3. Fallback heuristic
  if (language === 'en') {
    return {
      ...source,
      title: (source.title || '')
        .replace(/कार दस्तावेज.*/, 'Car Documents: Ownership Transfer (Form 29 & 30)')
        .replace(/కారు పత్రాలు.*/, 'Car Documents: Ownership Transfer (Form 29 & 30)')
        .replace(/किराया समझौता.*/, 'Rental Agreement & Security Deposit Rules')
        .replace(/అద్దె ఒప్పందం.*/, 'Rental Agreement & Security Deposit Rules')
        .replace(/मकान एवं संपत्ति.*/, 'House & Property Documents (Sale Deed & Mutation)')
        .replace(/ఇల్లు & స్థిరాస్తి.*/, 'House & Property Documents (Sale Deed & Mutation)'),
      act: (source.act || '')
        .replace(/मोटर वाहन अधिनियम.*/, 'Motor Vehicles Act 1988')
        .replace(/మోటారు వాహనాల చట్టం.*/, 'Motor Vehicles Act 1988')
        .replace(/मॉडल टेनेंसी एक्ट.*/, 'Model Tenancy Act 2021')
        .replace(/మోడల్ టెనెన్సీ చట్టం.*/, 'Model Tenancy Act 2021')
    };
  }

  return source;
}
