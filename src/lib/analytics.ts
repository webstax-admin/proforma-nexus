export type Role = "admin" | "company" | "applicant";

export type AnalyticsEventType =
  | "login_success"
  | "company_created"
  | "applicant_created"
  | "proforma1_saved"
  | "proforma1_submitted"
  | "proforma2_saved"
  | "applicant_approved"
  | "kit_created";

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: number; // epoch ms
  actorRole: Role;
  actorId?: string;
  companyId?: string;
  applicantId?: string;
  meta?: Record<string, unknown>;
}

const STORAGE_KEY = "analytics_events_v1";

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function readAll(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

function writeAll(events: AnalyticsEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function recordEvent(evt: Omit<AnalyticsEvent, "id" | "timestamp"> & { timestamp?: number }) {
  const all = readAll();
  const full: AnalyticsEvent = { id: uid(), timestamp: evt.timestamp ?? Date.now(), ...evt } as AnalyticsEvent;
  writeAll([full, ...all]);
}

export function getEvents(): AnalyticsEvent[] {
  return readAll();
}

export function clearEvents() {
  writeAll([]);
}
