import type { Call, Nurse, Booking, DashboardStats, ExtractedFields } from './types';

export type CallListener = (calls: Call[]) => void;
export type BookingListener = (bookings: Booking[]) => void;
export type StatsListener = (stats: DashboardStats) => void;

export interface IDataAdapter {
  getCalls(): Promise<Call[]>;
  getNurses(): Promise<Nurse[]>;
  getBookings(): Promise<Booking[]>;
  getStats(): Promise<DashboardStats>;

  subscribeToCalls(listener: CallListener): () => void;
  subscribeToBookings(listener: BookingListener): () => void;
  subscribeToStats(listener: StatsListener): () => void;

  confirmDispatch(callId: string, nurseId: string): Promise<{ call: Call; booking: Booking }>;
  reassignNurse(bookingId: string, newNurseId: string): Promise<Booking>;
  escalateCall(callId: string, reason: string): Promise<Call>;
  toggleNurseAvailability(nurseId: string, available: boolean): Promise<Nurse>;
  submitFallbackIntake(fields: ExtractedFields, callerPhone: string, callerName?: string): Promise<{ call: Call; booking: Booking }>;

  startDemoReplay(type: 'standard' | 'critical'): void;
  stopDemoReplay(): void;
}
