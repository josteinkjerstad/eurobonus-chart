export const prerender = false;
import type { APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { SummarizedTransaction, Transaction, VendorTransaction } from "../../models/transaction";
import type { Profile } from "../../models/profile";
import { calculateVendorTransactions, groupTransactionsByVendor } from "../../utils/calculations";

export const GET: APIRoute = async ({ request, cookies }) => {
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

  const { data, error } = await supabase.from("summarized_transactions").select();

  if (error) {
    return new Response(`Error fetching transactions: ${error.message}`, {
      status: 500,
    });
  }

  const profile: Profile = { id: "1", display_name: "All Users", created: new Date(2025, 1, 20).toISOString(), user_id: "1" };

  const transactions: Transaction[] = data
    ? data.map(x => ({ ...x, user_id: profile.user_id!, profile_id: profile.id, date: new Date(x.year, 1, 1).toISOString() }))
    : [];

  const groupedByVendor = groupTransactionsByVendor(transactions);

  const summarizedTransactions = Object.entries(groupedByVendor).flatMap(([vendor, vendorTransactions]) => {
    const groupedByYear = vendorTransactions.reduce((acc, transaction) => {
      const year = new Date(transaction.date).getFullYear();
      if (!acc[year]) {
        acc[year] = {
          year,
          activity: vendor,
          bonus_points: 0,
        };
      }
      acc[year].bonus_points += transaction.bonus_points || 0;
      return acc;
    }, {} as Record<number, SummarizedTransaction>);

    return Object.values(groupedByYear);
  });

  return new Response(JSON.stringify(summarizedTransactions), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
