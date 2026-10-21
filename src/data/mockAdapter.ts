import type { IDataAdapter, CallListener, BookingListener, StatsListener } from './adapterInterface';
import type { Call, Nurse, Booking, DashboardStats, ExtractedFields } from './types';
import { SEED_NURSES, SEED_BOOKINGS, INITIAL_CALLS, INITIAL_STATS } from './seedData';

class MockDataAdapter implements IDataAdapter {
  private calls: Call[] = [...INITIAL_CALLS];
  private nurses: Nurse[] = [...SEED_NURSES];
  private bookings: Booking[] = [...SEED_BOOKINGS];
  private stats: DashboardStats = { ...INITIAL_STATS };

  private callListeners: Set<CallListener> = new Set();
  private bookingListeners: Set<BookingListener> = new Set();
  private statsListeners: Set<StatsListener> = new Set();

  private liveTimer: ReturnType<typeof setInterval> | null = null;
  private demoTimers: Array<ReturnType<typeof setTimeout>> = [];
  private isDemoRunning = false;

  constructor() {
    this.startLiveSimulation();
  }

  private notifyCalls() {
    const copy = [...this.calls];
    this.callListeners.forEach((l) => l(copy));
  }

  private notifyBookings() {
    const copy = [...this.bookings];
    this.bookingListeners.forEach((l) => l(copy));
  }

  private notifyStats() {
    const copy = { ...this.stats };
    this.statsListeners.forEach((l) => l(copy));
  }

  private startLiveSimulation() {
    // Generate realistic incoming live calls every 25 to 35 seconds
    this.liveTimer = setInterval(() => {
      if (this.isDemoRunning) return;
      this.simulateIncomingCall();
    }, 28000);
  }

  private simulateIncomingCall() {
    const randomNurses = this.nurses.filter((n) => n.available);
    const primary = randomNurses[Math.floor(Math.random() * randomNurses.length)] || this.nurses[0];
    const newId = `call-live-${Date.now().toString().slice(-4)}`;
    
    const sampleCalls: Array<{
      phone: string;
      caller: string;
      condition: string;
      careType: string;
      urgency: 'routine' | 'urgent';
      shift: string;
      area: string;
      hindiQuery: string;
    }> = [
      {
        phone: '+91 98114 ' + Math.floor(10000 + Math.random() * 90000),
        caller: 'Sunil Mathur',
        condition: 'Post-op knee arthroscopy, cold pack & knee mobilization',
        careType: 'Home Nursing / Ortho Rehab',
        urgency: 'routine',
        shift: '8 Hours (Day)',
        area: 'Sector 45, Gurgaon',
        hindiQuery: 'नमस्ते, पिताजी का नी रिप्लेसमेंट हुआ है, फिजियो और ड्रेसिंग सपोर्ट के लिए नर्स चाहिए।',
      },
      {
        phone: '+91 98290 ' + Math.floor(10000 + Math.random() * 90000),
        caller: 'Meenakshi Joshi',
        condition: 'Bedridden stroke care, Ryle tube enteral feeding',
        careType: 'Elderly Bedside Care',
        urgency: 'urgent',
        shift: '12 Hours (Night)',
        area: 'C-Scheme, Jaipur',
        hindiQuery: 'राइस ट्यूब से फीडिंग और वाइटल्स चेक के लिए तुरंत अनुभवी सिस्टर की जरूरत है।',
      },
      {
        phone: '+91 94150 ' + Math.floor(10000 + Math.random() * 90000),
        caller: 'Pradeep Rastogi',
        condition: 'Diabetic ulcer daily cleaning and sterile dressing',
        careType: 'Wound Care',
        urgency: 'urgent',
        shift: 'Single Procedure (2h)',
        area: 'Aliganj, Lucknow',
        hindiQuery: 'डायबिटिक पैर के घाव की ड्रेसिंग करवानी है, आज दोपहर तक कोई आ सकता है क्या?',
      }
    ];

    const pick = sampleCalls[Math.floor(Math.random() * sampleCalls.length)];

    const newCall: Call = {
      id: newId,
      callerPhone: pick.phone,
      callerName: pick.caller,
      startTime: new Date().toISOString(),
      durationSeconds: 15,
      language: 'hinglish',
      triage: pick.urgency,
      status: 'in_call',
      pipelineStage: 'voice_agent',
      transcript: [
        { id: `t_${Date.now()}_1`, speaker: 'agent', text: 'नमस्ते, केयरकनेक्ट में आपका स्वागत है। मरीज की स्थिति बताइए।', timestamp: '00:03' },
        { id: `t_${Date.now()}_2`, speaker: 'caller', text: pick.hindiQuery, timestamp: '00:12' },
      ],
      extractedFields: {
        condition: pick.condition,
        careType: pick.careType,
        urgency: pick.urgency,
        shiftLength: pick.shift,
        location: pick.area,
      },
      matchedNurse: {
        nurse: primary,
        score: { overall: 93, skill: 95, distance: 91, availability: 94 },
        distanceKm: 3.2,
        estimatedArrivalMinutes: 22,
      },
      smsStatus: 'queued',
      patientCoordinates: [primary.coordinates[0] + 0.015, primary.coordinates[1] + 0.012],
    };

    this.calls.unshift(newCall);
    this.stats.callsToday += 1;
    this.notifyCalls();
    this.notifyStats();

    // Advance this new call to api_matching after 10 seconds
    setTimeout(() => {
      const idx = this.calls.findIndex((c) => c.id === newId);
      if (idx !== -1 && this.calls[idx].status === 'in_call') {
        this.calls[idx].pipelineStage = 'api_matching';
        this.calls[idx].durationSeconds = 28;
        this.notifyCalls();
      }
    }, 10000);
  }

  async getCalls(): Promise<Call[]> {
    return [...this.calls];
  }

  async getNurses(): Promise<Nurse[]> {
    return [...this.nurses];
  }

  async getBookings(): Promise<Booking[]> {
    return [...this.bookings];
  }

  async getStats(): Promise<DashboardStats> {
    return { ...this.stats };
  }

  subscribeToCalls(listener: CallListener): () => void {
    this.callListeners.add(listener);
    listener([...this.calls]);
    return () => this.callListeners.delete(listener);
  }

  subscribeToBookings(listener: BookingListener): () => void {
    this.bookingListeners.add(listener);
    listener([...this.bookings]);
    return () => this.bookingListeners.delete(listener);
  }

  subscribeToStats(listener: StatsListener): () => void {
    this.statsListeners.add(listener);
    listener({ ...this.stats });
    return () => this.statsListeners.delete(listener);
  }

  async confirmDispatch(callId: string, nurseId: string): Promise<{ call: Call; booking: Booking }> {
    const callIndex = this.calls.findIndex((c) => c.id === callId);
    if (callIndex === -1) throw new Error('Call not found');

    const nurse = this.nurses.find((n) => n.id === nurseId) || this.nurses[0];
    const call = this.calls[callIndex];
    const dispatchTime = Math.min(Math.max(call.durationSeconds + 6, 34), 58);

    const updatedCall: Call = {
      ...call,
      status: 'dispatched',
      pipelineStage: 'sms_dashboard',
      callToDispatchSeconds: dispatchTime,
      smsStatus: 'sent',
      smsTimestamp: new Date().toISOString(),
      endTime: new Date().toISOString(),
    };

    const newBooking: Booking = {
      id: `BK-${Math.floor(8920 + Math.random() * 900)}`,
      callId: call.id,
      callerPhone: call.callerPhone,
      patientName: call.callerName || 'Patient',
      nurseId: nurse.id,
      nurseName: nurse.name,
      condition: call.extractedFields.condition || 'General bedside nursing care',
      careType: call.extractedFields.careType || 'Home Nursing',
      urgency: call.triage,
      shiftLength: call.extractedFields.shiftLength || '8 Hours',
      location: call.extractedFields.location || 'Local Patient Area',
      status: 'dispatched',
      smsStatus: 'sent',
      smsTimestamp: new Date().toISOString(),
      dispatchDurationSeconds: dispatchTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: 'Dispatched via operator confirmation.',
    };

    updatedCall.bookingId = newBooking.id;
    this.calls[callIndex] = updatedCall;
    this.bookings.unshift(newBooking);

    // Update stats
    this.stats.dispatchedCount += 1;
    this.stats.recentDispatchTimes.push({
      callIndex: this.stats.recentDispatchTimes.length + 1,
      callId: newBooking.id,
      seconds: dispatchTime,
      target: 60,
    });
    if (this.stats.recentDispatchTimes.length > 20) {
      this.stats.recentDispatchTimes.shift();
    }
    const sum = this.stats.recentDispatchTimes.reduce((acc, curr) => acc + curr.seconds, 0);
    this.stats.avgDispatchSeconds = Number((sum / this.stats.recentDispatchTimes.length).toFixed(1));

    this.notifyCalls();
    this.notifyBookings();
    this.notifyStats();

    return { call: updatedCall, booking: newBooking };
  }

  async reassignNurse(bookingId: string, newNurseId: string): Promise<Booking> {
    const bookingIndex = this.bookings.findIndex((b) => b.id === bookingId);
    if (bookingIndex === -1) throw new Error('Booking not found');

    const newNurse = this.nurses.find((n) => n.id === newNurseId);
    if (!newNurse) throw new Error('Target nurse not found');

    const oldBooking = this.bookings[bookingIndex];
    const updatedBooking: Booking = {
      ...oldBooking,
      nurseId: newNurse.id,
      nurseName: newNurse.name,
      status: 'reassigned',
      updatedAt: new Date().toISOString(),
      notes: `Reassigned to ${newNurse.name} by operator at ${new Date().toLocaleTimeString()}.`,
    };

    this.bookings[bookingIndex] = updatedBooking;
    this.notifyBookings();
    return updatedBooking;
  }

  async escalateCall(callId: string, reason: string): Promise<Call> {
    const callIndex = this.calls.findIndex((c) => c.id === callId);
    if (callIndex === -1) throw new Error('Call not found');

    const call = this.calls[callIndex];
    const updatedCall: Call = {
      ...call,
      status: 'escalated_112',
      triage: 'critical',
      pipelineStage: 'voice_agent',
      escalationNotes: reason || 'Operator manual transfer to Emergency Medical Services 112/108.',
    };

    this.calls[callIndex] = updatedCall;
    this.stats.escalatedCount += 1;

    this.notifyCalls();
    this.notifyStats();
    return updatedCall;
  }

  async toggleNurseAvailability(nurseId: string, available: boolean): Promise<Nurse> {
    const idx = this.nurses.findIndex((n) => n.id === nurseId);
    if (idx === -1) throw new Error('Nurse not found');

    this.nurses[idx] = { ...this.nurses[idx], available };
    return this.nurses[idx];
  }

  async submitFallbackIntake(
    fields: ExtractedFields,
    callerPhone: string,
    callerName?: string
  ): Promise<{ call: Call; booking: Booking }> {
    const callId = `call-fallback-${Date.now().toString().slice(-4)}`;
    const nurse = this.nurses.find((n) => n.available) || this.nurses[0];

    const newCall: Call = {
      id: callId,
      callerPhone,
      callerName: callerName || 'Intake Caller',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: 44,
      callToDispatchSeconds: 44,
      language: 'hinglish',
      triage: fields.urgency,
      status: 'dispatched',
      pipelineStage: 'sms_dashboard',
      transcript: [
        { id: 'fb1', speaker: 'system', text: '[Text Fallback Intake Completed by Operator Desk]', timestamp: '00:01' },
        { id: 'fb2', speaker: 'caller', text: `Condition: ${fields.condition} | Area: ${fields.location} | Shift: ${fields.shiftLength}`, timestamp: '00:05' },
      ],
      extractedFields: fields,
      matchedNurse: {
        nurse,
        score: { overall: 95, skill: 96, distance: 93, availability: 97 },
        distanceKm: 2.8,
        estimatedArrivalMinutes: 20,
      },
      smsStatus: 'sent',
      smsTimestamp: new Date().toISOString(),
      patientCoordinates: [nurse.coordinates[0] + 0.01, nurse.coordinates[1] + 0.01],
    };

    const newBooking: Booking = {
      id: `BK-${Math.floor(9000 + Math.random() * 900)}`,
      callId: newCall.id,
      callerPhone,
      patientName: callerName || 'Fallback Patient',
      nurseId: nurse.id,
      nurseName: nurse.name,
      condition: fields.condition,
      careType: fields.careType,
      urgency: fields.urgency,
      shiftLength: fields.shiftLength,
      location: fields.location,
      status: 'dispatched',
      smsStatus: 'sent',
      smsTimestamp: new Date().toISOString(),
      dispatchDurationSeconds: 44,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: 'Generated via operator text fallback intake form.',
    };

    newCall.bookingId = newBooking.id;
    this.calls.unshift(newCall);
    this.bookings.unshift(newBooking);
    this.stats.callsToday += 1;
    this.stats.dispatchedCount += 1;
    this.stats.recentDispatchTimes.push({
      callIndex: this.stats.recentDispatchTimes.length + 1,
      callId: newBooking.id,
      seconds: 44,
      target: 60,
    });
    if (this.stats.recentDispatchTimes.length > 20) this.stats.recentDispatchTimes.shift();

    this.notifyCalls();
    this.notifyBookings();
    this.notifyStats();

    return { call: newCall, booking: newBooking };
  }

  startDemoReplay(type: 'standard' | 'critical'): void {
    this.stopDemoReplay();
    this.isDemoRunning = true;

    if (type === 'standard') {
      this.runStandardDemo();
    } else {
      this.runCriticalDemo();
    }
  }

  stopDemoReplay(): void {
    this.isDemoRunning = false;
    this.demoTimers.forEach((t) => clearTimeout(t));
    this.demoTimers = [];
  }

  private runStandardDemo() {
    const callId = `call-demo-std-${Date.now().toString().slice(-4)}`;
    const nurse = SEED_NURSES[0]; // Sunita Sharma

    const demoCall: Call = {
      id: callId,
      callerPhone: '+91 98118 44299',
      callerName: 'Rohit Verma (Son)',
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      language: 'hinglish',
      triage: 'urgent',
      status: 'in_call',
      pipelineStage: 'caller',
      transcript: [],
      extractedFields: {},
      smsStatus: 'queued',
      patientCoordinates: [28.4350, 77.1050],
    };

    this.calls.unshift(demoCall);
    this.notifyCalls();

    const t = (ms: number, fn: () => void) => {
      const timer = setTimeout(fn, ms);
      this.demoTimers.push(timer);
    };

    // Stage 1: Call connects to telephony
    t(2000, () => {
      demoCall.pipelineStage = 'telephony';
      demoCall.durationSeconds = 4;
      this.notifyCalls();
    });

    // Stage 2: Voice agent greeting
    t(4000, () => {
      demoCall.pipelineStage = 'voice_agent';
      demoCall.durationSeconds = 8;
      demoCall.transcript.push({
        id: 'd1',
        speaker: 'agent',
        text: 'नमस्ते, केयरकनेक्ट। कृपया बताएं मरीज की स्थिति क्या है और किस प्रकार की सहायता चाहिए?',
        timestamp: '00:04',
      });
      this.notifyCalls();
    });

    // Stage 3: Caller response in Hinglish
    t(8000, () => {
      demoCall.pipelineStage = 'voice_agent';
      demoCall.durationSeconds = 16;
      demoCall.transcript.push({
        id: 'd2',
        speaker: 'caller',
        text: 'नमस्ते। मेरी माताजी 72 वर्ष की हैं। कल मैक्स हॉस्पिटल से हिप रिप्लेसमेंट सर्जरी के बाद डिस्चार्ज हुई हैं। कैथेटर ड्रेनेज चेक और सर्जिकल ड्रेसिंग बदलनी है।',
        timestamp: '00:14',
      });
      this.notifyCalls();
    });

    // Stage 4: LLM extracts first details
    t(12000, () => {
      demoCall.pipelineStage = 'llm';
      demoCall.durationSeconds = 22;
      demoCall.extractedFields = {
        condition: 'Post-op total hip arthroplasty, catheter care & sterile dressing',
        careType: 'Home Nursing / Post-Op Care',
        urgency: 'urgent',
        patientAge: 72,
        patientGender: 'Female',
      };
      demoCall.transcript.push({
        id: 'd3',
        speaker: 'agent',
        text: 'जी बिल्कुल। क्या आप अपना पता और आवश्यक शिफ्ट का समय बता सकते हैं?',
        timestamp: '00:20',
      });
      this.notifyCalls();
    });

    // Stage 5: Caller provides location and shift
    t(16000, () => {
      demoCall.pipelineStage = 'llm';
      demoCall.durationSeconds = 30;
      demoCall.transcript.push({
        id: 'd4',
        speaker: 'caller',
        text: 'हम गुरुग्राम सेक्टर 56 में हैं। आज दिन के लिए 12 घंटे की शिफ्ट चाहिए।',
        timestamp: '00:28',
      });
      demoCall.extractedFields = {
        ...demoCall.extractedFields,
        shiftLength: '12 Hours (Day)',
        location: 'Sector 56, Gurgaon',
      };
      this.notifyCalls();
    });

    // Stage 6: API Matching & Nurse scoring
    t(20000, () => {
      demoCall.pipelineStage = 'api_matching';
      demoCall.durationSeconds = 38;
      demoCall.matchedNurse = {
        nurse,
        score: { overall: 97, skill: 98, distance: 96, availability: 98 },
        distanceKm: 2.1,
        estimatedArrivalMinutes: 16,
      };
      demoCall.alternativeNurses = [
        {
          nurse: SEED_NURSES[8],
          score: { overall: 88, skill: 89, distance: 84, availability: 91 },
          distanceKm: 8.6,
          estimatedArrivalMinutes: 32,
        },
        {
          nurse: SEED_NURSES[7],
          score: { overall: 81, skill: 85, distance: 75, availability: 82 },
          distanceKm: 14.1,
          estimatedArrivalMinutes: 45,
        }
      ];
      demoCall.transcript.push({
        id: 'd5',
        speaker: 'agent',
        text: 'सत्यापित नर्स सुनीता शर्मा (सेक्टर 56) को आपके केस के लिए मैच कर दिया गया है। डिस्पैच पुष्टि आपके एसएमएस पर भेजी जा रही है।',
        timestamp: '00:36',
      });
      this.notifyCalls();
    });

    // Stage 7: Database & SMS confirmation (under 60s SLA target!)
    t(24000, () => {
      demoCall.pipelineStage = 'database';
      demoCall.durationSeconds = 44;
      this.notifyCalls();
    });

    t(27000, () => {
      this.confirmDispatch(demoCall.id, nurse.id);
      this.isDemoRunning = false;
    });
  }

  private runCriticalDemo() {
    const callId = `call-demo-crit-${Date.now().toString().slice(-4)}`;

    const demoCall: Call = {
      id: callId,
      callerPhone: '+91 98110 55102',
      callerName: 'Rajeev Kapoor',
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      language: 'hindi',
      triage: 'critical',
      status: 'in_call',
      pipelineStage: 'caller',
      transcript: [],
      extractedFields: {},
      smsStatus: 'queued',
      patientCoordinates: [28.6320, 77.2980],
    };

    this.calls.unshift(demoCall);
    this.notifyCalls();

    const t = (ms: number, fn: () => void) => {
      const timer = setTimeout(fn, ms);
      this.demoTimers.push(timer);
    };

    t(1500, () => {
      demoCall.pipelineStage = 'telephony';
      demoCall.durationSeconds = 3;
      this.notifyCalls();
    });

    t(3500, () => {
      demoCall.pipelineStage = 'voice_agent';
      demoCall.durationSeconds = 7;
      demoCall.transcript.push({
        id: 'dc1',
        speaker: 'agent',
        text: 'नमस्ते, केयरकनेक्ट। कृपया मरीज की वर्तमान स्थिति बताएं।',
        timestamp: '00:03',
      });
      this.notifyCalls();
    });

    t(7000, () => {
      demoCall.pipelineStage = 'voice_agent';
      demoCall.durationSeconds = 15;
      demoCall.transcript.push({
        id: 'dc2',
        speaker: 'caller',
        text: 'अरे जल्दी सुनिए! पिताजी को सीने में बहुत तेज दर्द हो रहा है, बायां हाथ सुन्न हो गया है और बहुत पसीना आ रहा है! बोल नहीं पा रहे!',
        timestamp: '00:12',
      });
      this.notifyCalls();
    });

    t(10000, () => {
      demoCall.pipelineStage = 'llm';
      demoCall.durationSeconds = 20;
      demoCall.triage = 'critical';
      demoCall.extractedFields = {
        condition: 'ACUTE MYOCARDIAL INFARCTION SUSPECTED (Chest pain radiating to left arm, cold sweat)',
        careType: 'EMERGENCY REDIRECTION - 112 / 108',
        urgency: 'critical',
        shiftLength: 'N/A - Immediate Hospitalization',
        location: 'Preet Vihar, East Delhi',
        patientAge: 66,
        patientGender: 'Male',
      };
      demoCall.transcript.push({
        id: 'dc3',
        speaker: 'agent',
        text: 'यह एक गंभीर आपातकालीन स्थिति है। हम कॉल को तुरंत 112/108 एम्बुलेंस कंट्रोल रूम को ट्रांसफर कर रहे हैं। होम नर्स के लिए इंतजार न करें।',
        timestamp: '00:18',
      });
      this.notifyCalls();
    });

    t(13000, () => {
      this.escalateCall(
        demoCall.id,
        'CRITICAL TRIAGE: STEMI symptoms detected in Hindi audio. Automated transfer to 112 Emergency Dispatch Desk initiated at 00:22.'
      );
      this.isDemoRunning = false;
    });
  }
}

export const mockAdapter = new MockDataAdapter();
