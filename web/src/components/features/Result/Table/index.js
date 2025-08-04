import React from "react";
import styles from "./Table.module.css";

export default function Table({
  tableInstance,
  globalFilter,
  setGlobalFilter,
  resultCount,
}) {
  return (
    <>
      {resultCount > 10 && (
        <input
          type="text"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Filter..."
          className="input"
        />
      )}
      <table className={`${styles.result__table} table`}>
        <thead>
          {tableInstance.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="table__row">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`${
                    styles[header.column.columnDef.meta?.className] || ""
                  } table__header`}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: "pointer" }}
                >
                  {header.isPlaceholder ? null : (
                    <>
                      {header.column.columnDef.header()}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()] ?? ""}
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {tableInstance.getRowModel().rows.map((row) => (
            <tr key={row.id} className="table__row">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`${
                    styles[cell.column.columnDef.meta?.className] || ""
                  } table__cell`}
                >
                  {cell.column.columnDef.cell(cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
