import { createClient } from "@/lib/supabase/server";
import type { Incident, Station } from "@/lib/types";
import { SearchClient } from "./SearchClient";

interface SearchPageProps {
  searchParams: { date?: string; station_id?: string; tba?: string; category?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = createClient();

  const { data: stations } = await supabase.from("stations").select("*").order("name");

  const { date, station_id, tba, category } = searchParams;
  const searched = Boolean(date || station_id || tba || category);

  let results: Incident[] = [];

  if (searched) {
    let incidentIdsFromTba: string[] | null = null;

    if (tba) {
      const { data: matchingPackages } = await supabase
        .from("packages")
        .select("id")
        .ilike("tba", `%${tba}%`);

      const packageIds = (matchingPackages ?? []).map((p) => p.id);
      if (packageIds.length === 0) {
        incidentIdsFromTba = [];
      } else {
        const { data: links } = await supabase
          .from("incident_packages")
          .select("incident_id")
          .in("package_id", packageIds);
        incidentIdsFromTba = [...new Set((links ?? []).map((l) => l.incident_id))];
      }
    }

    if (!incidentIdsFromTba || incidentIdsFromTba.length > 0) {
      let query = supabase
        .from("incidents")
        .select("*, blocks!inner(*, stations(*)), incident_packages(packages(*)), evidence(*)")
        .order("occurred_at", { ascending: false });

      if (date) query = query.eq("blocks.block_date", date);
      if (station_id) query = query.eq("blocks.station_id", station_id);
      if (category) query = query.eq("category", category);
      if (incidentIdsFromTba) query = query.in("id", incidentIdsFromTba);

      const { data } = await query;
      results = (data as Incident[]) ?? [];
    }
  }

  return (
    <SearchClient stations={(stations as Station[]) ?? []} results={results} searched={searched} />
  );
}
