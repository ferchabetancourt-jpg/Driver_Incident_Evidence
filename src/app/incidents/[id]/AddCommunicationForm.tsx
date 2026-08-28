"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { COMMUNICATION_TYPE_LABELS } from "@/lib/i18n/dictionary";
import type { CommunicationType } from "@/lib/types";
import { AudioRecorder } from "@/components/AudioRecorder";

export function AddCommunicationForm({ incidentId, blockId }: { incidentId: string; blockId: string }) {
  const { t, lang } = useLanguage();
  const router = useRouter();

  const [type, setType] = useState<CommunicationType>("support_call");
  const [summary, setSummary] = useState("");
  const [reference, setReference] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: commError } = await supabase.from("communications").insert({
        incident_id: incidentId,
        type,
        summary: summary.trim() || null,
        reference: reference.trim() || null,
      });
      if (commError) throw commError;

      if (audioBlob) {
        const mime = audioBlob.type || "audio/webm";
        const extension = mime.split("/")[1]?.split(";")[0] || "webm";
        const path = `${user.id}/${blockId}/${incidentId}/${Date.now()}-communication-audio.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("evidence")
          .upload(path, audioBlob, { contentType: mime });
        if (uploadError) throw uploadError;

        const { error: evidenceError } = await supabase.from("evidence").insert({
          incident_id: incidentId,
          type: "audio",
          storage_path: path,
          mime_type: mime,
          original_filename: `communication-audio.${extension}`,
        });
        if (evidenceError) throw evidenceError;
      }

      setSummary("");
      setReference("");
      setAudioBlob(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.auth.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-xs font-medium uppercase text-gray-500">{t.incident.addCommunication}</h3>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as CommunicationType)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      >
        {Object.entries(COMMUNICATION_TYPE_LABELS).map(([value, labels]) => (
          <option key={value} value={value}>
            {labels[lang]}
          </option>
        ))}
      </select>
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder={t.incident.commSummary}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <AudioRecorder onRecorded={setAudioBlob} />
      <input
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        placeholder={t.incident.commReference}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {saving ? t.incident.saving : t.incident.commSave}
      </button>
    </div>
  );
}
