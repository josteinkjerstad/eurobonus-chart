export const prerender = false;
import type { APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export const DELETE: APIRoute = async ({ request, cookies, redirect }) => {
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

  const { error } = await supabase.from("transactions").delete().eq("user_id", userId);
  const { error: profileError } = await supabase.from("profiles").delete().or(`user_id.eq.${userId},parent_id.eq.${userId}`);

  if (error || profileError) {
    return new Response(`Error deleting transactions`, {
      status: 500,
    });
  }

  await supabase.auth.signOut();
  return redirect("/signin");

  return new Response("Transactions deleted successfully!", { status: 200 });
};
