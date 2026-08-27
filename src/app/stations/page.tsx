import { createClient } from "@/lib/supabase/server";
import type { Station } from "@/lib/types";
import { StationsClient } from "./StationsClient";

export default async function StationsPage() {
  const supabase = createClient();
  const { data: stations } = await supabase
    .from("stations")
    .select("*")
    .order("created_at", { ascending: false });

  return <StationsClient stations={(stations as Station[]) ?? []} />;
}
