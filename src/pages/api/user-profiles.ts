export const prerender = false;
import type { APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export const GET: APIRoute = async ({ request, cookies, url }) => {
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

  const user_id = new URL(url).searchParams.get("user_id");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("public", true)
    .or(`user_id.eq.${user_id},parent_id.eq.${user_id}`)
    .order("created", { ascending: true });

  if (error) {
    return new Response(`Error fetching profiles: ${error.message}`, {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
