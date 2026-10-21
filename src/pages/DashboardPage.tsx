import React, { useState, useEffect } from 'react';
import type { Call, DashboardStats } from '../data/types';
import { dataAdapter } from '../data';
import { StatsOverview } from '../components/StatsOverview';
import { CallQueue } from '../features/dashboard/CallQueue';
import { CallDetail } from '../features/dashboard/CallDetail';
import { ArchitecturePipeline } from '../features/dashboard/ArchitecturePipeline';
import { PhoneCall, FileText, Layers } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'queue' | 'detail' | 'pipeline'>('detail');
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  useEffect(() => {
    // Initial fetch
    dataAdapter.getCalls().then((initialCalls) => {
      setCalls(initialCalls);
      if (initialCalls.length > 0) {
        setSelectedCallId((prev) => prev || initialCalls[0].id);
      }
    });

    dataAdapter.getStats().then(setStats);

    // Realtime subscriptions
    const unsubCalls = dataAdapter.subscribeToCalls((updatedCalls) => {
      setCalls(updatedCalls);
      // If currently selected call was not set or disappeared, pick the first
      setSelectedCallId((prev) => {
        if (!prev && updatedCalls.length > 0) return updatedCalls[0].id;
        return prev;
      });
    });

    const unsubStats = dataAdapter.subscribeToStats((updatedStats) => {
      setStats(updatedStats);
    });

    return () => {
      unsubCalls();
      unsubStats();
    };
  }, []);

  const selectedCall = calls.find((c) => c.id === selectedCallId) || calls[0] || null;

  const handleSelectCall = (callId: string) => {
    setSelectedCallId(callId);
    // On mobile, switch to detail tab
    setActiveTab('detail');
  };

  const handleConfirmDispatch = async (callId: string, nurseId: string) => {
    setIsLoadingAction(true);
    try {
      await dataAdapter.confirmDispatch(callId, nurseId);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleReassignNurse = async (bookingId: string, nurseId: string) => {
    setIsLoadingAction(true);
    try {
      await dataAdapter.reassignNurse(bookingId, nurseId);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleEscalate = async (callId: string, reason: string) => {
    setIsLoadingAction(true);
    try {
      await dataAdapter.escalateCall(callId, reason);
    } finally {
      setIsLoadingAction(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Top Slim Stats Row */}
      {stats && <StatsOverview stats={stats} />}

      {/* Tab Switcher for Tablets & Mobile (<1280px) */}
      <div className="xl:hidden bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-around text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('queue')}
          className={`md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
            activeTab === 'queue' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Calls ({calls.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('detail')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
            activeTab === 'detail' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Call Detail</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
            activeTab === 'pipeline' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Architecture</span>
        </button>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Live Calls (~28% desktop, full/hidden on small screens) */}
        <div
          className={`w-full md:w-72 lg:w-80 shrink-0 ${
            activeTab === 'queue' ? 'block' : 'hidden md:block'
          }`}
        >
          <CallQueue
            calls={calls}
            selectedCallId={selectedCallId}
            onSelectCall={handleSelectCall}
          />
        </div>

        {/* Column 2: Call Detail (~44% desktop, flexible) */}
        <div
          className={`flex-1 flex overflow-hidden ${
            activeTab === 'detail' ? 'block' : 'hidden xl:block'
          } ${activeTab !== 'queue' && activeTab !== 'pipeline' ? 'block' : ''}`}
        >
          <CallDetail
            call={selectedCall}
            onConfirmDispatch={handleConfirmDispatch}
            onReassignNurse={handleReassignNurse}
            onEscalate={handleEscalate}
            isLoadingAction={isLoadingAction}
          />
        </div>

        {/* Column 3: Tool Architecture (~28% desktop, tab on <1280px) */}
        <div
          className={`w-full md:w-80 xl:w-88 shrink-0 ${
            activeTab === 'pipeline' ? 'block' : 'hidden xl:block'
          }`}
        >
          <ArchitecturePipeline currentCall={selectedCall} />
        </div>
      </div>
    </div>
  );
};
