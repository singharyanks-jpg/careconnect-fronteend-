import React, { useState } from 'react';
import type { Call, NurseCandidateMatch } from '../../data/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { maskPhoneNumber } from '../../lib/utils';
import { TriageBadge, CallStatusBadge, SMSStatusBadge } from '../../components/StatusBadge';
import { TranscriptView } from './TranscriptView';
import { NurseMatchCard } from './NurseMatchCard';
import { LeafletMap } from '../../components/LeafletMap';
import {
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  AlertOctagon,
  FileCheck2,
  Clock,
  MapPin,
  Stethoscope,
} from 'lucide-react';

interface CallDetailProps {
  call: Call | null;
  onConfirmDispatch: (callId: string, nurseId: string) => Promise<void>;
  onReassignNurse: (bookingId: string, nurseId: string) => Promise<void>;
  onEscalate: (callId: string, reason: string) => Promise<void>;
  isLoadingAction?: boolean;
}

export const CallDetail: React.FC<CallDetailProps> = ({
  call,
  onConfirmDispatch,
  onReassignNurse,
  onEscalate,
  isLoadingAction = false,
}) => {
  const { t } = useLanguage();
  const { role } = useAuth();
  const isViewer = role === 'viewer';

  const [selectedNurseCandidate, setSelectedNurseCandidate] = useState<NurseCandidateMatch | null>(null);
  const [showEscalatePrompt, setShowEscalatePrompt] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');

  if (!call) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/50 text-slate-400 text-sm">
        {t('selectCallPrompt')}
      </div>
    );
  }

  const activeCandidate = selectedNurseCandidate || call.matchedNurse;
  const isCritical = call.triage === 'critical' || call.status === 'escalated_112';
  const isDispatched = call.status === 'dispatched';

  const handleConfirm = async () => {
    if (!activeCandidate) return;
    await onConfirmDispatch(call.id, activeCandidate.nurse.id);
  };

  const handleEscalateSubmit = async () => {
    await onEscalate(call.id, escalateReason || 'Critical escalation dispatched to Emergency Medical Services (112 / 108).');
    setShowEscalatePrompt(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#F7F8F6]">
      {/* Top Header Card */}
      <div className="p-3.5 bg-white rounded-md border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 font-mono">
              {maskPhoneNumber(call.callerPhone)}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({call.callerName || 'Caller'})
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Language: <span className="font-semibold text-slate-700 capitalize">{call.language}</span> • Call ID: <span className="font-mono">{call.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TriageBadge level={call.triage} />
          <CallStatusBadge status={call.status} />
        </div>
      </div>

      {/* Critical Triage Notice Banner */}
      {isCritical && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md" role="alert" aria-live="assertive">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider">
                {t('criticalAlertTitle')}
              </h3>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                {t('criticalAlertMessage')}
              </p>
              {call.escalationNotes && (
                <p className="text-xs text-red-700 mt-2 font-mono bg-red-100/70 p-2 rounded border border-red-200">
                  {call.escalationNotes}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Captured Details (5 Extracted Fields Card) */}
      <div className="bg-white rounded-md border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-[#1F6F6B]" />
            {t('capturedDetailsTitle')}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">AI Real-time Extraction</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {/* 1. Condition */}
          <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-1">
              <Stethoscope className="w-3 h-3 text-slate-400" />
              {t('condition')}
            </div>
            <div className="font-semibold text-slate-800 line-clamp-2">
              {call.extractedFields.condition || <span className="text-slate-400 italic font-normal">{t('notYetAsked')}</span>}
            </div>
          </div>

          {/* 2. Care Type */}
          <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-1">
              <CheckCircle className="w-3 h-3 text-slate-400" />
              {t('careType')}
            </div>
            <div className="font-semibold text-slate-800">
              {call.extractedFields.careType || <span className="text-slate-400 italic font-normal">{t('notYetAsked')}</span>}
            </div>
          </div>

          {/* 3. Urgency */}
          <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3 h-3 text-slate-400" />
              {t('urgency')}
            </div>
            <div>
              {call.extractedFields.urgency ? (
                <TriageBadge level={call.extractedFields.urgency} />
              ) : (
                <span className="text-slate-400 italic font-normal">{t('notYetAsked')}</span>
              )}
            </div>
          </div>

          {/* 4. Shift Length */}
          <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {t('shiftLength')}
            </div>
            <div className="font-semibold text-slate-800">
              {call.extractedFields.shiftLength || <span className="text-slate-400 italic font-normal">{t('notYetAsked')}</span>}
            </div>
          </div>

          {/* 5. Location */}
          <div className="p-2.5 rounded bg-slate-50 border border-slate-100 sm:col-span-2">
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {t('location')}
            </div>
            <div className="font-semibold text-slate-800">
              {call.extractedFields.location || <span className="text-slate-400 italic font-normal">{t('notYetAsked')}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Live Transcript Stream */}
      <TranscriptView transcript={call.transcript} isActive={call.status === 'in_call'} />

      {/* Matched Nurse & Alternatives Card */}
      {!isCritical && (
        <NurseMatchCard
          primaryMatch={activeCandidate || undefined}
          alternatives={call.alternativeNurses}
          onSelectAlternative={(candidate) => setSelectedNurseCandidate(candidate)}
          canReassign={!isViewer && !isDispatched}
        />
      )}

      {/* Map (Patient & Nurse) */}
      {!isCritical && (
        <div className="bg-white rounded-md border border-slate-200 p-3">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Dispatch Route & Proximity</span>
            {activeCandidate && (
              <span className="text-xs font-semibold text-[#1F6F6B]">
                {activeCandidate.distanceKm} km ({activeCandidate.estimatedArrivalMinutes} min)
              </span>
            )}
          </div>
          <LeafletMap
            patientCoords={call.patientCoordinates}
            nurseCoords={activeCandidate?.nurse.coordinates}
            nurseName={activeCandidate?.nurse.name}
            distanceKm={activeCandidate?.distanceKm}
          />
        </div>
      )}

      {/* SMS Confirmation Status & Actions */}
      <div className="p-4 bg-white rounded-md border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {t('smsStatusTitle')}
          </span>
          <SMSStatusBadge status={call.smsStatus} timestamp={call.smsTimestamp} />
        </div>

        {/* Operator Action Buttons */}
        {isViewer ? (
          <div className="p-2.5 bg-slate-50 rounded text-xs text-slate-500 italic text-center">
            {t('readOnlyNotice')}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {/* Confirm Dispatch Button */}
            {!isCritical && !isDispatched && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isLoadingAction || !activeCandidate}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1F6F6B] hover:bg-[#165A56] rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{t('actionConfirmDispatch')}</span>
              </button>
            )}

            {/* Reassign Nurse Button */}
            {!isCritical && isDispatched && call.bookingId && (
              <button
                type="button"
                onClick={() => {
                  if (call.alternativeNurses && call.alternativeNurses[0]) {
                    onReassignNurse(call.bookingId!, call.alternativeNurses[0].nurse.id);
                  }
                }}
                disabled={isLoadingAction || !call.alternativeNurses?.length}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors duration-150 disabled:opacity-50 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('actionReassignNurse')}</span>
              </button>
            )}

            {/* Escalate to 112 Button */}
            {!isCritical && (
              <button
                type="button"
                onClick={() => setShowEscalatePrompt(true)}
                disabled={isLoadingAction}
                className="px-3 py-2 text-xs font-semibold text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-md transition-colors duration-150 flex items-center gap-1.5 ml-auto"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                <span>{t('actionEscalate')}</span>
              </button>
            )}
          </div>
        )}

        {/* Escalate Prompt Modal / Inline Box */}
        {showEscalatePrompt && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md space-y-2">
            <div className="text-xs font-bold text-red-900">
              Confirm Immediate 112 / 108 Emergency Medical Escalation
            </div>
            <p className="text-xs text-red-800">
              This action will abort routine nurse dispatch, set triage to Red Critical, and log the reason for emergency coordination.
            </p>
            <input
              type="text"
              value={escalateReason}
              onChange={(e) => setEscalateReason(e.target.value)}
              placeholder="e.g. Acute chest pain, unresponsive patient, anaphylaxis"
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-red-300 rounded focus:ring-1 focus:ring-red-500"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowEscalatePrompt(false)}
                className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEscalateSubmit}
                className="px-3 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded"
              >
                Confirm Escalation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
