export const prerender = false;
import type { APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { ViatrumfTransaction } from "../../models/viatrumf_transaction";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const transactionsData = JSON.parse(formData.get("viatrumf_transactions") as string) as ViatrumfTransaction[];
  const profileId = formData.get("profile_id") as string;

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

  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    return new Response("User not authenticated", { status: 401 });
  }

  const transactions = transactionsData.map(transaction => ({
    ...transaction,
    user_id: userId,
  }));

  await supabase.from("viatrumf_transactions").delete().eq("user_id", userId).eq("profile_id", profileId);

  const { error } = await supabase.from("viatrumf_transactions").insert(transactions);

  if (error) {
    return new Response(`Error uploading transactions: ${error.message}`, {
      status: 500,
    });
  }
  return redirect("/dashboard");
};
