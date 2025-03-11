import type {
  PeopleTransaction,
  Transaction,
  VendorTransaction,
  YearlyTransaction,
} from "../models/transaction";
import {
  Partner,
  RentalCarPartner,
  HotelPartner,
  CreditCardPartner,
} from "../models/partners";
import {
  type Vendor,
  type GroupVendor,
  groupedVendors,
} from "../models/vendor";
import {
  getPartnerFlightKey,
  getSasKey,
  isPartnerFlight,
  isRadisson,
  isSasTransaction,
} from "./partner-lookups";

export const calculateTotalBonusPoints = (
  transactions: Transaction[]
): number => {
  return transactions
    .filter((x) => x.bonus_points)
    .reduce((acc, transaction) => {
      if (
        transaction.bonus_points! < 0 ||
        transaction.activity?.includes("Refund")
      ) {
        return acc;
      }
      return acc + transaction.bonus_points!;
    }, 0);
};

export const calculateTotalBonusPointsByProfile = (
  transactions: Transaction[]
): PeopleTransaction[] => {
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.profile_id]) {
      acc[transaction.profile_id] = {
        profile_id: transaction.profile_id,
        value: 0,
      };
    }
    if (
      transaction.bonus_points &&
      transaction.bonus_points > 0 &&
      !transaction.activity?.includes("Refund")
    ) {
      acc[transaction.profile_id].value += transaction.bonus_points;
    }
    return acc;
  }, {} as Record<string, PeopleTransaction>);

  return Object.values(groupedTransactions).sort((a, b) => b.value - a.value);
};

export const calculateVendorTransactions = (
  transactions: Transaction[]
): VendorTransaction[] => {
  const vendorTransactions: Record<string, Transaction[]> = {};

  const allVendors = Object.values(groupedVendors)
    .flatMap((x) => x)
    .concat(Partner.Unknown);

  allVendors.forEach((vendor) => {
    vendorTransactions[vendor] = [];
  });

  transactions
    .filter(
      (x) =>
        x.bonus_points && x.bonus_points > 0 && !x.activity?.includes("Refund")
    )
    .forEach((transaction) => {
      const activity = transaction.activity!;
      const vendor = allVendors.find((vendor) => activity.includes(vendor));
      switch (true) {
        case !!vendor:
          vendorTransactions[vendor!].push(transaction);
          break;
        case isSasTransaction(transaction):
          vendorTransactions[getSasKey(transaction)].push(transaction);
          break;
        case isPartnerFlight(activity):
          const partnerKey = getPartnerFlightKey(activity);
          vendorTransactions[partnerKey!].push(transaction);
          break;
        case isRadisson(transaction):
          vendorTransactions[HotelPartner.Radisson].push(transaction);
          break;
        case activity.startsWith("ra "):
          vendorTransactions[RentalCarPartner.Avis].push(transaction);
          break;
        case activity.includes("Amex"):
          vendorTransactions[CreditCardPartner.Amex].push(transaction);
          break;
        case activity.includes("Norgesgruppen"):
          vendorTransactions[Partner.Trumf].push(transaction);
          break;
        default:
          console.log(
            `Unknown transaction: ${transaction.activity} ${transaction.bonus_points} ${transaction.date}`
          );
          vendorTransactions[Partner.Unknown].push(transaction);
          break;
      }
    });

  const vendorTransactionList: VendorTransaction[] = Object.entries(
    vendorTransactions
  ).flatMap(([vendor, transactions]) => {
    const group = Object.entries(groupedVendors).find(([, vendors]) =>
      vendors.includes(vendor as Vendor)
    )?.[0] as GroupVendor;
    return transactions.map((transaction) => ({
      year: new Date(transaction.date).getFullYear(),
      vendor: vendor as Vendor,
      value: transaction.bonus_points!,
      group: group,
      profile_id: transaction.profile_id,
    }));
  });

  return vendorTransactionList;
};

export const getEarliestDate = (transactions: Transaction[]): string | null => {
  if (transactions.length === 0) {
    return null;
  }
  return new Date(
    Math.min(
      ...transactions.map((transaction) => new Date(transaction.date).getTime())
    )
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

export const calculateYearlyPoints = (
  transactions: Transaction[]
): YearlyTransaction[] => {
  const yearlyPoints: Record<number, { earned: number; spent: number }> = {};
  const uniqueNegativeTransactions = new Set<string>();

  transactions
    .filter((x) => !!x.bonus_points)
    .forEach((transaction) => {
      const year = new Date(transaction.date).getFullYear();
      if (!yearlyPoints[year]) {
        yearlyPoints[year] = { earned: 0, spent: 0 };
      }
      if (transaction.bonus_points) {
        if (
          transaction.bonus_points > 0 &&
          !transaction.activity?.includes("Refund")
        ) {
          yearlyPoints[year].earned += transaction.bonus_points;
        } else {
          const transactionKey = `${transaction.activity}-${transaction.bonus_points}-${transaction.date}`;
          if (!uniqueNegativeTransactions.has(transactionKey)) {
            uniqueNegativeTransactions.add(transactionKey);
            yearlyPoints[year].spent += transaction.bonus_points;
          }
        }
      }
    });

  return Object.entries(yearlyPoints).map(([year, { earned, spent }]) => ({
    year: Number(year),
    earned,
    spent: Math.abs(spent),
  }));
};
