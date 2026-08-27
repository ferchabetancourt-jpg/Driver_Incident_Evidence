import { createClient } from "@/lib/supabase/server";
import type { Block, Station } from "@/lib/types";
import { BlocksClient } from "./BlocksClient";

export default async function BlocksPage() {
  const supabase = createClient();

  const [{ data: blocks }, { data: stations }] = await Promise.all([
    supabase
      .from("blocks")
      .select("*, stations(*)")
      .order("block_date", { ascending: false })
      .order("start_time", { ascending: false }),
    supabase.from("stations").select("*").eq("active", true).order("name"),
  ]);

  return <BlocksClient blocks={(blocks as Block[]) ?? []} stations={(stations as Station[]) ?? []} />;
}
