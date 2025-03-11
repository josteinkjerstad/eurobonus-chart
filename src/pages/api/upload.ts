export const prerender = false;
import type { APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import * as XLSX from "xlsx";
import { getUnknownTransactions } from "../../utils/calculations";
import type { Transaction } from "../../models/transaction";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const profileId = formData.get("profile_id") as string;

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  if (!profileId) {
    return new Response("No profile ID provided", { status: 400 });
  }

  const supabase = createServerClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookies.set(name, value, options));
      },
    },
  });

  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    return new Response("User not authenticated", { status: 401 });
  }

  const transactions: Transaction[] = jsonData.slice(1).map((row: any) => ({
    user_id: userId,
    date: new Date(row[0]).toISOString(),
    activity: row[1] || null,
    bonus_points: parseInt(row[2], 10) || 0,
    level_points: parseInt(row[3], 10) || 0,
    profile_id: profileId,
  }));

  await supabase.from("transactions").delete().eq("user_id", userId).eq("profile_id", profileId);

  const { error } = await supabase.from("transactions").insert(transactions);

  const unknownTransactions = getUnknownTransactions(transactions);

  console.log(unknownTransactions);

  const { error: unknownError } = await supabase.from("unknown_transactions").insert(
    unknownTransactions.map(activity => ({
      activity: activity,
    }))
  );

  if (unknownError) {
    console.log(unknownError);
  }

  if (error) {
    return new Response(`Error uploading transactions: ${error.message}`, {
      status: 500,
    });
  }

  return redirect("/dashboard");
};
