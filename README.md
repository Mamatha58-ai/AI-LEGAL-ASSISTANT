# LexAI - Production-Quality Indian Law AI Assistant

**LexAI** is an AI-powered legal research, document risk analyzer, legal drafting, and RAG assistant focused specifically on **Indian Law**.

> **Legal Safety Disclaimer:** LexAI provides general legal information grounded in Indian statutes (including Bharatiya Nyaya Sanhita BNS 2023, BNSS 2023, BSA 2023, Constitution of India, Consumer Protection Act 2019, RERA 2016, IT Act 2000, Contract Act 1872) and is **not a substitute for advice from a qualified legal professional or advocate**.

---

## 🏗️ Project Architecture

```text
lexai/
├── client/                      # React 18 + Vite + Tailwind CSS + Lucide Icons
│   ├── src/
│   │   ├── components/          # Navbar, Sidebar, LegalDisclaimer, CitationBadge
│   │   ├── pages/               # Dashboard, Chat, Research, Analyzer, Cases, Drafter, Admin, History, Settings, Login, Register
│   │   ├── hooks/
│   │   ├── services/            # Axios API client with JWT interceptor
│   │   ├── context/             # AuthContext
│   │   ├── App.jsx
│   │   └── index.css            # Tailwind Directives & Styling
│   └── package.json
│
├── server/                      # Node.js + Express.js + MongoDB Atlas / In-Memory + RAG Engine
│   ├── config/                  # Database & JWT Configuration
│   ├── controllers/             # Auth, Chat, Document, Legal Search, Draft, Admin
│   ├── middleware/              # Auth, Admin, Upload (Multer), Rate Limiter, Error Handler
│   ├── models/                  # Mongoose Schemas (User, Conversation, Document, LegalKnowledge)
│   ├── routes/                  # REST API Express Routes
│   ├── services/
│   │   ├── ai/                  # Intent Detector, LLM Service, Safety Checker
│   │   ├── rag/                 # RAG Retriever, Vector Store, Similarity Scorer
│   │   ├── documents/           # PDF Text Extractor, Risk Analyzer, Draft Generator
│   │   └── legal-search/        # Indian Legal Knowledge Base Dataset
│   ├── utils/                   # Legal Disclaimers & Utilities
│   ├── server.js
│   └── package.json
│
├── .env.example
├── README.md
└── package.json                 # Monorepo Scripts
```

---

## ⚡ Quick Start Guide

### 1. Install Dependencies
Run the command below from the root directory to install packages for both client and server:

```bash
npm run install:all
```

Or install manually:

```bash
# Server packages
cd server
npm install

# Client packages
cd ../client
npm install
```

---

### 2. Environment Variables Setup
Copy `.env.example` to `server/.env`:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection (MongoDB Atlas or local)
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/lexai?retryWrites=true&w=majority

# JWT Auth Secret
JWT_SECRET=super_secret_jwt_key_lexai_2026_indian_law

# AI Engine Credentials (Google Gemini)
LLM_API_KEY=your_gemini_api_key_here
EMBEDDING_API_KEY=your_gemini_api_key_here

# Client URL
CLIENT_URL=http://localhost:5173
```

> **Note**: LexAI features a built-in fallback data store and offline legal intelligence engine. If `MONGODB_URI` or `LLM_API_KEY` are not set immediately, the application will automatically run seamlessly out of the box!

---

### 3. Running Development Servers

#### Option A: Run Backend Server
```bash
cd server
npm run dev
```
Server runs at `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`).

#### Option B: Run Frontend App
```bash
cd client
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## 📚 Key Features & Usage

### 1. AI Legal Chat & Intent Reasoning Pipeline (`/chat`)
- Grounded in Indian statutes (BNS 2023 / IPC, BNSS 2023 / CrPC, BSA 2023 / Evidence Act, Constitution, COPRA 2019, RERA 2016, IT Act).
- RAG Vector retrieval attaches statutory sources and precedent citations to answers.
- Anti-hallucination safeguard: Explicitly disclaims if reliable sources cannot be matched.

### 2. PDF Contract Risk Analyzer (`/documents`)
- Upload contracts (PDF, DOCX, TXT).
- Extracts Executive Summary (Parties, Dates, Terms, Penalties).
- Highlights potential concerns (*"Uncapped Indemnity"*, *"Automatic Renewal"*, *"Extensive Non-Compete"*) using non-alarmist phrasing (*"Potential concern"*).
- Grounded Document Q&A: Ask questions specifically about the uploaded contract text with page/clause citations.

### 3. Legal Research & Case Search (`/research` & `/cases`)
- Search across Indian statutes, BNS sections, and Supreme Court landmark precedents (e.g. *Arnesh Kumar v. State of Bihar*, *Puttaswamy Right to Privacy*).

### 4. Legal Document Drafting Wizard (`/drafts`)
- Generate formal drafts for:
  - *Legal Notice for Recovery of Outstanding Dues*
  - *Residential Rental / Lease Agreement (Model Tenancy Rules)*
  - *Consumer Dispute Complaint (COPRA 2019 Section 35)*
  - *General Legal Correspondence*
- In-browser live editor with TXT and PDF export.

### 5. RAG Knowledge Base Admin Ingestion (`/admin`)
- Admin portal (`/admin`) allowing administrators to upload, process, and index new legal documents into the RAG vector engine.

---

## 🔒 Security & Safety Controls
- **Authentication**: Password hashing with BCrypt + JWT authentication tokens.
- **Role-based Access Control**: Protection for Admin ingestion routes.
- **Middleware Protections**: Helmet, Rate Limiter (300 req/15min per IP), CORS controls, file size/type sanitization.
- **Legal Safety Disclaimers**: Automatic disclaimer inclusion on every response and document draft.

---

## 🚀 Building for Production

To build the client bundle for production deployment:

```bash
cd client
npm run build
```

Production dist files will be compiled to `client/dist`.
