import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Block, Incident, Station } from "@/lib/types";
import { QuickIncidentToggle } from "@/components/QuickIncidentToggle";
import { IncidentList } from "@/components/IncidentList";
import { BlockHeader } from "./BlockHeader";

export default async function BlockDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: block } = await supabase
    .from("blocks")
    .select("*, stations(*)")
    .eq("id", params.id)
    .single();

  if (!block) notFound();

  const [{ data: incidents }, { data: stations }] = await Promise.all([
    supabase
      .from("incidents")
      .select("*, incident_packages(packages(*)), evidence(*)")
      .eq("block_id", params.id)
      .order("occurred_at", { ascending: false }),
    supabase.from("stations").select("*").order("name"),
  ]);

  return (
    <div className="space-y-6">
      <BlockHeader block={block as Block} stations={(stations as Station[]) ?? []} />

      <QuickIncidentToggle blockId={params.id} />

      <IncidentList incidents={(incidents as Incident[]) ?? []} />
    </div>
  );
}
