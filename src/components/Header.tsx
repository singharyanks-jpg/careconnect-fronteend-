import React from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Globe, LogOut, Shield, Play, Square } from 'lucide-react';

interface HeaderProps {
  isDemoActive?: boolean;
  onToggleDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDemoActive, onToggleDemo }) => {
  const { user, role, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 h-14 flex items-center justify-between">
      {/* Brand & Wordmark */}
      <div className="flex items-center gap-3">
        <span className="text-base font-semibold text-slate-900 tracking-tight">
          {t('brandName')}
        </span>
        <span className="hidden sm:inline-block text-xs text-slate-500 border-l border-slate-200 pl-3">
          {t('operatorDesk')}
        </span>
      </div>

      {/* Action utilities */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Demo Mode Toggle */}
        {onToggleDemo && (
          <button
            type="button"
            onClick={onToggleDemo}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border transition-colors duration-150 ${
              isDemoActive
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            title="Toggle presentation demo mode"
            aria-label="Toggle demo mode"
          >
            {isDemoActive ? (
              <>
                <Square className="w-3 h-3 text-amber-700 fill-amber-700" />
                <span>{t('demoRunning')}</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-slate-600" />
                <span>{t('demoMode')}</span>
              </>
            )}
          </button>
        )}

        {/* Language Toggle */}
        <button
          type="button"
          onClick={handleLanguageToggle}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors duration-150"
          aria-label="Switch interface language"
        >
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        {/* Role badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
          <Shield className="w-3 h-3 text-slate-500" />
          <span>{role === 'operator' ? t('operator') : t('viewer')}</span>
        </div>

        {/* User logout */}
        {user && (
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded transition-colors duration-150"
            title={t('logout')}
            aria-label={t('logout')}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('logout')}</span>
          </button>
        )}
      </div>
    </header>
  );
};
