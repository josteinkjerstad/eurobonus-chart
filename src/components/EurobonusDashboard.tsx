import { useMemo } from "react";
import useFetchProfiles from "../hooks/useFetchProfiles";
import useFetchTransactions from "../hooks/useFetchTransactions";
import { EurobonusCharts } from "./charts/eurobonus/EurobonusCharts";
import type { Transaction } from "../models/transaction";
import type { Profile } from "../models/profile";
import { Spinner } from "@blueprintjs/core";
import { calculateTotalEuroBonusPoints, getEarliestDate, getLatestDate } from "../utils/calculations";

export const EurobonusDashboard = () => {
  const { data, loading } = useFetchTransactions();
  const { data: profilesData, loading: profileLoading } = useFetchProfiles();

  const transactions: Transaction[] = useMemo(() => (data ? data : []), [data]);
  const profiles: Profile[] = useMemo(() => (profilesData ? profilesData : []), [profilesData]);
  const sum = useMemo(() => calculateTotalEuroBonusPoints(transactions), [transactions]);
  const earliestdate = useMemo(() => getEarliestDate(transactions), [transactions]);
  const latestDate = useMemo(() => getLatestDate(transactions), [transactions]);

  if (loading || profileLoading) {
    return <Spinner />;
  }
  if (transactions.length === 0) {
    return (
      <p>
        Oops, no data found - <a href="/profile">upload your data here</a>
      </p>
    );
  }

  return (
    <>
      <h2>Eurobonus </h2>
      {sum > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>{`You've earned a total of ${sum.toLocaleString()} eurobonus points since ${earliestdate}`}</p>
          <p>{`Last transaction date: ${latestDate}`}</p>
        </div>
      )}
      <EurobonusCharts transactions={transactions} profiles={profiles} />
    </>
  );
};
