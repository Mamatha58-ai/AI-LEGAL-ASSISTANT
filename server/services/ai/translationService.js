/**
 * Multilingual Translation Service for LexAI Legal Assistant
 * Translates conversation messages, statutory guidance, and disclaimers
 * between English, Hindi, Telugu, and Tamil.
 */

import { GoogleGenAI } from '@google/genai';
import { getLocalizedLegalDocument } from '../legal-search/indianLegalKnowledgeBase.js';

// Full-Block Offline Translations for Instant Exact Conversion
const FULL_BLOCK_MAP = {
  painting: {
    te: `### రంగుల (Painting) ఖర్చుల కోత & అద్దెదారు చట్టపరమైన రక్షణ

భారతీయ అద్దె చట్టాలు మరియు **మోడల్ టెనెన్సీ చట్టం (Model Tenancy Act 2021)** ప్రకారం:

- **రంగుల ఖర్చు కోత చట్టవిరుద్ధం**: ఇంటి సాధారణ రంగులు (Routine Painting) లేదా సాధారణ అరుగుదల (Normal Wear and Tear) కోసం యజమాని సెక్యూరిటీ డిపాజిట్ నుండి డబ్బులు కట్ చేయడానికి **చట్టబద్ధమైన అనుమతి లేదు**.
- **యజమాని బాధ్యత**: ఇల్లు కాలానుగుణంగా రంగులు వేయడం మరియు అరుగుదలను సరిచేయడం ఇంటి యజమాని యొక్క ప్రాథమిక నిర్వహణ బాధ్యత.
- **అనుమతించబడిన కోతలు మాత్రమే**: అద్దెదారు కావాలని చేసిన భౌతిక నష్టం, పగిలిన వస్తువులు లేదా పెండింగ్ విద్యుత్/నీటి బిల్లులకు మాత్రమే డిపాజిట్ నుండి మినహాయింపు చేయవచ్చు.
- **చట్టపరమైన పరిష్కారం**: యజమాని రంగుల పేరుతో డిపాజిట్ నిలిపివేస్తే, ఆస్తి బదిలీ చట్టం సెక్షన్ 106 కింద లీగల్ నోటీసు పంపవచ్చు మరియు స్థానిక రెంట్ అథారిటీ లేదా జిల్లా వినియోగదారుల ఫోరమ్‌లో వడ్డీతో సహా వాపసు కోసం పిటిషన్ దాఖలు చేయవచ్చు.`,
    hi: `### पेंटिंग (पुताई) और सामान्य टूट-फूट पर कानूनी नियम

**मॉडल टेनेंसी एक्ट 2021 (Model Tenancy Act)** एवं भारतीय कानून के तहत:

- **पेंटिंग कटौती गैरकानूनी**: मकान मालिक नियमित रंगाई-पुताई (Routine Painting) या सामान्य टूट-फूट (Normal Wear & Tear) के नाम पर सिक्योरिटी डिपॉजिट से पैसे **नहीं काट सकता**।
- **मकान मालिक का दायित्व**: समय के साथ दीवार के रंग का फीका पड़ना या मकान की सामान्य उम्र बढ़ना मकान मालिक के अनिवार्य रखरखाव के अंतर्गत आता है।
- **वैध कटौतियां**: केवल किरायेदार द्वारा किए गए वास्तविक संरचनात्मक नुकसान, टूटी हुई फिटिंग या बकाया बिजली/पानी के बिलों की ही कटौती संभव है।
- **कानूनी उपाय**: यदि मकान मालिक अवैध कटौती करता है, तो धारा 106 संपत्ति अंतरण अधिनियम के तहत कानूनी नोटिस भेजकर रेंट कोर्ट या उपभोक्ता फोरम में ब्याज सहित पूरी राशि वसूली जा सकती है।`,
    en: `### Landlord Deductions for Painting & Normal Wear and Tear

Under Indian tenancy jurisprudence and the **Model Tenancy Act 2021**:

- **No Painting Deduction Allowed**: A landlord **CANNOT** deduct security deposit money for routine painting or ordinary wear and tear.
- **Landlord's Statutory Obligation**: Routine repainting and normal aging of premises are statutory maintenance obligations of the property owner, not the tenant.
- **Permissible Deductions**: Deductions are legally restricted solely to verified tenant-inflicted physical damage, broken fixtures, or unpaid utility bills.
- **Legal Remedy**: If a landlord unlawfully withholds deposit funds for painting, serve a formal legal notice under Section 106 Transfer of Property Act and approach the Rent Authority or District Consumer Commission for a full refund with 12-18% interest.`
  },
  depositCap: {
    te: `### సెక్యూరిటీ డిపాజిట్ గరిష్ట చట్టబద్ధ పరిమితి

కేంద్ర **మోడల్ టెనెన్సీ చట్టం 2021 (Model Tenancy Act)** ప్రకారం:

- **నివాస గృహాలు (Residential)**: గరిష్టంగా **2 నెలల అద్దె మాత్రమే** సెక్యూరిటీ డిపాజిట్‌గా తీసుకోవడానికి చట్టం అనుమతిస్తుంది.
- **వాణిజ్య ప్రాంగణాలు (Commercial)**: దుకాణాలు లేదా కార్యాలయాలకు గరిష్టంగా **6 నెలల అద్దె** డిపాజిట్‌గా తీసుకోవచ్చు.
- **చట్టవిరుద్ధ డిమాండ్**: 5 లేదా 10 నెలల అద్దెను డిపాజిట్‌గా డిమాండ్ చేయడం చట్టవిరుద్ధం.`,
    hi: `### सुरक्षा जमा (सिक्योरिटी डिपॉजिट) की कानूनी सीमा

**मॉडल टेनेंसी एक्ट 2021 (Model Tenancy Act)** के अनुसार:

- **आवासीय संपत्तियां (Residential)**: मकान मालिक अधिकतम **2 महीने का किराया ही** सिक्योरिटी डिपॉजिट के रूप में ले सकता है।
- **व्यावसायिक संपत्तियां (Commercial)**: दुकानों या कार्यालयों के लिए अधिकतम **6 महीने का किराया** लिया जा सकता है।
- **अवैध मांग**: 5 से 10 महीने का एडवांस डिपॉजिट मांगना कानूनन वर्जित है।`,
    en: `### Statutory Cap on Rental Security Deposit

Under the **Model Tenancy Act 2021**:

- **Residential Leases**: The security deposit is strictly capped at a maximum of **2 months' rent**.
- **Commercial Leases**: For non-residential/commercial premises, the deposit is capped at a maximum of **6 months' rent**.
- **Unlawful Demands**: Demanding 6-10 months of deposit for residential apartments is legally impermissible.`
  },
  form29: {
    te: `### ఫారమ్ 29 (Form 29) - వాహన విక్రయ నోటీసు

మోటారు వాహనాల చట్టం 1988 నిబంధన 55 ప్రకారం:
- **ప్రయోజనం**: ఫారమ్ 29 అనేది వాహనాన్ని విక్రయించినట్లు విక్రేత (Seller) సంబంధిత RTO కార్యాలయానికి ఇచ్చే అధికారిక **యాజమాన్య బదిలీ నోటీసు (Notice of Transfer)**.
- **సమర్పణ**: 2 కాపీలలో సంతకం చేసి ఒక కాపీని RTOకి, మరొక కాపీని కొనుగోలుదారునికి అందజేయాలి.`,
    hi: `### फॉर्म 29 (Form 29) - वाहन स्वामित्व अंतरण नोटिस

केंद्रीय मोटर वाहन नियम 55 के अंतर्गत:
- **उद्देश्य**: फॉर्म 29 विक्रेता द्वारा RTO को दी जाने वाली **स्वामित्व अंतरण की औपचारिक सूचना (Notice of Transfer)** है कि वाहन बेचकर क्रेता को सौंप दिया गया है।
- **प्रक्रिया**: इसकी 2 प्रतियां हस्ताक्षरित कर एक RTO को भेजी जाती है और दूसरी क्रेता को दी जाती है।`,
    en: `### Form 29 - Notice of Transfer of Vehicle Ownership

Under Rule 55 of the Central Motor Vehicles Rules, 1989:
- **Statutory Purpose**: Form 29 is the mandatory **Notice of Transfer of Ownership** submitted by the vehicle seller to the RTO, officially intimating that the vehicle has been sold and physical possession transferred.
- **Execution**: Prepared in duplicate, signed by the seller, and submitted to the registered RTO within 14 days of vehicle transfer.`
  },
  form30: {
    te: `### ఫారమ్ 30 (Form 30) - RC యాజమాన్య బదిలీ దరఖాస్తు

- **ప్రయోజనం**: ఫారమ్ 30 అనేది వాహన కొనుగోలుదారు మరియు విక్రేత ఇద్దరూ సంయుక్తంగా సంతకం చేసి RTOలో RC బదిలీ కోసం దాఖలు చేసే అధికారిక దరఖాస్తు (Application for Transfer of Ownership).
- **సమయ పరిమితి**: వాహన కొనుగోలు జరిగిన **14 రోజుల్లోగా** RTOకి సమర్పించాలి (రాష్ట్రం దాటితే 45 రోజులు).`,
    hi: `### फॉर्म 30 (Form 30) - आरसी ट्रांसफर आवेदन

- **उद्देश्य**: फॉर्म 30 क्रेता और विक्रेता दोनों द्वारा संयुक्त रूप से हस्ताक्षरित **स्वामित्व हस्तांतरण आवेदन** है जिसके आधार पर RTO वाहन की आरसी (RC) को नए मालिक के नाम पर दर्ज करता है।
- **समय-सीमा**: लेन-देन के **14 दिनों के भीतर** इसे RTO में जमा करना अनिवार्य है।`,
    en: `### Form 30 - Application for Vehicle Ownership Transfer

Under Rule 55 of the Central Motor Vehicles Rules, 1989:
- **Statutory Purpose**: Form 30 is the joint **Application for Intimation and Transfer of Ownership** executed by both the buyer and seller to formally record the buyer as the registered owner on the RC.
- **Statutory Time Limit**: Must be lodged with the RTO within **14 days** of sale (or 45 days if vehicle transfer involves another state).`
  },
  form35: {
    te: `### ఫారమ్ 35 & బ్యాంక్ లోన్ రద్దు (Hypothecation Removal)

- **ప్రయోజనం**: కారు లేదా బైక్ రుణం (Vehicle Loan) పూర్తిగా చెల్లించిన తర్వాత, RC బుక్ నుండి బ్యాంక్ పేరును తొలగించడానికి (Cancellation of Hypothecation) ఫారమ్ 35 అవసరం.
- **ప్రక్రియ**: బ్యాంక్ సంతకం చేసిన ఫారమ్ 35 (2 కాపీలు) మరియు బ్యాంక్ ఇచ్చిన No Objection Certificate (NOC)లను RTOకి సమర్పించి క్లియర్ చేయించాలి.`,
    hi: `### फॉर्म 35 एवं वाहन लोन समाप्ति (हाइपोथीकेशन हटाना)

- **उद्देश्य**: गाड़ी का पूरा लोन चुकता होने के बाद आरसी (RC) से बैंक का नाम हटाने (Hypothecation Cancellation) के लिए फॉर्म 35 RTO में जमा किया जाता है।
- **आवश्यक दस्तावेज**: बैंक द्वारा हस्ताक्षरित फॉर्म 35 (दो प्रतियां) और बैंक का एनओसी (No Objection Certificate / No Dues Certificate)।`,
    en: `### Form 35 - Cancellation of Vehicle Hypothecation

Under Rule 61 of the Central Motor Vehicles Rules, 1989:
- **Statutory Purpose**: Form 35 is the application for **Cancellation of Endorsement of Hypothecation / Hire Purchase** on the Registration Certificate (RC) after full repayment of the vehicle loan.
- **Mandatory Filings**: Submit 2 copies of signed Form 35 along with the lender's original No Objection Certificate (NOC) to the RTO to issue a clean RC in your name alone.`
  },
  nilEc: {
    te: `### ఎన్‌కంబరెన్స్ సర్టిఫికేట్ (EC) & ఫారమ్ 16 (Nil EC) వివరణ

రిజిస్ట్రేషన్ చట్టం 1908 ప్రకారం సబ్-రిజిస్ట్రార్ ఇచ్చే కీలక పత్రం:
- **ఫారమ్ 16 (Nil EC)**: సంబంధిత అన్వేషణ కాలంలో ఆస్తిపై ఎటువంటి బ్యాంక్ లోన్లు, తనఖా లేదా రిజిస్టర్డ్ కోర్టు వివాదాలు లేవని రుజువు చేస్తుంది (ఆస్తి భార రహితమైనది).
- **ఫారమ్ 15**: ఆస్తిపై గతంలో రిజిస్టర్ అయిన అన్ని లావాదేవీలు, క్రయవిక్రయాలు మరియు తాకట్టుల పూర్తి చరిత్రను చూపుతుంది.`,
    hi: `### भारमुक्त प्रमाण पत्र (EC) एवं फॉर्म 16 (Nil EC)

पंजीकरण अधिनियम 1908 के अंतर्गत सब-रजिस्ट्रार द्वारा जारी प्रमाण पत्र:
- **फॉर्म 16 (Nil EC)**: यह प्रमाणित करता है कि खोजी गई अवधि के दौरान संपत्ति पर कोई पंजीकृत बैंक लोन, बंधक या अदालती विवाद नहीं है (संपत्ति पूर्णतः भारमुक्त है)।
- **फॉर्म 15**: संपत्ति पर पूर्व में हुए सभी पंजीकृत लेन-देन और विलेखों का विवरण प्रदर्शित करता है।`,
    en: `### Encumbrance Certificate (EC) & Form 16 (Nil EC)

Under the Registration Act 1908:
- **Form 16 (Nil EC)**: Issued by the Sub-Registrar certifying that the property has NO registered mortgages, liens, financial liabilities, or court attachments during the search period.
- **Form 15**: Issued when registered encumbrances or prior transaction deeds exist on the property, detailing dates, parties, and volume references.`
  },
  cheque: {
    te: `### చెక్ బౌన్స్ & సెక్షన్ 138 NI చట్టం నిబంధనలు

నెగోషియబుల్ ఇన్‌స్ట్రుమెంట్స్ చట్టం 1881 సెక్షన్ 138 కింద:
- **1. బ్యాంక్ మెమో & 30 రోజుల నోటీసు**: చెక్ బౌన్స్ అయినట్లు బ్యాంక్ మెమో అందిన **30 రోజుల్లోగా** చెక్ జారీ చేసిన వ్యక్తికి లీగల్ డిమాండ్ నోటీసు పంపాలి.
- **2. 15 రోజుల గడువు**: నోటీసు అందిన నాటి నుండి డబ్బు చెల్లించడానికి 15 రోజుల గడువు ఇవ్వాలి.
- **3. కోర్టు కేసు**: 15 రోజుల్లో చెల్లించకపోతే, తర్వాతి **30 రోజుల్లోగా** జ్యుడీషియల్ మేజిస్ట్రేట్ కోర్టులో క్రిమినల్ ఫిర్యాదు దాఖలు చేయాలి.
- **శిక్ష**: 2 సంవత్సరాల వరకు జైలు శిక్ష లేదా చెక్ మొత్తానికి రెట్టింపు జరిమానా విధించవచ్చు.`,
    hi: `### चेक बाउंस और धारा 138 परक्राम्य लिखत अधिनियम (NI Act)

परक्राम्य लिखत अधिनियम 1881 की धारा 138 के अंतर्गत:
- **1. 30 दिनों में कानूनी नोटिस**: बैंक से चेक अनादर (बाउंस) मेमो मिलने के **30 दिनों के भीतर** देनदार को कानूनी डिमांड नोटिस भेजना अनिवार्य है।
- **2. 15 दिनों की मोहलत**: नोटिस मिलने के बाद भुगतान के लिए 15 दिनों का समय दिया जाता है।
- **3. परिवाद दायर करना**: 15 दिन में भुगतान न होने पर अगले **30 दिनों के भीतर** सक्षम मजिस्ट्रेट अदालत में आपराधिक केस दर्ज करें।
- **सजा का प्रावधान**: 2 वर्ष तक का कारावास अथवा चेक राशि का दोगुना तक जुर्माना।`,
    en: `### Cheque Bounce Procedure under Section 138 NI Act

Under Section 138 of the Negotiable Instruments Act, 1881:
- **1. 30-Day Demand Notice**: Payee must issue a formal legal demand notice to the drawer within **30 days** of receiving the cheque return memo from the bank.
- **2. Mandatory 15-Day Cure Period**: The drawer is granted exactly 15 days from notice receipt to make full payment.
- **3. Criminal Complaint within 30 Days**: If the drawer fails to pay within 15 days, a criminal complaint must be instituted before the Judicial/Metropolitan Magistrate within **30 days**.
- **Statutory Penalty**: Imprisonment up to 2 years, or a fine up to twice the cheque amount, or both.`
  }
};

// Core Legal Terminology Mappings for Offline Fallback Translation
const LEGAL_TERM_MAP = {
  // English to Telugu
  te: {
    "Rental Agreement & Security Deposit Refund Rules": "అద్దె ఒప్పందం & సెక్యూరిటీ డిపాజిట్ వాపసు నిబంధనలు",
    "Security Deposit Limit": "సెక్యూరిటీ డిపాజిట్ గరిష్ట పరిమితి",
    "Model Tenancy Act": "మోడల్ టెనెన్సీ చట్టం",
    "Transfer of Property Act": "ఆస్తి బదిలీ చట్టం",
    "Motor Vehicles Act": "మోటారు వాహనాల చట్టం",
    "Registration Certificate (RC)": "రిజిస్ట్రేషన్ సర్టిఫికేట్ (RC)",
    "Form 29": "ఫారమ్ 29 (యాజమాన్య బదిలీ నోటీసు)",
    "Form 30": "ఫారమ్ 30 (బదిలీ దరఖాస్తు)",
    "Form 35": "ఫారమ్ 35 (హైపోథికేషన్ రద్దు)",
    "Sale Deed": "సేల్ డీడ్ (విక్రయ దస్తావేజు)",
    "Encumbrance Certificate (EC)": "ఎన్‌కంబరెన్స్ సర్టిఫికేట్ (ఈసీ)",
    "Mutation": "మ్యుటేషన్ / పట్టా బదిలీ",
    "Bharatiya Nyaya Sanhita (BNS)": "భారతీయ న్యాయ సంహిత (BNS 2023)",
    "Consumer Protection Act": "వినియోగదారుల రక్షణ చట్టం",
    "Notice Period": "నోటీసు వ్యవధి",
    "Normal Wear and Tear": "సాధారణ అరుగుదల (Wear & Tear)",
    "Hypothecation": "హైపోథికేషన్ (రుణ తాకట్టు)",
    "Relevant Statutory Authorities:": "సంబంధిత చట్టబద్ధమైన మూలాలు:",
    "Relevant Statutory Authority:": "సంబంధిత చట్టబద్ధమైన మూలం:",
    "Statutory Guidance:": "చట్టపరమైన మార్గదర్శకత్వం:",
    "Legal Guidance:": "చట్టపరమైన మార్గదర్శకత్వం:",
    "Question:": "ప్రశ్న:",
    "Answer:": "సమాధానం:",
    "Direct Statutory Answer:": "ప్రత్యక్ష చట్టపరమైన సమాధానం:",
    "Statutory Section:": "చట్టబద్ధమైన సెక్షన్:",
    "Statutory Provision:": "చట్టబద్ధమైన నిబంధన:",
    "General Provision": "సాధారణ నిబంధన",
    "Landlord Deductions for Painting & Normal Wear and Tear": "రంగుల (Painting) ఖర్చుల కోత & అద్దెదారు చట్టపరమైన రక్షణ",
    "Statutory Cap on Rental Security Deposit": "సెక్యూరిటీ డిపాజిట్ గరిష్ట చట్టబద్ధ పరిమితి",
    "Statutory Timeline for Security Deposit Refund": "సెక్యూరిటీ డిపాజిట్ వాపసు గడువు నిబంధన",
    "Legal Basis for 11-Month Rental Agreements": "11 నెలల అద్దె ఒప్పందం - చట్టపరమైన కారణం",
    "Form 29 - Notice of Transfer of Vehicle Ownership": "ఫారమ్ 29 (Form 29) - వాహన విక్రయ నోటీసు",
    "Form 30 - Application for Vehicle Ownership Transfer": "ఫారమ్ 30 (Form 30) - RC యాజమాన్య బదిలీ దరఖాస్తు",
    "Form 35 - Cancellation of Vehicle Hypothecation": "ఫారమ్ 35 & బ్యాంక్ లోన్ రద్దు (Hypothecation Removal)",
    "Encumbrance Certificate (EC) & Form 16 (Nil EC)": "ఎన్‌కంబరెన్స్ సర్టిఫికేట్ (EC) & ఫారమ్ 16 (Nil EC) వివరణ",
    "Cheque Bounce Procedure under Section 138 NI Act": "చెక్ బౌన్స్ & సెక్షన్ 138 NI చట్టం నిబంధనలు",
    "LexAI provides general legal information grounded in Indian law and is not a substitute for advice from a qualified legal professional or advocate.": "లెక్స్-ఏఐ (LexAI) భారతీయ చట్టాల ఆధారంగా ప్రాథమిక చట్టపరమైన సమాచారాన్ని అందిస్తుంది. ఇది అర్హత కలిగిన న్యాయవాది సలహాకు ప్రత్యామ్నాయం కాదు."
  },
  // English to Hindi
  hi: {
    "Rental Agreement & Security Deposit Refund Rules": "किराया समझौता और सुरक्षा जमा वापसी नियम",
    "Security Deposit Limit": "सुरक्षा जमा की अधिकतम सीमा",
    "Model Tenancy Act": "मॉडल टेनेंसी एक्ट",
    "Transfer of Property Act": "संपत्ति अंतरण अधिनियम",
    "Motor Vehicles Act": "मोटर वाहन अधिनियम",
    "Registration Certificate (RC)": "पंजीकरण प्रमाण पत्र (आरसी)",
    "Form 29": "फॉर्म 29 (स्वामित्व अंतरण नोटिस)",
    "Form 30": "फॉर्म 30 (अंतरण आवेदन)",
    "Form 35": "फॉर्म 35 (हाइपोथीकेशन समाप्ति)",
    "Sale Deed": "बैनामा / सेल डीड",
    "Encumbrance Certificate (EC)": "भारमुक्त प्रमाण पत्र (EC)",
    "Mutation": "दाखिल-खारिज / म्यूटेशन",
    "Bharatiya Nyaya Sanhita (BNS)": "भारतीय न्याय संहिता (BNS 2023)",
    "Consumer Protection Act": "उपभोक्ता संरक्षण अधिनियम",
    "Notice Period": "नोटिस अवधि",
    "Normal Wear and Tear": "सामान्य टूट-फूट (Wear & Tear)",
    "Hypothecation": "हाइपोथीकेशन (ऋण बंधक)",
    "Relevant Statutory Authorities:": "संबंधित कानूनी स्रोत:",
    "Relevant Statutory Authority:": "संबंधित कानूनी स्रोत:",
    "Statutory Guidance:": "कानूनी मार्गदर्शन:",
    "Legal Guidance:": "कानूनी मार्गदर्शन:",
    "Question:": "प्रश्न:",
    "Answer:": "उत्तर:",
    "Direct Statutory Answer:": "प्रत्यक्ष कानूनी उत्तर:",
    "Statutory Section:": "कानूनी धारा:",
    "Statutory Provision:": "वैधानिक प्रावधान:",
    "General Provision": "सामान्य प्रावधान",
    "Landlord Deductions for Painting & Normal Wear and Tear": "पेंटिंग (पुताई) और सामान्य टूट-फूट पर कानूनी नियम",
    "Statutory Cap on Rental Security Deposit": "सुरक्षा जमा (सिक्योरिटी डिपॉजिट) की कानूनी सीमा",
    "Statutory Timeline for Security Deposit Refund": "सिक्योरिटी डिपॉजिट वापसी की समय-सीमा",
    "Legal Basis for 11-Month Rental Agreements": "11 महीने के किराया समझौते का कानूनी कारण",
    "Form 29 - Notice of Transfer of Vehicle Ownership": "फॉर्म 29 (Form 29) - वाहन स्वामित्व अंतरण नोटिस",
    "Form 30 - Application for Vehicle Ownership Transfer": "फॉर्म 30 (Form 30) - आरसी ट्रांसफर आवेदन",
    "Form 35 - Cancellation of Vehicle Hypothecation": "फॉर्म 35 एवं वाहन लोन समाप्ति (हाइपोथीकेशन हटाना)",
    "Encumbrance Certificate (EC) & Form 16 (Nil EC)": "भारमुक्त प्रमाण पत्र (EC) एवं फॉर्म 16 (Nil EC)",
    "Cheque Bounce Procedure under Section 138 NI Act": "चेक बाउंस और धारा 138 परक्राम्य लिखत अधिनियम (NI Act)",
    "LexAI provides general legal information grounded in Indian law and is not a substitute for advice from a qualified legal professional or advocate.": "LexAI भारतीय कानूनों पर आधारित सामान्य कानूनी जानकारी प्रदान करता है। यह किसी योग्य अधिवक्ता की सलाह का विकल्प नहीं है।"
  },
  // To English
  en: {
    "అద్దె ఒప్పందం & సెక్యూరిటీ డిపాజిట్ వాపసు నిబంధనలు": "Rental Agreement & Security Deposit Refund Rules",
    "కిరాణా ఒప్పందం": "Rental Agreement",
    "కారు & వాహన పత్రాలు": "Car & Vehicle Documents",
    "హోమ్ లోన్ పత్రాలు": "Home Loan Documents",
    "బంగారు పత్రాలు": "Gold Documents & Loan Rules",
    "సంబంధిత చట్టబద్ధమైన మూలాలు:": "Relevant Statutory Authorities:",
    "సంబంధిత చట్టబద్ధమైన మూలం:": "Relevant Statutory Authority:",
    "చట్టపరమైన మార్గదర్శకత్వం:": "Statutory Guidance:",
    "రంగుల (Painting) ఖర్చుల కోత & అద్దెదారు చట్టపరమైన రక్షణ": "Landlord Deductions for Painting & Normal Wear and Tear",
    "సెక్యూరిటీ డిపాజిట్ గరిష్ట చట్టబద్ధ పరిమితి": "Statutory Cap on Rental Security Deposit",
    "ఫారమ్ 29 (Form 29) - వాహన విక్రయ నోటీసు": "Form 29 - Notice of Transfer of Vehicle Ownership",
    "ఫారమ్ 30 (Form 30) - RC యాజమాన్య బదిలీ దరఖాస్తు": "Form 30 - Application for Vehicle Ownership Transfer",
    "ఫారమ్ 35 & బ్యాంక్ లోన్ రద్దు (Hypothecation Removal)": "Form 35 - Cancellation of Vehicle Hypothecation",
    "ఎన్‌కంబరెన్స్ సర్టిఫికేట్ (EC) & ఫారమ్ 16 (Nil EC) వివరణ": "Encumbrance Certificate (EC) & Form 16 (Nil EC)",
    "చెక్ బౌన్స్ & సెక్షన్ 138 NI చట్టం నిబంధనలు": "Cheque Bounce Procedure under Section 138 NI Act"
  }
};

/**
 * Translates an array of chat messages into the target language
 * @param {Array} messages - [{ role, content, sources, disclaimer }]
 * @param {string} targetLanguage - 'en' | 'te' | 'hi' | 'ta'
 * @returns {Promise<Array>}
 */
export async function translateConversationMessages(messages, targetLanguage = 'en') {
  if (!messages || messages.length === 0) return [];

  const langNames = {
    en: 'English',
    te: 'Telugu (తెలుగు)',
    hi: 'Hindi (हिन्दी)',
    ta: 'Tamil (தமிழ்)'
  };
  const targetLangName = langNames[targetLanguage] || 'English';

  const apiKey = process.env.LLM_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = 'gemini-2.5-flash';

      // Prepare assistant messages for batch translation
      const toTranslate = messages.map((m, idx) => ({
        index: idx,
        role: m.role,
        content: m.content
      }));

      const prompt = `You are an expert Indian Law legal translator.
Translate the following legal messages into ${targetLangName}.
CRITICAL RULES:
1. Translate legal explanations accurately into fluent ${targetLangName}.
2. Preserve all Markdown formatting (headings ###, bold **, bullet points -, numbered lists).
3. Preserve all exact section numbers, monetary figures (e.g. INR 50,000, 30 days, Form 29, Section 103 BNS), case names, and legal statute names.
4. Output MUST be a valid JSON array of objects with structure: [{"index": number, "translatedContent": string}]. Do NOT add markdown code fences around the JSON.

INPUT MESSAGES:
${JSON.stringify(toTranslate)}`;

      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      const rawText = response.text?.trim() || '';
      const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed = JSON.parse(cleanJson);

      const translatedMap = {};
      parsed.forEach(item => {
        translatedMap[item.index] = item.translatedContent;
      });

      return messages.map((m, idx) => {
        const localizedSources = (m.sources || []).map(s => getLocalizedLegalDocument(s, targetLanguage));
        return {
          ...m,
          content: translatedMap[idx] || m.content,
          sources: localizedSources,
          language: targetLanguage,
          disclaimer: getLocalizedDisclaimer(m.intent || 'GENERAL', targetLanguage)
        };
      });

    } catch (err) {
      console.warn("Gemini translation error, using offline legal translation fallback:", err.message);
    }
  }

  // Offline Fallback Translation Engine
  return messages.map((m) => {
    let newContent = m.content;
    const lower = (newContent || '').toLowerCase();

    // 1. Check Full Block Matchers
    let matchedBlock = null;
    if (lower.includes('painting') || lower.includes('రంగు') || lower.includes('पुताई') || lower.includes('wear and tear') || lower.includes('అరుగుదల')) {
      matchedBlock = FULL_BLOCK_MAP.painting;
    } else if ((lower.includes('deposit') || lower.includes('డిపాజిట్') || lower.includes('डिपॉजिट')) && (lower.includes('2 month') || lower.includes('cap') || lower.includes('limit') || lower.includes('పరిమితి') || lower.includes('सीमा'))) {
      matchedBlock = FULL_BLOCK_MAP.depositCap;
    } else if (lower.includes('form 29') || lower.includes('ఫారమ్ 29') || lower.includes('फॉर्म 29')) {
      matchedBlock = FULL_BLOCK_MAP.form29;
    } else if (lower.includes('form 30') || lower.includes('ఫారమ్ 30') || lower.includes('फॉर्म 30')) {
      matchedBlock = FULL_BLOCK_MAP.form30;
    } else if (lower.includes('form 35') || lower.includes('ఫారమ్ 35') || lower.includes('फॉर्म 35') || lower.includes('hypothecation')) {
      matchedBlock = FULL_BLOCK_MAP.form35;
    } else if (lower.includes('nil ec') || lower.includes('form 16') || lower.includes('భార రహిత') || lower.includes('भारमुक्त प्रमाण पत्र')) {
      matchedBlock = FULL_BLOCK_MAP.nilEc;
    } else if (lower.includes('138') || lower.includes('cheque') || lower.includes('చెక్ బౌన్స్') || lower.includes('चेक बाउंस')) {
      matchedBlock = FULL_BLOCK_MAP.cheque;
    }

    if (matchedBlock && matchedBlock[targetLanguage]) {
      newContent = matchedBlock[targetLanguage];
    } else {
      // 2. Term & Phrase Replacements
      const termDict = LEGAL_TERM_MAP[targetLanguage] || {};
      for (const [engTerm, locTerm] of Object.entries(termDict)) {
        if (newContent.includes(engTerm)) {
          newContent = newContent.split(engTerm).join(locTerm);
        }
      }
    }

    const localizedSources = (m.sources || []).map(s => getLocalizedLegalDocument(s, targetLanguage));

    return {
      ...m,
      content: newContent,
      sources: localizedSources,
      language: targetLanguage,
      disclaimer: getLocalizedDisclaimer(m.intent || 'GENERAL', targetLanguage)
    };
  });
}

function getLocalizedDisclaimer(intent, language = 'en') {
  if (language === 'te') {
    return "లెక్స్-ఏఐ (LexAI) భారతీయ చట్టాల ఆధారంగా ప్రాథమిక చట్టపరమైన సమాచారాన్ని అందిస్తుంది. ఇది అర్హత కలిగిన న్యాయవాది సలహాకు ప్రత్యామ్నాయం కాదు.";
  }
  if (language === 'hi') {
    return "LexAI भारतीय कानूनों पर आधारित सामान्य कानूनी जानकारी प्रदान करता है। यह किसी योग्य अधिवक्ता की सलाह का विकल्प नहीं है।";
  }
  return "LexAI provides general legal information grounded in Indian law and is not a substitute for advice from a qualified legal professional or advocate.";
}
