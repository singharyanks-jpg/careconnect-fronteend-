import React, { useState } from 'react';
import type { DashboardStats } from '../data/types';
import { useLanguage } from '../i18n/LanguageContext';
import { PhoneCall, Clock, CheckCircle2, AlertOctagon, ChevronDown, ChevronUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

interface StatsOverviewProps {
  stats: DashboardStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const { t } = useLanguage();
  const [isChartOpen, setIsChartOpen] = useState(false);

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Metric tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 flex-1">
          {/* Calls Today */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">{t('statsCallsToday')}</div>
              <div className="text-base font-semibold text-slate-900">{stats.callsToday}</div>
            </div>
          </div>

          {/* Average Call to Dispatch */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">{t('statsAvgDispatch')}</div>
              <div className="text-base font-semibold text-slate-900 flex items-baseline gap-1">
                <span>{stats.avgDispatchSeconds}s</span>
                <span className="text-[11px] text-emerald-700 font-medium">(&lt;60s SLA)</span>
              </div>
            </div>
          </div>

          {/* Dispatched */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">{t('statsDispatched')}</div>
              <div className="text-base font-semibold text-slate-900">{stats.dispatchedCount}</div>
            </div>
          </div>

          {/* 112 Escalations */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center text-red-600">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">{t('statsEscalated')}</div>
              <div className="text-base font-semibold text-red-700">{stats.escalatedCount}</div>
            </div>
          </div>
        </div>

        {/* Collapsible toggle for trend chart */}
        <button
          type="button"
          onClick={() => setIsChartOpen(!isChartOpen)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded border border-slate-200 hover:bg-slate-50 transition-colors duration-150"
          aria-expanded={isChartOpen}
        >
          <span>{isChartOpen ? t('collapseChart') : t('expandChart')}</span>
          {isChartOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Collapsible Recharts line chart */}
      {isChartOpen && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-700">{t('statsTrendTitle')}</span>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#1F6F6B]"></span> Dispatch time
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t border-dashed border-red-500"></span> 60s Target SLA
              </span>
            </div>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.recentDispatchTimes} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                <XAxis dataKey="callId" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" />
                <YAxis domain={[0, 90]} tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" unit="s" />
                <Tooltip
                  formatter={(value: any) => [`${value}s`, 'Dispatch Time']}
                  labelFormatter={(label) => `Call: ${label}`}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', fontSize: '12px' }}
                />
                <ReferenceLine y={60} stroke="#EF4444" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="seconds"
                  stroke="#1F6F6B"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#1F6F6B' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
