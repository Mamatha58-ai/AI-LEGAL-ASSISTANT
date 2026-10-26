/**
 * Authoritative Indian Legal Knowledge Base Data Repository
 * Grounded in Indian Acts, BNS 2023, BNSS 2023, BSA 2023, Constitution, Consumer Protection Act, RERA, Model Tenancy Act, and Supreme Court Precedents.
 * Fully localized with Telugu (te) and Hindi (hi) statutory definitions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let hfKnowledge = [];
try {
  const hfPath = path.join(__dirname, 'huggingface_rag_knowledge.json');
  if (fs.existsSync(hfPath)) {
    hfKnowledge = JSON.parse(fs.readFileSync(hfPath, 'utf-8'));
  }
} catch (e) {
  // fallback
}

export const BASE_INDIAN_LEGAL_KNOWLEDGE = [
  // --- 1. RENT AGREEMENT & SECURITY DEPOSIT REFUND (HOUSE / TENANCY) ---
  {
    id: "doc-rent-agreement-deposit",
    title: "Rental Agreement & Security Deposit Refund Rules (Model Tenancy Act & TPA)",
    source: "Model Tenancy Act 2021 & Transfer of Property Act 1882 (Section 105-111)",
    act: "Model Tenancy Act 2021 & Transfer of Property Act 1882",
    section: "Section 105 (Lease Definition) & Model Tenancy Rules",
    jurisdiction: "All India / State Rent Authorities",
    court: "Rent Authority / Rent Court / District Consumer Forum",
    date: "2024-01-01",
    documentType: "Statute",
    url: "https://mohua.gov.in/",
    keywords: [
      "rent", "rental", "lease", "tenant", "tenancy", "landlord", "deposit", "security deposit", "refund", "wear and tear", "11 month", "eviction", "agreement",
      "అద్దె", "కిరాయి", "లీజు", "అద్దెదారు", "యజమాని", "డిపాజిట్", "సెక్యూరిటీ డిపాజిట్", "వాపసు", "ఖాళీ", "ఒప్పందం", "అగ్రిమెంట్",
      "किराया", "किरायेदार", "मकान मालिक", "पट्टा", "जमानत", "जमा", "वापसी", "समझौता", "अनुबंध", "खाली"
    ],
    text: `Rental Agreement & Security Deposit Refund Framework under Indian Law:
1. Security Deposit Cap: Under the Model Tenancy Act, security deposit for residential premises is strictly capped at a maximum of 2 months' rent (up to 6 months for commercial properties). Landlords cannot demand unreasonable advances.
2. Mandatory Refund within 30 Days: Upon tenant vacating premises and handing over possession, the landlord must refund the full security deposit within 30 days after deducting genuine unpaid rent or utility bills.
3. Wear and Tear Protection: Landlords are legally prohibited from deducting deposit money for normal wear and tear (such as ordinary aging or routine painting). Deductions are only permitted for actual, verified tenant-caused physical damage.
4. 11-Month Agreement vs Compulsory Registration: Rental agreements up to 11 months do not mandatorily require registration under Section 17 of the Registration Act 1908. Any lease agreement exceeding 11 months must be compulsorily registered with stamp duty.
5. Eviction & Notice Safeguards: Landlords cannot unlawfully disconnect electricity or water supply or lock out tenants. A mandatory 1-month written advance notice is required.
6. Legal Remedies for Unpaid Deposit: If the landlord unlawfully retains security deposit, the tenant can send a legal notice under Section 106 TPA, file a petition before the Rent Authority / Rent Tribunal, or approach the Consumer Court for refund with 12-18% interest and compensation.`,
    te: {
      title: "అద్దె ఒప్పందం & సెక్యూరిటీ డిపాజిట్ వాపసు నిబంధనలు (మోడల్ టెనెన్సీ చట్టం & TPA)",
      act: "మోడల్ టెనెన్సీ చట్టం 2021 & ఆస్తి బదిలీ చట్టం 1882 (సెక్షన్ 105)",
      section: "సెక్షన్ 105-111 & రెంట్ కంట్రోల్ నిబంధనలు",
      text: `భారతీయ చట్టం ప్రకారం అద్దె ఒప్పందం & సెక్యూరిటీ డిపాజిట్ వాపసు నిబంధనలు:
1. సెక్యూరిటీ డిపాజిట్ పరిమితి: మోడల్ టెనెన్సీ చట్టం ప్రకారం నివాస గృహాలకు గరిష్టంగా 2 నెలల అద్దె మాత్రమే డిపాజిట్‌గా తీసుకోవాలి (వాణిజ్య దుకాణాలకు 6 నెలలు). అంతకంటే ఎక్కువ డిమాండ్ చేయడం చట్టవిరుద్ధం.
2. 30 రోజుల్లో డిపాజిట్ వాపసు: అద్దెదారు ఇల్లు ఖాళీ చేసి తాళాలు అప్పగించిన 30 రోజుల్లోగా యజమాని సెక్యూరిటీ డిపాజిట్‌ను పూర్తిగా తిరిగి చెల్లించాలి.
3. అనుమతించబడిన కోతలు: కేవలం చెల్లించని కరెంట్ బిల్లులు లేదా అసలు అద్దె బకాయిలకు మాత్రమే కోత విధించవచ్చు. సాధారణ అరుగుదలకు (Normal Wear & Tear / సాధారణ రంగులు) డిపాజిట్ నుంచి మినహాయించరాదు.
4. అగ్రిమెంట్ కాలపరిమితి: 11 నెలల ఒప్పందాలకు నోటరీ సరిపోతుంది. 12 నెలలు దాటిన లీజు ఒప్పందాలను తప్పనిసరిగా సబ్-రిజిస్ట్రార్ వద్ద రిజిస్టర్ చేయాలి.
5. నోటీసు వ్యవధి: ఇల్లు ఖాళీ చేయించడానికి కనీసం 1 నెల ముందస్తు లిఖితపూర్వక నోటీసు ఇవ్వాలి. విద్యుత్, నీరు నిలిపివేయడం చట్టవిరుద్ధం.
6. డిపాజిట్ ఎగ్గొడితే చర్యలు: యజమాని డిపాజిట్ ఇవ్వకపోతే రెంట్ కోర్టు లేదా వినియోగదారుల ఫోరమ్‌లో వడ్డీతో సహా రికవరీ కోసం ఫిర్యాదు చేయవచ్చు.`
    },
    hi: {
      title: "किराया समझौता और सुरक्षा जमा वापसी नियम (मॉडल टेनेंसी एक्ट एवं TPA)",
      act: "मॉडल टेनेंसी एक्ट 2021 एवं संपत्ति अंतरण अधिनियम 1882 (धारा 105)",
      section: "धारा 105-111 एवं मॉडल टेनेंसी नियम",
      text: `भारतीय कानून के तहत किराया समझौता एवं सुरक्षा जमा वापसी नियम:
1. सुरक्षा जमा की सीमा: मॉडल टेनेंसी एक्ट के तहत आवासीय संपत्तियों के लिए अधिकतम 2 महीने का किराया ही सिक्योरिटी डिपॉजिट लिया जा सकता है।
2. 30 दिनों में जमा वापसी: किरायेदार द्वारा मकान खाली करने और कब्जा सौंपने के 30 दिनों के भीतर पूरी जमा राशि वापस करना अनिवार्य है।
3. कटौती के नियम: केवल बकाया किराया या वास्तविक नुकसान की कटौती हो सकती है; सामान्य टूट-फूट या पेंटिंग के नाम पर अवैध कटौती नहीं की जा सकती।
4. अनुबंध अवधि: 11 महीने तक नोटरी समझौता मान्य है; 12 महीने या अधिक की लीज का पंजीकरण अधिनियम की धारा 17 के तहत अनिवार्य है।
5. नोटिस अवधि: मकान खाली कराने हेतु कम से कम 1 महीने का पूर्व लिखित नोटिस अनिवार्य है। बिजली या पानी काटना गैरकानूनी है।
6. जमा न लौटाने पर कानूनी उपाय: मकान मालिक द्वारा जमा न लौटाने पर रेंट कोर्ट या उपभोक्ता फोरम में 12-18% ब्याज सहित दावा किया जा सकता है।`
    }
  },

  // --- 2. CAR & VEHICLE DOCUMENTS ---
  {
    id: "doc-car-transfer-forms",
    title: "Car Documents: Vehicle Ownership Transfer (Form 29, Form 30 & RC)",
    source: "Motor Vehicles Act, 1988 & Central Motor Vehicles Rules 1989",
    act: "Motor Vehicles Act 1988 (Section 50) / RTO Rules",
    section: "Section 50 (Transfer of Ownership)",
    jurisdiction: "All India (State RTOs - Parivahan Sewa)",
    court: "Regional Transport Office (RTO) / Motor Accidents Claims Tribunal",
    date: "2024-01-01",
    documentType: "Procedure",
    url: "https://parivahan.gov.in/",
    keywords: [
      "car", "vehicle", "bike", "rto", "rc", "form 29", "form 30", "form 28", "form 35", "ownership", "transfer", "hypothecation",
      "కారు", "వాహన", "బైక్", "ఆర్సీ", "ఆర్టీవో", "చలాన్", "ఫారమ్ 29", "ఫారమ్ 30", "ఫారమ్ 35", "హైపోథికేషన్",
      "कार", "गाड़ी", "वाहन", "आरसी", "आरटीओ", "फॉर्म 29", "फॉर्म 30", "फॉर्म 35", "हस्तांतरण"
    ],
    text: `Essential Car & Vehicle Documents required under Indian Law:
1. Registration Certificate (RC): Original Smart Card RC is proof of vehicle ownership.
2. Form 29 (Notice of Transfer): Signed by seller declaring transfer of vehicle ownership.
3. Form 30 (Application for Transfer): Signed by buyer and seller with intimation to RTO within 14 days of sale (45 days if outside jurisdiction).
4. Form 28 (NOC): Required when vehicle is sold or transferred to a different RTO state jurisdiction.
5. Form 35 (Hypothecation Cancellation): Requires Bank NOC and Form 35 signed by lender bank when car loan is fully repaid.
6. Valid PUC & Motor Insurance: Mandatory Third-Party Insurance under Section 146 MVA. Driving without valid RC attracts fines up to ₹5,000-₹10,000 under Section 192 MVA.`,
    te: {
      title: "కారు పత్రాలు: వాహన యాజమాన్య బదిలీ (ఫారమ్ 29, ఫారమ్ 30 & RC)",
      act: "మోటారు వాహనాల చట్టం 1988 (సెక్షన్ 50)",
      section: "సెక్షన్ 50 (యాజమాన్య బదిలీ)",
      text: `భారతీయ చట్టం ప్రకారం అవసరమైన కారు పత్రాలు:
1. రిజిస్ట్రేషన్ సర్టిఫికేట్ (RC): వాహన యాజమాన్యానికి ప్రాథమిక అధికారిక రుజువు.
2. ఫారమ్ 29 (Notice of Transfer): వాహనం విక్రయించినట్లు విక్రేత RTOకి సమర్పించే నోటీసు.
3. ఫారమ్ 30 (Application for Transfer): కొనుగోలుదారు మరియు విక్రేత 14 రోజుల్లోగా RTOకి దరఖాస్తు చేసుకోవాలి.
4. ఫారమ్ 28 (NOC): వేరే రాష్ట్రం లేదా వేరే RTO పరిధికి వాహనాన్ని బదిలీ చేస్తున్నప్పుడు తప్పనిసరి.
5. ఫారమ్ 35 & బ్యాంక్ NOC: కారు లోన్ పూర్తయిన తర్వాత RC పై హైపోథికేషన్ రద్దు చేయడానికి అవసరం.
6. ఇన్సూరెన్స్ & PUC: సెక్షన్ 146 ప్రకారం థర్డ్ పార్టీ ఇన్సూరెన్స్ మరియు పొల్యూషన్ సర్టిఫికేట్ తప్పనిసరి.`
    },
    hi: {
      title: "कार दस्तावेज: वाहन स्वामित्व हस्तांतरण (फॉर्म 29, फॉर्म 30 एवं RC)",
      act: "मोटर वाहन अधिनियम 1988 (धारा 50)",
      section: "धारा 50 (स्वामित्व हस्तांतरण)",
      text: `भारतीय कानून के तहत आवश्यक कार दस्तावेज:
1. पंजीकरण प्रमाणपत्र (RC): वाहन के कानूनी स्वामित्व का मूल दस्तावेज।
2. फॉर्म 29 (Notice of Transfer): विक्रेता द्वारा RTO को वाहन बिक्री की आधिकारिक सूचना।
3. फॉर्म 30 (Application for Transfer): क्रेता और विक्रेता द्वारा 14 दिनों के भीतर RTO में हस्तांतरण हेतु आवेदन।
4. फॉर्म 28 (एनओसी - NOC): दूसरे राज्य या RTO क्षेत्र में वाहन स्थानांतरण हेतु आवश्यक।
5. फॉर्म 35 एवं बैंक NOC: कार ऋण चुकता होने पर RC से बैंक का नाम (हाइपोथीकेशन) हटाने हेतु।
6. थर्ड-पार्टी बीमा एवं PUC: धारा 146 के तहत अनिवार्य बीमा और वैध प्रदूषण नियंत्रण प्रमाणपत्र।`
    }
  },
  {
    id: "doc-car-hypothecation-noc",
    title: "Car Loan Clearance: Hypothecation Termination (Form 35 & Bank NOC)",
    source: "Central Motor Vehicles Rules, 1989 (Rule 61)",
    act: "Motor Vehicles Act, 1988",
    section: "Section 51 & Rule 61",
    jurisdiction: "India",
    court: "RTO / Civil Courts",
    date: "2024-01-01",
    documentType: "Statute",
    url: "https://parivahan.gov.in/",
    keywords: ["car loan", "hypothecation", "form 35", "bank noc", "rto", "closure", "కారు లోన్", "హైపోథికేషన్", "कार लोन"],
    text: `Hypothecation Removal on Vehicle RC:
When a vehicle is purchased on bank finance, hypothecation is endorsed on the RC under Section 51 MVA.
After loan repayment:
1. The lender bank issues a Loan Closure / No Objection Certificate (NOC) and 2 copies of signed Form 35.
2. The owner must submit Form 35 along with original RC, Bank NOC, valid Insurance, and PUC to RTO within 90 days.
3. RTO removes the hypothecation and issues a clean Registration Certificate in the sole name of the owner.`,
    te: {
      title: "కారు లోన్ క్లియరెన్స్: హైపోథికేషన్ రద్దు (ఫారమ్ 35 & బ్యాంక్ NOC)",
      act: "మోటారు వాహనాల చట్టం, 1988 (సెక్షన్ 51)",
      section: "సెక్షన్ 51 & రూల్ 61",
      text: `కారు లోన్ తీరిన తర్వాత RC పై హైపోథికేషన్ తొలగింపు: బ్యాంక్ ఇచ్చే NOC మరియు 2 కాపీల ఫారమ్ 35 పత్రాలను అసలు RC, ఇన్సూరెన్స్ మరియు PUCతో కలిపి 90 రోజుల్లోగా RTOలో సమర్పించాలి. RTO హైపోథికేషన్ తొలగించి మీ పేరుపై పూర్తి హక్కు కల్పిస్తుంది.`
    },
    hi: {
      title: "कार लोन समापन: हाइपोथीकेशन रद्दीकरण (फॉर्म 35 एवं बैंक NOC)",
      act: "मोटर वाहन अधिनियम, 1988 (धारा 51)",
      section: "धारा 51 एवं नियम 61",
      text: `वाहन RC से हाइपोथीकेशन हटाना: ऋण चुकता होने पर बैंक से प्राप्त NOC और फॉर्म 35 की 2 प्रतियों को 90 दिनों के भीतर RTO में जमा कराएं ताकि RC से बैंक का बंधक समाप्त हो सके।`
    }
  },

  // --- 3. HOUSE & REAL ESTATE PROPERTY DOCUMENTS ---
  {
    id: "doc-house-sale-deed-title",
    title: "House & Property Documents: Sale Deed, Title Chain & Mutation",
    source: "Registration Act, 1908 & Transfer of Property Act, 1882",
    act: "Registration Act 1908 (Section 17) & Transfer of Property Act 1882 (Section 54)",
    section: "Section 17 (Compulsory Registration) & Section 54 (Sale)",
    jurisdiction: "State Sub-Registrar Offices (IGR / Meeseva / Kaveri / Bhulekh)",
    court: "Civil Court / Sub-Registrar / Revenue Authority",
    date: "2024-01-01",
    documentType: "Statute",
    url: "https://igrsup.gov.in/",
    keywords: [
      "house", "property", "flat", "plot", "land", "sale deed", "mother deed", "mutation", "khata", "patta",
      "ఇల్లు", "ఇంటి", "స్థలం", "ఆస్తి", "భూమి", "రిజిస్ట్రేషన్", "సేల్ డీడ్", "పట్టా", "ఖాటా", "మ్యుటేషన్",
      "मकान", "घर", "जमीन", "प्लॉट", "फ्लैट", "संपत्ति", "रजिस्ट्री", "बैनामा", "दाखिल खारिज", "म्यूटेशन"
    ],
    text: `Essential Documents for Buying/Selling House & Property in India:
1. Sale Deed: Principal legal instrument transferring title. Mandatory registration under Section 17 Registration Act with stamp duty.
2. Mother Deed / Parent Deeds: 30-year continuous chain of prior ownership documents to verify title integrity.
3. Encumbrance Certificate (EC - Form 15/16): Issued by Sub-Registrar proving property is free from mortgages, court attachments, or liens.
4. Patta / Khata Certificate / Pahani / 1B: Revenue record showing mutated ownership in municipal/panchayat records for property tax.
5. Building Sanction Plan & Occupancy Certificate (OC): Issued by local municipal development authority confirming construction is lawful.
6. Non-Agricultural (NALA) Order: Mandatory conversion certificate if agricultural land was converted to residential layout.`,
    te: {
      title: "ఇల్లు & స్థిరాస్తి పత్రాలు: సేల్ డీడ్, లింక్ డాక్యుమెంట్లు & మ్యుటేషన్",
      act: "రిజిస్ట్రేషన్ చట్టం 1908 (సెక్షన్ 17) & ఆస్తి బదిలీ చట్టం 1882",
      section: "సెక్షన్ 17 (తప్పనిసరి రిజిస్ట్రేషన్) & సెక్షన్ 54 (విక్రయం)",
      text: `ఇల్లు లేదా స్థలం కొనుగోలుకు పరిశీలించాల్సిన ముఖ్యమైన పత్రాలు:
1. సేల్ డీడ్ (రిజిస్టర్డ్ విక్రయ పత్రం): యాజమాన్య బదిలీకి ప్రధాన చట్టపరమైన పత్రం.
2. లింక్ డాక్యుమెంట్లు (Mother Deed): గత 30 సంవత్సరాల యాజమాన్య చరిత్రను తెలిపే పత్రాల గొలుసు.
3. ఎన్‌కంబరెన్స్ సర్టిఫికేట్ (EC): ఆస్తిపై ఎలాంటి మార్ట్‌గేజ్, బ్యాంక్ రుణాలు లేదా కోర్టు వివాదాలు లేవని ధృవీకరణ.
4. పట్టా / ఖాటా / పహాణి: రెవెన్యూ రికార్డులలో పేరు నమోదు (మ్యుటేషన్).
5. బిల్డింగ్ ప్లాన్ & OC: మున్సిపల్ అభివృద్ధి సంస్థ అనుమతి మరియు నివాస యోగ్యతా పత్రం.`
    },
    hi: {
      title: "मकान एवं संपत्ति दस्तावेज: सेल डीड, मदर डीड एवं दाखिल-खारिज",
      act: "पंजीकरण अधिनियम 1908 (धारा 17) एवं संपत्ति अंतरण अधिनियम 1882",
      section: "धारा 17 (अनिवार्य पंजीकरण) एवं धारा 54 (विक्रय)",
      text: `मकान या जमीन खरीदते समय आवश्यक मुख्य दस्तावेज:
1. विक्रय विलेख (Sale Deed / रजिस्ट्री / बैनामा): मालिकाना हक हस्तांतरण का प्राथमिक पंजीकृत दस्तावेज।
2. मदर डीड (Title Chain): पिछले 30 वर्षों के निरंतर मालिकाना हक का कानूनी इतिहास।
3. भारमुक्ति प्रमाणपत्र (EC): संपत्ति पर कोई बैंक लोन या कानूनी विवाद न होने का प्रमाण।
4. दाखिल-खारिज / म्यूटेशन (Mutation / खतौनी): राजस्व एवं नगर निगम रिकॉर्ड में खरीदार का नाम दर्ज होना।
5. भवन स्वीकृति नक्शा एवं OC (Occupancy Certificate): सक्षम विकास प्राधिकरण से स्वीकृत निर्माण प्रमाणपत्र।`
    }
  },
  {
    id: "doc-house-encumbrance-ec",
    title: "Property Encumbrance Certificate (EC) - Form 15 vs Form 16",
    source: "State Registration Departments",
    act: "Registration Act, 1908 (Section 57)",
    section: "Rule 118 (Encumbrance Certificate)",
    jurisdiction: "State Jurisdiction (Revenue & Sub-Registrar)",
    court: "Sub-Registrar Office",
    date: "2024-01-01",
    documentType: "Procedure",
    url: "https://registration.telangana.gov.in/",
    keywords: ["encumbrance", "ec", "form 15", "form 16", "nil ec", "భార రహిత", "ఎన్‌కంబరెన్స్", "भारमुक्ति"],
    text: `Encumbrance Certificate (EC) Significance:
An EC reflects all registered property transactions (sales, mortgages, leases, court attachments) over a specified period (typically 13 to 30 years).
- Form 15 (Encumbrance Statement): Issued when registered transactions or existing mortgages are found during the search period.
- Form 16 (Nil Encumbrance Certificate): Issued when no registered liabilities or encumbrances exist, proving clean title for bank loans and buyers.`,
    te: {
      title: "ఆస్తి భారాన్వేషణ ధృవీకరణ పత్రం (EC) - ఫారమ్ 15 vs ఫారమ్ 16",
      act: "రిజిస్ట్రేషన్ చట్టం, 1908 (సెక్షన్ 57)",
      section: "రూల్ 118 (భార రహిత సర్టిఫికేట్)",
      text: `ఎన్‌కంబరెన్స్ సర్టిఫికేట్ (EC): ఫారమ్ 16 (Nil EC) ఆస్తిపై ఎటువంటి బ్యాంక్ రుణాలు, మార్ట్‌గేజ్‌లు లేదా కోర్టు వివాదాలు లేవని రుజువు చేస్తుంది; ఫారమ్ 15 గతంలో నమోదైన అన్ని లావాదేవీల వివరాలను చూపుతుంది.`
    },
    hi: {
      title: "संपत्ति भारमुक्ति प्रमाणपत्र (EC) - फॉर्म 15 बनाम फॉर्म 16",
      act: "पंजीकरण अधिनियम, 1908 (धारा 57)",
      section: "नियम 118 (भारमुक्ति प्रमाण पत्र)",
      text: `भारमुक्ति प्रमाणपत्र (EC): फॉर्म 16 (निल EC) प्रमाणित करता है कि संपत्ति पर कोई बैंक लोन या कानूनी अड़चन नहीं है; फॉर्म 15 संपत्ति पर दर्ज पूर्व लेन-देनों की सूची दर्शाता है।`
    }
  },

  // --- 4. HOME LOAN DOCUMENTS & SARFAESI ---
  {
    id: "doc-home-loan-modt-cersai",
    title: "Home Loan Legal Documentation: Sanction Letter, MODT & CERSAI",
    source: "SARFAESI Act 2002 & Transfer of Property Act 1882",
    act: "SARFAESI Act 2002 (Section 13) & Transfer of Property Act 1882 (Section 58(f))",
    section: "Section 58(f) (Equitable Mortgage) & CERSAI Filing",
    jurisdiction: "India (Scheduled Commercial Banks, HFCs, NBFCs)",
    court: "Debt Recovery Tribunal (DRT) / Civil Court",
    date: "2024-01-01",
    documentType: "Statute",
    url: "https://cersai.org.in/",
    keywords: [
      "loan", "home loan", "modt", "cersai", "sanction letter", "mortgage", "equitable mortgage",
      "హోమ్ లోన్", "రుణం", "లోన్", "ఈఎంఐ", "మార్ట్‌గేజ్",
      "होम लोन", "गृह ऋण", "ऋण", "लोन", "बंधक"
    ],
    text: `Home Loan Documentation & Legal Safeguards:
1. Loan Sanction Letter: Official document detailing sanctioned amount, floating/fixed interest rate, EMI, processing fees, and conditions precedent.
2. MODT (Memorandum of Deposit of Title Deeds): Document executed by borrower depositing original title deeds with the bank to create an equitable mortgage.
3. CERSAI Registration: Central registry of securitization and asset reconstruction. Every bank must register the mortgage on CERSAI portal within 30 days to prevent duplicate financing.
4. Tripartite Agreement: Executed between Homebuyer, Builder/Developer, and Lending Bank in under-construction projects.
5. Foreclosure & Deed Retrieval: Upon complete repayment, bank must return all original title documents within 30 days along with No Dues Certificate (NDC).`,
    te: {
      title: "హోమ్ లోన్ పత్రాలు: శాంక్షన్ లెటర్, MODT & CERSAI రిజిస్ట్రేషన్",
      act: "SARFAESI చట్టం 2002 & ఆస్తి బదిలీ చట్టం 1882 (సెక్షన్ 58(f))",
      section: "సెక్షన్ 58(f) (మార్ట్‌గేజ్) & CERSAI నమోదు",
      text: `హోమ్ లోన్ ముఖ్య పత్రాలు & చట్టపరమైన రక్షణలు:
1. లోన్ శాంక్షన్ లెటర్: మంజూరైన లోన్ మొత్తం, వడ్డీ రేటు, మరియు EMI షరతులు.
2. MODT: అసలు ఆస్తి పత్రాలను బ్యాంకులో డిపాజిట్ చేసి ఈక్విటబుల్ మార్ట్‌గేజ్ సృష్టించడం.
3. CERSAI రిజిస్ట్రేషన్: ఒకే ఆస్తిపై వేర్వేరు బ్యాంకులలో మోసపూరిత రుణాలు రాకుండా నిరోధించే సెంట్రల్ పోర్టల్ నమోదు.
4. లోన్ ముగింపు: లోన్ పూర్తిగా తీరిపోయిన తర్వాత బ్యాంక్ 30 రోజుల్లోగా అసలు పత్రాలు మరియు No Dues Certificate ఇవ్వాలి.`
    },
    hi: {
      title: "होम लोन कानूनी दस्तावेज: स्वीकृति पत्र, MODT एवं CERSAI",
      act: "सरफेसी (SARFAESI) अधिनियम 2002 एवं संपत्ति अंतरण अधिनियम (धारा 58(f))",
      section: "धारा 58(f) (समान बंधक) एवं CERSAI पंजीकरण",
      text: `होम लोन आवश्यक दस्तावेज एवं कानूनी सुरक्षा:
1. लोन स्वीकृति पत्र (Sanction Letter): ऋण राशि, ब्याज दर, अवधि और EMI नियम।
2. MODT (शीर्षक विलेख बंधक): मूल दस्तावेज बैंक के पास जमा करके कानूनी बंधक बनाना।
3. CERSAI पंजीकरण: एक ही संपत्ति पर कई बैंकों से धोखाधड़ी रोकने हेतु 30 दिनों में केंद्रीय पोर्टल पर दर्ज करना।
4. ऋण समाप्ति: पूरा लोन चुकता होने पर बैंक से 30 दिनों में मूल दस्तावेज और NDC प्राप्त करें।`
    }
  },
  {
    id: "doc-home-loan-default-sarfaesi",
    title: "Home Loan Default: SARFAESI Act 2002 & Borrower Legal Rights",
    source: "SARFAESI Act 2002",
    act: "SARFAESI Act, 2002",
    section: "Section 13(2), 13(4) & Section 17 (Appeal before DRT)",
    jurisdiction: "India",
    court: "Debt Recovery Tribunal (DRT) / High Court",
    date: "2024-01-01",
    documentType: "Statute",
    url: "https://drt.gov.in/",
    keywords: ["sarfaesi", "default", "npa", "drt", "section 13", "సర్ఫేసి", "డిఫాల్ట్", "सरफेसी", "डिफ़ॉल्ट"],
    text: `Borrower Rights during Home Loan Default:
1. NPA Classification: Loan account must be overdue for 90 days before NPA classification.
2. 60-Day Notice (Section 13(2)): Bank must serve formal 60-day written notice specifying outstanding amount before taking any recovery action.
3. Right of Representation: Borrower has the right to file written objections within 60 days, and the bank must reply within 15 days giving reasoned rejection.
4. Possession Notice (Section 13(4)): If unpaid after 60 days, bank can take possession of property.
5. DRT Appeal: Borrower can file a Securitisation Application before the Debt Recovery Tribunal (DRT) under Section 17 within 45 days.`,
    te: {
      title: "హోమ్ లోన్ డిఫాల్ట్: SARFAESI చట్టం 2002 & రుణగ్రహీత చట్టపరమైన హక్కులు",
      act: "SARFAESI చట్టం, 2002 (సెక్షన్ 13 & 17)",
      section: "సెక్షన్ 13(2), 13(4) & సెక్షన్ 17 (DRT అప్పీల్)",
      text: `హోమ్ లోన్ డిఫాల్ట్ హక్కులు: 90 రోజుల తర్వాతే ఖాతా NPA అవుతుంది; బ్యాంక్ తప్పనిసరిగా సెక్షన్ 13(2) కింద 60 రోజుల ముందస్తు డిమాండ్ నోటీసు ఇవ్వాలి; రుణగ్రహీత అభ్యంతరాలను తెలపవచ్చు మరియు డెట్ రికవరీ ట్రిబ్యునల్ (DRT)లో అప్పీల్ చేసుకోవచ్చు.`
    },
    hi: {
      title: "होम लोन डिफ़ॉल्ट: SARFAESI अधिनियम 2002 एवं ऋणी के कानूनी अधिकार",
      act: "SARFAESI अधिनियम, 2002 (धारा 13 एवं 17)",
      section: "धारा 13(2), 13(4) एवं धारा 17 (DRT अपील)",
      text: `होम लोन डिफ़ॉल्ट में उपभोक्ता अधिकार: 90 दिनों बाद NPA वर्गीकरण; धारा 13(2) के तहत 60 दिनों का औपचारिक नोटिस अनिवार्य; ऋणी द्वारा आपत्ति दर्ज करने तथा DRT ट्रिब्यूनल में अपील का कानूनी अधिकार।`
    }
  },

  // --- 5. GOLD DOCUMENTS & GOLD LOAN REGULATIONS ---
  {
    id: "doc-gold-loan-agreement-rbi",
    title: "Gold Loan Documents: Pledge Agreement, Purity Assay, LTV & RBI Norms",
    source: "RBI Master Directions for Gold Loans & Indian Contract Act 1872",
    act: "Indian Contract Act 1872 (Section 172-176) & RBI Gold Loan Guidelines",
    section: "Section 172 (Pledge) & Section 176 (Pawnee's Right to Sell)",
    jurisdiction: "India (Scheduled Banks & NBFCs)",
    court: "Consumer Forum / Civil Court / Banking Ombudsman",
    date: "2024-01-01",
    documentType: "Statute",
    url: "https://rbi.org.in/",
    keywords: [
      "gold", "jewel", "jewellery", "gold loan", "pledge", "ltv", "auction notice", "appraiser",
      "బంగారం", "బంగారు", "గోల్డ్", "ఆభరణ", "తాకట్టు", "ప్లెడ్జ్", "వేలం", "రసీదు",
      "सोना", "सोने", "गोल्ड", "गहने", "आभूषण", "गिरवी", "नीलामी", "मूल्यांकन"
    ],
    text: `Gold Loan Documentation & Legal Framework:
1. Gold Loan Pledge Agreement: Creates a bailment of gold jewellery as security for debt repayment under Section 172 Indian Contract Act.
2. Appraiser Valuation & Purity Receipt: Document detailing gross weight, stone deduction, net gold weight, and purity (e.g. 22 Carat / 916 Hallmark).
3. Loan-to-Value (LTV) Cap: RBI mandates maximum 75% LTV on gold value calculated at 30-day average price.
4. Auction & Default Rules (Section 176): Lender cannot secretly sell pledged gold. Lender must provide mandatory written 14-day pre-auction notice via registered post.
5. Surplus Refund: Any surplus auction price over the loan liability must be refunded to the borrower.`,
    te: {
      title: "బంగారు లోన్ పత్రాలు: తాకట్టు ఒప్పందం, స్వచ్ఛత ధృవీకరణ, LTV & RBI నిబంధనలు",
      act: "భారతీయ కాంట్రాక్ట్ చట్టం 1872 (సెక్షన్ 172-176) & RBI మార్గదర్శకాలు",
      section: "సెక్షన్ 172 (ప్లెడ్జ్) & సెక్షన్ 176 (వేలం నిబంధనలు)",
      text: `గోల్డ్ లోన్ పత్రాలు & హక్కులు:
1. ప్లెడ్జ్ అగ్రిమెంట్: కాంట్రాక్ట్ చట్టం సెక్షన్ 172 ప్రకారం బంగారాన్ని సెక్యూరిటీగా తాకట్టు పెట్టడం.
2. అప్రైజర్ రసీదు: మొత్తం బరువు, రాళ్ల తగ్గింపు, మరియు నికర బంగారు బరువు (Net Weight) వివరాలు.
3. RBI 75% LTV పరిమితి: బంగారం విలువలో గరిష్టంగా 75% వరకు మాత్రమే రుణం ఇవ్వాలి.
4. వేలం ముందు 14 రోజుల నోటీసు: వడ్డీ చెల్లించకపోతే నేరుగా అమ్మలేరు; తప్పనిసరిగా 14 రోజుల ముందస్తు వేలం నోటీసు రిజిస్టర్డ్ పోస్ట్ ద్వారా ఇవ్వాలి. మిగులు సొమ్మును వాపసు చేయాలి.`
    },
    hi: {
      title: "गोल्ड लोन दस्तावेज: गिरवी अनुबंध, शुद्धता रसीद, LTV एवं RBI नियम",
      act: "भारतीय अनुबंध अधिनियम 1872 (धारा 172-176) एवं RBI दिशानिर्देश",
      section: "धारा 172 (गिरवी) एवं धारा 176 (नीलामी अधिकार)",
      text: `गोल्ड लोन कानूनी ढांचा:
1. गिरवी अनुबंध: धारा 172 के तहत गहने सुरक्षा के रूप में गिरवी रखे जाते हैं।
2. मूल्यांकन एवं शुद्धता रसीद: कुल वजन, पत्थरों की कटौती और शुद्ध सोने के वजन का स्पष्ट विवरण।
3. अधिकतम 75% LTV सीमा: आरबीआई नियमों के तहत सोने के मूल्य का अधिकतम 75% तक ही लोन देय है।
4. नीलामी पूर्व 14-दिन का नोटिस: बैंक बिना 14 दिन के लिखित नोटिस के सोना नीलाम नहीं कर सकता; बची हुई अतिरिक्त राशि ग्राहक को लौटाना अनिवार्य है।`
    }
  },
  {
    id: "doc-gold-hallmark-bis",
    title: "Gold Purity & Purchase Documents: BIS Hallmark (6-Digit HUID) & Invoices",
    source: "Bureau of Indian Standards (BIS) Hallmarking Regulations, 2021",
    act: "Bureau of Indian Standards Act, 2016",
    section: "Mandatory Hallmarking Rules 2021",
    jurisdiction: "India",
    court: "Consumer Dispute Redressal Commission / BIS Enforcement",
    date: "2021-06-16",
    documentType: "Statute",
    url: "https://www.bis.gov.in/",
    keywords: ["hallmark", "huid", "bis", "purity", "22k916", "హాల్‌మార్క్", "हॉलमार्क"],
    text: `Gold Purchase Documents & Consumer Rights:
1. BIS Hallmark Standard: Mandatory 3 symbols on genuine gold:
   - BIS Logo (Triangle)
   - Purity / Karat mark (e.g., 22K916 for 22 Karat 91.6% purity, 18K750 for 18 Karat)
   - 6-Digit Alphanumeric HUID (Hallmark Unique Identification) traceable via BIS Care App.
2. Tax Invoice / Purchase Bill: Must explicitly list gross weight, net weight, stone charges, making charges, purity (karat), and HUID.
3. Consumer Compensation: If hallmarked gold fails purity test at a recognized AHC center, jeweller is legally liable under BIS regulations to pay compensation of 2x the purity difference plus testing fees.`,
    te: {
      title: "బంగారు స్వచ్ఛత & కొనుగోలు పత్రాలు: BIS హాల్‌మార్క్ (6-అంకెల HUID) & బిల్లు",
      act: "బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ చట్టం, 2016",
      section: "తప్పనిసరి హాల్‌మార్కింగ్ నిబంధనలు 2021",
      text: `బంగారం స్వచ్ఛత హక్కులు: అసలైన బంగారంపై BIS లోగో, క్యారెట్ మార్క్ (22K916) మరియు 6-అంకెల HUID తప్పనిసరి. BIS Care App ద్వారా HUID ధృవీకరించవచ్చు. స్వచ్ఛత తక్కువగా తేలితే వినియోగదారునికి రెట్టింపు నష్టపరిహారం చెల్లించాలి.`
    },
    hi: {
      title: "सोने की शुद्धता दस्तावेज: BIS हॉलमार्क (6-अंकीय HUID) एवं रसीद",
      act: "भारतीय मानक ब्यूरो (BIS) अधिनियम, 2016",
      section: "अनिवार्य हॉलमार्किंग नियम 2021",
      text: `सोना खरीद में उपभोक्ता अधिकार: असली सोने पर BIS लोगो, शुद्धता (22K916) और 6-अंकों का HUID कोड अनिवार्य है जिसे BIS Care App पर जांचा जा सकता है। कम शुद्धता मिलने पर 2 गुना मुआवजा देय है।`
    }
  },

  // --- 6. STATUTORY BASES & PRECEDENTS ---
  {
    id: "leg-bns-318",
    title: "Bharatiya Nyaya Sanhita (BNS) 2023 - Section 318 (Cheating & Fraud)",
    source: "Bharatiya Nyaya Sanhita, 2023",
    act: "Bharatiya Nyaya Sanhita, 2023 (formerly IPC Section 415 & 420)",
    section: "Section 318",
    jurisdiction: "India (National)",
    court: "Magistrate Courts / Sessions Courts",
    date: "2023-12-25",
    documentType: "Section",
    url: "https://e-gazette.gov.in/",
    keywords: ["bns", "cheating", "fraud", "మోసం", "धोखाधड़ी"],
    text: `Section 318 of BNS deals with Cheating. Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property, shall be punished with imprisonment up to 7 years and fine.`,
    te: {
      title: "భారతీయ న్యాయ సంహిత (BNS) 2023 - సెక్షన్ 318 (మోసం & చీటింగ్)",
      act: "భారతీయ న్యాయ సంహిత, 2023 (పూర్వపు IPC 420)",
      section: "సెక్షన్ 318",
      text: `BNS సెక్షన్ 318 మోసం మరియు చీటింగ్‌ను నిర్వచిస్తుంది. మోసపూరితంగా ఇతరుల ఆస్తిని తీసుకోవడం లేదా ఆర్థిక నష్టం కలిగించడం నేరం. దీనికి 7 సంవత్సరాల వరకు జైలు శిక్ష మరియు జరిమానా విధించబడుతుంది.`
    },
    hi: {
      title: "भारतीय न्याय संहिता (BNS) 2023 - धारा 318 (धोखाधड़ी एवं छल)",
      act: "भारतीय न्याय संहिता, 2023 (पूर्व IPC धारा 420)",
      section: "धारा 318",
      text: `BNS धारा 318 धोखाधड़ी को परिभाषित करती है। संपत्ति हड़पने या आर्थिक कपट करने पर अधिकतम 7 वर्ष का कारावास और जुर्माना प्रावधानित है।`
    }
  },
  {
    id: "leg-ni-138",
    title: "Negotiable Instruments Act, 1881 - Section 138 (Cheque Bounce)",
    source: "Negotiable Instruments Act, 1881",
    act: "Negotiable Instruments Act, 1881",
    section: "Section 138",
    jurisdiction: "India",
    court: "Judicial Magistrate First Class (JMFC)",
    date: "1881-12-09",
    documentType: "Section",
    url: "https://indiacode.nic.in/",
    keywords: ["cheque bounce", "section 138", "చెక్కు బౌన్స్", "चेक बाउंस"],
    text: `Section 138 NI Act: Offence of dishonour of cheque for insufficiency of funds.
1. Statutory Demand Notice must be sent within 30 days of receiving bank memo.
2. Drawer gets 15 days to settle payment.
3. If unpaid after 15 days, criminal complaint must be filed within 1 month before Magistrate.`,
    te: {
      title: "నెగోషియబుల్ ఇన్‌స్ట్రుమెంట్స్ చట్టం, 1881 - సెక్షన్ 138 (చెక్కు బౌన్స్)",
      act: "నెగోషియబుల్ ఇన్‌స్ట్రుమెంట్స్ చట్టం, 1881",
      section: "సెక్షన్ 138",
      text: `చెక్కు బౌన్స్ నేరం: ఖాతాలో తగినంత సొమ్ము లేకపోవడం వల్ల చెక్కు తిరస్కరణకు గురైతే, బ్యాంక్ మెమో వచ్చిన 30 రోజుల్లోగా లీగల్ నోటీసు పంపాలి. నోటీసు అందిన 15 రోజుల్లో చెల్లించకపోతే మేజిస్ట్రేట్ కోర్టులో క్రిమినల్ కేసు దాఖలు చేయవచ్చు.`
    },
    hi: {
      title: "परक्राम्य लिखत अधिनियम 1881 - धारा 138 (चेक बाउंस)",
      act: "परक्राम्य लिखत अधिनियम, 1881",
      section: "धारा 138",
      text: `चेक बाउंस अपराध: बैंक मेमो मिलने के 30 दिनों के भीतर वैधानिक मांग नोटिस भेजना अनिवार्य है। 15 दिनों में भुगतान न होने पर न्यायालय में आपराधिक परिवाद दर्ज किया जा सकता है।`
    }
  },
  {
    id: "leg-copra-35",
    title: "Consumer Protection Act, 2019 - Section 35 (Deficiency in Service)",
    source: "Consumer Protection Act, 2019",
    act: "Consumer Protection Act, 2019",
    section: "Section 35 & Section 47",
    jurisdiction: "India",
    court: "District / State / National Consumer Commission",
    date: "2019-08-09",
    documentType: "Act",
    url: "https://consumeraffairs.nic.in/",
    keywords: ["consumer", "deficiency", "వినియోగదారుల రక్షణ", "उपभोक्ता संरक्षण"],
    text: `Under Section 35 of the Consumer Protection Act 2019, consumers can file complaints for defective vehicles, unfair gold appraisal charges, delayed flat possession, or bank overcharging.`,
    te: {
      title: "వినియోగదారుల రక్షణ చట్టం, 2019 - సెక్షన్ 35 (సేవా లోపం & పరిహారం)",
      act: "వినియోగదారుల రక్షణ చట్టం, 2019",
      section: "సెక్షన్ 35 & 47",
      text: `వినియోగదారుల రక్షణ: లోపభూయిష్ట వాహనాలు, బిల్డర్ ఫ్లాట్ ఆలస్యం, బ్యాంకింగ్ అధిక ఛార్జీలు లేదా అద్దె డిపాజిట్ సమస్యలపై జిల్లా వినియోగదారుల ఫోరమ్‌లో నష్టపరిహారం కోసం ఫిర్యాదు చేయవచ్చు.`
    },
    hi: {
      title: "उपभोक्ता संरक्षण अधिनियम, 2019 - धारा 35 (सेवा में कमी एवं मुआवजा)",
      act: "उपभोक्ता संरक्षण अधिनियम, 2019",
      section: "धारा 35 एवं 47",
      text: `उपभोक्ता अधिकार: खराब वाहन, फ्लैट मिलने में देरी, या बैंक/मकान मालिक की सेवा में कमी होने पर जिला उपभोक्ता आयोग में मुआवजा प्राप्त करने हेतु शिकायत दर्ज की जा सकती है।`
    }
  },
  {
    id: "leg-rera-18",
    title: "Real Estate (Regulation and Development) Act 2016 (RERA) - Section 18",
    source: "RERA Act, 2016",
    act: "Real Estate (Regulation and Development) Act, 2016",
    section: "Section 18 (Return of Amount and Compensation)",
    jurisdiction: "State RERA Authorities",
    court: "RERA Authority / Appellate Tribunal",
    date: "2016-03-26",
    documentType: "Section",
    url: "https://rera.mohua.gov.in/",
    keywords: ["rera", "builder delay", "flat possession", "రేరా", "रेरा"],
    text: `Section 18 RERA: If promoter fails to complete or give possession of flat/house as per agreement for sale, promoter is liable to return full principal amount with prescribed interest and compensation, or monthly interest for each month of delay.`,
    te: {
      title: "రియల్ ఎస్టేట్ (రెగ్యులేషన్ అండ్ డెవలప్‌మెంట్) చట్టం 2016 (RERA) - సెక్షన్ 18",
      act: "RERA చట్టం, 2016",
      section: "సెక్షన్ 18 (సొమ్ము వాపసు & పరిహారం)",
      text: `RERA సెక్షన్ 18: బిల్డర్ ఒప్పందం ప్రకారం ఫ్లాట్ లేదా ఇంటి నిర్మాణం పూర్తి చేయకపోతే, అసలు మొత్తాన్ని వడ్డీతో సహా వాపసు చేయాలి లేదా ఆలస్యమైన ప్రతి నెలా వడ్డీ నష్టపరిహారంగా చెల్లించాలి.`
    },
    hi: {
      title: "रेरा अधिनियम 2016 (RERA) - धारा 18 (रकम वापसी एवं मुआवजा)",
      act: "रेरा अधिनियम, 2016",
      section: "धारा 18",
      text: `RERA धारा 18: यदि बिल्डर निर्धारित समय पर फ्लैट का कब्जा नहीं देता, तो वह पूरी मूल राशि ब्याज सहित लौटाने या देरी के प्रत्येक माह का ब्याज देने हेतु कानूनी रूप से बाध्य है।`
    }
  },
  {
    id: "case-arnesh-kumar",
    title: "Arnesh Kumar v. State of Bihar (2014) 8 SCC 273 - Notice of Appearance",
    source: "Supreme Court of India (2014)",
    act: "CrPC Section 41A / BNSS Section 35",
    section: "Precedent Guidelines",
    jurisdiction: "Supreme Court Precedent",
    court: "Supreme Court of India",
    date: "2014-07-02",
    documentType: "Judgment",
    url: "https://main.sci.gov.in/",
    keywords: ["arnesh kumar", "notice 41a", "bnss 35", "arrest notice", "నోటీసు", "नोटिस"],
    text: `Police must issue a Notice of Appearance under Section 41A CrPC (Section 35 BNSS) before arresting accused in offences punishable with up to 7 years imprisonment.`,
    te: {
      title: "అర్నేష్ కుమార్ వర్సెస్ బీహార్ రాష్ట్రం (2014) - సెక్షన్ 41A నోటీసు",
      act: "CrPC సెక్షన్ 41A / BNSS సెక్షన్ 35",
      section: "సుప్రీంకోర్టు తీర్పు",
      text: `సుప్రీంకోర్టు మార్గదర్శకాలు: 7 సంవత్సరాల లోపు శిక్ష పడే కేసులలో నిందితుడిని నేరుగా అరెస్ట్ చేయకూడదు. విచారణకు హాజరు కావాలని సెక్షన్ 41A CrPC (లేదా BNSS సెక్షన్ 35) కింద నోటీసు ఇవ్వడం తప్పనిసరి.`
    },
    hi: {
      title: "अर्णेश कुमार बनाम बिहार राज्य (2014) - धारा 41A उपस्थिति नोटिस",
      act: "CrPC धारा 41A / BNSS धारा 35",
      section: "सुप्रीम कोर्ट दिशानिर्देश",
      text: `सुप्रीम कोर्ट फैसला: 7 वर्ष से कम सजा वाले अपराधों में सीधे गिरफ्तारी नहीं की जा सकती। पुलिस को सीआरपीसी की धारा 41A (बीएनएसएस धारा 35) के तहत उपस्थिति नोटिस देना अनिवार्य है।`
    }
  }
];

export const SEEDED_INDIAN_LEGAL_KNOWLEDGE = [...BASE_INDIAN_LEGAL_KNOWLEDGE, ...hfKnowledge];

/**
 * Helper to get document content localized for the requested language
 */
export function getLocalizedLegalDocument(doc, language = 'en') {
  if (!doc) return doc;
  if (language === 'te' && doc.te) {
    return {
      ...doc,
      title: doc.te.title || doc.title,
      act: doc.te.act || doc.act,
      section: doc.te.section || doc.section,
      text: doc.te.text || doc.text
    };
  }
  if (language === 'hi' && doc.hi) {
    return {
      ...doc,
      title: doc.hi.title || doc.title,
      act: doc.hi.act || doc.act,
      section: doc.hi.section || doc.section,
      text: doc.hi.text || doc.text
    };
  }
  return doc;
}
