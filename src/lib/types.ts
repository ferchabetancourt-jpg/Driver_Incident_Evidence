// The CAUSE of the problem — what went wrong. Kept separate from
// ActionTaken (what the driver did about it) and CommunicationType
// (the detailed follow-up log), which are different questions.
export type IncidentCategory =
  | "no_access_code"
  | "gate_locked"
  | "customer_unavailable"
  | "unsafe_location"
  | "damaged_package"
  | "missing_package"
  | "wrong_address"
  | "delivery_instructions"
  | "vehicle_route_issue"
  | "weather_or_external"
  | "other";

export const INCIDENT_CATEGORIES: IncidentCategory[] = [
  "no_access_code",
  "gate_locked",
  "customer_unavailable",
  "unsafe_location",
  "damaged_package",
  "missing_package",
  "wrong_address",
  "delivery_instructions",
  "vehicle_route_issue",
  "weather_or_external",
  "other",
];

// The ACTION the driver took in response to the incident — a separate
// question from the cause. Just a tag; the "why"/detail lives in the
// audio or text narrative, not in a sub-field here.
export type ActionTaken = "marked_in_app" | "called_support" | "emailed_amazon" | "returned_no_action" | "other";

export const ACTION_TAKEN_OPTIONS: ActionTaken[] = [
  "marked_in_app",
  "called_support",
  "emailed_amazon",
  "returned_no_action",
  "other",
];

export type IncidentScope = "package" | "block";

export type CommunicationType = "support_call" | "support_email" | "driver_email" | "other";

export type EvidenceType = "audio" | "photo" | "screenshot" | "other";

export interface Profile {
  id: string;
  display_name: string | null;
  language: "es" | "en";
  created_at: string;
  updated_at: string;
}

export interface Station {
  id: string;
  user_id: string;
  name: string;
  station_code: string | null;
  address: string | null;
  active: boolean;
  created_at: string;
}

export function formatStationLabel(station: Pick<Station, "name" | "station_code"> | null | undefined) {
  if (!station) return "";
  return station.station_code ? `${station.name} (${station.station_code})` : station.name;
}

export interface Block {
  id: string;
  user_id: string;
  station_id: string;
  block_date: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  pay_amount: number | null;
  source: "manual" | "screenshot";
  created_at: string;
  stations?: Station;
}

export function formatPayAmount(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return null;
  return `$${amount.toFixed(2)}`;
}

// Formats a "HH:MM" or "HH:MM:SS" time string as 12-hour ("6:30 PM"),
// without constructing a Date (avoids timezone conversion entirely).
export function formatTime12h(time: string | null | undefined) {
  if (!time) return "";
  const [hStr, mStr] = time.split(":");
  const hours = parseInt(hStr, 10);
  if (Number.isNaN(hours)) return time;
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${mStr} ${period}`;
}

// A block is "in progress" if the current local time falls within its
// start/end time on its date. If end_time isn't set yet (the driver
// hasn't closed out the block), it stays active only through the end
// of its own calendar date — once that date has passed we stop
// guessing, rather than inventing an arbitrary duration.
export function isBlockActiveNow(block: Pick<Block, "block_date" | "start_time" | "end_time">, now = new Date()) {
  const start = new Date(`${block.block_date}T${block.start_time}`);
  if (Number.isNaN(start.getTime()) || now < start) return false;

  if (block.end_time) {
    const end = new Date(`${block.block_date}T${block.end_time}`);
    return now <= end;
  }

  const endOfDay = new Date(`${block.block_date}T23:59:59`);
  return now <= endOfDay;
}

export interface PackageRecord {
  id: string;
  block_id: string;
  tba: string | null;
  description: string | null;
  delivery_location: string | null;
  status: string | null;
  created_at: string;
}

export interface Incident {
  id: string;
  block_id: string;
  category: IncidentCategory;
  action_taken: ActionTaken | null;
  occurred_at: string;
  transcript: string | null;
  structured_summary: string | null;
  status: "open" | "resolved";
  created_at: string;
  updated_at: string;
  blocks?: Block;
  incident_packages?: { packages: PackageRecord }[];
  evidence?: EvidenceRecord[];
  communications?: CommunicationRecord[];
}

export interface CommunicationRecord {
  id: string;
  incident_id: string;
  type: CommunicationType;
  occurred_at: string;
  summary: string | null;
  reference: string | null;
  created_at: string;
}

export interface EvidenceRecord {
  id: string;
  incident_id: string;
  type: EvidenceType;
  storage_path: string;
  mime_type: string | null;
  original_filename: string | null;
  captured_at: string;
  ocr_text: string | null;
  created_at: string;
}
