export const prerender = false;
import type { APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import * as XLSX from "xlsx";
import { getLocalUserId } from "../../utils/localUser";
import type { Profile } from "../../models/profile";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  const supabase = createServerClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const userId = (import.meta.env.MODE === 'development') ? getLocalUserId() : (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    return new Response("User not authenticated", { status: 401 });
  }


  const transactions = jsonData.slice(1).map((row: any) => ({
    user_id: userId,
    date: new Date(row[0]),
    activity: row[1] || null,
    bonus_points: parseInt(row[2], 10) || 0,
    level_points: parseInt(row[3], 10) || 0,
  }));

  await supabase.from("transactions").delete().eq("user_id", userId);

  const { error } = await supabase.from("transactions").insert(transactions);

  if (error) {
    return new Response(`Error uploading transactions: ${error.message}`, { status: 500 });
  }

  return redirect("/dashboard");
};