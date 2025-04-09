export const prerender = false;
import { Tabs, Tab, Card } from "@mui/material";
import type { Profile } from "../../../models/profile";
import type { ViatrumfTransaction } from "../../../models/viatrumf_transaction";
import { calculateViatrumfVendorTransactions } from "../../../utils/viatrumf-calculations";
import { ViatrumfVendorChart } from "./ViatrumfVendorChart";
import { ViatrumfTransactionsTable } from "./ViatrumfTransactionsTable";
import React, { type ReactNode } from "react";

type ViatrumfChartsProps = {
  transactions: ViatrumfTransaction[];
  profiles: Profile[];
  headerLeft?: ReactNode;
};

enum ViatrumfTabsEnum {
  Points = "Points",
  Transactions = "Transactions",
}

export const ViatrumfCharts = ({ transactions, profiles, headerLeft }: ViatrumfChartsProps) => {
  const viatrumfVendorPoints = calculateViatrumfVendorTransactions(transactions);
  const [activeTab, setActiveTab] = React.useState<ViatrumfTabsEnum>(ViatrumfTabsEnum.Points);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: ViatrumfTabsEnum) => {
    setActiveTab(newValue);
  };

  return (
    <Card style={{ marginRight: 5, marginTop: 5, alignSelf: "center", alignContent: "center", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center" }}>{headerLeft}</div>
      <Tabs
        style={{ marginTop: -10, paddingBottom: 10 }}
        value={activeTab}
        onChange={handleTabChange}
        centered
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        <Tab label="Points" value={ViatrumfTabsEnum.Points} />
        <Tab label="Transactions" value={ViatrumfTabsEnum.Transactions} />
      </Tabs>
      {activeTab === ViatrumfTabsEnum.Points && <ViatrumfVendorChart transactions={viatrumfVendorPoints} profiles={profiles} />}
      {activeTab === ViatrumfTabsEnum.Transactions && <ViatrumfTransactionsTable transactions={transactions} />}
    </Card>
  );
};
