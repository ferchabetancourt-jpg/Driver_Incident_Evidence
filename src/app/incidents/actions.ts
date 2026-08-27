"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addCommunication(incidentId: string, formData: FormData) {
  const supabase = createClient();

  const type = String(formData.get("type") ?? "support_call");
  const summary = String(formData.get("summary") ?? "").trim() || null;
  const reference = String(formData.get("reference") ?? "").trim() || null;

  const { error } = await supabase.from("communications").insert({
    incident_id: incidentId,
    type,
    summary,
    reference,
  });
  if (error) throw error;

  revalidatePath(`/incidents/${incidentId}`);
}
