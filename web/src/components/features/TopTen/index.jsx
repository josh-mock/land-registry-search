"use client";
import React, { useEffect } from "react";
import useResultStore from "@/store/resultStore";
import styles from "./TopTen.module.css";
import Loading from "@/components/ui/Loading";

export default function TopTen() {
  const { topTen, topTenLoading, topTenError, fetchTopTen } = useResultStore();

  useEffect(() => {
    if (!topTen) fetchTopTen();
  }, [topTen, fetchTopTen]);

  if (topTenLoading) return <Loading />;
  if (topTenError)
    return (
      <div className={`${styles.topten} container`}>
        <span className={styles.topten__error}>Error: {topTenError}</span>
      </div>
    );

  if (!topTen) return null;

  return (
    <div className={`${styles.topten} container`}>
      <h2 className="h2">10 Largest Proprietors</h2>
      <table className={`${styles.topten__table} table`}>
        <thead>
          <tr className="table__row">
            <th
              scope="col"
              className={`${styles.topten__column} ${styles.topten__columnCompany} table__header`}
            >
              Company
            </th>
            <th
              scope="col"
              className={`${styles.topten__column} ${styles.topten__columnProperties} table__header`}
            >
              Number of properties
            </th>
          </tr>
        </thead>
        <tbody>
          {topTen.map((proprietor, index) => (
            <tr key={index} className="table__row">
              <td className={`${styles.topten__columnCompany} table__cell`}>
                <a
                  href={`/company?query=${encodeURIComponent(
                    proprietor.proprietor_name
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="table__link"
                >
                  {proprietor.proprietor_name}
                </a>
              </td>
              <td className={`${styles.topten__columnProperties} table__cell`}>
                {Number(proprietor.titles_count).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
