import { useEffect, useMemo, useState } from "react";
import { EurobonusCharts } from "./charts/eurobonus/EurobonusCharts";
import type { Transaction } from "../models/transaction";
import type { Profile } from "../models/profile";
import { Spinner } from "@blueprintjs/core";
import { calculateTotalEuroBonusPoints, getEarliestDate, getLatestDate } from "../utils/calculations";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { IconButton, Tooltip } from "@mui/material";
import useFetchPublicProfiles from "../hooks/useFetchPublicProfiles";
import useFetchPublicTransactions from "../hooks/useFetchPublicTransactions";

type PublicDashboardProps = {
  userId: string;
};

export const PublicDashboard = ({ userId }: PublicDashboardProps) => {
  const { data: profilesData, loading: profileLoading } = useFetchPublicProfiles(userId);
  const { data, loading } = useFetchPublicTransactions(userId);

  const transactions: Transaction[] = useMemo(() => (data ? data : []), [data]);
  const profiles: Profile[] = useMemo(() => (profilesData ? profilesData : []), [profilesData]);
  const sum = useMemo(() => calculateTotalEuroBonusPoints(transactions), [transactions]);
  const earliestdate = useMemo(() => getEarliestDate(transactions), [transactions]);
  const latestDate = useMemo(() => getLatestDate(transactions), [transactions]);

  if (loading || profileLoading) {
    return <Spinner />;
  }

  if (transactions.length === 0 || profiles.length === 0) {
    return;
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
