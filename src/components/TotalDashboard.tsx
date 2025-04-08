import { useMemo } from "react";
import { EurobonusCharts } from "./charts/eurobonus/EurobonusCharts";
import type { Transaction } from "../models/transaction";
import type { Profile } from "../models/profile";
import { Spinner } from "@blueprintjs/core";
import useFetchTotalTransactions from "../hooks/useFetchTotalTransactions";
import { calculateTotalEuroBonusPoints } from "../utils/calculations";

export const TotalDashboard = () => {
  const { data, loading } = useFetchTotalTransactions();

  const profile: Profile = useMemo(() => ({ id: "1", display_name: "All Users", created: new Date(2025, 1, 20).toISOString(), user_id: "1" }), []);
  const transactions: Transaction[] = useMemo(
    () => (data ? data.map(x => ({ ...x, date: new Date(x.year, 1, 1).toISOString(), profile_id: profile.id, user_id: profile.user_id! })) : []),
    [data]
  );

  const sum = useMemo(() => calculateTotalEuroBonusPoints(transactions), [transactions]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      {sum > 0 && <p>{`Users have earned a total of ${sum.toLocaleString()} eurobonus points since 2017`}</p>}
      <EurobonusCharts transactions={transactions} profiles={[profile]} hideTable />
    </>
  );
};
