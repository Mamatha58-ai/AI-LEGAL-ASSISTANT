import { DRAFT_DOCUMENT_DISCLAIMER } from '../../utils/disclaimers.js';

/**
 * Legal Document Generator Engine for Indian Legal Templates
 */
export function generateLegalDraft(templateType, formData) {
  const disclaimer = DRAFT_DOCUMENT_DISCLAIMER;
  const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  let text = "";

  switch (templateType) {
    case 'LEGAL_NOTICE_PAYMENT':
      text = `LEGAL NOTICE FOR RECOVERY OF OUTSTANDING DUES

BY REGISTERED POST A.D. / SPEED POST

Date: ${today}

TO:
${formData.recipientName || '[Recipient Name / Company]'}
${formData.recipientAddress || '[Recipient Full Address]'}

SENDER / CLIENT:
${formData.senderName || '[Your Full Name]'}
${formData.senderAddress || '[Your Address]'}

SUBJECT: NOTICE FOR PAYMENT OF OUTSTANDING DUES OF ₹${formData.amount || '___'} ALONG WITH INTEREST

Sir/Madam,

Under instructions and authority from my client, ${formData.senderName}, I hereby serve upon you this Legal Notice:

1. That my client is engaged in the business of ${formData.businessType || 'services/goods delivery'} and enjoys high reputation in the commercial community.
2. That you had approached my client for providing ${formData.serviceDescription || 'services/goods'} vide Agreement/Invoice dated ${formData.contractDate || '___'}.
3. That as per the agreed terms, my client rendered the services to your complete satisfaction and raised Invoice(s) totaling ₹${formData.amount || '___'}.
4. That despite repeated reminders and promises, you have failed and neglected to pay the outstanding balance of ₹${formData.amount || '___'}, thereby causing deliberate financial loss and breach of contract.
5. That your failure to pay constitutes an offence of breach of trust and civil default under the provisions of the Indian Contract Act, 1872.

THEREFORE, I hereby call upon you to pay the entire outstanding sum of ₹${formData.amount || '___'} along with interest @ 18% per annum within FIFTEEN (15) DAYS from the receipt of this Notice.

Failing which, my client has given me clear instructions to initiate appropriate civil suit for recovery and criminal proceedings in the competent Court of Law at your sole risk, cost, and consequence.

Copy retained in office for further record.

Advocate / Authorized Signatory

---
[DISCLAIMER: ${disclaimer}]`;
      break;

    case 'RENTAL_AGREEMENT':
      text = `RESIDENTIAL RENTAL AGREEMENT
(Formulated in Accordance with Model Tenancy Guidelines & Transfer of Property Principles)

This Rental Agreement is executed at ${formData.city || '[City]'} on this ${today}, by and between:

LANDLORD / LESSOR:
${formData.landlordName || '[Landlord Name]'}, Resident of ${formData.landlordAddress || '[Address]'}.

TENANT / LESSEE:
${formData.tenantName || '[Tenant Name]'}, Resident of ${formData.tenantAddress || '[Address]'}.

1. PREMISES:
Landlord agrees to let out, and Tenant agrees to take on rent, the residential property situated at ${formData.propertyAddress || '[Property Address]'} ("Premises").

2. TERM & RENT:
The tenancy shall be for an initial period of eleven (11) months starting from ${formData.startDate || today}. Tenant shall pay monthly base rent of ₹${formData.monthlyRent || '___'} on or before the 5th day of each calendar month.

3. SECURITY DEPOSIT:
Tenant has deposited a interest-free Security Deposit of ₹${formData.securityDeposit || '___'} with the Landlord, refundable upon peaceful handover of Premises.

4. MAINTENANCE & UTILITIES:
Tenant shall pay electricity and water charges directly. Landlord shall be responsible for structural repairs.

5. NOTICE FOR VACATION:
Either party may terminate this agreement by giving ONE (1) MONTH prior written notice to the other party.

IN WITNESS WHEREOF, parties have signed below:

_____________________                  _____________________
LANDLORD                               TENANT

WITNESS 1: ________________           WITNESS 2: ________________

---
[DISCLAIMER: ${disclaimer}]`;
      break;

    case 'CONSUMER_COMPLAINT':
      text = `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION AT ${formData.district || '[DISTRICT]'?.toUpperCase()}

COMPLAINT NO. _____ OF 2026

IN THE MATTER OF:
${formData.complainantName || '[Complainant Name]'}
Residing at: ${formData.complainantAddress || '[Address]'}
... COMPLAINANT

VERSUS

${formData.oppositeParty || '[Opposite Party / Seller Name]'}
Having office at: ${formData.opAddress || '[Address]'}
... OPPOSITE PARTY

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019

MOST RESPECTFULLY SHOWETH:

1. That the Complainant purchased ${formData.productName || 'product/service'} from Opposite Party on ${formData.purchaseDate || '___'} for consideration of ₹${formData.amountPaid || '___'}.
2. That the said product/service suffered from major deficiency and defect, namely: ${formData.defectDetails || '[Describe defect or deficiency]'}.
3. That Complainant served written notice dated ${formData.noticeDate || '___'} requesting replacement/refund, but Opposite Party failed to resolve the grievance.

PRAYER:
It is respectfully prayed that this Hon'ble Commission may be pleased to direct Opposite Party to:
(a) Refund the sum of ₹${formData.amountPaid || '___'} along with interest @ 12% p.a.;
(b) Pay compensation of ₹${formData.compensation || '50,000'} for mental agony and harassment;
(c) Award litigation costs of ₹10,000.

COMPLAINANT
THROUGH ADVOCATE

---
[DISCLAIMER: ${disclaimer}]`;
      break;

    default:
      text = `GENERAL LEGAL CORRESPONDENCE / NOTICE DRAFT

Date: ${today}

To Whom It May Concern,

RE: LEGAL NOTICE REGARDING ${formData.subject || 'MATTER'}

I am writing on behalf of ${formData.senderName || '[Name]'} regarding ${formData.details || '[Details of dispute or inquiry]'}.

Please be advised that as per Indian laws, appropriate action must be taken within 15 days of this notice.

Sincerely,

${formData.senderName || '[Name]'}

---
[DISCLAIMER: ${disclaimer}]`;
  }

  return {
    templateType,
    draftContent: text,
    disclaimer,
    generatedAt: new Date().toISOString()
  };
}
