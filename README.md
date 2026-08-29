# NetWaste Connect

Build a clean, mobile-first responsive web app called "NetWaste QR", designed for the PROTEGO Marine Litter Initiative at the Nsidung Waterfront, Calabar. 



The app serves two main views accessible via a top navigation toggle:

1. "Collector & Hub Drop-off Portal" (Mobile view)

2. "Nsidung Admin & Aggregator Impact Dashboard" (Desktop/Tablet view)



Use a modern environmental/ocean theme: deep oceanic navy (#0B192C), fresh aquatic teal (#008DDA), vibrant recovery green (#10B981), and clean off-white background with subtle rounded cards and crisp typography.



Key Sections and Functionality to Include:



1. Top Navigation Bar:

- App logo: "NetWaste QR" with a leaf/water drop badge.

- Subtitle: "PROTEGO Marine Litter Hotspot - Nsidung, Calabar".

- Role switcher toggle: [ Collector / Attendant Mode | Admin Analytics Mode ].



2. View A: Collector & Attendant Drop-off Portal:

- Collector Card: Display a mock user profile ("Effiong Bassey", ID: #NSD-408), total points balance (1,450 pts ≈ ₦1,450), and kilograms of plastic recycled to date (29 kg).

- Quick Action Button: "Scan Station QR Code" (simulates opening a camera scanner with a modal overlay).

- Drop-off Entry Form:

  * Select Hub: Dropdown ("Nsidung Jetty Main Hub", "Fish Market Corridor", "Beach Landing Post").

  * Plastic Category: Segmented button for "PET Bottles" (50 pts/kg) and "Water Sachets / Polythene" (35 pts/kg).

  * Weight Input (kg): Number input with increment/decrement buttons.

  * Live Reward Calculation: Automatically displays calculated points and equivalent value in Naira.

  * "Submit Drop-off" CTA button: When clicked, displays a celebratory toast with points credited and plays a short visual counter animation.

- Rewards Redemption Drawer:

  * Cards for instant redemption: "₦500 MTN Airtime", "₦1,000 Airtel Data", "Clean Water Voucher (5 Bags)", and "Direct Bank Transfer".

  * Active "Redeem" button with instant modal confirmation.



3. View B: Nsidung Admin & Aggregator Impact Dashboard:

- Header Stats (KPI metric cards with green change badges):

  * "Total Marine Plastic Intercepted": 3,420 kg

  * "Active Waterfront Collectors": 184 users

  * "Airtime & Value Distributed": ₦171,000

  * "Offtake Capacity Status": 85% full (Ready for Recycler Pickup)

- Interactive Map / Hotspot Tracker:

  * A card showcasing the 3 active drop-off points along the Nsidung Calabar shoreline with live status tags ("Active", "Nearly Full", "Pickup Requested").

- Recent Drop-off Activity Feed:

  * A table listing recent drop-offs: Collector Name, Hub Location, Material Type, Weight (kg), Timestamp, and Status ("Verified").

- Aggregator Alert Action:

  * A highlighted alert banner: "Nsidung Main Hub has reached 250 kg. Trigger Pickup Notification to Calabar Recyclers."

  * Button: "Dispatch Aggregator Pickup Alert" (triggers a success notification banner: 'Aggregator SMS Alert Sent').



Keep state in memory with realistic mock data, smooth tab transitions, fully interactive buttons/modals, and high polish so it loo

ks production-ready for an investor pitch.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://netwaste-qr-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fe2b895f-94d5-4fd0-a790-a07974e07b9d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
