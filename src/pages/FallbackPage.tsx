import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataAdapter } from '../data';
import type { ExtractedFields, TriageLevel } from '../data/types';
import { useLanguage } from '../i18n/LanguageContext';
import { isValidE164Phone } from '../lib/utils';
import { MessageSquarePlus, Bot, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const FallbackPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('+91 ');
  const [condition, setCondition] = useState('');
  const [careType, setCareType] = useState('Home Nursing / Post-Op Care');
  const [urgency, setUrgency] = useState<TriageLevel>('urgent');
  const [shiftLength, setShiftLength] = useState('12 Hours (Day)');
  const [location, setLocation] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidE164Phone(callerPhone)) {
      setError('Please provide a valid E.164 phone number (e.g. +91 98101 23456).');
      return;
    }

    if (!condition.trim() || condition.length < 5) {
      setError('Please enter a specific medical condition (minimum 5 characters).');
      return;
    }

    if (!location.trim() || location.length < 5) {
      setError('Please provide a complete location / area (minimum 5 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const fields: ExtractedFields = {
        condition,
        careType,
        urgency,
        shiftLength,
        location,
      };

      const res = await dataAdapter.submitFallbackIntake(fields, callerPhone, callerName || 'Intake Patient');
      setCreatedBookingId(res.booking.id);
    } catch (err: any) {
      setError(err?.message || 'Error creating fallback intake booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F7F8F6]">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white p-4 rounded-md border border-slate-200">
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquarePlus className="w-4 h-4 text-[#1F6F6B]" />
            {t('fallbackTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {t('fallbackSubtitle')}
          </p>
        </div>

        {/* Success Confirmation */}
        {createdBookingId ? (
          <div className="bg-white rounded-md border border-emerald-200 p-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t('fallbackSuccess')}</h3>
            <p className="text-xs text-slate-600">
              Booking ID <span className="font-mono font-semibold text-slate-800">{createdBookingId}</span> is now active. SMS confirmation queued to {callerPhone}.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCreatedBookingId(null);
                  setCondition('');
                  setLocation('');
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded"
              >
                New Intake Form
              </button>
              <button
                type="button"
                onClick={() => navigate('/app/bookings')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1F6F6B] hover:bg-[#165A56] rounded"
              >
                View in Bookings Roster
              </button>
            </div>
          </div>
        ) : (
          /* Conversational Intake Form */
          <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
            {/* Simulation Header */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#1F6F6B]" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Operator Structured Chat Intake
              </span>
            </div>

            {error && (
              <div className="m-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              {/* Field 1 & 2: Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('patientNameField')}
                  </label>
                  <input
                    type="text"
                    required
                    value={callerName}
                    onChange={(e) => setCallerName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra (Son)"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#1F6F6B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('phoneField')}
                  </label>
                  <input
                    type="text"
                    required
                    value={callerPhone}
                    onChange={(e) => setCallerPhone(e.target.value)}
                    placeholder="+91 98101 23456"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono focus:ring-1 focus:ring-[#1F6F6B]"
                  />
                </div>
              </div>

              {/* 5 Core Intake Fields */}
              <div className="space-y-3.5 pt-2 border-t border-slate-100">
                {/* 1. Condition */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    1. {t('conditionField')}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder="e.g. Post-operative knee surgery recovery, wound dressing change, Foley catheter flush"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#1F6F6B]"
                  />
                </div>

                {/* 2. Care Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      2. {t('careTypeField')}
                    </label>
                    <select
                      value={careType}
                      onChange={(e) => setCareType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-700"
                    >
                      <option value="Home Nursing / Post-Op Care">Home Nursing / Post-Op Care</option>
                      <option value="Elderly Bedside Care">Elderly Bedside Care</option>
                      <option value="ICU-Level Care">ICU-Level Care</option>
                      <option value="Physiotherapy Support">Physiotherapy Support</option>
                      <option value="Palliative Care">Palliative Care</option>
                      <option value="Wound Care">Wound Care</option>
                    </select>
                  </div>

                  {/* 3. Urgency */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      3. {t('urgencyField')}
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as TriageLevel)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-700"
                    >
                      <option value="routine">Routine (Non-critical scheduled)</option>
                      <option value="urgent">Urgent (Immediate attention needed)</option>
                      <option value="critical">Critical (Life-threatening / 112)</option>
                    </select>
                  </div>
                </div>

                {/* 4. Shift Length & 5. Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      4. {t('shiftLengthField')}
                    </label>
                    <select
                      value={shiftLength}
                      onChange={(e) => setShiftLength(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-700"
                    >
                      <option value="Single Procedure (2-3 Hours)">Single Procedure (2-3 Hours)</option>
                      <option value="4 Hours">4 Hours</option>
                      <option value="8 Hours (Day)">8 Hours (Day)</option>
                      <option value="12 Hours (Day)">12 Hours (Day)</option>
                      <option value="12 Hours (Night)">12 Hours (Night)</option>
                      <option value="24 Hours">24 Hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      5. {t('locationField')}
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Sector 56, Gurgaon / Gomti Nagar, Lucknow"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#1F6F6B]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#1F6F6B] hover:bg-[#165A56] rounded-md transition-colors duration-150 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Scoring & Dispatching...' : t('submitFallbackBtn')}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
