# CareConnect API Documentation (Mock & Service Layer)

This document describes the API endpoints and service interfaces powering the CareConnect Operator Desk and Voice Intake workflow. Currently, all responses are emulated via `mockAdapter.ts` for standalone client evaluation.

---

### Base URL
`https://api.careconnect.internal/v1` *(Active Mock Client Adapter)*

---

### Endpoints

#### 1. Ingest Voice Intake / Fallback Form
Creates a structured patient call ticket from real-time transcript or fallback intake form.

* **Endpoint:** `POST /intake/calls`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "callerName": "SK Srivastav",
  "callerPhone": "+91 8994796736",
  "condition": "Bone fracture",
  "urgency": "Urgent",
  "careType": "ICU-Level Care",
  "shiftLength": "Single Procedure (2-3 Hours)",
  "address": "Vasundhara Sector 2b, House No. 203"
}
