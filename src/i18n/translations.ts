export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Header & Brand
    brandName: 'CareConnect',
    operatorDesk: 'Operator Coordination Desk',
    role: 'Role',
    operator: 'Operator',
    viewer: 'Viewer',
    logout: 'Log out',
    demoMode: 'Demo mode',
    demoRunning: 'Demo active',

    // Navigation
    navDashboard: 'Dashboard',
    navBookings: 'Bookings',
    navNurses: 'Nurses',
    navFallback: 'Text Intake',
    navSettings: 'Settings',

    // Stats bar
    statsCallsToday: 'Calls today',
    statsAvgDispatch: 'Avg dispatch time',
    statsDispatched: 'Dispatched',
    statsEscalated: '112 Escalations',
    statsTrendTitle: 'Call-to-dispatch time (Last 20 calls)',
    statsTarget: '60s target',
    collapseChart: 'Hide chart',
    expandChart: 'View dispatch trend',

    // Column 1: Live calls
    liveCallsTitle: 'Incoming & Active Calls',
    filterAll: 'All',
    filterActive: 'Active',
    filterCritical: 'Critical',
    targetAchieved: '< 60s target',
    noActiveCalls: 'No calls currently in queue',
    languageDetected: 'Language',

    // Statuses
    statusInCall: 'In call',
    statusMatching: 'Matching',
    statusDispatched: 'Dispatched',
    statusEscalated: 'Escalated to 112',
    statusCompleted: 'Completed',
    statusInTransit: 'In transit',
    statusCancelled: 'Cancelled',
    statusReassigned: 'Reassigned',

    // Triage
    triageCritical: 'Critical',
    triageUrgent: 'Urgent',
    triageRoutine: 'Routine',

    // Column 2: Call detail
    callDetailTitle: 'Call Detail & Live Dispatch',
    selectCallPrompt: 'Select a call from the queue to view real-time details.',
    transcriptTitle: 'Live Transcript',
    capturedDetailsTitle: 'Captured Details',
    notYetAsked: 'Not yet asked',
    condition: 'Condition',
    careType: 'Care type',
    urgency: 'Urgency',
    shiftLength: 'Shift length',
    location: 'Location',
    callerPhone: 'Caller phone',
    patientAgeGender: 'Patient',

    // Triage alert banner
    criticalAlertTitle: 'CRITICAL TRIAGE: Emergency Service Transfer Notice',
    criticalAlertMessage: 'This call has been identified as a life-threatening medical emergency. Routine caregiver dispatch is suspended. Emergency services (112 / 108) have been notified.',

    // Matched nurse card
    matchedNurseTitle: 'Matched Nurse',
    verifiedNurse: 'Verified',
    matchScore: 'Match Score',
    skillScore: 'Skill match',
    distanceScore: 'Distance',
    availabilityScore: 'Availability',
    distanceKm: 'km away',
    etaMinutes: 'min ETA',
    alternativeCandidates: 'Next-best candidates',
    noNurseMatchedYet: 'Nurse scoring in progress...',

    // SMS & Actions
    smsStatusTitle: 'SMS Confirmation Status',
    smsQueued: 'Queued',
    smsSent: 'Sent',
    smsFailed: 'Failed',
    actionConfirmDispatch: 'Confirm dispatch',
    actionReassignNurse: 'Reassign nurse',
    actionEscalate: 'Escalate to 112',
    readOnlyNotice: 'Viewer account is in read-only mode.',

    // Column 3: Tool Architecture
    pipelineTitle: 'Tool Architecture & Runtime',
    pipelineSubtitle: 'End-to-end execution pipeline per active call',
    dataFlowTitle: 'Data flow',
    dataFlowStep: 'Audio → text → JSON (5 fields) → match → booking → SMS',
    pipelineStageCaller: 'Caller',
    pipelineStageTelephony: 'Telephony (+91 SIP)',
    pipelineStageVoiceAgent: 'Voice Agent (STT/TTS)',
    pipelineStageLLM: 'LLM (Triage & Extraction)',
    pipelineStageAPI: 'API Layer (Rules & Scoring)',
    pipelineStageDatabase: 'Database (Postgres/Supabase)',
    pipelineStageSMS: 'SMS Gateway & Operator UI',
    nodeDetailsTitle: 'Inspection Panel',
    nodeReceives: 'Input payload',
    nodeOutputs: 'Output payload',
    avgLatency: 'Average latency',

    // Bookings Page
    bookingsTitle: 'Dispatched Bookings & Care Log',
    searchBookings: 'Search by patient, phone or location...',
    allStatuses: 'All statuses',
    allUrgencies: 'All urgencies',
    bookingId: 'Booking ID',
    patient: 'Patient',
    nurseAssigned: 'Nurse Assigned',
    duration: 'Dispatch Time',
    drawerTitle: 'Booking Details',

    // Nurses Page
    nursesTitle: 'Verified Nurses & Caregivers',
    searchNurses: 'Search nurses by name, city or skill...',
    availableOnly: 'Available only',
    availability: 'Availability',
    available: 'Available',
    onDuty: 'On Duty / Unavailable',
    yearsExp: 'yrs experience',

    // Text Fallback Page
    fallbackTitle: 'Text Fallback Intake',
    fallbackSubtitle: 'Manual operator intake form when voice connection is unavailable. Dispatches verified caregivers through the identical pipeline.',
    patientNameField: 'Patient / Caller Name',
    phoneField: 'Caller Phone (E.164)',
    conditionField: 'Medical Condition & Symptoms',
    careTypeField: 'Care Type Needed',
    urgencyField: 'Urgency Assessment',
    shiftLengthField: 'Required Shift Length',
    locationField: 'Full Street Address & City',
    submitFallbackBtn: 'Submit & Score Nurses',
    fallbackSuccess: 'Booking created and nurse dispatched successfully.',

    // Settings Page
    settingsTitle: 'Settings & Runtime Diagnostics',
    languageSetting: 'Display Language',
    currentAdapter: 'Data Adapter Mode',
    switchRole: 'Simulate Operator vs Viewer Role',
    demoReplayTitle: 'Demonstration Replays',
    runStandardDemo: 'Run standard call demo (Hip Replacement)',
    runCriticalDemo: 'Run critical emergency demo (112 Escalation)',
    stopDemo: 'Stop current demo',
  },
  hi: {
    // Header & Brand
    brandName: 'CareConnect',
    operatorDesk: 'ऑपरेटर समन्वय डेस्क',
    role: 'भूमिका',
    operator: 'ऑपरेटर',
    viewer: 'दर्शक (केवल देखने योग्य)',
    logout: 'लॉग आउट',
    demoMode: 'डेमो मोड',
    demoRunning: 'डेमो सक्रिय',

    // Navigation
    navDashboard: 'डैशबोर्ड',
    navBookings: 'बुकिंग्स',
    navNurses: 'नर्स सूची',
    navFallback: 'टेक्स्ट इनटेक',
    navSettings: 'सेटिंग्स',

    // Stats bar
    statsCallsToday: 'आज की कॉल्स',
    statsAvgDispatch: 'औसत डिस्पैच समय',
    statsDispatched: 'डिस्पैच पूर्ण',
    statsEscalated: '112 आपातकालीन रेफर',
    statsTrendTitle: 'डिस्पैच समय रुझान (पिछली 20 कॉल्स)',
    statsTarget: '60 सेकंड लक्ष्य',
    collapseChart: 'चार्ट छुपाएं',
    expandChart: 'रुझान देखें',

    // Column 1: Live calls
    liveCallsTitle: 'सक्रिय एवं आगामी कॉल्स',
    filterAll: 'सभी',
    filterActive: 'सक्रिय',
    filterCritical: 'गंभीर',
    targetAchieved: '< 60s लक्ष्य पूरा',
    noActiveCalls: 'कतार में कोई कॉल नहीं है',
    languageDetected: 'भाषा',

    // Statuses
    statusInCall: 'कॉल जारी',
    statusMatching: 'मैचिंग जारी',
    statusDispatched: 'डिस्पैच पूरा',
    statusEscalated: '112 को भेजा गया',
    statusCompleted: 'संपन्न',
    statusInTransit: 'रास्ते में',
    statusCancelled: 'रद्द',
    statusReassigned: 'पुनः आवंटित',

    // Triage
    triageCritical: 'गंभीर (क्रिटिकल)',
    triageUrgent: 'तत्काल (अर्जेंट)',
    triageRoutine: 'सामान्य (रूटीन)',

    // Column 2: Call detail
    callDetailTitle: 'कॉल विवरण एवं लाइव डिस्पैच',
    selectCallPrompt: 'लाइव विवरण देखने के लिए कतार से कॉल चुनें।',
    transcriptTitle: 'लाइव बातचीत (ट्रांसक्रिप्ट)',
    capturedDetailsTitle: 'दर्ज विवरण (5 मुख्य बिंदु)',
    notYetAsked: 'अभी नहीं पूछा गया',
    condition: 'मरीज की स्थिति',
    careType: 'देखभाल का प्रकार',
    urgency: 'प्राथमिकता',
    shiftLength: 'शिफ्ट की अवधि',
    location: 'स्थान व पता',
    callerPhone: 'कॉलर नंबर',
    patientAgeGender: 'मरीज विवरण',

    // Triage alert banner
    criticalAlertTitle: 'गंभीर चेतावनी: आपातकालीन सेवा सूचना',
    criticalAlertMessage: 'यह कॉल जानलेवा आपात स्थिति के रूप में चिन्हित की गई है। सामान्य नर्स डिस्पैच स्थगित है। आपातकालीन सेवा (112 / 108) को सूचित कर दिया गया है।',

    // Matched nurse card
    matchedNurseTitle: 'मैच की गई नर्स',
    verifiedNurse: 'सत्यापित',
    matchScore: 'मैच स्कोर',
    skillScore: 'कौशल मैच',
    distanceScore: 'दूरी',
    availabilityScore: 'उपलब्धता',
    distanceKm: 'किमी दूर',
    etaMinutes: 'मिनट में पहुंच',
    alternativeCandidates: 'अन्य विकल्प',
    noNurseMatchedYet: 'नर्स स्कोरिंग जारी है...',

    // SMS & Actions
    smsStatusTitle: 'एसएमएस पुष्टि स्थिति',
    smsQueued: 'कतार में',
    smsSent: 'भेजा गया',
    smsFailed: 'विफल',
    actionConfirmDispatch: 'डिस्पैच पुष्टि करें',
    actionReassignNurse: 'अन्य नर्स चुनें',
    actionEscalate: '112 पर भेजें',
    readOnlyNotice: 'दर्शक खाता केवल पढ़ने के लिए है।',

    // Column 3: Tool Architecture
    pipelineTitle: 'टूल आर्किटेक्चर एवं निष्पादन पाइपलाइन',
    pipelineSubtitle: 'कॉल अनुसार चरणबद्ध पाइपलाइन प्रगति',
    dataFlowTitle: 'डेटा प्रवाह',
    dataFlowStep: 'ऑडियो → टेक्स्ट → JSON (5 बिंदु) → मैच → बुकिंग → SMS',
    pipelineStageCaller: 'कॉलर',
    pipelineStageTelephony: 'टेलीफोनी (+91 SIP)',
    pipelineStageVoiceAgent: 'वॉयस एजेंट (STT/TTS)',
    pipelineStageLLM: 'एलएलएम (ट्राइएज व निष्कर्षण)',
    pipelineStageAPI: 'एपीआई लेयर (नियम व मैचिंग)',
    pipelineStageDatabase: 'डेटाबेस (पोस्टग्रेस/सुपाबेस)',
    pipelineStageSMS: 'एसएमएस गेटवे व ऑपरेटर यूआई',
    nodeDetailsTitle: 'नोड विवरण',
    nodeReceives: 'इनपुट डेटा',
    nodeOutputs: 'आउटपुट डेटा',
    avgLatency: 'औसत विलंबता',

    // Bookings Page
    bookingsTitle: 'डिस्पैच बुकिंग्स एवं रिकॉर्ड',
    searchBookings: 'मरीज, फोन नंबर या स्थान से खोजें...',
    allStatuses: 'सभी स्थितियां',
    allUrgencies: 'सभी प्राथमिकताएं',
    bookingId: 'बुकिंग आईडी',
    patient: 'मरीज',
    nurseAssigned: 'आवंटित नर्स',
    duration: 'डिस्पैच समय',
    drawerTitle: 'बुकिंग विवरण',

    // Nurses Page
    nursesTitle: 'सत्यापित नर्स एवं देखभालकर्ता सूची',
    searchNurses: 'नाम, शहर या कौशल से खोजें...',
    availableOnly: 'केवल उपलब्ध',
    availability: 'उपलब्धता',
    available: 'उपलब्ध',
    onDuty: 'ड्यूटी पर / व्यस्त',
    yearsExp: 'वर्ष अनुभव',

    // Text Fallback Page
    fallbackTitle: 'टेक्स्ट फॉलबैक इनटेक',
    fallbackSubtitle: 'वॉयस कनेक्शन अनुपलब्ध होने पर ऑपरेटर द्वारा विवरण दर्ज करने हेतु फॉर्म। उसी पाइपलाइन द्वारा नर्स मैच होती है।',
    patientNameField: 'मरीज / कॉलर का नाम',
    phoneField: 'कॉलर फोन (E.164)',
    conditionField: 'चिकित्सा स्थिति व लक्षण',
    careTypeField: 'आवश्यक देखभाल प्रकार',
    urgencyField: 'प्राथमिकता मूल्यांकन',
    shiftLengthField: 'आवश्यक शिफ्ट अवधि',
    locationField: 'पूरा पता व शहर',
    submitFallbackBtn: 'सबमिट करें व नर्स खोजें',
    fallbackSuccess: 'बुकिंग बन गई और नर्स को डिस्पैच भेज दिया गया।',

    // Settings Page
    settingsTitle: 'सेटिंग्स एवं डायग्नोस्टिक्स',
    languageSetting: 'प्रदर्शन भाषा',
    currentAdapter: 'डेटा एडॉप्टर मोड',
    switchRole: 'ऑपरेटर बनाम दर्शक भूमिका चुनें',
    demoReplayTitle: 'डेमो रीप्ले',
    runStandardDemo: 'मानक कॉल डेमो चलाएं (हिप रिप्लेसमेंट)',
    runCriticalDemo: 'गंभीर आपातकाल डेमो चलाएं (112 एस्केलेशन)',
    stopDemo: 'डेमो बंद करें',
  },
};
