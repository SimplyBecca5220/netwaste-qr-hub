NetWaste QR
> Decentralized Coastal Plastic Recovery & Micro-Incentive Platform
> Built for the PROTEGO National Blue Innovation Challenge | Target Hotspot: Nsidung Waterfront, Calabar
> 
Overview
Marine plastic pollution along the Gulf of Guinea is heavily concentrated at urban riverine exit points. At the Nsidung waterfront in Calabar, low-density plastics (PET bottles, water sachets, and polythene) choke shoreline mangroves and drain into the marine channel.
NetWaste QR turns coastal plastic interception into a self-sustaining micro-economy. Waterfront residents, traders, and youth collectors deposit sorted marine plastics at physical waterfront recovery hubs. Drop-offs are scanned and verified via a mobile web app, awarding instant digital points redeemable for mobile airtime, data, and daily essentials. Bulk aggregation automatically alerts commercial recyclers for offtake, ensuring a complete circular loop.
Core Features
 * Live Camera QR Scanning: Instant browser-based camera feed leveraging html5-qrcode with hardware back-camera detection and fallback simulation for desktop review.
 * Instant Value Calculator: Real-time point conversion dynamically calculated by scrap category (e.g., 50 pts/kg for PET vs. 35 pts/kg for polythene sachets).
 * Collector Micro-Wallet: Real-time balances with instant redemptions for local utilities (MTN/Airtel airtime, clean sachet water vouchers, cash transfer).
 * Shoreline Hotspot Tracker: Geospatial tracking of physical collection bins across Nsidung Jetty, Fish Market Corridor, and Beach Landing Post.
 * Aggregator Logistics Alert: Automated bulk alerts notifying industrial recyclers in Calabar once a collection post exceeds capacity (250 kg threshold).
System Architecture
[ Waterfront Collector ] 
         │ 
         ▼ (Brings sorted PET / Sachets)
[ Physical Nsidung Hub ] 
         │
         ├── Attendant scans station QR via Web App (`html5-qrcode`)
         ├── Weight entered on digital scale
         │
         ▼
[ NetWaste Engine / Database ]
         │
         ├── Credits Collector Points & Dispatches SMS
         ├── Updates Public Nsidung Marine Interception Metric (kg)
         │
         ▼
[ Bulk Capacity Reached (≥ 250 kg) ] ──> [ SMS Alert Sent to Calabar Recyclers ]

Tech Stack
 * Frontend: React, TypeScript, Tailwind CSS, Vite
 * UI Components: Lucide Icons, Shadcn UI primitives
 * Hardware Integration: html5-qrcode (HTML5 Camera Barcode & QR API)
 * State & Persistence: In-memory reactive state with local cache persistence
 * Deployment: Hosted on Lovable / Vercel Edge
Quick Start (Local Setup)
Prerequisites
 * Node.js (v18 or higher)
 * npm, pnpm, or bun
Installation
 * Clone the repository:
   git clone https://github.com/your-username/netwaste-qr.git
cd netwaste-qr

 * Install dependencies:
   npm install
# or
pnpm install

 * Start local development server:
   npm run dev

 * Open in browser:
   Navigate to http://localhost:5173.
   > Note: Camera QR scanning requires either localhost or an HTTPS origin due to browser security restrictions (navigator.mediaDevices).
   > 
Field Pilot Roadmap (Nsidung, Calabar)
 * Month 1: Deploy physical QR tags and hanging scales at 3 collection spots: Nsidung Jetty, Fish Market Corridor, and Beach Landing Post.
 * Month 2: Train 6 youth attendants; establish scrap offtake cycles with registered recycling aggregators in Cross River State.
 * Month 3: Scale collector base to 200+ waterfront households and evaluate metric diversion into the Calabar River channel.
 * License & Attribution
Developed for the PROTEGO Blue Innovation Challenge (implemented by WASTE Africa, Nigeria Climate Innovation Center, and adelphi; supported by the German Federal Ministry for the Environment BMUV). Distributed under the MIT License.
