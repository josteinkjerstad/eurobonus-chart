import { useMemo } from "react";
import useFetchProfiles from "../hooks/useFetchProfiles";
import type { Profile } from "../models/profile";
import { Spinner } from "@blueprintjs/core";
import { calculateTotalViatrumfPoints } from "../utils/calculations";
import useFetchViatrumfTransactions from "../hooks/useFetchViatrumfTransactions";
import type { ViatrumfTransaction } from "../models/viatrumf_transaction";
import { ViatrumfCharts } from "./charts/viatrumf/ViatrumfCharts";
import { getEarliestViatrumfDate, getLatestViatrumfDate } from "../utils/viatrumf-calculations";

export const ViatrumfDashboard = () => {
  const { data: viatrumfData, loading } = useFetchViatrumfTransactions();
  const { data: profilesData, loading: profileLoading } = useFetchProfiles();

  const transactions: ViatrumfTransaction[] = useMemo(() => (viatrumfData ? viatrumfData : []), [viatrumfData]);
  const profiles: Profile[] = useMemo(() => (profilesData ? profilesData : []), [profilesData]);

  const sum = useMemo(() => calculateTotalViatrumfPoints(transactions), [transactions]);
  const earliestdate = useMemo(() => getEarliestViatrumfDate(transactions), [transactions]);
  const latestDate = useMemo(() => getLatestViatrumfDate(transactions), [transactions]);

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
      <h2>Viatrumf </h2>
      {sum > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>{`You've earned a total of kr ${sum.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })} since ${earliestdate}`}</p>
          <p>{`Last transaction date: ${latestDate}`}</p>
        </div>
      )}
      <ViatrumfCharts transactions={transactions} profiles={profiles} />
    </>
  );
};
