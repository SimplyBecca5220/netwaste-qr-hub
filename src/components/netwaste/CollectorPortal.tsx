import { useCallback, useEffect, useRef, useState } from "react";
import {
  ScanLine,
  Minus,
  Plus,
  Leaf,
  Gift,
  X,
  CheckCircle2,
  ChevronDown,
  Flame,
  Trophy,
  Wallet,
  Recycle,
  ImageUp,
  Zap,
  CameraOff,
} from "lucide-react";
import { toast } from "sonner";
import {
  hubs,
  materials,
  rewards,
  collectorProfile,
  type MaterialKey,
  type Reward,
} from "@/lib/netwaste-data";
import { initials, type NetwasteUser } from "@/lib/netwaste-auth";
import type { Html5Qrcode } from "html5-qrcode";

/* ---------------- Hub matching from scanned text ---------------- */
const HUB_HINTS: Record<string, string[]> = {
  "nsd-main": ["nsd-jetty", "jetty", "nsd-main", "main hub", "nsidung jetty"],
  "fish-market": ["fish market", "fish-market", "corridor", "nsd-fish"],
  "beach-landing": ["beach landing", "beach-landing", "landing post", "nsd-beach"],
};

function matchHubFromText(text: string): string | null {
  const t = text.toLowerCase();
  for (const hub of hubs) {
    if (t.includes(hub.name.toLowerCase()) || t.includes(hub.id)) return hub.id;
  }
  for (const [hubId, hints] of Object.entries(HUB_HINTS)) {
    if (hints.some((h) => t.includes(h))) return hubId;
  }
  return null;
}

/* Short confirmation beep via WebAudio (no asset needed) */
function playBeep() {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.26);
    osc.onended = () => void ctx.close().catch(() => undefined);
  } catch {
    /* audio unsupported — ignore */
  }
}

/* ---------------- QR Scanner modal ---------------- */
function ScannerModal({
  onClose,
  onHubDetected,
}: {
  onClose: () => void;
  onHubDetected: (hubId: string, rawText: string) => void;
}) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const handlingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [fileBusy, setFileBusy] = useState(false);

  const stopCamera = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (!scanner) return;
    try {
      if (scanner.isScanning) await scanner.stop();
    } catch {
      /* already stopped */
    }
    try {
      await scanner.clear();
    } catch {
      /* already cleared */
    }
  }, []);

  const handleResult = useCallback(
    (text: string) => {
      if (handlingRef.current) return;
      handlingRef.current = true;
      navigator.vibrate?.(120);
      playBeep();
      const hubId = matchHubFromText(text);
      const targetHub = hubId ?? hubs[0]!.id;
      const hubName = hubs.find((h) => h.id === targetHub)?.name ?? targetHub;
      onHubDetected(targetHub, text);
      toast.success(`Station QR Verified: ${text}`, {
        description: hubId
          ? `${hubName} selected automatically.`
          : `Closest match: ${hubName}.`,
      });
      void stopCamera().then(onClose);
    },
    [onClose, onHubDetected, stopCamera],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;
        const scanner = new Html5Qrcode("qr-reader", { verbose: false });
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 210, height: 210 } },
          (decodedText) => {
            void stopCamera().then(() => handleResult(decodedText));
          },
          () => undefined,
        );
      } catch {
        if (!cancelled)
          setCameraError("Camera unavailable — use the simulate button or upload a QR image below.");
      }
    })();
    return () => {
      cancelled = true;
      void stopCamera();
    };
  }, [handleResult, stopCamera]);

  const onFilePicked = async (file: File | null) => {
    if (!file) return;
    setFileBusy(true);
    try {
      await stopCamera();
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("qr-reader-file", { verbose: false });
      const text = await scanner.scanFileV2(file, true).then((r) => r.decodedText);
      try {
        await scanner.clear();
      } catch {
        /* ignore */
      }
      handleResult(text);
    } catch {
      toast.error("No QR code found in that image", {
        description: "Try a clearer photo of the station QR code.",
      });
      setFileBusy(false);
    }
  };

  const simulate = () => {
    void stopCamera().then(() =>
      handleResult("NSD-JETTY | Nsidung Jetty Main Hub | PROTEGO Station"),
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy/80 backdrop-blur-sm animate-fade-in sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-t-3xl bg-navy p-6 pb-10 text-navy-foreground animate-drawer-up sm:rounded-3xl sm:pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Scan Station QR</h3>
          <button
            onClick={() => void stopCamera().then(onClose)}
            aria-label="Close camera"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Camera viewfinder with reticle overlay */}
        <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl bg-navy-soft">
          <div id="qr-reader" className="absolute inset-0 [&_video]:h-full [&_video]:w-full [&_video]:object-cover" />
          {/* corner brackets */}
          {["left-3 top-3 border-l-4 border-t-4 rounded-tl-xl",
            "right-3 top-3 border-r-4 border-t-4 rounded-tr-xl",
            "left-3 bottom-3 border-l-4 border-b-4 rounded-bl-xl",
            "right-3 bottom-3 border-r-4 border-b-4 rounded-br-xl",
          ].map((pos) => (
            <span key={pos} className={`pointer-events-none absolute z-10 h-10 w-10 border-recovery ${pos}`} />
          ))}
          {!cameraError && (
            <span className="pointer-events-none absolute left-5 right-5 z-10 h-0.5 rounded-full bg-recovery shadow-[0_0_18px_4px] shadow-recovery/60 animate-scan-line" />
          )}
          {cameraError && (
            <div className="absolute inset-0 z-10 grid place-items-center p-5 text-center">
              <div>
                <CameraOff className="mx-auto mb-2 h-8 w-8 text-navy-foreground/50" />
                <p className="text-xs text-navy-foreground/70">{cameraError}</p>
              </div>
            </div>
          )}
        </div>
        {/* Hidden mount point for file decoding */}
        <div id="qr-reader-file" className="hidden" />

        <p className="mt-4 text-center text-sm text-navy-foreground/70">
          Point your back camera at the hub station QR code…
        </p>

        {/* Desktop / testing fallbacks */}
        <div className="mt-4 space-y-2">
          <button
            onClick={simulate}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-recovery py-3 text-sm font-bold text-recovery-foreground transition hover:brightness-110 active:scale-[0.98]"
          >
            <Zap className="h-4 w-4" /> Simulate Scan (Nsidung Jetty Hub)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              void onFilePicked(e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={fileBusy}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3 text-sm font-semibold transition hover:bg-white/10 disabled:opacity-50"
          >
            <ImageUp className="h-4 w-4" />
            {fileBusy ? "Decoding image…" : "Upload QR image"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Redeem confirm modal ---------------- */
function RedeemModal({
  reward,
  balance,
  onClose,
  onConfirm,
}: {
  reward: Reward;
  balance: number;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const enough = balance >= reward.cost;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-card p-6 text-center animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-recovery-soft">
          <Gift className="h-7 w-7 text-recovery" />
        </div>
        <h3 className="font-display text-lg font-bold">{reward.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{reward.note}</p>
        <div className="mt-4 rounded-2xl bg-muted p-3 text-sm">
          <span className="text-muted-foreground">Cost: </span>
          <span className="font-bold">{reward.cost.toLocaleString()} pts</span>
          <span className="mx-2 text-border">|</span>
          <span className="text-muted-foreground">Balance after: </span>
          <span className={`font-bold ${enough ? "text-recovery" : "text-destructive"}`}>
            {(balance - reward.cost).toLocaleString()} pts
          </span>
        </div>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold transition hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!enough}
            className="flex-1 rounded-xl bg-recovery py-3 text-sm font-bold text-recovery-foreground transition hover:brightness-110 disabled:opacity-40"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Rewards drawer ---------------- */
function RewardsDrawer({
  open,
  balance,
  onClose,
  onRedeem,
}: {
  open: boolean;
  balance: number;
  onClose: () => void;
  onRedeem: (r: Reward) => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-navy/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="max-h-[82vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-5 pb-8 animate-drawer-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">Redeem Rewards</h3>
          <span className="rounded-full bg-recovery-soft px-3 py-1 text-sm font-bold text-accent-foreground">
            {balance.toLocaleString()} pts
          </span>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          Instant payouts for Nsidung waterfront collectors.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {rewards.map((r) => {
            const enough = balance >= r.cost;
            return (
              <div
                key={r.id}
                className="flex flex-col rounded-2xl border border-border bg-background p-4 transition hover:border-recovery/50 hover:shadow-md"
              >
                <p className="font-display font-bold">{r.title}</p>
                <p className="mt-1 flex-1 text-xs text-muted-foreground">{r.note}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-teal">{r.cost.toLocaleString()} pts</span>
                  <button
                    onClick={() => onRedeem(r)}
                    disabled={!enough}
                    className="rounded-lg bg-recovery px-4 py-2 text-xs font-bold text-recovery-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Redeem
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Animated counter ---------------- */
function AnimatedPoints({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current;
    if (from === value) return;
    const start = performance.now();
    const dur = 900;
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span>{display.toLocaleString()}</span>;
}

/* ---------------- Main portal ---------------- */
export function CollectorPortal({ user }: { user?: NetwasteUser }) {
  const profile = user ?? collectorProfile;
  const [points, setPoints] = useState(profile.points);
  const [totalKg, setTotalKg] = useState(profile.totalKg);
  const [hubId, setHubId] = useState(hubs[0]?.id ?? "nsd-main");
  const [material, setMaterial] = useState<MaterialKey>("pet");
  const [weight, setWeight] = useState(2);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [redeemTarget, setRedeemTarget] = useState<Reward | null>(null);

  const rate = materials[material].rate;
  const earned = Math.round(weight * rate);

  const bumpWeight = (d: number) =>
    setWeight((w) => Math.min(50, Math.max(0.5, Math.round((w + d) * 2) / 2)));

  const submit = () => {
    if (weight <= 0) return;
    setPoints((p) => p + earned);
    setTotalKg((k) => Math.round((k + weight) * 10) / 10);
    toast.success(`+${earned.toLocaleString()} pts credited! 🎉`, {
      description: `${weight} kg of ${materials[material].label} verified at ${hubs.find((h) => h.id === hubId)?.name}.`,
    });
    setWeight(0.5);
  };

  const confirmRedeem = () => {
    if (!redeemTarget) return;
    setPoints((p) => p - redeemTarget.cost);
    toast.success("Reward redeemed!", {
      description: `${redeemTarget.title} — processing instantly.`,
    });
    setRedeemTarget(null);
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 px-4 pb-24 pt-4 animate-rise">
      {/* Collector card */}
      <section className="relative overflow-hidden rounded-3xl bg-navy p-5 text-navy-foreground shadow-xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal/25 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-recovery/20 blur-2xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal font-display text-lg font-black text-teal-foreground">
              EB
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold">{collectorProfile.name}</p>
              <p className="text-xs text-navy-foreground/60">
                Collector ID {collectorProfile.id} · {collectorProfile.rank}
              </p>
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold">
            <Flame className="h-3.5 w-3.5 text-amber-warm" /> {collectorProfile.streak}-day streak
          </span>
        </div>
        <div className="relative mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <div className="flex items-center gap-1.5 text-xs text-navy-foreground/60">
              <Wallet className="h-3.5 w-3.5" /> Points balance
            </div>
            <p className="mt-1 font-display text-2xl font-black text-recovery">
              <AnimatedPoints value={points} />
            </p>
            <p className="text-xs text-navy-foreground/60">≈ ₦{points.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <div className="flex items-center gap-1.5 text-xs text-navy-foreground/60">
              <Recycle className="h-3.5 w-3.5" /> Plastic recycled
            </div>
            <p className="mt-1 font-display text-2xl font-black">{totalKg} kg</p>
            <p className="text-xs text-navy-foreground/60">kept out of the creek</p>
          </div>
        </div>
      </section>

      {/* Scan CTA */}
      <button
        onClick={() => setScannerOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal py-4 font-display text-base font-bold text-teal-foreground shadow-lg shadow-teal/30 transition hover:brightness-110 active:scale-[0.98]"
      >
        <ScanLine className="h-5 w-5" /> Scan Station QR Code
      </button>

      {/* Drop-off form */}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-display text-lg font-bold">Log a Drop-off</h2>

        <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Select Hub
        </label>
        <div className="relative mt-1.5">
          <select
            value={hubId}
            onChange={(e) => setHubId(e.target.value)}
            className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-3 text-sm font-semibold outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/30"
          >
            {hubs.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} · {h.distance}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Plastic Category
        </label>
        <div className="mt-1.5 grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1.5">
          {(Object.keys(materials) as MaterialKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setMaterial(key)}
              className={`rounded-xl px-3 py-2.5 text-left transition ${
                material === key
                  ? "bg-card font-bold shadow-sm ring-1 ring-teal/40"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="block text-sm">{materials[key].label}</span>
              <span className={`text-xs font-bold ${material === key ? "text-recovery" : ""}`}>
                {materials[key].rate} pts/kg
              </span>
            </button>
          ))}
        </div>

        <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Weight (kg)
        </label>
        <div className="mt-1.5 flex items-center gap-2">
          <button
            onClick={() => bumpWeight(-0.5)}
            aria-label="Decrease weight"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-border bg-background transition hover:bg-muted active:scale-95"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min={0.5}
            step={0.5}
            value={weight}
            onChange={(e) => setWeight(Math.max(0, Number(e.target.value) || 0))}
            className="h-12 w-full min-w-0 rounded-xl border border-input bg-background text-center font-display text-xl font-bold outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/30"
          />
          <button
            onClick={() => bumpWeight(0.5)}
            aria-label="Increase weight"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-border bg-background transition hover:bg-muted active:scale-95"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Live reward calculation */}
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-recovery-soft px-4 py-3">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-recovery" />
            <span className="text-sm font-semibold text-accent-foreground">You'll earn</span>
          </div>
          <div className="text-right">
            <p className="font-display text-xl font-black text-recovery">
              {earned.toLocaleString()} pts
            </p>
            <p className="text-xs font-semibold text-accent-foreground/70">
              ≈ ₦{earned.toLocaleString()}
            </p>
          </div>
        </div>

        <button
          onClick={submit}
          className="mt-4 w-full rounded-2xl bg-recovery py-4 font-display text-base font-bold text-recovery-foreground shadow-lg shadow-recovery/30 transition hover:brightness-110 active:scale-[0.98]"
        >
          Submit Drop-off
        </button>
      </section>

      {/* Rewards entry */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="flex w-full items-center justify-between rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:border-teal/50 hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-soft">
            <Trophy className="h-5 w-5 text-teal" />
          </div>
          <div className="text-left">
            <p className="font-display font-bold">Redeem Rewards</p>
            <p className="text-xs text-muted-foreground">Airtime, data, water & cash-out</p>
          </div>
        </div>
        <ChevronDown className="h-5 w-5 -rotate-90 text-muted-foreground" />
      </button>

      {scannerOpen && (
        <ScannerModal
          onClose={() => setScannerOpen(false)}
          onHubDetected={(hub) => setHubId(hub)}
        />
      )}
      <RewardsDrawer
        open={drawerOpen}
        balance={points}
        onClose={() => setDrawerOpen(false)}
        onRedeem={(r) => {
          setDrawerOpen(false);
          setRedeemTarget(r);
        }}
      />
      {redeemTarget && (
        <RedeemModal
          reward={redeemTarget}
          balance={points}
          onClose={() => setRedeemTarget(null)}
          onConfirm={confirmRedeem}
        />
      )}
    </div>
  );
}
