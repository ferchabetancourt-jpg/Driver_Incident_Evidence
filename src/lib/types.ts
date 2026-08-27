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
  | "support_call"
  | "email_to_amazon"
  | "email_from_amazon"
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
  "support_call",
  "email_to_amazon",
  "email_from_amazon",
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
  source: "manual" | "screenshot";
  created_at: string;
  stations?: Station;
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
