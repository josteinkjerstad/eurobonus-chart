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

  const { profile_id, month } = await request.json();
  const { error } = await supabase.from("profiles").update({ periode_start_month: month }).eq("id", profile_id);

  if (error) {
    console.log(error);
    return new Response(`Error updating profile: ${error.message}`, {
      status: 500,
    });
  }

  return new Response("Profile updated successfully!", { status: 200 });
};
