"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createBlock(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const station_id = String(formData.get("station_id") ?? "");
  const block_date = String(formData.get("block_date") ?? "");
  const start_time = String(formData.get("start_time") ?? "");
  const end_time = String(formData.get("end_time") ?? "").trim() || null;
  const pay_amount_raw = String(formData.get("pay_amount") ?? "").trim();
  const pay_amount = pay_amount_raw ? Number(pay_amount_raw) : null;

  if (!station_id || !block_date || !start_time) {
    throw new Error("Station, date, and start time are required");
  }
  if (pay_amount_raw && (Number.isNaN(pay_amount) || pay_amount! < 0)) {
    throw new Error("Pay amount must be a non-negative number");
  }

  const { data, error } = await supabase
    .from("blocks")
    .insert({
      user_id: user.id,
      station_id,
      block_date,
      start_time,
      end_time,
      pay_amount,
      source: "manual",
    })
    .select("id")
    .single();

  if (error) throw error;

  revalidatePath("/blocks");
  revalidatePath("/dashboard");
  redirect(`/blocks/${data.id}`);
}

export async function deleteBlock(blockId: string, redirectPath?: string) {
  const supabase = createClient();

  const { error } = await supabase.from("blocks").delete().eq("id", blockId);
  if (error) throw error;

  revalidatePath("/blocks");
  revalidatePath("/dashboard");
  if (redirectPath) redirect(redirectPath);
}
