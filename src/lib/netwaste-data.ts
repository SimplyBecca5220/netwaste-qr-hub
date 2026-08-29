export type Hub = {
  id: string;
  name: string;
  distance: string;
  status: "Active" | "Nearly Full" | "Pickup Requested";
  fillPct: number;
  collectedKg: number;
};

export const hubs: Hub[] = [
  {
    id: "nsd-main",
    name: "Nsidung Jetty Main Hub",
    distance: "0.4 km",
    status: "Pickup Requested",
    fillPct: 100,
    collectedKg: 250,
  },
  {
    id: "fish-market",
    name: "Fish Market Corridor",
    distance: "1.1 km",
    status: "Nearly Full",
    fillPct: 82,
    collectedKg: 164,
  },
  {
    id: "beach-landing",
    name: "Beach Landing Post",
    distance: "1.8 km",
    status: "Active",
    fillPct: 37,
    collectedKg: 74,
  },
];

export type MaterialKey = "pet" | "sachet";

export const materials: Record<
  MaterialKey,
  { label: string; short: string; rate: number; icon: string }
> = {
  pet: { label: "PET Bottles", short: "PET", rate: 50, icon: "🍾" },
  sachet: { label: "Water Sachets / Polythene", short: "Sachets", rate: 35, icon: "🛍️" },
};

export type Reward = {
  id: string;
  title: string;
  cost: number;
  note: string;
};

export const rewards: Reward[] = [
  { id: "mtn", title: "₦500 MTN Airtime", cost: 500, note: "Instant top-up to your line" },
  { id: "airtel", title: "₦1,000 Airtel Data", cost: 1000, note: "1.5GB bundle, credited in seconds" },
  { id: "water", title: "Clean Water Voucher", cost: 750, note: "5 bags of sachet water at hub kiosk" },
  { id: "bank", title: "Direct Bank Transfer", cost: 1450, note: "Cash out full balance to any bank" },
];

export type Activity = {
  collector: string;
  hub: string;
  material: string;
  weight: number;
  time: string;
  status: "Verified" | "Pending";
};

export const recentActivity: Activity[] = [
  { collector: "Effiong Bassey", hub: "Nsidung Jetty Main Hub", material: "PET Bottles", weight: 4.5, time: "2 min ago", status: "Verified" },
  { collector: "Blessing Okon", hub: "Fish Market Corridor", material: "Water Sachets", weight: 7.2, time: "14 min ago", status: "Verified" },
  { collector: "Ubong Etim", hub: "Beach Landing Post", material: "PET Bottles", weight: 3.8, time: "26 min ago", status: "Verified" },
  { collector: "Iniobong Asuquo", hub: "Nsidung Jetty Main Hub", material: "Water Sachets", weight: 5.1, time: "41 min ago", status: "Verified" },
  { collector: "Mfoniso Udoh", hub: "Fish Market Corridor", material: "PET Bottles", weight: 6.4, time: "1 hr ago", status: "Verified" },
  { collector: "Ekpenyong Oqua", hub: "Beach Landing Post", material: "Water Sachets", weight: 2.9, time: "1 hr ago", status: "Verified" },
  { collector: "Anietie Offiong", hub: "Nsidung Jetty Main Hub", material: "PET Bottles", weight: 8.0, time: "2 hrs ago", status: "Verified" },
];

export const collectorProfile = {
  name: "Effiong Bassey",
  id: "#NSD-408",
  points: 1450,
  totalKg: 29,
  rank: "Gold Collector",
  streak: 12,
};
