export const prerender = false;
import {
  calculateQualifyingTransactions,
  calculateTotalBonusPointsByProfile,
  calculateVendorTransactions,
  calculateYearlyPoints,
} from "../../utils/calculations";
import type { Transaction } from "../../models/transaction";
import { Tabs, Tab, Card, Elevation } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { VendorChart } from "./VendorChart";
import { YearlySpentChart } from "./YearlySpentChart";
import { PeopleChart } from "./PeopleChart";
import { QualifyingPeriodsChart } from "./QualifyingPeriodsChart";
import type { ViatrumfTransaction } from "../../models/viatrumf_transaction";
import { calculateViatrumfVendorTransactions } from "../../utils/viatrumf-calculations";
import { ViatrumfVendorChart } from "./ViatrumfVendorChart";

type ChartsProps = {
  transactions: Transaction[];
  viatrumfTransactions?: ViatrumfTransaction[];
  profiles: Profile[];
};

export const Charts = ({ transactions, viatrumfTransactions, profiles }: ChartsProps) => {
  const vendorPoints = calculateVendorTransactions(transactions);
  const yearlyPoints = calculateYearlyPoints(transactions);
  const peoplePoints = calculateTotalBonusPointsByProfile(transactions);
  const qualifyingPoints = calculateQualifyingTransactions(transactions, profiles);
  const viatrumfVendorPoints = calculateViatrumfVendorTransactions(viatrumfTransactions ?? []);

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
          {viatrumfVendorPoints.length >= 1 && (
            <Tab id="viatrumf" title="Viatrumf" panel={<ViatrumfVendorChart transactions={viatrumfVendorPoints} profiles={profiles} />} />
          )}
        </Tabs>
      </Card>
    </>
  );
};
