"use client";

import { useLanguage } from "@/lib/i18n/context";
import { ACTION_TAKEN_LABELS, CATEGORY_LABELS, COMMUNICATION_TYPE_LABELS } from "@/lib/i18n/dictionary";
import { formatStationLabel, formatTime12h, type CommunicationRecord, type Incident } from "@/lib/types";
import { AddCommunicationForm } from "./AddCommunicationForm";

interface EvidenceWithUrl {
  id: string;
  type: string;
  url: string | null;
  original_filename: string | null;
}

export function IncidentDetailClient({
  incident,
  evidenceWithUrls,
  communications,
}: {
  incident: Incident;
  evidenceWithUrls: EvidenceWithUrl[];
  communications: CommunicationRecord[];
}) {
  const { t, lang } = useLanguage();

  const tbas = (incident.incident_packages ?? []).map((ip) => ip.packages?.tba).filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">
          {CATEGORY_LABELS[incident.category]?.[lang] ?? incident.category}
        </h1>
        <p className="text-sm text-gray-500">
          {t.incident.timestamp}: {new Date(incident.occurred_at).toLocaleString(lang === "es" ? "es-ES" : "en-US")}
        </p>
        {incident.blocks && (
          <p className="text-sm text-gray-500">
            {formatStationLabel(incident.blocks.stations)} · {incident.blocks.block_date} ·{" "}
            {formatTime12h(incident.blocks.start_time)}
          </p>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-medium text-gray-700">{t.incident.linkedPackages}</h2>
        <p className="mt-1 text-sm text-gray-600">
          {tbas.length > 0 ? tbas.join(", ") : t.incident.noLinkedPackages}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-medium text-gray-700">{t.incident.actionTakenLabel}</h2>
        <p className="mt-1 text-sm text-gray-600">
          {incident.action_taken ? ACTION_TAKEN_LABELS[incident.action_taken]?.[lang] ?? incident.action_taken : "—"}
        </p>
      </div>

      {incident.transcript && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-medium text-gray-700">{t.incident.narrativeLabel}</h2>
          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{incident.transcript}</p>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-medium text-gray-700">{t.incident.evidence}</h2>
        {evidenceWithUrls.length === 0 && <p className="mt-1 text-sm text-gray-500">—</p>}
        <div className="mt-2 space-y-3">
          {evidenceWithUrls.map((item) => (
            <div key={item.id}>
              {item.type === "audio" && item.url && <audio controls src={item.url} className="w-full" />}
              {item.type === "photo" && item.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.original_filename ?? "evidence"} className="max-h-64 rounded-md" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-medium text-gray-700">{t.incident.communications}</h2>
        <ul className="mt-2 space-y-2">
          {communications.map((comm) => (
            <li key={comm.id} className="rounded-md bg-gray-50 p-3 text-sm">
              <p className="font-medium">{COMMUNICATION_TYPE_LABELS[comm.type]?.[lang] ?? comm.type}</p>
              {comm.summary && <p className="text-gray-600">{comm.summary}</p>}
              {comm.reference && <p className="text-xs text-gray-400">Ref: {comm.reference}</p>}
            </li>
          ))}
        </ul>

        <AddCommunicationForm incidentId={incident.id} blockId={incident.block_id} />
      </div>
    </div>
  );
}
