import React, { useState, useEffect } from 'react';
import type { Booking } from '../data/types';
import { dataAdapter } from '../data';
import { useLanguage } from '../i18n/LanguageContext';
import { maskPhoneNumber } from '../lib/utils';
import { TriageBadge, SMSStatusBadge } from '../components/StatusBadge';
import { Search, X, MapPin } from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    dataAdapter.getBookings().then(setBookings);
    const unsub = dataAdapter.subscribeToBookings(setBookings);
    return () => unsub();
  }, []);

  const filtered = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      b.patientName.toLowerCase().includes(q) ||
      b.location.toLowerCase().includes(q) ||
      b.nurseName.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.condition.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || b.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Table Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 bg-[#F7F8F6]">
        {/* Title & Controls Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              {t('bookingsTitle')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical dispatch records, response latency audits, and nurse assignments
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchBookings')}
                className="w-48 sm:w-64 text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded focus:border-[#1F6F6B] focus:ring-1 focus:ring-[#1F6F6B]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-2 bg-white border border-slate-300 rounded text-slate-700"
            >
              <option value="all">{t('allStatuses')}</option>
              <option value="dispatched">Dispatched</option>
              <option value="in_transit">In Transit</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="reassigned">Reassigned</option>
            </select>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="text-xs py-1.5 px-2 bg-white border border-slate-300 rounded text-slate-700"
            >
              <option value="all">{t('allUrgencies')}</option>
              <option value="routine">{t('triageRoutine')}</option>
              <option value="urgent">{t('triageUrgent')}</option>
              <option value="critical">{t('triageCritical')}</option>
            </select>
          </div>
        </div>

        {/* Dense Readable Table */}
        <div className="flex-1 bg-white rounded-md border border-slate-200 overflow-y-auto shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0 z-10">
              <tr>
                <th className="p-3 uppercase tracking-wider text-[11px]">{t('bookingId')}</th>
                <th className="p-3 uppercase tracking-wider text-[11px]">{t('patient')}</th>
                <th className="p-3 uppercase tracking-wider text-[11px]">{t('location')}</th>
                <th className="p-3 uppercase tracking-wider text-[11px]">{t('nurseAssigned')}</th>
                <th className="p-3 uppercase tracking-wider text-[11px]">{t('urgency')}</th>
                <th className="p-3 uppercase tracking-wider text-[11px]">Status</th>
                <th className="p-3 uppercase tracking-wider text-[11px]">{t('duration')}</th>
                <th className="p-3 uppercase tracking-wider text-[11px]">SMS Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                    No matching bookings found.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const isSelected = selectedBooking?.id === b.id;
                  const under60s = b.dispatchDurationSeconds <= 60;

                  return (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className={`cursor-pointer transition-colors duration-150 ${
                        isSelected
                          ? 'bg-[#1F6F6B]/5 font-medium'
                          : 'hover:bg-slate-50/80 text-slate-700'
                      }`}
                    >
                      <td className="p-3 font-mono font-semibold text-slate-900">{b.id}</td>
                      <td className="p-3 font-medium text-slate-900">{b.patientName}</td>
                      <td className="p-3 text-slate-600 truncate max-w-[160px]">{b.location}</td>
                      <td className="p-3 text-slate-800">{b.nurseName}</td>
                      <td className="p-3"><TriageBadge level={b.urgency} /></td>
                      <td className="p-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 capitalize">
                          {b.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 font-mono">
                        <span>{b.dispatchDurationSeconds}s</span>
                        {under60s && (
                          <span className="ml-1 text-[10px] text-emerald-700 font-sans font-semibold">
                            (&lt;60s)
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <SMSStatusBadge status={b.smsStatus} timestamp={b.smsTimestamp} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      {selectedBooking && (
        <aside className="w-80 md:w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg z-20">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                {t('drawerTitle')}
              </span>
              <span className="text-xs font-mono text-slate-500">{selectedBooking.id}</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {/* Patient & Care */}
            <div className="p-3 rounded bg-slate-50 border border-slate-100 space-y-2">
              <div className="font-semibold text-slate-900 text-sm">{selectedBooking.patientName}</div>
              <div className="text-slate-600 flex items-center gap-1.5 font-mono">
                {maskPhoneNumber(selectedBooking.callerPhone)}
              </div>
              <div className="text-slate-600 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{selectedBooking.location}</span>
              </div>
            </div>

            {/* Medical Scope */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Condition & Care Scope
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed">
                {selectedBooking.condition}
              </div>
              <div className="text-slate-600 pt-1">
                Care Type: <span className="font-medium text-slate-900">{selectedBooking.careType}</span>
              </div>
              <div className="text-slate-600">
                Shift: <span className="font-medium text-slate-900">{selectedBooking.shiftLength}</span>
              </div>
            </div>

            {/* Nurse Assigned */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Assigned Nurse
              </div>
              <div className="p-3 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{selectedBooking.nurseName}</div>
                  <div className="text-[11px] text-slate-500">ID: {selectedBooking.nurseId}</div>
                </div>
                <TriageBadge level={selectedBooking.urgency} />
              </div>
            </div>

            {/* Dispatch Timeline & Performance */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Dispatch SLA Audit
              </div>
              <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1 text-slate-600 font-mono text-[11px]">
                <div>Time-to-dispatch: <span className="font-bold text-slate-900">{selectedBooking.dispatchDurationSeconds} seconds</span></div>
                <div>Status: <span className="text-slate-900 capitalize">{selectedBooking.status}</span></div>
                <div>Created: {new Date(selectedBooking.createdAt).toLocaleString()}</div>
              </div>
            </div>

            {/* SMS Status */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                SMS Confirmation
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <SMSStatusBadge status={selectedBooking.smsStatus} timestamp={selectedBooking.smsTimestamp} />
              </div>
            </div>

            {/* Notes */}
            {selectedBooking.notes && (
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Operator Desk Notes
                </div>
                <div className="p-2 rounded bg-amber-50/50 border border-amber-200 text-amber-900 text-xs">
                  {selectedBooking.notes}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};
