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

type ChartsProps = {
  transactions: Transaction[];
  profiles: Profile[];
};

export const Charts = ({ transactions, profiles }: ChartsProps) => {
  const vendorPoints = calculateVendorTransactions(transactions);
  const yearlyPoints = calculateYearlyPoints(transactions);
  const peoplePoints = calculateTotalBonusPointsByProfile(transactions);
  const qualifyingPoints = calculateQualifyingTransactions(transactions, profiles);

  return (
    <>
      <Card elevation={Elevation.TWO} style={{ marginTop: 5, alignSelf: "center", alignContent: "center" }}>
        <Tabs>
          <Tab id="points" title="Points" panel={<VendorChart transactions={vendorPoints} profiles={profiles} />} />
          <Tab id="years" title="Years" panel={<YearlySpentChart yearlyPoints={yearlyPoints} />} />
          {profiles.length > 1 && <Tab id="people" title="People" panel={<PeopleChart transactions={peoplePoints} profiles={profiles} />} />}
          {qualifyingPoints.length > 1 && profiles.some(x => x.periode_start_month) && (
            <Tab id="qualifying" title="Level Points" panel={<QualifyingPeriodsChart transactions={qualifyingPoints} profiles={profiles} />} />
          )}
        </Tabs>
      </Card>
    </>
  );
};
