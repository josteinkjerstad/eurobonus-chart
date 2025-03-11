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

  const { display_name } = await request.json();
  const { error } = await supabase.from("profiles").update({ display_name }).eq("user_id", userId);

  if (error) {
    return new Response(`Error updating profile: ${error.message}`, {
      status: 500,
    });
  }

  return new Response("Profile updated successfully!", { status: 200 });
};
