import React, { useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { dataAdapter } from '../data';
import { SlidersHorizontal, Globe, Shield, Play, Square, AlertOctagon, Server } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { role, setRole, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [demoStatus, setDemoStatus] = useState<string | null>(null);

  const isSupabase = import.meta.env.VITE_DATA_ADAPTER === 'supabase';

  const handleStartStandardDemo = () => {
    dataAdapter.startDemoReplay('standard');
    setDemoStatus('Standard Hip Replacement demo call running... Switch to Dashboard to watch live!');
  };

  const handleStartCriticalDemo = () => {
    dataAdapter.startDemoReplay('critical');
    setDemoStatus('Critical 112 STEMI Emergency demo call running... Switch to Dashboard to watch live!');
  };

  const handleStopDemo = () => {
    dataAdapter.stopDemoReplay();
    setDemoStatus('Demo replay stopped.');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F7F8F6]">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white p-4 rounded-md border border-slate-200">
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#1F6F6B]" />
            {t('settingsTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Desk preferences, presentation demonstration scenarios, and role simulators
          </p>
        </div>

        {/* Setting 1: Language Toggle */}
        <div className="bg-white p-5 rounded-md border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#1F6F6B]" />
                {t('languageSetting')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Switches the desk UI between English and Hindi. Live caller transcripts always remain in original spoken language.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors duration-150 ${
                  language === 'en'
                    ? 'bg-[#1F6F6B] text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors duration-150 ${
                  language === 'hi'
                    ? 'bg-[#1F6F6B] text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>
        </div>

        {/* Setting 2: Role Switcher (Operator vs Viewer) */}
        <div className="bg-white p-5 rounded-md border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#1F6F6B]" />
                {t('switchRole')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current active user: <span className="font-mono text-slate-800">{user?.email}</span> ({role})
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole('operator')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors duration-150 ${
                  role === 'operator'
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                Operator (Full)
              </button>
              <button
                type="button"
                onClick={() => setRole('viewer')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors duration-150 ${
                  role === 'viewer'
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                Viewer (Read-only)
              </button>
            </div>
          </div>
        </div>

        {/* Setting 3: Demo Mode Replays */}
        <div className="bg-white p-5 rounded-md border border-slate-200 space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Play className="w-4 h-4 text-[#1F6F6B]" />
              {t('demoReplayTitle')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulates complete end-to-end inbound calls with timed streaming transcripts, audio pipeline stages, and triage actions.
            </p>
          </div>

          {demoStatus && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-mono">
              {demoStatus}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={handleStartStandardDemo}
              className="flex-1 py-2 px-3 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 hover:bg-slate-100 rounded transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-[#1F6F6B]" />
              <span>{t('runStandardDemo')}</span>
            </button>

            <button
              type="button"
              onClick={handleStartCriticalDemo}
              className="flex-1 py-2 px-3 text-xs font-medium text-red-800 bg-red-50 border border-red-200 hover:bg-red-100 rounded transition-colors flex items-center justify-center gap-1.5"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
              <span>{t('runCriticalDemo')}</span>
            </button>

            <button
              type="button"
              onClick={handleStopDemo}
              className="py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded transition-colors flex items-center justify-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('stopDemo')}</span>
            </button>
          </div>
        </div>

        {/* Setting 4: Data Layer Runtime Info */}
        <div className="bg-white p-5 rounded-md border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-500" />
            <span className="font-bold text-slate-900 uppercase tracking-wider">
              {t('currentAdapter')}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 text-slate-600">
            <div>
              Active Adapter:{' '}
              <span className="font-bold text-slate-900 capitalize">
                {isSupabase ? 'Supabase Realtime Adapter' : 'Realistic Mock Adapter (Default)'}
              </span>
            </div>
            <div>
              Live Call Influx: Every 25–35 seconds (automated in Mock Mode)
            </div>
            <div>
              Configuration Switch:{' '}
              <code className="text-slate-800 bg-white px-1 py-0.5 rounded border border-slate-200">
                VITE_DATA_ADAPTER=supabase
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
