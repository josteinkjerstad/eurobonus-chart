export const prerender = false;
import type { APIRoute } from "astro";
import type { Provider } from "@supabase/supabase-js";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const provider = formData.get("provider")?.toString();
  const validProviders = ["github", "google", "facebook"];

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

  if (provider && validProviders.includes(provider)) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: import.meta.env.REDIRECT_URL,
      },
    });

    if (error) {
      return new Response(error.message, { status: 500 });
    }

    return redirect(data.url);
  }

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  console.log(email, password);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }

  return redirect("/dashboard");
};
