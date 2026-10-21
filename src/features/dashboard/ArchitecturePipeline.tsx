import React, { useState } from 'react';
import type { PipelineStage, Call } from '../../data/types';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Phone,
  Radio,
  Cpu,
  BrainCircuit,
  Sliders,
  Database,
  Send,
  ChevronRight,
  Info,
  Layers
} from 'lucide-react';

interface ArchitecturePipelineProps {
  currentCall?: Call | null;
}

interface NodeDefinition {
  id: PipelineStage;
  name: string;
  role: string;
  icon: React.ElementType;
  receives: string;
  outputs: string;
  latency: string;
}

const PIPELINE_NODES: NodeDefinition[] = [
  {
    id: 'caller',
    name: 'Caller',
    role: 'Cellular/Landline PSTN voice call',
    icon: Phone,
    receives: 'Caller voice (Hindi / Hinglish / English)',
    outputs: 'Analog / VoLTE audio signal',
    latency: '< 5ms',
  },
  {
    id: 'telephony',
    name: 'Telephony Gateway',
    role: '+91 SIP Trunk & Webhook router',
    icon: Radio,
    receives: 'PSTN dial-in to +91 11 4084 4899',
    outputs: 'Bidirectional WebSocket audio media stream',
    latency: '45ms',
  },
  {
    id: 'voice_agent',
    name: 'Voice Agent (STT / TTS)',
    role: 'Streaming speech-to-text & synthesis',
    icon: Cpu,
    receives: 'Streaming PCM 16kHz audio frames',
    outputs: 'Real-time Hindi/Hinglish text transcript',
    latency: '180ms',
  },
  {
    id: 'llm',
    name: 'LLM (Triage & Extraction)',
    role: 'Clinical triage & JSON extraction',
    icon: BrainCircuit,
    receives: 'Dialogue history & clinical rubric system prompt',
    outputs: 'JSON: condition, careType, urgency, shift, location',
    latency: '360ms',
  },
  {
    id: 'api_matching',
    name: 'API Scoring Engine',
    role: 'Triage rules & weighted nurse scoring',
    icon: Sliders,
    receives: 'Extracted 5 fields + patient geocoded bounds',
    outputs: 'Ranked nurse candidate matches & arrival ETA',
    latency: '60ms',
  },
  {
    id: 'database',
    name: 'Database (Supabase / Postgres)',
    role: 'Row-Level Security & audit persistence',
    icon: Database,
    receives: 'Booking record, nurse assignment, audit logs',
    outputs: 'Persisted booking record (e.g. BK-8902)',
    latency: '24ms',
  },
  {
    id: 'sms_dashboard',
    name: 'SMS & Operator Desk',
    role: 'SMS dispatch notification & real-time sync',
    icon: Send,
    receives: 'Confirmation text payload with nurse details',
    outputs: 'Carrier delivery receipt (DLR) + desk update',
    latency: '1.2s',
  },
];

const STAGE_ORDER: PipelineStage[] = [
  'caller',
  'telephony',
  'voice_agent',
  'llm',
  'api_matching',
  'database',
  'sms_dashboard',
];

export const ArchitecturePipeline: React.FC<ArchitecturePipelineProps> = ({ currentCall }) => {
  const { t } = useLanguage();
  const [selectedNode, setSelectedNode] = useState<NodeDefinition | null>(PIPELINE_NODES[3]); // Default LLM

  const currentStageIndex = currentCall ? STAGE_ORDER.indexOf(currentCall.pipelineStage) : -1;
  const isEscalated = currentCall?.status === 'escalated_112';

  const getNodeStatus = (nodeId: PipelineStage, index: number): 'idle' | 'processing' | 'done' | 'error' => {
    if (!currentCall) return 'idle';
    if (isEscalated && (nodeId === 'llm' || nodeId === 'voice_agent')) return 'error';
    if (isEscalated && index > currentStageIndex) return 'idle';
    if (index < currentStageIndex) return 'done';
    if (index === currentStageIndex) return 'processing';
    return 'idle';
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#1F6F6B]" />
            {t('pipelineTitle')}
          </h2>
          {currentCall && (
            <span className="text-[11px] font-mono text-slate-500">
              Stage: {currentCall.pipelineStage}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {t('pipelineSubtitle')}
        </p>
      </div>

      {/* Vertical Pipeline Diagram */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 -z-0" />

          {PIPELINE_NODES.map((node, idx) => {
            const status = getNodeStatus(node.id, idx);
            const isSelected = selectedNode?.id === node.id;
            const Icon = node.icon;

            let dotColor = 'bg-slate-300';
            if (status === 'done') dotColor = 'bg-emerald-600';
            if (status === 'processing') dotColor = 'bg-[#1F6F6B] animate-pulse';
            if (status === 'error') dotColor = 'bg-red-600';

            return (
              <div key={node.id} className="relative z-10 mb-2">
                <button
                  type="button"
                  onClick={() => setSelectedNode(node)}
                  className={`w-full text-left p-2.5 rounded-md border transition-all duration-150 flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-[#1F6F6B]/5 border-[#1F6F6B] shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Node icon & status dot */}
                    <div className="relative w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      <Icon className="w-4 h-4" />
                      <span
                        className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${dotColor}`}
                      />
                    </div>

                    {/* Text info */}
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {node.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {node.role}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Node Inspection Panel */}
        {selectedNode && (
          <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Info className="w-3 h-3 text-[#1F6F6B]" />
                {selectedNode.name}
              </span>
              <span className="text-[11px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                {t('avgLatency')}: {selectedNode.latency}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
                {t('nodeReceives')}
              </span>
              <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200 break-words">
                {selectedNode.receives}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
                {t('nodeOutputs')}
              </span>
              <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200 break-words">
                {selectedNode.outputs}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compact Data Flow Line */}
      <div className="p-3 bg-slate-50 border-t border-slate-200">
        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
          {t('dataFlowTitle')}
        </div>
        <div className="text-[11px] font-mono text-slate-700 leading-snug bg-white p-2 rounded border border-slate-200">
          {t('dataFlowStep')}
        </div>
      </div>
    </div>
  );
};
