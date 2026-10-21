import React from 'react';
import type { TriageLevel, CallStatus, SMSStatus } from '../data/types';
import { useLanguage } from '../i18n/LanguageContext';
import { getTriageColorClasses } from '../lib/utils';
import { AlertCircle, CheckCircle, Clock, Send, AlertTriangle } from 'lucide-react';

interface TriageBadgeProps {
  level: TriageLevel;
}

export const TriageBadge: React.FC<TriageBadgeProps> = ({ level }) => {
  const { t } = useLanguage();
  const colors = getTriageColorClasses(level);

  const label =
    level === 'critical'
      ? t('triageCritical')
      : level === 'urgent'
      ? t('triageUrgent')
      : t('triageRoutine');

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      <span>{label}</span>
    </span>
  );
};

interface CallStatusBadgeProps {
  status: CallStatus;
}

export const CallStatusBadge: React.FC<CallStatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();

  switch (status) {
    case 'in_call':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded border border-slate-200">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{t('statusInCall')}</span>
        </span>
      );
    case 'matching':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-cyan-50 text-cyan-800 rounded border border-cyan-200">
          <Clock className="w-3 h-3 text-cyan-600" />
          <span>{t('statusMatching')}</span>
        </span>
      );
    case 'dispatched':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-[#1F6F6B]/10 text-[#1F6F6B] rounded border border-[#1F6F6B]/30">
          <CheckCircle className="w-3 h-3 text-[#1F6F6B]" />
          <span>{t('statusDispatched')}</span>
        </span>
      );
    case 'escalated_112':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-red-50 text-red-700 rounded border border-red-200">
          <AlertCircle className="w-3 h-3 text-red-600" />
          <span>{t('statusEscalated')}</span>
        </span>
      );
    default:
      return null;
  }
};

interface SMSStatusBadgeProps {
  status: SMSStatus;
  timestamp?: string;
}

export const SMSStatusBadge: React.FC<SMSStatusBadgeProps> = ({ status, timestamp }) => {
  const { t } = useLanguage();

  switch (status) {
    case 'sent':
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <Send className="w-3.5 h-3.5" />
          <span>{t('smsSent')}</span>
          {timestamp && <span className="text-slate-400 font-normal">({new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})</span>}
        </div>
      );
    case 'failed':
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-red-700">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{t('smsFailed')}</span>
          <span className="text-slate-500 font-normal">(Carrier DND / Timeout)</span>
        </div>
      );
    case 'queued':
    default:
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{t('smsQueued')}</span>
        </div>
      );
  }
};
