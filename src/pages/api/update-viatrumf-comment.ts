export const prerender = false;
import type { APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export const POST: APIRoute = async ({ request, cookies }) => {
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

  const { transactionId, comment } = await request.json();

  console.log("transactionId", transactionId);
  console.log("comment", comment);
  const { error } = await supabase.from("viatrumf_transactions").update({ comment }).eq("id", transactionId);

  if (error) {
    return new Response(`Error adding comment: ${error.message}`, { status: 500 });
  }

  return new Response("Comment added successfully", { status: 200 });
};
