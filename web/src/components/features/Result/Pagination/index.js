import styles from "./Pagination.module.css";

export default function Pagination({ table, pagination, setPagination }) {
  return (
    <div className={styles.pagination}>
      <div className={styles.pagination__group}>
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="btn"
        >
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="btn"
        >
          {"<"}
        </button>
      </div>
      <span>
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount().toLocaleString()}
      </span>
      <div className={styles.pagination__group}>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="btn"
        >
          {">"}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className="btn"
        >
          {">>"}
        </button>
      </div>
      <select
        value={pagination.pageSize}
        onChange={(e) =>
          setPagination((old) => ({
            ...old,
            pageSize: Number(e.target.value),
            pageIndex: 0,
          }))
        }
      >
        {[10, 25, 50, 100].map((size) => (
          <option key={size} value={size}>
            Show {size}
          </option>
        ))}
      </select>
    </div>
  );
}
