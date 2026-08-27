import { createClient } from "@/lib/supabase/server";
import type { Block, Incident } from "@/lib/types";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: recentBlocks } = await supabase
    .from("blocks")
    .select("*, stations(*)")
    .order("block_date", { ascending: false })
    .order("start_time", { ascending: false })
    .limit(5);

  const { data: recentIncidents } = await supabase
    .from("incidents")
    .select("*, incident_packages(packages(*)), evidence(*)")
    .order("occurred_at", { ascending: false })
    .limit(10);

  return (
    <DashboardClient
      recentBlocks={(recentBlocks as Block[]) ?? []}
      recentIncidents={(recentIncidents as Incident[]) ?? []}
    />
  );
}
