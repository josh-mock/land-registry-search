"use client";
import { useState } from "react";
import Form from "../Form";
import TopTen from "../TopTen"; 
import styles from "./Tabs.module.css";

const tabs = [
  {
    name: "companyTab",
    label: "Company Search",
    component: <Form searchType={"company"} />,
  },
  {
    name: "titleTab",
    label: "Title Search",
    component: <Form searchType={"title"} />,
  },
  { name: "topTenTab", label: "10 Largest Proprietors", component: <TopTen /> },
];

export default function Tabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  return (
    <div className={`${styles.tabs} container`}>
      <div className={`${styles.tabs__buttons} container`}>
        {tabs.map((tab, index) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`btn ${activeTab !== tab.name ? "btn--inactive" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {tabs.map((tab) =>
          activeTab === tab.name ? (
            <div key={tab.name}>{tab.component}</div>
          ) : null
        )}
      </div>
    </div>
  );
}
