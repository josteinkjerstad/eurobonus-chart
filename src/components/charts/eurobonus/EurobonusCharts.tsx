export const prerender = false;
import {
  CalculateCurrentYearEstimatedPoints,
  calculateQualifyingTransactions,
  calculateTotalEuroBonusPointsByProfile,
  calculateVendorTransactions,
  calculateYearlyPoints,
} from "../../../utils/calculations";
import type { Transaction } from "../../../models/transaction";
import { Tabs, Tab, Card, Box } from "@mui/material";
import type { Profile } from "../../../models/profile";
import { PeopleChart } from "./PeopleChart";
import { QualifyingPeriodsChart } from "./QualifyingPeriodsChart";
import { VendorChart } from "./VendorChart";
import { YearlySpentChart } from "./YearlySpentChart";
import { TransactionsTable } from "./TransactionsTable";
import React, { type ReactNode } from "react";

type EurobonusChartsProps = {
  transactions: Transaction[];
  profiles: Profile[];
  hideTable?: boolean;
  headerLeft?: ReactNode;
};

enum TabsEnum {
  Points = "Points",
  Years = "Years",
  Members = "Members",
  LevelPoints = "LevelPoints",
  Transactions = "Transactions",
}

export const EurobonusCharts = ({ transactions, profiles, hideTable, headerLeft }: EurobonusChartsProps) => {
  const vendorPoints = calculateVendorTransactions(transactions);
  const yearlyPoints = calculateYearlyPoints(transactions);
  const peoplePoints = calculateTotalEuroBonusPointsByProfile(transactions);
  const qualifyingPoints = calculateQualifyingTransactions(transactions, profiles);

  const [activeTab, setActiveTab] = React.useState<TabsEnum>(TabsEnum.Points);

  const hideQualifying = qualifyingPoints.length === 0;
  const hidePeople = peoplePoints.length <= 1;

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
          {!hidePeople && <Tab label="Members" value={TabsEnum.Members} />}
          {!hideQualifying && <Tab label="Level Points" value={TabsEnum.LevelPoints} />}
          {!hideTable && <Tab label="Transactions" value={TabsEnum.Transactions} />}
        </Tabs>
      </Box>
      {activeTab === TabsEnum.Points && <VendorChart transactions={vendorPoints} profiles={profiles} />}
      {activeTab === TabsEnum.Years && <YearlySpentChart yearlyPoints={yearlyPoints} />}
      {activeTab === TabsEnum.Members && !hidePeople && <PeopleChart transactions={peoplePoints} profiles={profiles} />}
      {activeTab === TabsEnum.LevelPoints && !hideQualifying && <QualifyingPeriodsChart transactions={qualifyingPoints} profiles={profiles} />}
      {activeTab === TabsEnum.Transactions && !hideTable && <TransactionsTable transactions={transactions} profiles={profiles} />}
    </Card>
  );
};
