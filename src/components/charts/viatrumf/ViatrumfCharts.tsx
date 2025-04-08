export const prerender = false;
import { Tabs, Tab, Card, Elevation } from "@blueprintjs/core";
import type { Profile } from "../../../models/profile";
import type { ViatrumfTransaction } from "../../../models/viatrumf_transaction";
import { calculateViatrumfVendorTransactions } from "../../../utils/viatrumf-calculations";
import { ViatrumfVendorChart } from "./ViatrumfVendorChart";
import { ViatrumfTransactionsTable } from "./ViatrumfTransactionsTable";

type ViatrumfChartsProps = {
  transactions: ViatrumfTransaction[];
  profiles: Profile[];
};

export const ViatrumfCharts = ({ transactions, profiles }: ViatrumfChartsProps) => {
  const viatrumfVendorPoints = calculateViatrumfVendorTransactions(transactions);

  return (
    <>
      <Card elevation={Elevation.TWO} style={{ marginRight: 5, marginTop: 5, alignSelf: "center", alignContent: "center" }}>
        <Tabs>
          <Tab id="viatrumf" title="Points" panel={<ViatrumfVendorChart transactions={viatrumfVendorPoints} profiles={profiles} />} />
          <Tab id="transactions" title="Transactions" panel={<ViatrumfTransactionsTable transactions={transactions} />} />
        </Tabs>
      </Card>
    </>
  );
};
