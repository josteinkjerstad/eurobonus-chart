export const prerender = false;
import {
  calculateTotalBonusPointsByProfile,
  calculateVendorTransactions,
  calculateYearlyPoints,
} from "../../helpers/calculations";
import type { Transaction } from "../../models/transaction";
import { Tabs, Tab, TabsExpander } from "@blueprintjs/core";
import type { Profile } from "../../models/profile";
import { VendorChart } from "./VendorChart";
import { YearlySpentChart } from "./YearlySpentChart";
import { PeopleChart } from "./PeopleChart";

type ChartsProps = {
  transactions: Transaction[];
  profiles: Profile[];
};

export const Charts = ({ transactions, profiles }: ChartsProps) => {
  const vendorPoints = calculateVendorTransactions(transactions);
  const yearlyPoints = calculateYearlyPoints(transactions);
  const peoplePoints = calculateTotalBonusPointsByProfile(transactions);

  return (
    <Tabs>
      <Tab
        id="points"
        title="Points"
        panel={<VendorChart transactions={vendorPoints} profiles={profiles} />}
      />
      <Tab
        id="years"
        title="Years"
        panel={<YearlySpentChart yearlyPoints={yearlyPoints} />}
      />
      {profiles.length > 1 && (
        <Tab
          id="people"
          title="People"
          panel={
            <PeopleChart transactions={peoplePoints} profiles={profiles} />
          }
        />
      )}
    </Tabs>
  );
};
