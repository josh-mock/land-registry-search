"use client";

import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import styles from "./Result.module.css";
import Pagination from "./Pagination";
import Table from "./Table";
import configs from "./configs";

export default function Result({ result }) {
  const config = configs[result.type];
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const summaryData = config.getSummaryData(result);
  const tableData = config.getTableData(result);
  const resultCount = tableData.length;

  const table = useReactTable({
    columns: config.tableColumns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: "onChange",
    state: { pagination, sorting, globalFilter },
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  if (!summaryData) {
    return (
      <div className={`${styles.result} container`}>
        <h1 className={styles.result__title}>Search Result</h1>
        <p
          className={`${styles.result__summary} ${styles.result__summaryError}`}
        >
          {config.noResultMsg}.
        </p>
      </div>
    );
  }
  return (
    <div className={`${styles.result} container`}>
      <h1 className={styles.result__title}>Search Result</h1>
      {config.renderSummary?.(summaryData, tableData)}

      {resultCount > 10 && (
        <Pagination
          table={table}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}

      <Table
        tableInstance={table}
        resultCount={resultCount}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </div>
  );
}
