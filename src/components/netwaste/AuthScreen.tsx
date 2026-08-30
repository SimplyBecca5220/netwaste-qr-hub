import { useState } from "react";
import { Droplets, Eye, EyeOff, Sparkles, Waves, Recycle, Users } from "lucide-react";
import { toast } from "sonner";
import {
  locations,
  signIn,
  signUp,
  demoUser,
  type NetwasteUser,
} from "@/lib/netwaste-auth";

type Tab = "create" | "signin";

export function AuthScreen({ onAuthed }: { onAuthed: (user: NetwasteUser) => void }) {
  const [tab, setTab] = useState<Tab>("create");
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState(locations[0]!);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (tab === "create") {
      if (name.trim().length < 2) return setError("Please enter your full name.");
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Please enter a valid email address.");
      if (password.length < 6) return setError("Password must be at least 6 characters.");
      const res = signUp({ name, email, location, password });
      if (res.error) return setError(res.error);
      toast.success(`Welcome aboard, ${res.user!.name.split(" ")[0]}! 🌊`, {
        description: "100 welcome points credited to your wallet.",
      });
      onAuthed(res.user!);
    } else {
      const res = signIn(email, password);
      if (res.error) return setError(res.error);
      toast.success(`Welcome back, ${res.user!.name.split(" ")[0]}!`);
      onAuthed(res.user!);
    }
  };

  const quickDemo = () => {
    const user = demoUser();
    toast.success("Demo session started", { description: "Signed in as Effiong Bassey (Nsidung)." });
    onAuthed(user);
  };

  const inputCls =
    "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/25";

  return (
    <div className="min-h-screen bg-navy text-navy-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-4 py-8 lg:grid-cols-2 lg:px-8">
        {/* Brand side */}
        <section className="relative hidden overflow-hidden rounded-3xl bg-navy-soft p-10 lg:block">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-teal/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-recovery/20 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
              <Waves className="h-3.5 w-3.5 text-teal" /> PROTEGO Marine Litter Hotspot
            </span>
            <h1 className="mt-6 font-display text-4xl font-black leading-tight">
              Turn coastal plastic into <span className="text-recovery">real rewards</span>.
            </h1>
            <p className="mt-4 max-w-md text-sm text-navy-foreground/70">
              Join collectors recovering marine litter at the Nsidung Waterfront, Calabar. Scan a hub
              QR, drop off your plastic, and cash out in airtime, data or naira.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <Recycle className="h-4 w-4 text-recovery" />
                <p className="mt-2 font-display text-2xl font-black">3,420 kg</p>
                <p className="text-xs text-navy-foreground/60">Plastic intercepted</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <Users className="h-4 w-4 text-teal" />
                <p className="mt-2 font-display text-2xl font-black">184</p>
                <p className="text-xs text-navy-foreground/60">Active collectors</p>
              </div>
            </div>
          </div>
        </section>

        {/* Form card */}
        <section className="w-full animate-rise rounded-3xl bg-background p-6 text-foreground shadow-2xl sm:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-recovery shadow-md shadow-recovery/40">
              <Droplets className="h-5 w-5 text-recovery-foreground" />
            </div>
            <div>
              <p className="font-display text-lg font-black leading-tight">NetWaste QR</p>
              <p className="text-[11px] text-muted-foreground">
                PROTEGO Marine Litter Hotspot · Nsidung, Calabar
              </p>
            </div>
          </div>

          <div className="mt-6 flex rounded-2xl bg-muted p-1">
            {(["create", "signin"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t);
                  setError(null);
                }}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition ${
                  tab === t
                    ? "bg-card text-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "create" ? "Create Account" : "Sign In"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-5 space-y-3" key={tab}>
            {tab === "create" && (
              <div className="animate-fade-in space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                    Full name
                  </label>
                  <input
                    className={inputCls}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Effiong Bassey"
                    maxLength={80}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Email address
              </label>
              <input
                className={inputCls}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                maxLength={255}
                autoComplete="email"
              />
            </div>

            {tab === "create" && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  Location / neighbourhood
                </label>
                <select
                  className={inputCls}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  {locations.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  className={`${inputCls} pr-12`}
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  maxLength={100}
                  autoComplete={tab === "create" ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-recovery px-4 py-3.5 font-display text-sm font-black text-recovery-foreground shadow-lg shadow-recovery/30 transition hover:brightness-105 active:scale-[0.99]"
            >
              {tab === "create" ? "Join Coastal Recovery" : "Sign In"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={quickDemo}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-teal/40 bg-teal-soft px-4 py-3 text-sm font-bold text-navy transition hover:bg-teal/20"
          >
            <Sparkles className="h-4 w-4 text-teal" />
            Quick Demo as Effiong Bassey (Nsidung)
          </button>

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            Accounts are stored locally on this device — no email or OTP verification needed.
          </p>
        </section>
      </div>
    </div>
  );
}
