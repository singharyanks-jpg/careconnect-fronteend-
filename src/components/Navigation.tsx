import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { LayoutDashboard, CalendarCheck, UserCheck, MessageSquarePlus, SlidersHorizontal } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { t } = useLanguage();

  const navItems = [
    { to: '/app', label: t('navDashboard'), icon: LayoutDashboard, end: true },
    { to: '/app/bookings', label: t('navBookings'), icon: CalendarCheck, end: false },
    { to: '/app/nurses', label: t('navNurses'), icon: UserCheck, end: false },
    { to: '/app/fallback', label: t('navFallback'), icon: MessageSquarePlus, end: false },
    { to: '/app/settings', label: t('navSettings'), icon: SlidersHorizontal, end: false },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 flex overflow-x-auto scrollbar-none" aria-label="Main Navigation">
      <div className="flex gap-1 sm:gap-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors duration-150 ${
                  isActive
                    ? 'bg-[#1F6F6B]/10 text-[#1F6F6B]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
