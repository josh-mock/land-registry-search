import styles from "../Table/Table.module.css";

export default {
  getSummaryData: (result) => result?.data.proprietor,
  getTableData: (result) => result?.data.titles || [],
  tableColumns: [
    {
      accessorKey: "title",
      header: () => "Title Number",
      enableSorting: true,
      cell: (info) => {
        const title = info.getValue();
        return (
          <a
            href={`/title?query=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="table__link"
          >
            {title}
          </a>
        );
      },
      meta: { className: "col-title" },
    },
    {
      accessorKey: "address",
      header: () => "Address",
      cell: (info) => info.getValue(),
      meta: { className: "col-address" },
    },
    {
      accessorKey: "price",
      header: () => "Price (GBP)",
      cell: (info) => {
        const value = Number(info.getValue());
        return value
          ? new Intl.NumberFormat("en-GB", { style: "decimal" }).format(value)
          : "";
      },
      meta: { className: "col-price" },
    },
  ],
  noResultMsg: "Proprietor not found.",
  renderSummary: (summaryData, tableData) => (
    <>
      <p className={styles.result__summary}>
        {`${summaryData.proprietor_name} is incorporated in ${summaryData.jurisdiction}.`}
      </p>
      <p className={styles.result__summary}>
        {`${
          summaryData.proprietor_name
        } is the proprietor of ${tableData.length.toLocaleString()} ${
          tableData.length === 1 ? "property" : "properties"
        } in the OCOD and CCOD datasets.`}
      </p>
    </>
  ),
};
