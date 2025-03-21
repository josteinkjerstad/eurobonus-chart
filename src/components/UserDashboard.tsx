import { useMemo } from "react";
import useFetchProfiles from "../hooks/useFetchProfiles";
import useFetchTransactions from "../hooks/useFetchTransactions";
import { Charts } from "./charts/Charts";
import type { Transaction } from "../models/transaction";
import type { Profile } from "../models/profile";
import { Spinner } from "@blueprintjs/core";
import { calculateTotalBonusPoints, getEarliestDate, getLatestDate } from "../utils/calculations";
import useFetchViatrumfTransactions from "../hooks/useFetchViatrumfTransactions";
import type { ViatrumfTransaction } from "../models/viatrumf_transaction";

export const UserDashboard = () => {
  const { data, loading } = useFetchTransactions();
  const { data: viatrumfData, loading: viatrumfLoading } = useFetchViatrumfTransactions();
  const { data: profilesData, loading: profileLoading } = useFetchProfiles();

  const transactions: Transaction[] = useMemo(() => (data ? data : []), [data]);
  const viatrumfTransactions: ViatrumfTransaction[] = useMemo(() => (viatrumfData ? viatrumfData : []), [viatrumfData]);

  const profiles: Profile[] = useMemo(() => (profilesData ? profilesData : []), [profilesData]);

  const sum = useMemo(() => calculateTotalBonusPoints(transactions), [transactions]);
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
      <h2>Hi, </h2>
      {sum > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>{`You've earned a total of ${sum.toLocaleString()} eurobonus points since ${earliestdate}`}</p>
          <p>{`Last transaction date: ${latestDate}`}</p>
        </div>
      )}
      <Charts transactions={transactions} viatrumfTransactions={viatrumfTransactions} profiles={profiles} />
    </>
  );
};
