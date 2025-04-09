export const prerender = false;
import { calculateVendorTransactions, calculateYearlyPoints, groupPointsByRange } from "../../../utils/calculations";
import type { Transaction } from "../../../models/transaction";
import { Tabs, Tab, Card, Box } from "@mui/material";
import { VendorChart } from "./VendorChart";
import { YearlySpentChart } from "./YearlySpentChart";
import { PercentileChart } from "./PercentileChart";
import React, { type ReactNode } from "react";
import type { Profile } from "../../../models/profile";

type TotalChartsProps = {
  transactions: Transaction[];
  summedTransactions: number[];
  profiles: Profile[];
  headerLeft?: ReactNode;
};

enum TabsEnum {
  Points = "Points",
  Years = "Years",
  Percentile = "Percentile",
}

export const TotalCharts = ({ transactions, summedTransactions, profiles, headerLeft }: TotalChartsProps) => {
  const [activeTab, setActiveTab] = React.useState<TabsEnum>(TabsEnum.Points);

  const vendorPoints = calculateVendorTransactions(transactions);
  const yearlyPoints = calculateYearlyPoints(transactions);
  const groupedSums = groupPointsByRange(summedTransactions);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabsEnum) => {
    setActiveTab(newValue);
  };

  return (
    <Card style={{ marginRight: 5, marginTop: 5, alignSelf: "center", alignContent: "center", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center" }}>{headerLeft}</div>
      <Box display="flex" justifyContent="center" width="100%">
        <Tabs
          style={{ paddingBottom: 10 }}
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Points" value={TabsEnum.Points} />
          <Tab label="Years" value={TabsEnum.Years} />
          <Tab label="Percentile" value={TabsEnum.Percentile} />
        </Tabs>
      </Box>
      {activeTab === TabsEnum.Points && <VendorChart transactions={vendorPoints} profiles={profiles} />}
      {activeTab === TabsEnum.Years && <YearlySpentChart yearlyPoints={yearlyPoints} />}
      {activeTab === TabsEnum.Percentile && <PercentileChart groupedSums={groupedSums} />}
    </Card>
  );
};
