export const prerender = false;
import type { APIRoute } from "astro";
import * as XLSX from "xlsx";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const transactions = jsonData.slice(1).map((row: any) => ({
    user_id: "1",
    date: new Date(row[0]),
    activity: row[1] || null,
    bonus_points: parseInt(row[2], 10) || 0,
    level_points: parseInt(row[3], 10) || 0,
    profile_id: "1",
  }));

  return new Response(JSON.stringify(transactions), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
