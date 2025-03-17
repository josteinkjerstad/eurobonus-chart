export const prerender = false;
import type { APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData();
  const newPassword = formData.get("newPassword")?.toString();

  if (!newPassword) {
    return new Response(JSON.stringify({ message: "New password is required." }), { status: 400 });
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

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ message: "Password updated successfully." }), { status: 200 });
};
