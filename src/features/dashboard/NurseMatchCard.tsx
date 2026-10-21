import React, { useState } from 'react';
import type { NurseCandidateMatch } from '../../data/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { CheckCircle2, ChevronDown, ChevronUp, MapPin, Star } from 'lucide-react';

interface NurseMatchCardProps {
  primaryMatch?: NurseCandidateMatch;
  alternatives?: NurseCandidateMatch[];
  onSelectAlternative?: (candidate: NurseCandidateMatch) => void;
  canReassign?: boolean;
}

export const NurseMatchCard: React.FC<NurseMatchCardProps> = ({
  primaryMatch,
  alternatives = [],
  onSelectAlternative,
  canReassign = true,
}) => {
  const { t } = useLanguage();
  const [showAlternatives, setShowAlternatives] = useState(false);

  if (!primaryMatch) {
    return (
      <div className="bg-white rounded-md border border-slate-200 p-4 text-center">
        <p className="text-xs text-slate-500 italic">{t('noNurseMatchedYet')}</p>
      </div>
    );
  }

  const { nurse, score, distanceKm, estimatedArrivalMinutes } = primaryMatch;

  return (
    <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
      {/* Primary Match Card Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {t('matchedNurseTitle')}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1F6F6B] bg-[#1F6F6B]/10 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-[#1F6F6B]" />
            {t('verifiedNurse')}
          </span>
        </div>

        {/* Composite Match Score */}
        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
          <span className="text-xs text-slate-500 font-medium">{t('matchScore')}:</span>
          <span className="text-xs font-bold text-slate-900">{score.overall}%</span>
        </div>
      </div>

      {/* Primary Nurse Body */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <span>{nurse.name}</span>
              <span className="text-xs font-normal text-slate-500">({nurse.experienceYears} {t('yearsExp')})</span>
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                {nurse.area}, {nurse.city}
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-slate-700">{distanceKm} {t('distanceKm')}</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#1F6F6B] font-medium">~{estimatedArrivalMinutes} {t('etaMinutes')}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
            <span className="font-semibold">{nurse.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Clinical Skills Tags */}
        <div className="flex flex-wrap gap-1.5">
          {nurse.skills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Match Score Breakdown */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Score Breakdown
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500">{t('skillScore')}</div>
              <div className="text-xs font-bold text-slate-800">{score.skill}%</div>
            </div>
            <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500">{t('distanceScore')}</div>
              <div className="text-xs font-bold text-slate-800">{score.distance}%</div>
            </div>
            <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500">{t('availabilityScore')}</div>
              <div className="text-xs font-bold text-slate-800">{score.availability}%</div>
            </div>
          </div>
        </div>

        {/* Collapsible Next-Best 2 Candidates */}
        {alternatives.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAlternatives(!showAlternatives)}
              className="w-full flex items-center justify-between text-xs font-medium text-slate-600 hover:text-slate-900 py-1"
            >
              <span>{t('alternativeCandidates')} ({alternatives.length})</span>
              {showAlternatives ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAlternatives && (
              <div className="mt-2 space-y-2">
                {alternatives.slice(0, 2).map((alt) => (
                  <div
                    key={alt.nurse.id}
                    className="p-2.5 rounded border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span>{alt.nurse.name}</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          ({alt.distanceKm} km • Match: {alt.score.overall}%)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {alt.nurse.skills.slice(0, 2).join(', ')}
                      </div>
                    </div>

                    {canReassign && onSelectAlternative && (
                      <button
                        type="button"
                        onClick={() => onSelectAlternative(alt)}
                        className="px-2 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded transition-colors duration-150"
                      >
                        Select
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
