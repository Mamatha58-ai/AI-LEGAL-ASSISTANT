import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Send,
  Sparkles,
  RefreshCw,
  FileCheck,
  Building2,
  Car,
  Landmark,
  Coins,
  XCircle,
  Download,
  Search,
  Filter,
  Layers,
  Scale,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import api from '../services/api';
import LegalDisclaimer from '../components/LegalDisclaimer';
import { useLanguage } from '../context/LanguageContext';

// 4 Target Indian Legal Domain Presets + Review-2 Slide 17 Benchmark
const PRESET_SAMPLES = [
  {
    id: 'review-2-benchmark-lease',
    domain: 'House Property',
    name: 'Review-2 Benchmark: Lease Agreement (Ramesh Sharma & Priya Verma)',
    icon: Building2,
    filename: 'Sample_Lease_Agreement_Review2.pdf',
    badge: 'Slide 17 Benchmark Demo',
    text: `THIS RESIDENTIAL LEASE AGREEMENT executed on 15th August 2024 between Ramesh Sharma (Lessor) and Priya Verma (Lessee).

CLAUSE 1. RENT AND SECURITY DEPOSIT:
The monthly rent is Rs. 35,000/- per month and interest-free refundable security deposit is Rs. 2,10,000/-.

CLAUSE 2. UNCAPPED INDEMNIFICATION:
Lessee shall indemnify Lessor against all claims, damages, and legal costs without limitation.

CLAUSE 3. UNILATERAL FORFEITURE OF SECURITY DEPOSIT:
Lessor reserves right to forfeit entire deposit without prior written notice.

CLAUSE 4. ACCELERATED EVICTION NOTICE:
Termination effective on 7 days notice.

CLAUSE 5. STATUTORY COMPLIANCE & JURISDICTION:
Governed under Model Tenancy Act 2021 and Transfer of Property Act 1882.`
  },
  {
    id: 'house-property',
    domain: 'House Property',
    name: 'Residential Lease & Tenancy Agreement',
    icon: Building2,
    filename: 'Residential_Rental_Agreement_Bengaluru.pdf',
    badge: 'House Property Domain',
    text: `RESIDENTIAL LEASE AND TENANCY AGREEMENT

This Agreement is executed on this 15th day of June 2024 at Bengaluru by and between:
LESSOR: Rajesh Sharma, residing at Flat 402, Green Valley Apartments, Bengaluru.
LESSEE: Amit Verma, residing at H-12, Koramangala, Bengaluru.

CLAUSE 1. RENT AND SECURITY DEPOSIT:
The Lessee shall pay a monthly rent of INR 45,000 payable on or before 5th of each English calendar month, along with an interest-free refundable security deposit of INR 2,50,000.

CLAUSE 2. AUTOMATIC RENEWAL AND RENT ESCALATION:
Upon completion of 11 months, if renewed by mutual consent, the monthly rent shall automatically increase by 10% per annum unless Lessee serves 90 days advance notice.

CLAUSE 3. UNILATERAL TERMINATION AND DEPOSIT FORFEITURE:
The Lessor reserves unconditional right to terminate tenancy with 7 days notice without cause and forfeit 50% of the security deposit if premise is vacated before completion of lock-in period.

CLAUSE 4. MAINTENANCE AND REPAIRS:
Lessee shall bear all internal minor repair costs up to INR 2,000 while major structural repairs remain Lessor's responsibility under Transfer of Property Act 1882.

CLAUSE 5. UNLIMITED INDEMNIFICATION OBLIGATION:
The Lessee agrees to unconditionally indemnify, defend and hold Lessor harmless against any and all structural damages, neighbor disputes, or municipal violations arising during occupancy, regardless of fault or causation.

CLAUSE 6. GOVERNING LAW AND DISPUTE RESOLUTION:
Governed by Transfer of Property Act 1882, Registration Act 1908, and Karnataka Rent Act with exclusive seat of civil courts in Bengaluru.`
  },
  {
    id: 'car-documents',
    domain: 'Car Documents',
    name: 'Used Vehicle Sale & Hypothecation Agreement',
    icon: Car,
    filename: 'Vehicle_Sale_Hypothecation_Deed.pdf',
    badge: 'Car Documents Domain',
    text: `USED MOTOR VEHICLE SALE AGREEMENT & HYPOTHECATION DEED

This Agreement executed on 05th May 2024 at Mumbai between Rohan Gupta (Seller) and Vikram Patel (Buyer).

CLAUSE 1. VEHICLE PARTICULARS & SALE CONSIDERATION:
Seller transfers Hyundai Creta 2021 model (Chassis: ME1234, Engine: EN9876) for agreed consideration of INR 6,75,000 received in full via RTGS.

CLAUSE 2. RTO TRANSFER & STATUTORY RESPONSIBILITY:
Buyer covenants to submit Form 29, Form 30, and Form 28 (NOC) to Regional Transport Office (RTO) within 14 days and transfer Registration Certificate (RC) as required under Motor Vehicles Act 1988.

CLAUSE 3. TRAFFIC CHALLAN & ACCIDENT INDEMNITY:
From the exact date and hour of physical delivery (05-May-2024, 14:00 hrs), Buyer assumes full civil, criminal, and motor accident claims tribunal (MACT) liabilities under Section 146 Motor Vehicles Act.

CLAUSE 4. HYPOTHECATION & UNILATERAL REPOSSESSION:
Upon default in payment of two consecutive EMIs under vehicle finance facility, the Lender shall have unfettered right to repossess the vehicle without court intervention or prior notice.

CLAUSE 5. PREPAYMENT PENALTY & GST:
Foreclosure or prepayment within first 12 months is subject to a 5% foreclosure fee plus applicable GST on the total outstanding principal balance.`
  },
  {
    id: 'bank-loan',
    domain: 'Bank Loan Agreement',
    name: 'Commercial Bank Term Loan & Mortgage Agreement',
    icon: Landmark,
    filename: 'Bank_Loan_Sanction_Mortgage_Deed.pdf',
    badge: 'Bank Loan Domain',
    text: `COMMERCIAL BANK TERM LOAN & SECURED MORTGAGE AGREEMENT

Executed on 02nd November 2024 between State Bank of India (Lender) and Sunrise Tech Enterprises (Borrower).

CLAUSE 1. SANCTION AND DISBURSEMENT:
Bank sanctions term loan of INR 50,00,000 repayable in 60 equated monthly installments with floating interest rate linked to RBI Repo Rate (EBLR + 2.75% p.a.).

CLAUSE 2. CROSS-DEFAULT AND INSTANT ACCELERATION:
Any default by Borrower or its directors in any other credit facility across any financial institution triggers instant acceleration and total recall of this entire loan.

CLAUSE 3. SARFAESI ENFORCEMENT & ASSET ATTACHMENT:
Upon classification of account as Non-Performing Asset (NPA), Bank is entitled to enforce security under Section 13(2) and 13(4) of SARFAESI Act 2002 without prior court decree.

CLAUSE 4. UNILATERAL MATERIAL ADVERSE CHANGE (MAC):
Bank reserves right to demand immediate full repayment if in Bank's sole judgment any material adverse change occurs in Borrower's financial health.

CLAUSE 5. CONTINUING PERSONAL GUARANTEE:
Managing Director executes unconditional, irrevocable, joint and several continuing personal guarantee covering all dues, legal fees, and recovery expenses.`
  },
  {
    id: 'gold-loan',
    domain: 'Gold Loan Agreement',
    name: 'Gold Jewellery Pledge & Overdraft Agreement',
    icon: Coins,
    filename: 'Gold_Loan_Pledge_Sanction_Letter.pdf',
    badge: 'Gold Loan Domain',
    text: `GOLD JEWELLERY PLEDGE & OVERDRAFT CREDIT AGREEMENT

Executed on 12th August 2024 between Muthoot Finance / Canara Bank (Lender) and Arjun Singhania (Borrower).

CLAUSE 1. PLEDGE OF ORNAMENTS & PURITY APPRAISAL:
Borrower pledges 72 grams net 22-Karat gold ornaments appraised and sealed in tamper-proof pouch in Borrower's presence for loan sanction of INR 3,20,000.

CLAUSE 2. RBI 75% LTV MARGIN CALL & FLUCTUATION:
If market price of gold drops and Loan-to-Value (LTV) exceeds 75% as per RBI Master Directions, Borrower must pay margin money within 14 days of notice.

CLAUSE 3. EXPEDITED PUBLIC AUCTION & NOTICE:
Upon failure to service interest or meet margin calls, Lender may issue 7-day SMS notice to registered mobile number prior to auctioning gold at local district auction center.

CLAUSE 4. PLEDGE RIGHTS & SURPLUS ADJUSTMENT:
Governed by Sections 172-176 Indian Contract Act 1872; net auction proceeds shall be appropriated towards dues and surplus proceeds promptly refunded to Borrower.`
  }
];

// Helper to format currency in Indian format
function formatIndianCurrency(amountStr) {
  if (!amountStr) return 'As stipulated in Schedule';
  return amountStr;
}

export default function DocumentAnalyzerPage() {
  const { t, language } = useLanguage();
  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'clauses' | 'qa'
  const [isDragging, setIsDragging] = useState(false);
  
  // Clause Explorer Filters
  const [clauseSearch, setClauseSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL'); // 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  
  // Document Q&A States
  const [qaInput, setQaInput] = useState('');
  const [qaHistory, setQaHistory] = useState([]);
  const [qaLoading, setQaLoading] = useState(false);

  const fileInputRef = useRef(null);

  const suggestedQuestionsList = {
    en: [
      "What are the house rental agreement & deposit refund rules?",
      "What are car loan, hypothecation NOC & RC transfer rules?",
      "What are bank loan default & SARFAESI notice protections?",
      "What are gold loan 75% LTV and auction notice rules?",
      "What happens if I terminate early or face deposit forfeiture?"
    ],
    hi: [
      "किराया समझौता और सुरक्षा जमा वापसी के नियम क्या हैं?",
      "कार लोन, हाइपोथीकेशन हटाना और RC ट्रांसफर के क्या नियम हैं?",
      "ऋण डिफ़ॉल्ट पर SARFAESI अधिनियम और बैंक नोटिस के नियम क्या हैं?",
      "गोल्ड लोन 75% LTV और 14 दिनों के नीलामी नोटिस नियम क्या हैं?",
      "समय से पहले अनुबंध समाप्ति पर नोटिस और जुर्माने के नियम क्या हैं?"
    ],
    te: [
      "అద్దె ఒప్పందం & సెక్యూరిటీ డిపాజిట్ వాపసు నిబంధనలు ఏమిటి?",
      "కారు లోన్, హైపోథికేషన్ రద్దు మరియు RC బదిలీ నియమాలు ఏమిటి?",
      "రుణం డిఫాల్ట్ అయితే SARFAESI చట్టం మరియు బ్యాంకు నోటీసు నిబంధనలు ఏమిటి?",
      "గోల్డ్ లోన్ 75% LTV మరియు 14 రోజుల వేలం నోటీసు నిబంధనలు ఏమిటి?",
      "ముందుగా ఒప్పందం రద్దు చేయడానికి నోటీసు కాలం మరియు జరిమానాలు ఏమిటి?"
    ]
  };

  const currentSuggestedQuestions = suggestedQuestionsList[language] || suggestedQuestionsList.en;

  const analyzeFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setErrorMsg(null);
    setDocData(null);
    setQaHistory([]);
    setRiskFilter('ALL');
    setCategoryFilter('ALL');
    setClauseSearch('');

    const formData = new FormData();
    formData.append('document', file);
    formData.append('language', language);

    try {
      const res = await api.post('/documents/upload', formData);

      if (res.data.success) {
        setDocData(res.data.document);
      } else {
        setErrorMsg(res.data.message || t('errorTitle'));
      }
    } catch (err) {
      console.error("Upload error:", err);
      const serverMsg = err.response?.data?.message || err.message || t('errorTitle');
      setErrorMsg(serverMsg);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) analyzeFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) analyzeFile(file);
  };

  const handleLoadSample = async (sample) => {
    setLoading(true);
    setErrorMsg(null);
    setDocData(null);
    setQaHistory([]);
    setRiskFilter('ALL');
    setCategoryFilter('ALL');
    setClauseSearch('');

    try {
      const res = await api.post('/documents/upload', {
        text: sample.text,
        filename: sample.filename,
        language
      });

      if (res.data.success) {
        setDocData(res.data.document);
      } else {
        setErrorMsg(res.data.message || t('errorTitle'));
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || t('errorTitle'));
    } finally {
      setLoading(false);
    }
  };

  const handleAskDocQA = async () => {
    if (!qaInput.trim() || !docData?.id || qaLoading) return;

    const q = qaInput.trim();
    setQaInput('');
    setQaLoading(true);

    try {
      const res = await api.post(`/documents/${docData.id}/ask`, { 
        question: q,
        language 
      });
      if (res.data.success) {
        setQaHistory((prev) => [
          ...prev,
          {
            question: q,
            answer: res.data.answer,
            relevantSection: res.data.relevantSection,
            pageNumber: res.data.pageNumber
          }
        ]);
      }
    } catch (err) {
      alert("Error querying document QA: " + (err.response?.data?.message || err.message));
    } finally {
      setQaLoading(false);
    }
  };

  // PDF Export Engine via jsPDF
  const handleExportPDF = () => {
    if (!docData) return;

    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      const contentWidth = pageWidth - (margin * 2);
      let y = 35;

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 65, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(245, 158, 11); // amber-500
      doc.text("LEXAI LEGAL INTELLIGENCE AUDIT REPORT", margin, 32);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(226, 232, 240);
      doc.text(`Document: ${docData.filename || 'Legal Contract'} | Date: ${new Date().toLocaleDateString()}`, margin, 48);

      y = 85;

      // Executive Summary Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("1. DOCUMENT CLASSIFICATION & RISK PROFILE", margin, y);
      y += 18;

      const summary = docData.analysis?.summary || {};
      const riskScore = docData.analysis?.riskScore || 20;
      const riskLevel = docData.analysis?.riskLevel || 'LOW';

      // Summary Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, y, contentWidth, 75, 4, 4, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text(`Domain Category: ${summary.documentType || 'Legal Contract'} (Confidence: ${summary.classificationConfidence || '95%'})`, margin + 12, y + 20);
      doc.text(`Overall Risk Rating: ${riskScore}/100 [${riskLevel} RISK]`, margin + 12, y + 36);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Parties: ${Array.isArray(summary.importantParties) ? summary.importantParties.join(' & ') : summary.importantParties}`, margin + 12, y + 52);
      doc.text(`Financial Terms: ${summary.paymentTerms || 'As specified'} | Effective Date: ${summary.effectiveDate || 'Stipulated'}`, margin + 12, y + 66);

      y += 95;

      // Extractive Centroid Abstract Section
      if (summary.extractiveSummary) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("2. EXECUTIVE EXTRACTIVE ABSTRACT (DEONTIC CENTROID SUMMARY)", margin, y);
        y += 16;

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const splitAbstract = doc.splitTextToSize(`"${summary.extractiveSummary}"`, contentWidth);
        doc.text(splitAbstract, margin, y);
        y += splitAbstract.length * 12 + 15;
      }

      // Clause Breakdown Audit Table
      const clauses = docData.analysis?.clauseBreakdown || [];
      if (clauses.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text(`3. CLAUSE-BY-CLAUSE AUDIT (${clauses.length} PROVISIONS ANALYZED)`, margin, y);
        y += 18;

        for (let i = 0; i < clauses.length; i++) {
          const cl = clauses[i];
          
          // Check for page break
          if (y > 720) {
            doc.addPage();
            y = 40;
          }

          // Clause Box
          const boxHeight = 65;
          doc.setFillColor(cl.riskLevel === 'High' ? 254 : cl.riskLevel === 'Medium' ? 255 : 240, 
                           cl.riskLevel === 'High' ? 242 : cl.riskLevel === 'Medium' ? 251 : 253, 
                           cl.riskLevel === 'High' ? 242 : cl.riskLevel === 'Medium' ? 235 : 244);
          doc.setDrawColor(226, 232, 240);
          doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(cl.riskLevel === 'High' ? 185 : cl.riskLevel === 'Medium' ? 180 : 16, 
                           cl.riskLevel === 'High' ? 28 : cl.riskLevel === 'Medium' ? 83 : 185, 
                           cl.riskLevel === 'High' ? 28 : cl.riskLevel === 'Medium' ? 9 : 129);
          doc.text(`Clause ${cl.clauseNumber || i + 1}: ${cl.title}  [${cl.category}]  •  ${cl.riskLevel} Risk`, margin + 8, y + 16);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(51, 65, 85);
          const excerpt = doc.splitTextToSize(`Text: "${cl.clauseText}"`, contentWidth - 16);
          doc.text(excerpt.slice(0, 2), margin + 8, y + 30);

          doc.setFont('helvetica', 'bold');
          doc.text(`Recommendation: ${cl.advice}`, margin + 8, y + 54);

          y += boxHeight + 8;
        }
      }

      // Footer disclaimer
      if (y > 750) {
        doc.addPage();
        y = 50;
      }
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Generated by LexAI Assistant. This audit report is for analytical and educational assistance and does not substitute qualified legal counsel.", margin, y + 20);

      doc.save(`LexAI_Legal_Audit_${(docData.filename || 'Document').replace(/\.[^/.]+$/, '')}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Error generating PDF report: " + err.message);
    }
  };

  // Derived analysis values
  const summary = docData?.analysis?.summary || {};
  const riskScore = docData?.analysis?.riskScore || 20;
  const riskLevel = docData?.analysis?.riskLevel || 'LOW';
  const riskCounts = docData?.analysis?.riskCounts || {
    high: docData?.analysis?.riskAnalysis?.filter(r => r.mlRiskLabel === 'High').length || 0,
    medium: docData?.analysis?.riskAnalysis?.filter(r => r.mlRiskLabel === 'Medium').length || 0,
    low: 0,
    total: docData?.analysis?.clauseBreakdown?.length || 0
  };
  const clausesList = docData?.analysis?.clauseBreakdown || [];
  const domainDistribution = summary.domainDistribution || [];

  // Extract all unique categories from the 25 classes present in the clauses
  const availableCategories = Array.from(new Set(clausesList.map(c => c.category))).filter(Boolean);

  // Filter clauses
  const filteredClauses = clausesList.filter(c => {
    const matchesRisk = riskFilter === 'ALL' || c.riskLevel?.toUpperCase() === riskFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesQuery = !clauseSearch.trim() || 
      c.title.toLowerCase().includes(clauseSearch.toLowerCase()) || 
      c.clauseText.toLowerCase().includes(clauseSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(clauseSearch.toLowerCase());
    return matchesRisk && matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300 uppercase tracking-wider">
              Legal NLP Engine 2.0
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              4 Indian Domains • 25 Clause Categories • Deontic Centroid NLP
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2 mt-1">
            <FileText className="w-5 h-5 text-amber-600" />
            {t('docAnalyzerTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingests PDF, DOCX, DOC, TXT, and Markdown contracts. Classifies risk, sorts 25 clause categories, and synthesizes executive abstracts.
          </p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.docx,.doc,.txt,.md"
          className="hidden"
        />

        <div className="flex items-center gap-2">
          {docData && (
            <>
              <button
                onClick={handleExportPDF}
                className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                title="Download formatted multi-page PDF Audit Report"
              >
                <Download className="w-3.5 h-3.5" /> Export PDF Audit
              </button>

              <button
                onClick={() => { setDocData(null); setQaHistory([]); setErrorMsg(null); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> {t('analyzeAnother')}
              </button>
            </>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shrink-0 shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            {loading ? t('analyzingDoc') : t('uploadDoc')}
          </button>
        </div>
      </div>

      <LegalDisclaimer />

      {/* Error Message Display */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-xs text-red-800">
          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-bold">{t('errorTitle')}</p>
            <p>{errorMsg}</p>
          </div>
          <button 
            onClick={() => setErrorMsg(null)}
            className="text-red-500 hover:text-red-700 font-bold text-xs"
          >
            {t('dismiss')}
          </button>
        </div>
      )}

      {/* Main Upload Dropzone & Domain Sample Presets when no docData */}
      {!docData && !loading && (
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-white border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer shadow-sm ${
              isDragging ? 'border-amber-500 bg-amber-50/50 scale-[0.99]' : 'border-slate-300 hover:border-amber-500 hover:bg-slate-50'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              {isDragging ? t('dropzoneActive') : t('dropzoneTitle')}
            </h3>
            <p className="text-slate-500 text-xs max-w-md mx-auto mb-3">
              Multi-format ingestion: stream buffer parsing for <strong>PDF, DOCX, DOC, Plain Text (.txt), and Markdown (.md)</strong> contracts up to 15MB.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded border border-slate-200">.PDF</span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded border border-slate-200">.DOCX</span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded border border-slate-200">.DOC</span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded border border-slate-200">.TXT</span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded border border-slate-200">.MD (Markdown)</span>
            </div>
          </div>

          {/* Quick Demo Contract Samples for 4 Indian Domains */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Test With 4 Core Indian Legal Domains (1-Click NLP Demo)
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">Pre-loaded Indian statutory contracts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PRESET_SAMPLES.map((sample) => {
                const IconComponent = sample.icon;
                return (
                  <button
                    key={sample.id}
                    onClick={() => handleLoadSample(sample)}
                    className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-amber-50 hover:border-amber-300 transition-all text-left group shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-white border border-slate-200 text-amber-600 group-hover:border-amber-300">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {sample.domain}
                        </span>
                      </div>
                      <span className="font-bold text-xs text-slate-900 block group-hover:text-amber-950">
                        {sample.name}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-amber-700 font-medium">
                      <span>Analyze Document</span>
                      <span>→</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <Sparkles className="w-10 h-10 text-amber-600 animate-spin mx-auto" />
          <div>
            <h3 className="font-bold text-slate-900 text-base">{t('processingDocTitle')}</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Executing Unicode NFKD normalization, 4-domain classification, 25-category clause parsing, and deontic centroid summarization...
            </p>
          </div>
        </div>
      )}

      {/* Analyzed Document View */}
      {docData && (
        <div className="space-y-6">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-white px-4 rounded-t-xl gap-2">
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-3 px-4 font-semibold text-xs border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'summary' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" /> Executive Audit & Metadata
            </button>
            <button
              onClick={() => setActiveTab('clauses')}
              className={`py-3 px-4 font-semibold text-xs border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'clauses' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" /> Clause Breakdown ({clausesList.length} Provisions)
            </button>
            <button
              onClick={() => setActiveTab('qa')}
              className={`py-3 px-4 font-semibold text-xs border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'qa' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" /> Grounded Q&A ({qaHistory.length})
            </button>
          </div>

          {/* TAB 1: EXECUTIVE AUDIT & METADATA */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Top Row: Risk Gauge & Domain Classifier Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Real-Time Risk Gauge Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600" /> Real-Time Risk Gauge
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      riskLevel === 'HIGH' ? 'bg-red-100 text-red-800 border-red-300' :
                      riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {riskLevel} RISK
                    </span>
                  </div>

                  {/* Clean & Clear Circular Risk Gauge */}
                  <div className="py-4 text-center">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-36 h-36 transform -rotate-90 drop-shadow-xs" viewBox="0 0 120 120">
                        {/* Background Track */}
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          className="text-slate-100 stroke-current"
                          strokeWidth="9"
                          fill="transparent"
                        />
                        {/* Active Meter Arc */}
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          className={`stroke-current transition-all duration-1000 ease-out ${
                            riskScore >= 70 ? 'text-red-500' :
                            riskScore >= 40 ? 'text-amber-500' :
                            'text-emerald-500'
                          }`}
                          strokeWidth="9"
                          strokeDasharray={2 * Math.PI * 48}
                          strokeDashoffset={(2 * Math.PI * 48) * (1 - (riskScore / 100))}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-black text-slate-900 font-mono tracking-tight leading-none">
                          {riskScore}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                          / 100
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 ${
                          riskScore >= 70 ? 'bg-red-50 text-red-700 border border-red-200' :
                          riskScore >= 40 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {riskScore >= 70 ? 'CRITICAL' : riskScore >= 40 ? 'MODERATE' : 'LOW RISK'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Breakdown Counts */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="p-2 bg-red-50 rounded-lg border border-red-100">
                      <span className="text-[10px] text-red-600 font-bold block uppercase">High</span>
                      <span className="text-sm font-bold text-red-800">{riskCounts.high}</span>
                    </div>
                    <div className="p-2 bg-amber-50 rounded-lg border border-amber-100">
                      <span className="text-[10px] text-amber-600 font-bold block uppercase">Medium</span>
                      <span className="text-sm font-bold text-amber-800">{riskCounts.medium}</span>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                      <span className="text-[10px] text-emerald-600 font-bold block uppercase">Low</span>
                      <span className="text-sm font-bold text-emerald-800">{riskCounts.low}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Document Domain Classifier Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between md:col-span-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                        <Scale className="w-4 h-4 text-amber-600" /> Document Domain Classifier
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Sublinear TF-IDF + Logistic Regression across 4 Indian Domains</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Classified As</span>
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 inline-block">
                        {summary.documentType || 'House Property'} ({summary.classificationConfidence || '95%'})
                      </span>
                    </div>
                  </div>

                  {/* Domain Probabilities Progress Bars */}
                  <div className="space-y-3 py-3">
                    {domainDistribution.map((item, dIdx) => {
                      const pct = Math.round((item.probability || 0) * 100);
                      const isTop = item.domain === summary.documentType;
                      return (
                        <div key={dIdx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-semibold ${isTop ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                              {item.domain}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-700">{pct}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-700 ${
                                isTop ? 'bg-amber-500' : 'bg-slate-300'
                              }`}
                              style={{ width: `${Math.max(4, pct)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    File: <strong>{docData.filename}</strong> • Extracted Format: <strong>{docData.fileType}</strong>
                  </div>
                </div>
              </div>

              {/* Legal Entity & Metadata Extraction Grid */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-amber-600" /> Extracted Legal Metadata & Entities
                  </h3>
                  <span className="text-[11px] text-slate-500">Regex & NLP Named Entity Recognition</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Contracting Parties</span>
                    <span className="text-xs font-semibold text-slate-900 block mt-1">
                      {Array.isArray(summary.importantParties) ? summary.importantParties.join(' & ') : summary.importantParties}
                    </span>
                    {summary.primaryRole && (
                      <span className="text-[10px] text-amber-700 font-medium block mt-1">
                        Role: {summary.primaryRole}
                      </span>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Execution & Dates</span>
                    <span className="text-xs font-semibold text-slate-900 block mt-1">
                      {summary.effectiveDate || 'Stipulated on execution'}
                    </span>
                    {summary.tenures?.length > 0 && (
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Tenure: {summary.tenures.join(', ')}
                      </span>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Financial Considerations (INR)</span>
                    <span className="text-xs font-semibold text-slate-900 block mt-1 font-mono">
                      {formatIndianCurrency(summary.paymentTerms)}
                    </span>
                    {summary.interestRates?.length > 0 && (
                      <span className="text-[10px] text-red-600 block mt-1 font-semibold">
                        Interest / Rate: {summary.interestRates.join(' • ')}
                      </span>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Notice & Deadlines</span>
                    <span className="text-xs font-semibold text-slate-900 block mt-1">
                      {summary.deadlines || 'Standard 14-60 days statutory period'}
                    </span>
                  </div>
                </div>

                {/* Indian Statutory References Detected */}
                {summary.statutesDetected?.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Indian Statutory Acts Grounding:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {summary.statutesDetected.map((act, aIdx) => (
                        <span key={aIdx} className="bg-slate-100 text-slate-800 text-[11px] font-medium px-2.5 py-1 rounded-md border border-slate-200">
                          ⚖️ {act}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Extractive Centroid Summarizer Card */}
              {summary.extractiveSummary && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                        Extractive Centroid Executive Abstract
                      </h3>
                    </div>
                    <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                      TF-IDF Cosine Similarity + Deontic Modal Weighting
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-serif italic border-l-4 border-l-amber-500">
                    "{summary.extractiveSummary}"
                  </div>

                  <p className="text-[11px] text-slate-500">
                    *Synthesized by calculating sentence-to-document centroid similarity, boosted for mandatory legal deontic markers (e.g. <em>shall, covenants, indemnifies, forfeit</em>).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CLAUSE BREAKDOWN EXPLORER (25 CATEGORIES & 3 RISK LEVELS) */}
          {activeTab === 'clauses' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base font-serif flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-600" />
                    Clause-by-Clause Legal Classification
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Multi-class classification sorting provisions into 25 distinct legal categories and 3 risk tiers.
                  </p>
                </div>

                {/* Filter and Search Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search clauses..."
                      value={clauseSearch}
                      onChange={(e) => setClauseSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500 w-44"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-amber-500 bg-white"
                  >
                    <option value="ALL">All Categories ({clausesList.length})</option>
                    {availableCategories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>

                  {/* Risk Level Filter Buttons */}
                  <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
                    <button
                      onClick={() => setRiskFilter('ALL')}
                      className={`px-2 py-1 rounded-md font-semibold ${riskFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setRiskFilter('HIGH')}
                      className={`px-2 py-1 rounded-md font-semibold ${riskFilter === 'HIGH' ? 'bg-red-600 text-white shadow-xs' : 'text-red-700'}`}
                    >
                      High ({riskCounts.high})
                    </button>
                    <button
                      onClick={() => setRiskFilter('MEDIUM')}
                      className={`px-2 py-1 rounded-md font-semibold ${riskFilter === 'MEDIUM' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-800'}`}
                    >
                      Medium ({riskCounts.medium})
                    </button>
                    <button
                      onClick={() => setRiskFilter('LOW')}
                      className={`px-2 py-1 rounded-md font-semibold ${riskFilter === 'LOW' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700'}`}
                    >
                      Low ({riskCounts.low})
                    </button>
                  </div>
                </div>
              </div>

              {/* Clauses List */}
              <div className="space-y-4">
                {filteredClauses.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    No clauses matched your filter criteria.
                  </div>
                ) : (
                  filteredClauses.map((clause, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-xl border transition-all ${
                        clause.riskLevel === 'High' ? 'bg-red-50/40 border-red-200' :
                        clause.riskLevel === 'Medium' ? 'bg-amber-50/40 border-amber-200' :
                        'bg-slate-50/70 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            #{clause.clauseNumber || idx + 1}
                          </span>
                          <h4 className="font-bold text-xs text-slate-900">
                            {clause.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* 25 Distinct Category Badge */}
                          <span className="text-[10px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                            🏷️ {clause.category}
                          </span>

                          {/* Risk Level Badge */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            clause.riskLevel === 'High' ? 'bg-red-100 text-red-800 border-red-300' :
                            clause.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                            'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}>
                            {clause.riskLevel} Risk
                          </span>
                        </div>
                      </div>

                      {/* Verbatim Excerpt */}
                      <div className="bg-white p-2.5 rounded border border-slate-200 text-xs font-mono text-slate-800 mb-2">
                        "{clause.clauseText}"
                      </div>

                      {/* Legal Analysis and Recommendation */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div className="text-slate-600 bg-slate-100/70 p-2 rounded border border-slate-200/80">
                          <strong>Analysis:</strong> {clause.explanation}
                        </div>
                        <div className="text-emerald-800 bg-emerald-50/80 p-2 rounded border border-emerald-200 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Recommendation:</strong> {clause.advice}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: GROUNDED DOCUMENT Q&A */}
          {activeTab === 'qa' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  {t('askDocumentHeader')} {docData.filename}
                </h3>
                <span className="text-[11px] text-slate-500">Multilingual: English • Hindi • Telugu</span>
              </div>

              {/* Suggested Questions */}
              {qaHistory.length === 0 && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                  <span className="text-[11px] font-bold text-amber-900 block">{t('suggestedQuestions')}</span>
                  <div className="flex flex-wrap gap-2">
                    {currentSuggestedQuestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => { setQaInput(sug); }}
                        className="text-[11px] bg-white text-slate-700 hover:text-amber-700 hover:border-amber-400 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q&A Conversation History */}
              <div className="space-y-4">
                {qaHistory.map((item, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-bold">Q</span>
                      {item.question}
                    </div>
                    <div className="text-slate-700 whitespace-pre-wrap leading-relaxed pl-7">{item.answer}</div>
                    
                    <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between pl-7">
                      <span>{t('relevantClause')} "{item.relevantSection}"</span>
                      <span className="font-semibold text-amber-600">{t('page')} {item.pageNumber}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Bar */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:border-amber-500"
                  placeholder={t('askPlaceholder')}
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskDocQA()}
                />
                <button
                  onClick={handleAskDocQA}
                  disabled={!qaInput.trim() || qaLoading}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-400 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {qaLoading ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {t('askBtn')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
