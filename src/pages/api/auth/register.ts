export const prerender = false;
import type { APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response(JSON.stringify({ message: "Email and password are required." }), { status: 400 });
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

  const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: import.meta.env.REDIRECT_URL } });

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }

  return redirect("/signin");
};
