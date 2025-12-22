import { useMemo } from "react";
import useFetchProfiles from "../hooks/useFetchProfiles";
import type { Profile } from "../models/profile";
import { calculateTotalViatrumfPoints } from "../utils/calculations";
import useFetchViatrumfTransactions from "../hooks/useFetchViatrumfTransactions";
import type { ViatrumfTransaction } from "../models/viatrumf_transaction";
import { ViatrumfCharts } from "./charts/viatrumf/ViatrumfCharts";
import { getEarliestViatrumfDate, getLatestViatrumfDate } from "../utils/viatrumf-calculations";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

export const ViatrumfDashboard = () => {
  const { data: viatrumfData, loading } = useFetchViatrumfTransactions();
  const { data: profilesData, loading: profileLoading } = useFetchProfiles();

  const transactions: ViatrumfTransaction[] = useMemo(() => (viatrumfData ? viatrumfData : []), [viatrumfData]);
  const profiles: Profile[] = useMemo(() => (profilesData ? profilesData : []), [profilesData]);

  const sum = useMemo(() => calculateTotalViatrumfPoints(transactions), [transactions]);
  const earliestdate = useMemo(() => getEarliestViatrumfDate(transactions), [transactions]);
  const latestDate = useMemo(() => getLatestViatrumfDate(transactions), [transactions]);

  if (loading || profileLoading) {
    return <CircularProgress />;
  }
  if (transactions.length === 0) {
    return (
      <p>
        Oops, no data found - <a href="/profile/?tab=upload">upload your data here</a>
      </p>
    );
  }

  return (
    <ViatrumfCharts
      transactions={transactions}
      profiles={profiles}
      headerLeft={
        <>
          <strong>Trumf Earned:&nbsp;</strong> {sum.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          <Tooltip
            title={
              <>
                {`Total trumf that has been transfered since ${earliestdate}`}
                <br />
                Last Transaction: {latestDate}
              </>
            }
            arrow
            disableInteractive
          >
            <IconButton size="small" style={{ marginLeft: 4 }}>
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      }
    />
  );
};
