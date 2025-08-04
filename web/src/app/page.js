"use client";

import Tabs from "@/components/features/Tabs";
import Result from "@/components/features/Result";
import useResultStore from "@/store/resultStore";
import Loading from "@/components/ui/Loading";

export default function Home() {
  const result = useResultStore((s) => s.resultData);
  const loading = useResultStore((s) => s.loading);

  return (
    <div>
      <Tabs />
      {loading ? <Loading /> : result && <Result result={result} />}
    </div>
  );
}
