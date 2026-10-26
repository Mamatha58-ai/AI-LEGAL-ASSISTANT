import React from 'react';
import { Settings, Shield, User, Languages } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function SettingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <h1 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-600" />
          {t('settingsTitle')}
        </h1>
        <p className="text-xs text-slate-500">
          {t('settingsDesc')}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 text-xs">
        {/* Language Selection Setting */}
        <div>
          <h2 className="font-bold text-slate-900 text-sm font-serif mb-1 flex items-center gap-2">
            <Languages className="w-4 h-4 text-amber-600" /> {t('languagePreference')}
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            {t('languagePreferenceDesc')}
          </p>
          <LanguageSwitcher variant="cards" />
        </div>

        {/* User Profile */}
        <div className="border-t border-slate-100 pt-6">
          <h2 className="font-bold text-slate-900 text-sm font-serif mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-600" /> {t('userProfile')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-400 font-semibold block mb-0.5">{t('fullName')}</span>
              <strong className="text-slate-900">{user?.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block mb-0.5">{t('emailAddress')}</span>
              <strong className="text-slate-900">{user?.email}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block mb-0.5">{t('accountRole')}</span>
              <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                {user?.role}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block mb-0.5">{t('jurisdiction')}</span>
              <strong className="text-slate-900">{t('jurisdictionVal')}</strong>
            </div>
          </div>
        </div>

        {/* Legal Compliance */}
        <div className="border-t border-slate-100 pt-4">
          <h2 className="font-bold text-slate-900 text-sm font-serif mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-600" /> {t('complianceTitle')}
          </h2>
          <div className="space-y-2 text-slate-600 leading-relaxed">
            <p>• <strong>Data Security:</strong> Uploaded legal documents are stored securely and never shared publicly.</p>
            <p>• <strong>Grounded Compliance:</strong> LexAI prioritizes retrieved authoritative Indian statutes over general model parameters.</p>
            <p>• <strong>Disclaimer Enforcement:</strong> All generated responses include mandatory disclaimers establishing that information is not formal legal advice.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

