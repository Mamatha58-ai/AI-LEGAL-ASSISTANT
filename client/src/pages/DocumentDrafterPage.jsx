import React, { useState } from 'react';
import { FileCheck2, Copy, Check, Download, Edit3, Sparkles, FileText, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import api from '../services/api';
import LegalDisclaimer from '../components/LegalDisclaimer';

export default function DocumentDrafterPage() {
  const [templateType, setTemplateType] = useState('LEGAL_NOTICE_PAYMENT');
  const [formData, setFormData] = useState({
    senderName: '',
    senderAddress: '',
    recipientName: '',
    recipientAddress: '',
    amount: '',
    businessType: '',
    serviceDescription: '',
    landlordName: '',
    tenantName: '',
    monthlyRent: '',
    securityDeposit: '',
    propertyAddress: '',
    complainantName: '',
    oppositeParty: '',
    amountPaid: '',
    defectDetails: ''
  });

  const [generatedDraft, setGeneratedDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/drafts/generate', {
        templateType,
        formData
      });

      if (res.data.success) {
        setGeneratedDraft(res.data.draft.draftContent);
      }
    } catch (err) {
      alert(`Error generating draft: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([generatedDraft], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Legal_Draft_${templateType}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("LEXAI - AI GENERATED LEGAL DRAFT", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(generatedDraft, 180);
    doc.text(lines, 14, 30);
    doc.save(`Legal_Draft_${templateType}.pdf`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <h1 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-amber-600" />
          Automated Indian Legal Document Generator & Drafter
        </h1>
        <p className="text-xs text-slate-500">
          Generate formal drafts for Legal Notices, Residential Rental Agreements, and Consumer Disputes.
        </p>
      </div>

      <LegalDisclaimer text="AI-generated draft — review by a qualified legal professional before use." isHighRisk />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs Pane */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-sm font-serif">1. Select Document Template</h2>

          <select
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-amber-500"
          >
            <option value="LEGAL_NOTICE_PAYMENT">📄 Legal Notice for Recovery of Dues</option>
            <option value="RENTAL_AGREEMENT">📄 Residential Rental / Lease Agreement</option>
            <option value="CONSUMER_COMPLAINT">📄 Consumer Forum Complaint (COPRA 2019)</option>
            <option value="GENERAL_NOTICE">📄 General Legal Notice / Correspondence</option>
          </select>

          <h2 className="font-bold text-slate-900 text-sm font-serif pt-2">2. Enter Required Facts</h2>

          {templateType === 'LEGAL_NOTICE_PAYMENT' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sender Name (Your Name)</label>
                <input
                  type="text"
                  className="w-full p-2 border border-slate-300 rounded-md outline-none"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.senderName}
                  onChange={(e) => handleInputChange('senderName', e.target.value)}
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Recipient / Defaulter Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-slate-300 rounded-md outline-none"
                  placeholder="e.g. Apex Tech Pvt Ltd"
                  value={formData.recipientName}
                  onChange={(e) => handleInputChange('recipientName', e.target.value)}
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Outstanding Amount (₹)</label>
                <input
                  type="text"
                  className="w-full p-2 border border-slate-300 rounded-md outline-none"
                  placeholder="e.g. 1,50,000"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                />
              </div>
            </div>
          )}

          {templateType === 'RENTAL_AGREEMENT' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Landlord Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-slate-300 rounded-md outline-none"
                  placeholder="e.g. Suresh Sharma"
                  value={formData.landlordName}
                  onChange={(e) => handleInputChange('landlordName', e.target.value)}
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tenant Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-slate-300 rounded-md outline-none"
                  placeholder="e.g. Ananya Roy"
                  value={formData.tenantName}
                  onChange={(e) => handleInputChange('tenantName', e.target.value)}
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Monthly Rent (₹)</label>
                <input
                  type="text"
                  className="w-full p-2 border border-slate-300 rounded-md outline-none"
                  placeholder="e.g. 25,000"
                  value={formData.monthlyRent}
                  onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Security Deposit (₹)</label>
                <input
                  type="text"
                  className="w-full p-2 border border-slate-300 rounded-md outline-none"
                  placeholder="e.g. 50,000"
                  value={formData.securityDeposit}
                  onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                />
              </div>
            </div>
          )}

          {templateType === 'CONSUMER_COMPLAINT' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Complainant Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-slate-300 rounded-md outline-none"
                  placeholder="e.g. Rajesh Verma"
                  value={formData.complainantName}
                  onChange={(e) => handleInputChange('complainantName', e.target.value)}
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Opposite Party (Seller / Service Provider)</label>
                <input
                  type="text"
                  className="w-full p-2 border border-slate-300 rounded-md outline-none"
                  placeholder="e.g. Global Electronics Store"
                  value={formData.oppositeParty}
                  onChange={(e) => handleInputChange('oppositeParty', e.target.value)}
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Defect / Deficiency Details</label>
                <textarea
                  className="w-full p-2 border border-slate-300 rounded-md outline-none h-20"
                  placeholder="e.g. Sold defective laptop with broken motherboard and refused refund."
                  value={formData.defectDetails}
                  onChange={(e) => handleInputChange('defectDetails', e.target.value)}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {loading ? <Sparkles className="w-4 h-4 spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Legal Draft
          </button>
        </div>

        {/* Draft Editor Preview Pane */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-sm font-serif flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-600" /> Draft Preview & Editor
            </h2>

            {generatedDraft && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded flex items-center gap-1 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> TXT
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 px-2.5 py-1 rounded flex items-center gap-1 font-bold"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            )}
          </div>

          <textarea
            className="w-full flex-1 min-h-[420px] p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 leading-relaxed outline-none focus:border-amber-500"
            placeholder="Click 'Generate Legal Draft' to generate formal document draft here..."
            value={generatedDraft}
            onChange={(e) => setGeneratedDraft(e.target.value)}
          />

          <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 text-center">
            Notice: All generated drafts carry mandatory legal review disclaimers. Always consult a practicing advocate before formal signing or legal filing.
          </div>
        </div>
      </div>
    </div>
  );
}
