"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { ACTION_TAKEN_LABELS, CATEGORY_LABELS } from "@/lib/i18n/dictionary";
import {
  ACTION_TAKEN_OPTIONS,
  INCIDENT_CATEGORIES,
  type ActionTaken,
  type IncidentCategory,
  type IncidentScope,
} from "@/lib/types";
import { AudioRecorder } from "./AudioRecorder";

type NarrativeMode = "audio" | "text";

function audioUpload(blob: Blob, name: string) {
  const mime = blob.type || "audio/webm";
  const extension = mime.split("/")[1]?.split(";")[0] || "webm";
  return { type: "audio" as const, file: blob, mime, name: `${name}.${extension}` };
}

export function QuickIncidentForm({
  blockId,
  onSaved,
  onCancel,
}: {
  blockId: string;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const { t, lang } = useLanguage();
  const router = useRouter();

  const [scope, setScope] = useState<IncidentScope>("package");
  const [tba, setTba] = useState("");
  const [category, setCategory] = useState<IncidentCategory>(INCIDENT_CATEGORIES[0]);
  const [actionTaken, setActionTaken] = useState<ActionTaken | null>(null);
  const [narrativeMode, setNarrativeMode] = useState<NarrativeMode>("audio");
  const [narrativeText, setNarrativeText] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [commSummary, setCommSummary] = useState("");
  const [commReference, setCommReference] = useState("");
  const [commAudioBlob, setCommAudioBlob] = useState<Blob | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const needsComm = actionTaken === "called_support" || actionTaken === "emailed_amazon";

  async function handleSave() {
    if (!actionTaken) {
      setError(t.incident.actionTakenRequired);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: incident, error: incidentError } = await supabase
        .from("incidents")
        .insert({
          block_id: blockId,
          category,
          action_taken: actionTaken,
          transcript: narrativeMode === "text" && narrativeText.trim() ? narrativeText.trim() : null,
        })
        .select("id")
        .single();
      if (incidentError) throw incidentError;

      if (scope === "package" && tba.trim()) {
        const { data: existingPackage } = await supabase
          .from("packages")
          .select("id")
          .eq("block_id", blockId)
          .eq("tba", tba.trim())
          .maybeSingle();

        let packageId = existingPackage?.id as string | undefined;

        if (!packageId) {
          const { data: newPackage, error: packageError } = await supabase
            .from("packages")
            .insert({ block_id: blockId, tba: tba.trim() })
            .select("id")
            .single();
          if (packageError) throw packageError;
          packageId = newPackage.id;
        }

        const { error: linkError } = await supabase
          .from("incident_packages")
          .insert({ incident_id: incident.id, package_id: packageId });
        if (linkError) throw linkError;
      }

      if (needsComm && (commSummary.trim() || commReference.trim() || commAudioBlob)) {
        const { error: commError } = await supabase.from("communications").insert({
          incident_id: incident.id,
          type: actionTaken === "called_support" ? "support_call" : "driver_email",
          summary: commSummary.trim() || null,
          reference: commReference.trim() || null,
        });
        if (commError) throw commError;
      }

      const uploads: { type: "audio" | "photo"; file: Blob; mime: string; name: string }[] = [];
      if (narrativeMode === "audio" && audioBlob) {
        uploads.push(audioUpload(audioBlob, "incident-audio"));
      }
      if (needsComm && commAudioBlob) {
        uploads.push(audioUpload(commAudioBlob, "communication-audio"));
      }
      if (photoFile) {
        uploads.push({ type: "photo", file: photoFile, mime: photoFile.type, name: photoFile.name });
      }

      for (const upload of uploads) {
        const path = `${user.id}/${blockId}/${incident.id}/${Date.now()}-${upload.name}`;
        const { error: uploadError } = await supabase.storage
          .from("evidence")
          .upload(path, upload.file, { contentType: upload.mime });
        if (uploadError) throw uploadError;

        const { error: evidenceError } = await supabase.from("evidence").insert({
          incident_id: incident.id,
          type: upload.type,
          storage_path: path,
          mime_type: upload.mime,
          original_filename: upload.name,
        });
        if (evidenceError) throw evidenceError;
      }

      setSavedAt(Date.now());
      setTba("");
      setActionTaken(null);
      setNarrativeText("");
      setAudioBlob(null);
      setPhotoFile(null);
      setCommSummary("");
      setCommReference("");
      setCommAudioBlob(null);
      router.refresh();
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.auth.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700">{t.incident.quickCapture}</h2>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm text-slate">
            {t.common.cancel}
          </button>
        )}
      </div>

      {/* Paquete */}
      <div className="space-y-2 border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate">{t.incident.sectionPackage}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setScope("package")}
            className={`rounded-md px-3 py-2 text-sm ${
              scope === "package" ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {t.incident.scopePackage}
          </button>
          <button
            type="button"
            onClick={() => setScope("block")}
            className={`rounded-md px-3 py-2 text-sm ${
              scope === "block" ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {t.incident.scopeBlock}
          </button>
        </div>
        {scope === "package" && (
          <div>
            <label className="block text-sm text-gray-600">{t.incident.tba}</label>
            <input
              value={tba}
              onChange={(e) => setTba(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        )}
      </div>

      {/* Qué pasó */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate">{t.incident.sectionWhatHappened}</p>
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
          <div className="mb-1 flex gap-2">
            <button
              type="button"
              onClick={() => setNarrativeMode("audio")}
              className={`rounded-md px-3 py-1.5 text-sm ${
                narrativeMode === "audio" ? "bg-navy text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {t.incident.narrativeAudio}
            </button>
            <button
              type="button"
              onClick={() => setNarrativeMode("text")}
              className={`rounded-md px-3 py-1.5 text-sm ${
                narrativeMode === "text" ? "bg-navy text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {t.incident.narrativeText}
            </button>
          </div>
          {narrativeMode === "audio" ? (
            <AudioRecorder onRecorded={setAudioBlob} />
          ) : (
            <textarea
              value={narrativeText}
              onChange={(e) => setNarrativeText(e.target.value)}
              placeholder={t.incident.narrativePlaceholder}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          )}
        </div>
      </div>

      {/* Qué hiciste */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate">{t.incident.sectionWhatYouDid}</p>
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

        {needsComm && (
          <div className="space-y-2 rounded-md bg-brand-50 p-3">
            <p className="text-xs font-medium uppercase text-slate">{t.incident.addCommunication}</p>
            <textarea
              value={commSummary}
              onChange={(e) => setCommSummary(e.target.value)}
              placeholder={t.incident.commSummary}
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <AudioRecorder onRecorded={setCommAudioBlob} />
            <input
              value={commReference}
              onChange={(e) => setCommReference(e.target.value)}
              placeholder={t.incident.commReference}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        )}
      </div>

      {/* Evidencia */}
      <div className="space-y-2 border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate">{t.incident.sectionEvidence}</p>
        <div>
          <label className="block text-sm text-gray-600">{t.incident.photo}</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {savedAt && !error && <p className="text-sm text-green-700">{t.incident.saved}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {saving ? t.incident.saving : t.incident.save}
      </button>
    </div>
  );
}
