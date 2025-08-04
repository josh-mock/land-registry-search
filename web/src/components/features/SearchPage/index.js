"use client";

import Result from "@/components/features/Result";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/ui/Loading";

export default function SearchPage({ searchType }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    async function fetchResult() {
      setLoading(true);
      try {
        const res = await axios.get(`api/${searchType}/search`, {
          params: { query },
        });

        setResult({ type: searchType, data: res.data });
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || "Network error");
        setResult(null);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [query, searchType]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : error ? (
        <p>{error}</p>
      ) : (
        result && <Result result={result} />
      )}
    </div>
  );
}
