import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CommunicationRecord, EvidenceRecord, Incident } from "@/lib/types";
import { IncidentDetailClient } from "./IncidentDetailClient";

export default async function IncidentDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: incident } = await supabase
    .from("incidents")
    .select("*, blocks(*, stations(*)), incident_packages(packages(*))")
    .eq("id", params.id)
    .single();

  if (!incident) notFound();

  const [{ data: evidence }, { data: communications }] = await Promise.all([
    supabase.from("evidence").select("*").eq("incident_id", params.id).order("created_at"),
    supabase.from("communications").select("*").eq("incident_id", params.id).order("created_at"),
  ]);

  const evidenceWithUrls = await Promise.all(
    ((evidence as EvidenceRecord[]) ?? []).map(async (item) => {
      const { data: signed } = await supabase.storage
        .from("evidence")
        .createSignedUrl(item.storage_path, 60 * 60);
      return {
        id: item.id,
        type: item.type,
        url: signed?.signedUrl ?? null,
        original_filename: item.original_filename,
      };
    })
  );

  return (
    <IncidentDetailClient
      incident={incident as Incident}
      evidenceWithUrls={evidenceWithUrls}
      communications={(communications as CommunicationRecord[]) ?? []}
    />
  );
}
