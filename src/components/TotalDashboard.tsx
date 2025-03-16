import { useMemo } from "react";
import { Charts } from "./charts/Charts";
import type { Transaction } from "../models/transaction";
import type { Profile } from "../models/profile";
import { Spinner } from "@blueprintjs/core";
import useFetchTotalTransactions from "../hooks/useFetchTotalTransactions";
import { calculateTotalBonusPoints } from "../utils/calculations";

export const TotalDashboard = () => {
  const { data, loading } = useFetchTotalTransactions();

  const profile: Profile = useMemo(() => ({ id: "1", display_name: "All Users", created: new Date(2025, 1, 20).toISOString(), user_id: "1" }), []);

  const transactions: Transaction[] = useMemo(
    () => (data ? data.map(x => ({ ...x, user_id: profile.user_id!, profile_id: profile.id, date: new Date(x.year, 1, 1).toISOString() })) : []),
    [data]
  );

  const sum = useMemo(() => calculateTotalBonusPoints(transactions), [transactions]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      {sum > 0 && <p>{`Users have earned a total of ${sum.toLocaleString()} eurobonus points since 2017`}</p>}
      <Charts transactions={transactions} profiles={[profile]} />
    </>
  );
};
