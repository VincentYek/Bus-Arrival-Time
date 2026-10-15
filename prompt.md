# Development Prompts Log

This document records the sequential prompts used during the creation and development of the **SG BusPulse** Singapore Real-Time Bus Arrival & Tracking application.

---

### Prompt 1: Initial Application Conception & Frontend Development

> **User Prompt:**  
> `build a singapore based bus arrival time application that tracks real time bus locations and provides accurate wait time for all LTA bus stops. build the front end for now`

**Actions Completed:**
- Built the complete modern Singapore transit frontend using React, TypeScript, Leaflet, and Tailwind CSS.
- Modeled the system on the Land Transport Authority (LTA) DataMall v2/v3 schema.
- Added live interactive Leaflet map featuring real Singapore streets and moving bus vehicles with live speed, heading angle, plate numbers, and crowd load borders.
- Implemented 3 upcoming buses (`NextBus`, `NextBus2`, `NextBus3`) with second-by-second countdowns, capacity badges (`SEA` Seats, `SDA` Standing, `LSD` Limited Standing), deck badges (`SD`, `DD`, `BD`), and wheelchair accessibility (`WAB`).
- Created search by 5-digit stop code (e.g., `09048`), road name, description, MRT station, or bus number.
- Added 2-minute arrival alarm chime via Web Audio API, favorites/bookmarks drawer, and route inspector drawer.

---

### Prompt 2: GitHub Repository Setup & Push

> **User Prompt:**  
> `git push ghp_***@https://github.com/VincentYek/Bus-Arrival-Time.git`

**Actions Completed:**
- Initialized local Git repository on branch `main`.
- Configured user credentials and committed all codebase files.
- Pushed initial project release to [https://github.com/VincentYek/Bus-Arrival-Time](https://github.com/VincentYek/Bus-Arrival-Time).
- Sanitized remote URL to prevent token exposure.

---

### Prompt 3: Serverless LTA DataMall v3 Integration

> **User Prompt:**  
> `add a serverless connection that pulls live data from LTA Datamall using the following endpoints: GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139`  
> `# AccountKey: <LTA_ACCOUNT_KEY>`  
> `# accept: application/json`

**Actions Completed:**
- Created full-stack server integration in `server.ts` running Express alongside Vite.
- Built proxy endpoints connecting to `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival`.
- Added test bus stop `83139` ("Telok Kurau Rd - Aft Joo Chiat Pl") to presets and data models.
- Documented `LTA_ACCOUNT_KEY` in `.env.example`.
- Committed and pushed changes to GitHub.

---

### Prompt 4: Root-Level `/api` Serverless Architecture

> **User Prompt:**  
> `add a serverless connection that pulls live data from LTA Datamall using the following endpoints:`  
> `- store this in / api folder (project root level) not the scr folder`  
> `- include /health.ts and busarrival.ts within that subfolder`  
> `- do not hardcode any key I will include them later`  
> `GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139`  
> `# AccountKey: <LTA_ACCOUNT_KEY>`  
> `# accept: application/json`

**Actions Completed:**
- Created root-level `/api` directory:
  - `/api/health.ts`: Health check endpoint (`GET /api/health`).
  - `/api/busarrival.ts`: Serverless proxy handler (`GET /api/busarrival?BusStopCode=83139`).
- Strictly read `AccountKey` from `process.env.LTA_ACCOUNT_KEY` or dynamic `x-account-key` header with zero hardcoding.
- Mounted handlers in `server.ts` and connected the client application.
- Committed and pushed to GitHub.

---

### Prompt 5: Prompts Documentation (Current)

> **User Prompt:**  
> `collate all the prompts create so far prompt.md`

**Actions Completed:**
- Created `prompt.md` documenting the complete prompt development history and actions taken.
