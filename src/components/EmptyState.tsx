import React from 'react';
import { Inbox } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      {description && <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>}
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-3 py-1.5 text-xs font-medium text-white bg-[#1F6F6B] hover:bg-[#165A56] rounded transition-colors duration-150"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
