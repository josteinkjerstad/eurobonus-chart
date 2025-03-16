import { useMemo } from "react";
import useFetchProfiles from "../hooks/useFetchProfiles";
import useFetchTransactions from "../hooks/useFetchTransactions";
import { Charts } from "./charts/Charts";
import type { Transaction } from "../models/transaction";
import type { Profile } from "../models/profile";
import { Spinner } from "@blueprintjs/core";
import { calculateTotalBonusPoints, getEarliestDate } from "../utils/calculations";

export const UserDashboard = () => {
  const { data, loading } = useFetchTransactions();
  const { data: profilesData, loading: profileLoading } = useFetchProfiles();

  const transactions: Transaction[] = useMemo(() => (data ? data : []), [data]);

  const profiles: Profile[] = useMemo(() => (profilesData ? profilesData : []), [profilesData]);

  const sum = useMemo(() => calculateTotalBonusPoints(transactions), [transactions]);
  const earliestdate = useMemo(() => getEarliestDate(transactions), [transactions]);

  if (loading || profileLoading) {
    return <Spinner />;
  }
  if (transactions.length === 0) {
    return (
      <p>
        Oops, no data found - <a href="/profile">upload your data here</a>.
      </p>
    );
  }

  return (
    <>
      {sum > 0 && <p>{`You've earned a total of ${sum.toLocaleString()} eurobonus points since ${earliestdate}`}</p>}
      <Charts transactions={transactions} profiles={profiles} />;
    </>
  );
};
