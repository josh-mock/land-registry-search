import { NextResponse } from "next/server";
import { query as dbQuery } from "@/app/lib/db";

const configs = {
  company: {
    sql: `
      SELECT proprietor_name
      FROM proprietors
      WHERE proprietor_name ILIKE $1
      ORDER BY proprietor_name
      LIMIT 10
    `,
    params: (q) => [`${q}%`],
  },
};

export async function GET(req, { params }) {
  const { searchType } = await params;
  const config = configs[searchType];
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.length < 1) {
    return NextResponse.json(
      { error: "Missing search query" },
      { status: 400 }
    );
  }

  if (!config) {
    return NextResponse.json({ error: "Invalid search type" }, { status: 400 });
  }

  try {
    const results = await dbQuery(config.sql, config.params(q));
    return NextResponse.json(results.rows, { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
