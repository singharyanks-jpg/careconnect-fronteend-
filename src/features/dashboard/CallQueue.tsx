import React, { useState, useEffect } from 'react';
import type { Call } from '../../data/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { maskPhoneNumber, formatDuration, formatTimeOnly } from '../../lib/utils';
import { TriageBadge, CallStatusBadge } from '../../components/StatusBadge';
import { Zap, Clock, User } from 'lucide-react';

interface CallQueueProps {
  calls: Call[];
  selectedCallId: string | null;
  onSelectCall: (callId: string) => void;
  isLoading?: boolean;
}

export const CallQueue: React.FC<CallQueueProps> = ({
  calls,
  selectedCallId,
  onSelectCall,
  isLoading: _isLoading,
}) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'active' | 'critical'>('all');
  const [now, setNow] = useState(() => Date.now());

  // Update timer every second for active calls
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredCalls = calls.filter((c) => {
    if (filter === 'active') return c.status === 'in_call' || c.status === 'matching';
    if (filter === 'critical') return c.triage === 'critical';
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Header & Filter Chips */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {t('liveCallsTitle')} ({filteredCalls.length})
          </h2>
        </div>

        {/* Filter chips */}
        <div className="flex gap-1.5" role="tablist" aria-label="Call Filters">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors duration-150 ${
              filter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            {t('filterAll')} ({calls.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'active'}
            onClick={() => setFilter('active')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors duration-150 ${
              filter === 'active'
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            {t('filterActive')} ({calls.filter((c) => c.status === 'in_call' || c.status === 'matching').length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'critical'}
            onClick={() => setFilter('critical')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors duration-150 ${
              filter === 'critical'
                ? 'bg-red-800 text-white'
                : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
            }`}
          >
            {t('filterCritical')} ({calls.filter((c) => c.triage === 'critical').length})
          </button>
        </div>
      </div>

      {/* Call List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100" aria-live="polite">
        {filteredCalls.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            {t('noActiveCalls')}
          </div>
        ) : (
          filteredCalls.map((call) => {
            const isSelected = call.id === selectedCallId;
            const isActive = call.status === 'in_call' || call.status === 'matching';

            // Running timer calculation for active calls
            let elapsedSec = call.durationSeconds;
            if (isActive && call.startTime) {
              const diff = Math.floor((now - new Date(call.startTime).getTime()) / 1000);
              if (diff > 0) elapsedSec = diff;
            }

            const dispatchSec = call.callToDispatchSeconds;
            const under60s = dispatchSec !== undefined && dispatchSec <= 60;

            return (
              <div
                key={call.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectCall(call.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelectCall(call.id);
                }}
                className={`p-3 text-left transition-colors duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1F6F6B]/5 border-l-4 border-l-[#1F6F6B]'
                    : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                }`}
              >
                {/* Top line: Masked Phone & Time */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-semibold text-slate-900 tracking-tight font-mono">
                    {maskPhoneNumber(call.callerPhone)}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {formatTimeOnly(call.startTime)}
                  </span>
                </div>

                {/* Second line: Caller Name & Language */}
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                  <span className="truncate flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[130px]">{call.callerName || 'Caller'}</span>
                  </span>
                  <span className="text-[10px] uppercase font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    {call.language}
                  </span>
                </div>

                {/* Third line: Triage badge & Status badge */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <TriageBadge level={call.triage} />
                  <CallStatusBadge status={call.status} />
                </div>

                {/* Bottom line: Running timer or Final Dispatch Time */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100/70">
                  {isActive ? (
                    <div className="flex items-center gap-1 text-slate-700 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
                      <span>Live: {formatDuration(elapsedSec)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-600 text-[11px]">
                      <span>Dispatch: {dispatchSec ? `${dispatchSec}s` : '--'}</span>
                    </div>
                  )}

                  {/* Marker when under 60-second target */}
                  {under60s && (
                    <span
                      className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
                      title="Completed in under 60 seconds target"
                    >
                      <Zap className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" />
                      <span>{t('targetAchieved')}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
