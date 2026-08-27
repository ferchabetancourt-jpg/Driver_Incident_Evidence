import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatStationLabel, type Block, type Incident } from "@/lib/types";
import { QuickIncidentForm } from "@/components/QuickIncidentForm";
import { IncidentList } from "@/components/IncidentList";

export default async function BlockDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: block } = await supabase
    .from("blocks")
    .select("*, stations(*)")
    .eq("id", params.id)
    .single();

  if (!block) notFound();

  const { data: incidents } = await supabase
    .from("incidents")
    .select("*, incident_packages(packages(*)), evidence(*)")
    .eq("block_id", params.id)
    .order("occurred_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/blocks" className="text-sm text-brand-600 hover:underline">
          ← {formatStationLabel((block as Block).stations)}
        </Link>
        <h1 className="text-xl font-semibold">
          {(block as Block).block_date} · {(block as Block).start_time}
        </h1>
      </div>

      <QuickIncidentForm blockId={params.id} />

      <IncidentList incidents={(incidents as Incident[]) ?? []} />
    </div>
  );
}
