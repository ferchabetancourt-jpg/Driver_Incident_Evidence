"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { ACTION_TAKEN_LABELS, CATEGORY_LABELS, COMMUNICATION_TYPE_LABELS } from "@/lib/i18n/dictionary";
import {
  ACTION_TAKEN_OPTIONS,
  INCIDENT_CATEGORIES,
  formatDateTime12h,
  formatStationLabel,
  formatTime12h,
  type ActionTaken,
  type CommunicationRecord,
  type Incident,
  type IncidentCategory,
} from "@/lib/types";
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
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [category, setCategory] = useState<IncidentCategory>(incident.category);
  const [actionTaken, setActionTaken] = useState<ActionTaken | null>(incident.action_taken);
  const [transcript, setTranscript] = useState(incident.transcript ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tbas = (incident.incident_packages ?? []).map((ip) => ip.packages?.tba).filter(Boolean);

  async function handleSaveEdit() {
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("incidents")
        .update({
          category,
          action_taken: actionTaken,
          transcript: transcript.trim() || null,
        })
        .eq("id", incident.id);
      if (updateError) throw updateError;

      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.auth.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            {CATEGORY_LABELS[incident.category]?.[lang] ?? incident.category}
          </h1>
          <p className="text-sm text-gray-500">
            {t.incident.timestamp}: {formatDateTime12h(incident.occurred_at, lang)}
          </p>
          {incident.blocks && (
            <p className="text-sm text-gray-500">
              {formatStationLabel(incident.blocks.stations)} · {incident.blocks.block_date} ·{" "}
              {formatTime12h(incident.blocks.start_time)}
            </p>
          )}
        </div>
        {!editing && (
          <button
            type="button"
            aria-label={t.common.edit}
            onClick={() => setEditing(true)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-3xl text-brand-700 hover:bg-brand-100"
          >
            ✎
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
          <div>
            <label className="block text-sm text-gray-600">{t.incident.category}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IncidentCategory)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            >
              {INCIDENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat][lang]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-600">{t.incident.actionTaken}</p>
            <div className="flex flex-wrap gap-2">
              {ACTION_TAKEN_OPTIONS.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => setActionTaken(action)}
                  className={`rounded-md px-3 py-2 text-sm ${
                    actionTaken === action ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {ACTION_TAKEN_LABELS[action][lang]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600">{t.incident.narrativeLabel}</label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={t.incident.narrativePlaceholder}
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={saving}
              className="flex-1 rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? t.incident.saving : t.incident.saveChanges}
            </button>
            <button
              type="button"
              onClick={() => {
                setCategory(incident.category);
                setActionTaken(incident.action_taken);
                setTranscript(incident.transcript ?? "");
                setError(null);
                setEditing(false);
              }}
              className="rounded-md px-4 py-2 text-sm text-slate"
            >
              {t.common.cancel}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-medium text-gray-700">{t.incident.linkedPackages}</h2>
            <p className="mt-1 text-sm text-gray-600">
              {tbas.length > 0 ? tbas.join(", ") : t.incident.noLinkedPackages}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-medium text-gray-700">{t.incident.actionTakenLabel}</h2>
            <p className="mt-1 text-sm text-gray-600">
              {incident.action_taken
                ? ACTION_TAKEN_LABELS[incident.action_taken]?.[lang] ?? incident.action_taken
                : "—"}
            </p>
          </div>

          {incident.transcript && (
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="text-sm font-medium text-gray-700">{t.incident.narrativeLabel}</h2>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{incident.transcript}</p>
            </div>
          )}
        </>
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

        {communications.length === 0 && (
          <AddCommunicationForm incidentId={incident.id} blockId={incident.block_id} />
        )}
      </div>
    </div>
  );
}
