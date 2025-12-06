import { useMemo } from "react";
import useFetchProfiles from "../hooks/useFetchProfiles";
import useFetchTransactions from "../hooks/useFetchTransactions";
import { EurobonusCharts } from "./charts/eurobonus/EurobonusCharts";
import { Spinner } from "@blueprintjs/core";
import { calculateTotalEuroBonusPoints, getEarliestDate, getLatestDate } from "../utils/calculations";
import { Tooltip, IconButton } from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

export const EurobonusDashboard = () => {
  const { data, loading } = useFetchTransactions();
  const { data: profilesData, loading: profileLoading } = useFetchProfiles();

  const transactions = useMemo(() => (data ? data : []), [data]);
  const profiles = useMemo(() => (profilesData ? profilesData : []), [profilesData]);
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
