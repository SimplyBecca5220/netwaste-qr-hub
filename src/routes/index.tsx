import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Droplets, Smartphone, BarChart3 } from "lucide-react";
import { CollectorPortal } from "@/components/netwaste/CollectorPortal";
import { AdminDashboard } from "@/components/netwaste/AdminDashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NetWaste QR — PROTEGO Marine Litter Initiative, Nsidung Calabar" },
      {
        name: "description",
        content:
          "NetWaste QR powers plastic recovery at the Nsidung Waterfront, Calabar: collectors scan station QR codes, log drop-offs, earn points and redeem airtime, data and cash — while aggregators track impact live.",
      },
      { property: "og:title", content: "NetWaste QR — PROTEGO Marine Litter Initiative" },
      {
        property: "og:description",
        content:
          "Scan. Drop off. Earn. NetWaste QR turns marine plastic recovery at Nsidung Waterfront into instant rewards for collectors and live impact data for aggregators.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Mode = "collector" | "admin";

function Index() {
  const [mode, setMode] = useState<Mode>("collector");

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation */}
      <header className="sticky top-0 z-30 border-b border-navy-foreground/10 bg-navy text-navy-foreground shadow-lg">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-recovery shadow-md shadow-recovery/40">
                <Droplets className="h-5 w-5 text-recovery-foreground" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-base font-black leading-tight sm:text-lg">
                  NetWaste QR
                </p>
                <p className="truncate text-[11px] text-navy-foreground/60">
                  PROTEGO Marine Litter Hotspot · Nsidung, Calabar
                </p>
              </div>
            </div>

            {/* Role switcher */}
            <div className="flex shrink-0 rounded-2xl bg-white/10 p-1">
              <button
                onClick={() => setMode("collector")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition sm:text-sm ${
                  mode === "collector"
                    ? "bg-teal text-teal-foreground shadow"
                    : "text-navy-foreground/70 hover:text-navy-foreground"
                }`}
              >
                <Smartphone className="h-4 w-4" />
                <span className="hidden xs:inline sm:inline">Collector</span>
              </button>
              <button
                onClick={() => setMode("admin")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition sm:text-sm ${
                  mode === "admin"
                    ? "bg-recovery text-recovery-foreground shadow"
                    : "text-navy-foreground/70 hover:text-navy-foreground"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden xs:inline sm:inline">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Views */}
      <main key={mode}>
        {mode === "collector" ? <CollectorPortal /> : <AdminDashboard />}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        NetWaste QR · PROTEGO Marine Litter Initiative · Nsidung Waterfront, Calabar
      </footer>
    </div>
  );
}
