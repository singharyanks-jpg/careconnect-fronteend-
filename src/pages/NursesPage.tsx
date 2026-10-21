import React, { useState, useEffect } from 'react';
import type { Nurse } from '../data/types';
import { dataAdapter } from '../data';
import { useAuth } from '../features/auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Search, CheckCircle2, MapPin, Star, UserCheck } from 'lucide-react';

export const NursesPage: React.FC = () => {
  const { t } = useLanguage();
  const { role } = useAuth();
  const isViewer = role === 'viewer';

  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    dataAdapter.getNurses().then(setNurses);
  }, []);

  const handleToggleAvailability = async (nurseId: string, current: boolean) => {
    if (isViewer) return;
    const updated = await dataAdapter.toggleNurseAvailability(nurseId, !current);
    setNurses((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  const cities = Array.from(new Set(nurses.map((n) => n.city)));

  const filtered = nurses.filter((n) => {
    const q = search.toLowerCase();
    const matchesSearch =
      n.name.toLowerCase().includes(q) ||
      n.area.toLowerCase().includes(q) ||
      n.city.toLowerCase().includes(q) ||
      n.skills.some((s) => s.toLowerCase().includes(q));

    const matchesCity = cityFilter === 'all' || n.city === cityFilter;
    const matchesAvail = availableOnly ? n.available : true;

    return matchesSearch && matchesCity && matchesAvail;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F7F8F6]">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header & Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-md border border-slate-200">
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#1F6F6B]" />
              {t('nursesTitle')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified clinical nurses, background-checked credentials, and geographic duty roster
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('searchNurses')}
                className="w-48 sm:w-60 text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#1F6F6B]"
              />
            </div>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="text-xs py-1.5 px-2 bg-white border border-slate-300 rounded text-slate-700"
            >
              <option value="all">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded border-slate-300 text-[#1F6F6B] focus:ring-[#1F6F6B]"
              />
              <span>{t('availableOnly')}</span>
            </label>
          </div>
        </div>

        {/* Nurses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((nurse) => (
            <div
              key={nurse.id}
              className="bg-white rounded-md border border-slate-200 p-4 flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div>
                {/* Top Row: Name, Verified Badge, Rating */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{nurse.name}</span>
                      {nurse.verified && (
                        <span title="Verified Registered Professional" className="inline-flex">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6F6B]" />
                        </span>
                      )}
                    </h3>
                    <div className="text-xs text-slate-500 font-mono">{nurse.phone}</div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                    <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
                    <span className="font-semibold">{nurse.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Location & Experience */}
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {nurse.area}, {nurse.city}
                  </span>
                  <span>•</span>
                  <span>{nurse.experienceYears} {t('yearsExp')}</span>
                </div>

                {/* Clinical Skills Chips */}
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
              </div>

              {/* Bottom: Availability Toggle */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{t('availability')}:</span>

                {isViewer ? (
                  <span
                    className={`font-medium px-2 py-0.5 rounded text-[11px] ${
                      nurse.available
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {nurse.available ? t('available') : t('onDuty')}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggleAvailability(nurse.id, nurse.available)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors duration-150 ${
                      nurse.available
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {nurse.available ? t('available') : t('onDuty')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
