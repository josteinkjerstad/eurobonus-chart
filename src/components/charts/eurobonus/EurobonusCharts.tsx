export const prerender = false;
import {
  calculateQualifyingTransactions,
  calculateTotalEuroBonusPointsByProfile,
  calculateVendorTransactions,
  calculateYearlyPoints,
} from "../../../utils/calculations";
import type { Transaction } from "../../../models/transaction";
import { Tabs, Tab, Card } from "@mui/material";
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
  headerRight?: ReactNode;
};

enum TabsEnum {
  Points = "Points",
  Years = "Years",
  Members = "Members",
  LevelPoints = "LevelPoints",
  Transactions = "Transactions",
}

export const EurobonusCharts = ({ transactions, profiles, hideTable, headerLeft, headerRight }: EurobonusChartsProps) => {
  const vendorPoints = calculateVendorTransactions(transactions);
  const yearlyPoints = calculateYearlyPoints(transactions);
  const peoplePoints = calculateTotalEuroBonusPointsByProfile(transactions);
  const qualifyingPoints = calculateQualifyingTransactions(transactions, profiles);

  const [activeTab, setActiveTab] = React.useState<TabsEnum>(TabsEnum.Points);

  const hideQualifying = qualifyingPoints.length === 0 || !profiles.some(x => x.periode_start_month);
  const hidePeople = peoplePoints.length <= 1;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabsEnum) => {
    setActiveTab(newValue);
  };

  return (
    <Card style={{ marginRight: 5, marginTop: 5, alignSelf: "center", alignContent: "center", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>{headerLeft}</div>
        <div>{headerRight}</div>
      </div>
      <Tabs style={{ marginTop: -10, paddingBottom: 10 }} value={activeTab} onChange={handleTabChange} centered scrollButtons="auto">
        <Tab label="Points" value={TabsEnum.Points} />
        <Tab label="Years" value={TabsEnum.Years} />
        {profiles.length > 1 && <Tab label="Members" value={TabsEnum.Members} />}
        {qualifyingPoints.length >= 1 && profiles.some(x => x.periode_start_month) && <Tab label="Level Points" value={TabsEnum.LevelPoints} />}
        {!hideTable && <Tab label="Transactions" value={TabsEnum.Transactions} />}
      </Tabs>
      {activeTab === TabsEnum.Points && <VendorChart transactions={vendorPoints} profiles={profiles} />}
      {activeTab === TabsEnum.Years && <YearlySpentChart yearlyPoints={yearlyPoints} />}
      {activeTab === TabsEnum.Members && !hidePeople && <PeopleChart transactions={peoplePoints} profiles={profiles} />}
      {activeTab === TabsEnum.LevelPoints && !hideQualifying && <QualifyingPeriodsChart transactions={qualifyingPoints} profiles={profiles} />}
      {activeTab === TabsEnum.Transactions && !hideTable && <TransactionsTable transactions={transactions} profiles={profiles} />}
    </Card>
  );
};
