import { NextResponse } from "next/server";
import { query as dbQuery } from "@/app/lib/db";

export async function GET() {
  try {
    const q = `
      SELECT p.proprietor_name, mv.titles_count
      FROM proprietors p
      JOIN top_proprietors mv ON mv.proprietor_id = p.id
      ORDER BY mv.titles_count DESC
      LIMIT 10;
    `;
    const { rows: topTen } = await dbQuery(q);
    return NextResponse.json(topTen, { status: 200 });
  } catch (error) {
    console.error("DB query failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
