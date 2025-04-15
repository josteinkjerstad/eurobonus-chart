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

  if (!user_id) {
    return new Response("Missing user_id", { status: 400 });
  }

  const { data: profiles } = await supabase.from("profiles").select("user_id").eq("public", true).eq("user_id", user_id);

  if (!profiles || profiles.length === 0) {
    return new Response(JSON.stringify([]), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", profiles?.at(0)?.user_id)
    .order("created", { ascending: true });

  if (error) {
    return new Response(`Error fetching transactions: ${error.message}`, {
      status: 500,
    });
  }

  return new Response(JSON.stringify(transactions), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
