export const prerender = false;
import type { APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export const GET: APIRoute = async ({ request, cookies }) => {
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

  const { data, error } = await supabase.from("profiles").select("*");

  let profiles = data;

  if (profiles?.length === 0) {
    const userId = (await supabase.auth.getUser()).data?.user?.id;
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({ user_id: userId })
      .select()
      .single();
    profiles = [newProfile];
  }

  if (error) {
    return new Response(`Error fetching profiles: ${error.message}`, {
      status: 500,
    });
  }

  return new Response(JSON.stringify(profiles), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
