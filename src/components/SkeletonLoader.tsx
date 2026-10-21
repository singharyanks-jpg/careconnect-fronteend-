import React from 'react';

export const CallCardSkeleton: React.FC = () => {
  return (
    <div className="p-3.5 bg-white rounded-md border border-slate-200 animate-pulse space-y-2.5">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 rounded w-28" />
        <div className="h-4 bg-slate-200 rounded w-16" />
      </div>
      <div className="flex gap-2">
        <div className="h-3 bg-slate-100 rounded w-20" />
        <div className="h-3 bg-slate-100 rounded w-14" />
      </div>
      <div className="h-3 bg-slate-100 rounded w-3/4" />
    </div>
  );
};

export const DetailCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded-md border border-slate-200 animate-pulse space-y-4">
      <div className="h-5 bg-slate-200 rounded w-1/3" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 bg-slate-100 rounded" />
        <div className="h-10 bg-slate-100 rounded" />
        <div className="h-10 bg-slate-100 rounded" />
        <div className="h-10 bg-slate-100 rounded" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-16" /></td>
      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-32" /></td>
      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-28" /></td>
      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-20" /></td>
      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-16" /></td>
    </tr>
  );
};
