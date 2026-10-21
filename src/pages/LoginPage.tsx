import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('operator@careconnect.in');
  const [password, setPassword] = useState('careconnect2026');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/app';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = await login(email, password);
    if (res.error) {
      setErrorMessage(res.error);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleDemoPreset = (presetRole: 'operator' | 'viewer') => {
    if (presetRole === 'operator') {
      setEmail('operator@careconnect.in');
      setPassword('careconnect2026');
    } else {
      setEmail('viewer@careconnect.in');
      setPassword('viewer2026');
    }
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F6] flex flex-col justify-center items-center p-4">
      {/* Back to landing */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to CareConnect overview</span>
      </Link>

      <div className="w-full max-w-sm bg-white rounded-md border border-slate-200 p-6 shadow-xs">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <span className="text-base font-semibold text-slate-900 tracking-tight block">
            {t('brandName')}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Operator Desk Authentication
          </span>
        </div>

        {/* Generic Error Message Display */}
        {errorMessage && (
          <div
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center gap-2"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Desk Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@careconnect.in"
                className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1F6F6B] focus:ring-1 focus:ring-[#1F6F6B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Desk Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1F6F6B] focus:ring-1 focus:ring-[#1F6F6B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 text-xs font-semibold text-white bg-[#1F6F6B] hover:bg-[#165A56] rounded-md transition-colors duration-150 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Sign in to Operator Desk'}
          </button>
        </form>

        {/* Quick fill presets */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="text-[11px] font-medium text-slate-500 mb-2">
            Quick credentials (demo testing):
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoPreset('operator')}
              className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded transition-colors"
            >
              Operator (Full)
            </button>
            <button
              type="button"
              onClick={() => handleDemoPreset('viewer')}
              className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded transition-colors"
            >
              Viewer (Read-only)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
