# CareConnect

CareConnect is a care coordination operator desk web application. It monitors and manages an automated AI voice pipeline that turns inbound patient and family phone calls (spoken in Hindi and Hinglish) into dispatched, verified home nurses and caregivers in under 60 seconds.

Callers interact exclusively via phone (+91 11 4084 4899); this application is used by coordinators at the care operations desk.

---

## Key Features

- **3-Column Real-Time Operator Dashboard**:
  - **Live Calls Queue**: Active call timers, masked caller phone numbers (`+91 98••• ••214`), triage priority tags, and `<60s` SLA markers.
  - **Call Detail & Dispatch Desk**: Live speaker-labelled transcript (Hindi/Hinglish), 5-field captured summary (Condition, Care Scope, Urgency, Shift Length, Location), Leaflet/OSM route map, SMS delivery status, and operator actions (Confirm dispatch, Reassign nurse, Escalate to 112).
  - **Tool Architecture Pipeline**: Interactive SVG execution flow (`Caller` → `Telephony` → `Voice Agent` → `LLM` → `API Engine` → `Database` → `SMS Gateway`) synced with call stages, inspectable payloads, and latency metrics. Responsive layout transitions to tabs on viewports below 1280px and mobile.
- **Dual Data Layer**:
  - Default `MockDataAdapter` running fully standalone with seeded Indian nurses, historical bookings, and automatic simulated incoming calls every 25–35 seconds.
  - Pluggable `SupabaseDataAdapter` with real-time PostgreSQL subscriptions.
- **Triage Safety Routing**:
  - Automated detection of acute emergencies (e.g. STEMI, severe trauma, anaphylaxis).
  - Immediate red triage flag and 112 / 108 emergency handoff banner.
- **Bilingual Interface (i18n)**:
  - English and Hindi interface toggle.
  - Authentic preservation of spoken Hindi/Hinglish transcripts.
- **Secondary Workflows**:
  - Searchable Bookings audit table with slide-over detail drawer.
  - Verified Nurses roster with geographic duty toggle.
  - Text Fallback Intake for audio degradation fallback.
  - Settings panel with presentation demo replays (Standard vs 112 Critical).

---

## Quick Start

### 1. Prerequisites
- Node.js 18+
- npm 9+

### 2. Installation
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

The app will run at `http://localhost:5173` using the built-in standalone mock adapter. No backend configuration or API keys are required.

### 4. Build & Lint
```bash
npm run build
npm run lint
```

---

## Directory Structure

```
src/
├── components/          # Reusable UI widgets
│   ├── Header.tsx       # Plain wordmark, role indicator, language toggle, demo trigger
│   ├── Navigation.tsx   # Semantic view navigation
│   ├── StatsOverview.tsx# Compact metrics row + collapsible Recharts dispatch chart
│   ├── LeafletMap.tsx   # Leaflet + OpenStreetMap route and marker visualization
│   ├── StatusBadge.tsx  # Strict triage (red/amber/green) and status tags
│   ├── SkeletonLoader.tsx # Loading skeletons
│   └── EmptyState.tsx   # Calm neutral empty states
├── features/
│   ├── auth/            # AuthContext, role state (operator vs viewer)
│   └── dashboard/       # 3-column operator dashboard components
│       ├── CallQueue.tsx            # Column 1: Live call queue & timers
│       ├── CallDetail.tsx           # Column 2: Transcript, 5 fields, map, actions
│       ├── TranscriptView.tsx       # Safe speaker-labelled plain text transcript
│       ├── NurseMatchCard.tsx       # Score breakdown & next-best candidates
│       └── ArchitecturePipeline.tsx # Column 3: Tool runtime pipeline diagram
├── pages/
│   ├── LandingPage.tsx  # Minimal public overview, visible hotline, 3-step workflow
│   ├── LoginPage.tsx    # Supabase email/password auth & demo presets
│   ├── DashboardPage.tsx# Operator desk main dashboard
│   ├── BookingsPage.tsx # Searchable bookings history & slide-over drawer
│   ├── NursesPage.tsx   # Verified nurses roster & availability
│   ├── FallbackPage.tsx # Text intake fallback form
│   └── SettingsPage.tsx # Diagnostics, language toggle, demo replays
├── data/
│   ├── types.ts         # TypeScript data models
│   ├── seedData.ts      # 18 verified nurses, 12 bookings, sample calls
│   ├── adapterInterface.ts # IDataAdapter contract
│   ├── mockAdapter.ts   # Browser event simulator & demo runner
│   ├── supabaseAdapter.ts # Supabase client and realtime channels
│   └── index.ts         # Singleton adapter exporter
├── i18n/
│   ├── translations.ts  # English & Hindi JSON dictionaries
│   └── LanguageContext.tsx # Language switching context
├── lib/
│   ├── supabase.ts      # Client-safe Supabase initialization
│   └── utils.ts         # E.164 validator, phone masking, duration formatters
├── App.tsx              # Router configuration & protected desk layout
└── main.tsx             # Application bootstrap
```

---

## Switching to Supabase Backend

To switch from the default mock adapter to a live Supabase project:

1. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Set the following environment variables:
   ```env
   VITE_DATA_ADAPTER=supabase
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-public-anon-key
   ```
3. Run the schema migrations below in the Supabase SQL Editor.
4. Restart the development server: `npm run dev`.

---

## Expected Supabase SQL Schema

Execute the following DDL in your Supabase project:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Nurses Table
create table if not exists public.nurses (
  id text primary key,
  name text not null,
  phone text not null,
  verified boolean default true,
  skills text[] not null default '{}',
  area text not null,
  city text not null,
  available boolean default true,
  experience_years integer not null default 1,
  rating numeric(3, 2) not null default 4.80,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Call Logs Table
create table if not exists public.call_logs (
  id text primary key,
  caller_phone text not null,
  caller_name text,
  start_time timestamp with time zone default timezone('utc'::text, now()) not null,
  end_time timestamp with time zone,
  duration_seconds integer default 0,
  call_to_dispatch_seconds integer,
  language text default 'hinglish',
  triage text not null check (triage in ('routine', 'urgent', 'critical')),
  status text not null check (status in ('in_call', 'matching', 'dispatched', 'escalated_112')),
  pipeline_stage text not null check (pipeline_stage in ('caller', 'telephony', 'voice_agent', 'llm', 'api_matching', 'database', 'sms_dashboard')),
  transcript jsonb default '[]'::jsonb,
  extracted_fields jsonb default '{}'::jsonb,
  matched_nurse_id text references public.nurses(id),
  patient_latitude double precision,
  patient_longitude double precision,
  sms_status text default 'queued' check (sms_status in ('queued', 'sent', 'failed')),
  sms_timestamp timestamp with time zone,
  escalation_notes text,
  booking_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Bookings Table
create table if not exists public.bookings (
  id text primary key,
  call_id text references public.call_logs(id),
  caller_phone text not null,
  patient_name text not null,
  nurse_id text not null references public.nurses(id),
  nurse_name text not null,
  condition text not null,
  care_type text not null,
  urgency text not null check (urgency in ('routine', 'urgent', 'critical')),
  shift_length text not null,
  location text not null,
  status text not null check (status in ('dispatched', 'in_transit', 'active', 'completed', 'cancelled', 'reassigned')),
  sms_status text default 'queued' check (sms_status in ('queued', 'sent', 'failed')),
  sms_timestamp timestamp with time zone,
  dispatch_duration_seconds integer not null default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.nurses enable row level security;
alter table public.call_logs enable row level security;
alter table public.bookings enable row level security;

-- Read policies for authenticated operators and viewers
create policy "Allow read access to authenticated desk users"
  on public.nurses for select using (auth.role() = 'authenticated');

create policy "Allow read access to call logs"
  on public.call_logs for select using (auth.role() = 'authenticated');

create policy "Allow read access to bookings"
  on public.bookings for select using (auth.role() = 'authenticated');

-- Write policies (Operator role only)
create policy "Allow operator updates on nurses"
  on public.nurses for update using (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'operator'
  );

create policy "Allow operator dispatch on call_logs"
  on public.call_logs for insert with check (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'operator'
  );

create policy "Allow operator updates on call_logs"
  on public.call_logs for update using (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'operator'
  );

create policy "Allow operator inserts on bookings"
  on public.bookings for insert with check (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'operator'
  );

create policy "Allow operator updates on bookings"
  on public.bookings for update using (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'operator'
  );

-- Enable Supabase Realtime publication
alter publication supabase_realtime add table public.call_logs;
alter publication supabase_realtime add table public.bookings;
```

---

## Security Policies

- Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are exposed in the client.
- Telephony, SIP credentials, Twilio auth tokens, and LLM API keys are handled exclusively on the backend voice gateway.
- Transcripts and caller notes are escaped and rendered strictly as plain text to prevent XSS.
- Client validation enforces E.164 phone formats and character constraints.
