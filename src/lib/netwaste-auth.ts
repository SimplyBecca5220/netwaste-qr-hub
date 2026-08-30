export type NetwasteUser = {
  id: string;
  name: string;
  email: string;
  location: string;
  points: number;
  totalKg: number;
  rank: string;
  streak: number;
};

export type StoredAccount = NetwasteUser & { password: string };

export const CURRENT_KEY = "netwaste_current_user";
export const ACCOUNTS_KEY = "netwaste_accounts";

export const locations = [
  "Nsidung Waterfront (Jetty)",
  "Fish Market Area",
  "Beach Landing Corridor",
  "Calabar South / Other",
];

export const WELCOME_BONUS = 100;

export function generateId() {
  return `#NSD-${Math.floor(100 + Math.random() * 900)}`;
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return [];
  return safeParse<StoredAccount[]>(localStorage.getItem(ACCOUNTS_KEY)) ?? [];
}

export function saveAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function loadCurrentUser(): NetwasteUser | null {
  if (typeof window === "undefined") return null;
  return safeParse<NetwasteUser>(localStorage.getItem(CURRENT_KEY));
}

export function setCurrentUser(user: NetwasteUser) {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_KEY);
}

export function signUp(input: {
  name: string;
  email: string;
  location: string;
  password: string;
}): { user?: NetwasteUser; error?: string } {
  const email = input.email.trim().toLowerCase();
  const accounts = loadAccounts();
  if (accounts.some((a) => a.email === email)) {
    return { error: "An account with that email already exists. Try signing in." };
  }
  const user: NetwasteUser = {
    id: generateId(),
    name: input.name.trim(),
    email,
    location: input.location,
    points: WELCOME_BONUS,
    totalKg: 0,
    rank: "New Collector",
    streak: 1,
  };
  saveAccounts([...accounts, { ...user, password: input.password }]);
  setCurrentUser(user);
  return { user };
}

export function signIn(email: string, password: string): { user?: NetwasteUser; error?: string } {
  const normalized = email.trim().toLowerCase();
  const account = loadAccounts().find((a) => a.email === normalized);
  if (!account || account.password !== password) {
    return { error: "Invalid email or password." };
  }
  const { password: _pw, ...user } = account;
  setCurrentUser(user);
  return { user };
}

export function demoUser(): NetwasteUser {
  const accounts = loadAccounts();
  const existing = accounts.find((a) => a.email === "effiong@nsidung.ng");
  if (existing) {
    const { password: _pw, ...user } = existing;
    setCurrentUser(user);
    return user;
  }
  const user: NetwasteUser = {
    id: "#NSD-408",
    name: "Effiong Bassey",
    email: "effiong@nsidung.ng",
    location: "Nsidung Waterfront (Jetty)",
    points: 1450,
    totalKg: 29,
    rank: "Gold Collector",
    streak: 12,
  };
  saveAccounts([...accounts, { ...user, password: "demo1234" }]);
  setCurrentUser(user);
  return user;
}
