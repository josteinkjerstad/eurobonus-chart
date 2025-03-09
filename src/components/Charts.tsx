export const prerender = false
import React, { useState } from "react";
import { VendorChart } from "./VendorChart";
import { YearlySpentChart } from "./YearlySpentChart";
import { calculateVendorTransactions, calculateYearlyPoints } from "../helpers/calculations";
import type { Transaction } from "../models/transaction";
import styles from "./Charts.module.scss";

type ChartsProps = {
  transactions: Transaction[];
};

export const Charts = ({ transactions }: ChartsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const vendorPoints = calculateVendorTransactions(transactions);
  const yearlyPoints = calculateYearlyPoints(transactions);

  const tabs = [
    { label: "Points", content: <VendorChart transactions={vendorPoints} /> },
    { label: "Years", content: <YearlySpentChart yearlyPoints={yearlyPoints}/> },
  ];

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabHeaders}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tabHeader} ${activeTab === index ? styles.active : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {tabs[activeTab].content}
      </div>
    </div>
  );
};
