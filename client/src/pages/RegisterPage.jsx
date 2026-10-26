import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, Scale, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        {/* Brand mark */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-extrabold mx-auto shadow-lg text-2xl">
            L
          </div>
          <div>
            <h1 className="text-2xl font-extrabold font-serif tracking-tight text-white">Create your account</h1>
            <p className="text-sm text-slate-400 mt-1">Join the LexAI Indian Law Platform</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 p-7 rounded-2xl shadow-2xl space-y-5">

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs font-medium flex items-center gap-2">
              <span className="shrink-0">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Full Name</label>
              <div className="flex items-center gap-2.5 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/30 transition-all">
                <User className="w-4 h-4 text-slate-500 shrink-0" />
                <input
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder:text-slate-500"
                  placeholder="Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Email Address</label>
              <div className="flex items-center gap-2.5 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/30 transition-all">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder:text-slate-500"
                  placeholder="advocate@lexai.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Password
                <span className="text-slate-500 font-normal ml-1">(min. 6 characters)</span>
              </label>
              <div className="flex items-center gap-2.5 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/30 transition-all">
                <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder:text-slate-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400 font-medium"
              >
                <option value="user">User / Legal Counsel</option>
                <option value="admin">Administrator (RAG Ingestion Access)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-500/20 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 text-slate-700">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs">or</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <p className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 text-slate-600 text-[11px]">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure & encrypted</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>Indian Law focused</span>
          </div>
        </div>

      </div>
    </div>
  );
}
