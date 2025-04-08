export const prerender = false;
import {
  calculateQualifyingTransactions,
  calculateTotalEuroBonusPointsByProfile,
  calculateVendorTransactions,
  calculateYearlyPoints,
} from "../../../utils/calculations";
import type { Transaction } from "../../../models/transaction";
import { Tabs, Tab, Card, Elevation } from "@blueprintjs/core";
import type { Profile } from "../../../models/profile";
import { PeopleChart } from "./PeopleChart";
import type { ViatrumfTransaction } from "../../../models/viatrumf_transaction";
import { calculateViatrumfVendorTransactions } from "../../../utils/viatrumf-calculations";
import { ViatrumfVendorChart } from "../viatrumf/ViatrumfVendorChart";
import { QualifyingPeriodsChart } from "./QualifyingPeriodsChart";
import { VendorChart } from "./VendorChart";
import { YearlySpentChart } from "./YearlySpentChart";
import { TransactionsTable } from "./TransactionsTable";

type EurobonusChartsProps = {
  transactions: Transaction[];
  profiles: Profile[];
};

export const EurobonusCharts = ({ transactions, profiles }: EurobonusChartsProps) => {
  const vendorPoints = calculateVendorTransactions(transactions);
  const yearlyPoints = calculateYearlyPoints(transactions);
  const peoplePoints = calculateTotalEuroBonusPointsByProfile(transactions);
  const qualifyingPoints = calculateQualifyingTransactions(transactions, profiles);

  return (
    <>
      <Card elevation={Elevation.TWO} style={{ marginRight: 5, marginTop: 5, alignSelf: "center", alignContent: "center" }}>
        <Tabs>
          <Tab id="points" title="Points" panel={<VendorChart transactions={vendorPoints} profiles={profiles} />} />
          <Tab id="years" title="Years" panel={<YearlySpentChart yearlyPoints={yearlyPoints} />} />
          {profiles.length > 1 && <Tab id="people" title="Members" panel={<PeopleChart transactions={peoplePoints} profiles={profiles} />} />}
          {qualifyingPoints.length >= 1 && profiles.some(x => x.periode_start_month) && (
            <Tab id="qualifying" title="Level Points" panel={<QualifyingPeriodsChart transactions={qualifyingPoints} profiles={profiles} />} />
          )}
          <Tab id="transactions" title="Transactions" panel={<TransactionsTable transactions={transactions} profiles={profiles} />} />
        </Tabs>
      </Card>
    </>
  );
};
