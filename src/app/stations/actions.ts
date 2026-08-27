"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createStation(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const name = String(formData.get("name") ?? "").trim();
  const station_code = String(formData.get("station_code") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;

  if (!name) throw new Error("Station name is required");

  const { error } = await supabase.from("stations").insert({
    user_id: user.id,
    name,
    station_code,
    address,
  });
  if (error) throw error;

  revalidatePath("/stations");
}

export async function toggleStationActive(stationId: string, active: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from("stations").update({ active }).eq("id", stationId);
  if (error) throw error;
  revalidatePath("/stations");
}
