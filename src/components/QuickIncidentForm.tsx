"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { CATEGORY_LABELS } from "@/lib/i18n/dictionary";
import { INCIDENT_CATEGORIES, type IncidentCategory, type IncidentScope } from "@/lib/types";
import { AudioRecorder } from "./AudioRecorder";

export function QuickIncidentForm({ blockId }: { blockId: string }) {
  const { t, lang } = useLanguage();
  const router = useRouter();

  const [scope, setScope] = useState<IncidentScope>("package");
  const [tba, setTba] = useState("");
  const [category, setCategory] = useState<IncidentCategory>(INCIDENT_CATEGORIES[0]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  async function handleSave() {
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
        .insert({ block_id: blockId, category })
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

      const uploads: { type: "audio" | "photo"; file: Blob; mime: string; name: string }[] = [];
      if (audioBlob) {
        uploads.push({ type: "audio", file: audioBlob, mime: "audio/webm", name: "incident-audio.webm" });
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
      setAudioBlob(null);
      setPhotoFile(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.auth.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="text-sm font-medium text-gray-700">{t.incident.quickCapture}</h2>

      <div>
        <p className="mb-1 text-sm text-gray-600">{t.incident.scope}</p>
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

      <AudioRecorder onRecorded={setAudioBlob} />

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
