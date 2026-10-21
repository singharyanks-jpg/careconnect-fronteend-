import type { IDataAdapter, CallListener, BookingListener, StatsListener } from './adapterInterface';
import type { Call, Nurse, Booking, DashboardStats, ExtractedFields } from './types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockAdapter } from './mockAdapter';

export class SupabaseDataAdapter implements IDataAdapter {
  async getCalls(): Promise<Call[]> {
    if (!isSupabaseConfigured || !supabase) {
      return mockAdapter.getCalls();
    }
    try {
      const { data, error } = await supabase
        .from('call_logs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data) throw error;
      return data as unknown as Call[];
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Supabase getCalls error, falling back to mock:', err);
      return mockAdapter.getCalls();
    }
  }

  async getNurses(): Promise<Nurse[]> {
    if (!isSupabaseConfigured || !supabase) {
      return mockAdapter.getNurses();
    }
    try {
      const { data, error } = await supabase
        .from('nurses')
        .select('*')
        .order('name');
      if (error || !data) throw error;
      return data as unknown as Nurse[];
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Supabase getNurses error, falling back to mock:', err);
      return mockAdapter.getNurses();
    }
  }

  async getBookings(): Promise<Booking[]> {
    if (!isSupabaseConfigured || !supabase) {
      return mockAdapter.getBookings();
    }
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data) throw error;
      return data as unknown as Booking[];
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Supabase getBookings error, falling back to mock:', err);
      return mockAdapter.getBookings();
    }
  }

  async getStats(): Promise<DashboardStats> {
    return mockAdapter.getStats();
  }

  subscribeToCalls(listener: CallListener): () => void {
    if (!isSupabaseConfigured || !supabase) {
      return mockAdapter.subscribeToCalls(listener);
    }

    // Subscribe to Postgres changes on call_logs
    const channel = supabase
      .channel('realtime_call_logs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'call_logs' }, async () => {
        const calls = await this.getCalls();
        listener(calls);
      })
      .subscribe();

    this.getCalls().then(listener);

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }

  subscribeToBookings(listener: BookingListener): () => void {
    if (!isSupabaseConfigured || !supabase) {
      return mockAdapter.subscribeToBookings(listener);
    }

    const channel = supabase
      .channel('realtime_bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, async () => {
        const bookings = await this.getBookings();
        listener(bookings);
      })
      .subscribe();

    this.getBookings().then(listener);

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }

  subscribeToStats(listener: StatsListener): () => void {
    return mockAdapter.subscribeToStats(listener);
  }

  async confirmDispatch(callId: string, nurseId: string): Promise<{ call: Call; booking: Booking }> {
    if (!isSupabaseConfigured || !supabase) {
      return mockAdapter.confirmDispatch(callId, nurseId);
    }
    try {
      // Direct update in Supabase
      const { error: callErr } = await supabase
        .from('call_logs')
        .update({ status: 'dispatched', pipeline_stage: 'sms_dashboard' })
        .eq('id', callId);
      if (callErr) throw callErr;

      return mockAdapter.confirmDispatch(callId, nurseId);
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Supabase confirmDispatch error, using mock:', err);
      return mockAdapter.confirmDispatch(callId, nurseId);
    }
  }

  async reassignNurse(bookingId: string, newNurseId: string): Promise<Booking> {
    if (!isSupabaseConfigured || !supabase) {
      return mockAdapter.reassignNurse(bookingId, newNurseId);
    }
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ nurse_id: newNurseId, status: 'reassigned' })
        .eq('id', bookingId);
      if (error) throw error;
      return mockAdapter.reassignNurse(bookingId, newNurseId);
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Supabase reassignNurse error, using mock:', err);
      return mockAdapter.reassignNurse(bookingId, newNurseId);
    }
  }

  async escalateCall(callId: string, reason: string): Promise<Call> {
    if (!isSupabaseConfigured || !supabase) {
      return mockAdapter.escalateCall(callId, reason);
    }
    try {
      await supabase
        .from('call_logs')
        .update({ status: 'escalated_112', triage: 'critical', escalation_notes: reason })
        .eq('id', callId);
      return mockAdapter.escalateCall(callId, reason);
    } catch {
      return mockAdapter.escalateCall(callId, reason);
    }
  }

  async toggleNurseAvailability(nurseId: string, available: boolean): Promise<Nurse> {
    if (!isSupabaseConfigured || !supabase) {
      return mockAdapter.toggleNurseAvailability(nurseId, available);
    }
    try {
      await supabase.from('nurses').update({ available }).eq('id', nurseId);
      return mockAdapter.toggleNurseAvailability(nurseId, available);
    } catch {
      return mockAdapter.toggleNurseAvailability(nurseId, available);
    }
  }

  async submitFallbackIntake(
    fields: ExtractedFields,
    callerPhone: string,
    callerName?: string
  ): Promise<{ call: Call; booking: Booking }> {
    return mockAdapter.submitFallbackIntake(fields, callerPhone, callerName);
  }

  startDemoReplay(type: 'standard' | 'critical'): void {
    mockAdapter.startDemoReplay(type);
  }

  stopDemoReplay(): void {
    mockAdapter.stopDemoReplay();
  }
}

export const supabaseAdapter = new SupabaseDataAdapter();
