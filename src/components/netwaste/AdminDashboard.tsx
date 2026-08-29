import { useState } from "react";
import {
  Waves,
  Users,
  Banknote,
  Truck,
  MapPin,
  CheckCircle2,
  BellRing,
  TrendingUp,
} from "lucide-react";
import { hubs, recentActivity } from "@/lib/netwaste-data";

const kpis = [
  {
    label: "Total Marine Plastic Intercepted",
    value: "3,420 kg",
    change: "+12.4%",
    icon: Waves,
    tint: "bg-teal-soft text-teal",
  },
  {
    label: "Active Waterfront Collectors",
    value: "184 users",
    change: "+8 this week",
    icon: Users,
    tint: "bg-recovery-soft text-recovery",
  },
  {
    label: "Airtime & Value Distributed",
    value: "₦171,000",
    change: "+₦22,500",
    icon: Banknote,
    tint: "bg-amber-soft text-amber-strong",
  },
  {
    label: "Offtake Capacity Status",
    value: "85% full",
    change: "Ready for recycler pickup",
    icon: Truck,
    tint: "bg-teal-soft text-teal",
  },
];

const statusStyle: Record<string, string> = {
  Active: "bg-recovery-soft text-accent-foreground",
  "Nearly Full": "bg-amber-soft text-amber-strong",
  "Pickup Requested": "bg-destructive/10 text-destructive",
};

export function AdminDashboard() {
  const [alertSent, setAlertSent] = useState(false);

  const dispatch = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 6000);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-16 pt-6 animate-rise sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
          Nsidung Impact Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Aggregator analytics for the PROTEGO Marine Litter Hotspot · Calabar shoreline
        </p>
      </div>

      {/* Success banner */}
      {alertSent && (
        <div className="flex items-center gap-3 rounded-2xl border border-recovery/40 bg-recovery-soft p-4 animate-pop">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-recovery" />
          <p className="text-sm font-bold text-accent-foreground">
            Aggregator SMS Alert Sent — Calabar Recyclers notified for pickup at Nsidung Main Hub.
          </p>
        </div>
      )}

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${k.tint}`}>
                <k.icon className="h-5 w-5" />
              </div>
              <span className="flex items-center gap-1 rounded-full bg-recovery-soft px-2 py-1 text-[11px] font-bold text-accent-foreground">
                <TrendingUp className="h-3 w-3" /> {k.change}
              </span>
            </div>
            <p className="mt-4 font-display text-2xl font-black">{k.value}</p>
            <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Hotspot tracker */}
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-teal" />
            <h2 className="font-display text-lg font-bold">Shoreline Hotspot Tracker</h2>
          </div>
          <div className="space-y-3">
            {hubs.map((h) => (
              <div
                key={h.id}
                className="rounded-2xl border border-border bg-background p-4 transition hover:border-teal/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="min-w-0 truncate text-sm font-bold">{h.name}</p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyle[h.status]}`}
                  >
                    {h.status}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {h.distance} along shoreline · {h.collectedKg} kg collected
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      h.fillPct >= 100
                        ? "bg-destructive"
                        : h.fillPct >= 75
                          ? "bg-amber-warm"
                          : "bg-recovery"
                    }`}
                    style={{ width: `${h.fillPct}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-[11px] font-bold text-muted-foreground">
                  {h.fillPct}% capacity
                </p>
              </div>
            ))}
          </div>

          {/* Aggregator alert */}
          <div className="mt-4 rounded-2xl border border-amber-warm/50 bg-amber-soft p-4">
            <div className="flex items-start gap-3">
              <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-amber-strong" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-amber-strong">
                  Nsidung Main Hub has reached 250 kg.
                </p>
                <p className="mt-0.5 text-xs text-amber-strong/80">
                  Trigger pickup notification to Calabar Recyclers.
                </p>
                <button
                  onClick={dispatch}
                  className="mt-3 w-full rounded-xl bg-navy py-2.5 text-xs font-bold text-navy-foreground transition hover:brightness-125 active:scale-[0.98] sm:w-auto sm:px-5"
                >
                  Dispatch Aggregator Pickup Alert
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Activity feed */}
        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between p-5 pb-3">
            <h2 className="font-display text-lg font-bold">Recent Drop-off Activity</h2>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-recovery">
              <span className="h-2 w-2 rounded-full bg-recovery animate-pulse-dot" /> Live
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-y border-border bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-bold">Collector</th>
                  <th className="px-3 py-3 font-bold">Hub</th>
                  <th className="px-3 py-3 font-bold">Material</th>
                  <th className="px-3 py-3 font-bold text-right">Weight</th>
                  <th className="px-3 py-3 font-bold">Time</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((a, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/60 transition last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-5 py-3.5 font-semibold">{a.collector}</td>
                    <td className="px-3 py-3.5 text-muted-foreground">{a.hub}</td>
                    <td className="px-3 py-3.5">{a.material}</td>
                    <td className="px-3 py-3.5 text-right font-bold">{a.weight} kg</td>
                    <td className="px-3 py-3.5 text-muted-foreground">{a.time}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-recovery-soft px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
                        <CheckCircle2 className="h-3 w-3" /> {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
