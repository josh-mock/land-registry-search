import { NextResponse } from "next/server";
import { query as dbQuery } from "@/app/lib/db";
import * as yup from "yup";

const configs = {
  company: {
    schema: yup
      .string()
      .required("Company name is required")
      .max(255, "Company name is too long")
      .matches(
        /^[\p{L}\p{N} &]+$/u,
        "Only letters, numbers, spaces, and '&' allowed"
      ),
    subjectSql: "SELECT * FROM proprietors WHERE proprietor_name = $1",
    subjectKey: "proprietor",
    subjectNotFound: "Proprietor not found",
    resultsSql:
      "SELECT titles.* FROM titles_proprietors JOIN titles ON titles.id = titles_proprietors.title_id WHERE titles_proprietors.proprietor_id = $1",
    resultsKey: "titles",
  },
  title: {
    schema: yup
      .string()
      .required("Title number is required")
      .max(16, "Maximum 16 characters allowed")
      .matches(/^[A-Za-z0-9]+$/, "Only letters and numbers allowed"),
    subjectSql: "SELECT * FROM titles WHERE title = $1",
    subjectKey: "title",
    subjectNotFound: "Title not found",
    resultsSql:
      "SELECT proprietors.* FROM titles_proprietors JOIN proprietors ON proprietors.id = titles_proprietors.proprietor_id WHERE titles_proprietors.title_id = $1",
    resultsKey: "proprietors",
  },
};

export async function GET(req, { params }) {
  const { searchType } = await params;
  const config = configs[searchType];

  const { searchParams } = new URL(req.url);
  const rawQuery = searchParams.get("query") || "";
  const queryValue = rawQuery.trim().toUpperCase();

  try {
    await config.schema.validate(queryValue, { abortEarly: false });

    const {
      rows: [subject],
    } = await dbQuery(config.subjectSql, [queryValue]);

    if (!subject) {
      return NextResponse.json(
        { error: [config.subjectNotFound] },
        { status: 404 }
      );
    }

    const { rows: results } = await dbQuery(config.resultsSql, [subject.id]);

    return NextResponse.json(
      { [config.subjectKey]: subject, [config.resultsKey]: results },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errorMessages = err.errors;
      return NextResponse.json(
        { success: false, errors: errorMessages },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
