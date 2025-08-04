import styles from "../Table/Table.module.css";

export default {
  getSummaryData: (result) => result?.data?.title,
  getTableData: (result) => result?.data?.proprietors || [],
  tableColumns: [
    {
      accessorKey: "proprietor_name",
      header: () => "Proprietor",
      cell: (info) => {
        const proprietor = info.getValue();
        return (
          <a
            href={`/company?query=${encodeURIComponent(proprietor)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="table__link"
          >
            {proprietor}
          </a>
        );
      },
      meta: { className: "col-proprietor" },
    },
    {
      accessorKey: "jurisdiction",
      header: () => "Jursidiction",
      cell: (info) => info.getValue(),
      meta: { className: "col-jurisdiction" },
    },
  ],
  noResultMsg: "Title not found.",
  renderSummary: (summaryData, tableData) => (
    <>
      <p className={styles.result__summary}>
        {`${summaryData.title} is located at ${summaryData.address}.`}
      </p>

      {summaryData.price && (
        <p className={styles.result__summary}>
          {`${summaryData.title}'s last recorded price was GBP ${Number(
            summaryData.price
          ).toLocaleString("en-GB")}.`}
        </p>
      )}

      <p className={styles.result__summary}>
        {`${summaryData.title} has ${tableData.length.toLocaleString()} ${
          tableData.length === 1 ? "proprietor" : "proprietors"
        } recorded in the OCOD and CCOD datasets.`}
      </p>
    </>
  ),
};
