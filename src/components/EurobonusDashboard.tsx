import { useMemo } from "react";
import useFetchProfiles from "../hooks/useFetchProfiles";
import useFetchTransactions from "../hooks/useFetchTransactions";
import { EurobonusCharts } from "./charts/eurobonus/EurobonusCharts";
import type { Transaction } from "../models/transaction";
import type { Profile } from "../models/profile";
import { Spinner } from "@blueprintjs/core";
import { calculateTotalEuroBonusPoints, getEarliestDate, getLatestDate } from "../utils/calculations";
import { useSummarizedPoints } from "../hooks/useSummarizedPoints";
import { Tooltip, IconButton } from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

export const EurobonusDashboard = () => {
  const { data, loading } = useFetchTransactions();
  const { data: profilesData, loading: profileLoading } = useFetchProfiles();
  const { data: summarizedPoints, loading: loadingSummarized } = useSummarizedPoints();

  const transactions: Transaction[] = useMemo(() => (data ? data : []), [data]);
  const profiles: Profile[] = useMemo(() => (profilesData ? profilesData : []), [profilesData]);
  const sum = useMemo(() => calculateTotalEuroBonusPoints(transactions), [transactions]);
  const earliestdate = useMemo(() => getEarliestDate(transactions), [transactions]);
  const latestDate = useMemo(() => getLatestDate(transactions), [transactions]);

  if (loading || profileLoading || loadingSummarized) {
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
    <EurobonusCharts
      transactions={transactions}
      profiles={profiles}
      headerLeft={
        <>
          <strong>Points Earned:&nbsp;</strong> {sum.toLocaleString()}
          <Tooltip
            title={
              <>
                {`Total points earned since ${earliestdate}`}
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
