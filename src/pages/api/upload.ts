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

  const { data: latestTransaction, error: latestError } = await supabase
    .from("transactions")
    .select("date")
    .eq("user_id", userId)
    .eq("profile_id", profileId)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (latestError && latestError.code !== "PGRST116") {
    // Ignore "no rows" error
    return new Response(`Error fetching latest transaction: ${latestError.message}`, {
      status: 500,
    });
  }

  const latestDate = latestTransaction?.date || null;

  if (latestDate) {
    const { error: deleteError } = await supabase
      .from("transactions")
      .delete()
      .eq("user_id", userId)
      .eq("profile_id", profileId)
      .gte("date", latestDate);

    if (deleteError) {
      return new Response(`Error deleting transactions: ${deleteError.message}`, {
        status: 500,
      });
    }
  }

  const transactions: Transaction[] = jsonData
    .slice(1)
    .map((row: any) => ({
      user_id: userId,
      date: new Date(row[0]).toISOString(),
      activity: row[1] || null,
      bonus_points: parseInt(row[2], 10) || 0,
      level_points: parseInt(row[3], 10) || 0,
      profile_id: profileId,
    }))
    .filter(t => !latestDate || new Date(t.date) >= new Date(latestDate));

  if (transactions.length > 0) {
    const { error } = await supabase.from("transactions").insert(transactions);

    if (error) {
      return new Response(`Error uploading transactions: ${error.message}`, {
        status: 500,
      });
    }
  }

  const unknownTransactions = Array.from(getUnknownTransactions(transactions));

  if (unknownTransactions.length !== 0) {
    await supabase.from("unknown_transactions").insert(unknownTransactions.map(t => ({ activity: t })));
  }

  return redirect("/dashboard");
};
