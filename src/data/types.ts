export type TriageLevel = 'critical' | 'urgent' | 'routine';

export type CallStatus = 'in_call' | 'matching' | 'dispatched' | 'escalated_112';

export type SMSStatus = 'queued' | 'sent' | 'failed';

export type LanguageDetected = 'hindi' | 'hinglish' | 'english';

export type PipelineStage = 
  | 'caller'
  | 'telephony'
  | 'voice_agent'
  | 'llm'
  | 'api_matching'
  | 'database'
  | 'sms_dashboard';

export interface ExtractedFields {
  condition: string;
  careType: string;
  urgency: TriageLevel;
  shiftLength: string;
  location: string;
  patientAge?: number;
  patientGender?: string;
}

export interface TranscriptLine {
  id: string;
  speaker: 'caller' | 'agent' | 'system';
  text: string;
  timestamp: string;
}

export interface NurseMatchScore {
  overall: number; // 0 - 100
  skill: number;
  distance: number;
  availability: number;
}

export interface Nurse {
  id: string;
  name: string;
  phone: string;
  verified: boolean;
  skills: string[];
  area: string;
  city: string;
  available: boolean;
  experienceYears: number;
  rating: number;
  coordinates: [number, number]; // [lat, lng]
}

export interface NurseCandidateMatch {
  nurse: Nurse;
  score: NurseMatchScore;
  distanceKm: number;
  estimatedArrivalMinutes: number;
}

export interface Call {
  id: string;
  callerPhone: string;
  callerName?: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  callToDispatchSeconds?: number;
  language: LanguageDetected;
  triage: TriageLevel;
  status: CallStatus;
  pipelineStage: PipelineStage;
  transcript: TranscriptLine[];
  extractedFields: Partial<ExtractedFields>;
  matchedNurse?: NurseCandidateMatch;
  alternativeNurses?: NurseCandidateMatch[];
  patientCoordinates?: [number, number];
  smsStatus: SMSStatus;
  smsTimestamp?: string;
  escalationNotes?: string;
  bookingId?: string;
}

export interface Booking {
  id: string;
  callId: string;
  callerPhone: string;
  patientName: string;
  nurseId: string;
  nurseName: string;
  condition: string;
  careType: string;
  urgency: TriageLevel;
  shiftLength: string;
  location: string;
  status: 'dispatched' | 'in_transit' | 'active' | 'completed' | 'cancelled' | 'reassigned';
  smsStatus: SMSStatus;
  smsTimestamp: string;
  dispatchDurationSeconds: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export type UserRole = 'operator' | 'viewer';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface DashboardStats {
  callsToday: number;
  avgDispatchSeconds: number;
  dispatchedCount: number;
  escalatedCount: number;
  recentDispatchTimes: Array<{ callIndex: number; callId: string; seconds: number; target: number }>;
}
