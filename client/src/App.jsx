import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import ResearchPage from './pages/ResearchPage';
import DocumentAnalyzerPage from './pages/DocumentAnalyzerPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import AdminIngestionPage from './pages/AdminIngestionPage';
import CaseSearchPage from './pages/CaseSearchPage';
import DocumentDrafterPage from './pages/DocumentDrafterPage';
import SimpleLegalAssistantPage from './pages/SimpleLegalAssistantPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-amber-400 flex items-center justify-center text-sm font-semibold">
        Connecting to LexAI Indian Law Engine...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/assistant" element={<SimpleLegalAssistantPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/documents" element={<DocumentAnalyzerPage />} />
            <Route path="/drafts" element={<DocumentDrafterPage />} />
            <Route path="/cases" element={<CaseSearchPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminIngestionPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/*" element={<ProtectedLayout />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

