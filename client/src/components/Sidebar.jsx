import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  FileSearch,
  Search,
  FileEdit,
  MessageSquare,
  Settings,
  Database,
  LogOut,
  Scale
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home',              path: '/dashboard',  icon: Home        },
    { label: 'Document Analysis', path: '/documents',  icon: FileSearch  },
    { label: 'Legal Search',      path: '/research',   icon: Search      },
    { label: 'Document Drafting', path: '/drafts',     icon: FileEdit    },
    { label: 'Chat with AI',      path: '/chat',       icon: MessageSquare },
    { label: 'Settings',          path: '/settings',   icon: Settings    },
  ];

  if (isAdmin) {
    navItems.splice(6, 0, { label: 'Admin', path: '/admin', icon: Database });
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1a2332] text-white flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* ── Logo ── */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[#2563eb] flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div className="leading-none">
            <p className="text-white font-bold text-base tracking-tight">LexAI</p>
            <p className="text-[10px] text-blue-300 mt-0.5">AI Legal Assistant</p>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#2563eb] text-white'
                      : 'text-slate-400 hover:bg-white/8 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* ── Footer ── */}
        <div className="px-4 py-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || ''}</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="text-slate-500 hover:text-red-400 p-1 rounded shrink-0"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center pt-3 border-t border-white/10">
            <p className="text-[10px] text-slate-600 leading-relaxed">
              🏛 Powered by AI<br />Built for Justice
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
