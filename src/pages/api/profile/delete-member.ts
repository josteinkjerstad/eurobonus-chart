export const prerender = false;
import type { APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export const DELETE: APIRoute = async ({ request, cookies }) => {
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

  const { id } = await request.json();

  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) {
    console.log(error);
    return new Response(`Error deleting family member: ${error.message}`, {
      status: 500,
    });
  }

  return new Response("Family member deleted successfully!", { status: 200 });
};
