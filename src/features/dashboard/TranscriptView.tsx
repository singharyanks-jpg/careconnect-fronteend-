import React, { useEffect, useRef } from 'react';
import type { TranscriptLine } from '../../data/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { Bot, User, Radio } from 'lucide-react';

interface TranscriptViewProps {
  transcript: TranscriptLine[];
  isActive?: boolean;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ transcript, isActive }) => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as dialogue arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="bg-white rounded-md border border-slate-200 overflow-hidden flex flex-col h-56">
      {/* Header */}
      <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {t('transcriptTitle')}
          </span>
          {isActive && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#1F6F6B] font-medium">
              <Radio className="w-3 h-3 animate-pulse" /> Live Stream
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          {transcript.length} turns
        </span>
      </div>

      {/* Speech lines - strictly escaped plain text rendering */}
      <div
        ref={scrollRef}
        className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#FAFBF9] text-xs font-normal"
        aria-live="polite"
      >
        {transcript.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 italic">
            Connecting audio stream...
          </div>
        ) : (
          transcript.map((line) => {
            const isAgent = line.speaker === 'agent';
            const isSystem = line.speaker === 'system';

            if (isSystem) {
              return (
                <div key={line.id} className="text-center my-1 text-[11px] text-slate-500 italic">
                  {line.text}
                </div>
              );
            }

            return (
              <div
                key={line.id}
                className={`flex gap-2.5 ${isAgent ? 'justify-start' : 'justify-end'}`}
              >
                {isAgent && (
                  <div className="w-6 h-6 rounded bg-[#1F6F6B]/15 text-[#1F6F6B] flex items-center justify-center shrink-0 mt-0.5" title="CareConnect Voice Agent">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded px-3 py-2 leading-relaxed ${
                    isAgent
                      ? 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                      : 'bg-[#1F6F6B] text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] mb-1 opacity-75">
                    <span className="font-semibold uppercase tracking-wider">
                      {isAgent ? 'CareConnect AI' : 'Caller'}
                    </span>
                    <span className="font-mono">{line.timestamp}</span>
                  </div>
                  {/* Escaped text string - never raw HTML */}
                  <p className="whitespace-pre-wrap select-text">{line.text}</p>
                </div>

                {!isAgent && (
                  <div className="w-6 h-6 rounded bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5" title="Caller">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
