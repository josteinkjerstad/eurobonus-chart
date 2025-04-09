import { useMemo } from "react";
import { EurobonusCharts } from "./charts/eurobonus/EurobonusCharts";
import type { Transaction } from "../models/transaction";
import type { Profile } from "../models/profile";
import { Spinner } from "@blueprintjs/core";
import useFetchTotalTransactions from "../hooks/useFetchTotalTransactions";
import { calculateAveragePoints, calculateTotalEuroBonusPoints } from "../utils/calculations";
import { useSummarizedPoints } from "../hooks/useSummarizedPoints";
import { IconButton, Tooltip } from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

export const TotalDashboard = () => {
  const { data, loading } = useFetchTotalTransactions();
  const { data: summarizedPoints, error } = useSummarizedPoints();

  const profile: Profile = useMemo(() => ({ id: "1", display_name: "All Users", created: new Date(2025, 1, 20).toISOString(), user_id: "1" }), []);
  const transactions: Transaction[] = useMemo(
    () => (data ? data.map(x => ({ ...x, date: new Date(x.year, 1, 1).toISOString(), profile_id: profile.id, user_id: profile.user_id! })) : []),
    [data]
  );

  const sum = useMemo(() => calculateTotalEuroBonusPoints(transactions), [transactions]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const average = calculateAveragePoints(summarizedPoints);

  return (
    <EurobonusCharts
      transactions={transactions}
      profiles={[profile]}
      hideTable
      headerLeft={
        <>
          <strong>Points Earned:&nbsp;</strong>
          {sum.toLocaleString()}
          <Tooltip
            title={
              <>
                Total points all signed in users have earned since 2017 <br />
                Avg per user: {average.toLocaleString()}
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
