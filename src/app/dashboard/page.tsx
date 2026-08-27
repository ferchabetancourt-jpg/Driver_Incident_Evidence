import { createClient } from "@/lib/supabase/server";
import type { Block, Incident } from "@/lib/types";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: activeBlock } = await supabase
    .from("blocks")
    .select("*, stations(*)")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: recentIncidents } = await supabase
    .from("incidents")
    .select("*, incident_packages(packages(*)), evidence(*)")
    .order("occurred_at", { ascending: false })
    .limit(10);

  return (
    <DashboardClient
      activeBlock={(activeBlock as Block) ?? null}
      recentIncidents={(recentIncidents as Incident[]) ?? []}
    />
  );
}
