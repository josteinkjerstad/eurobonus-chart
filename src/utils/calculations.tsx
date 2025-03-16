import { Partner } from "../models/partners";
import type { Profile } from "../models/profile";
import type { PeopleTransaction, QualifyingTransaction, Transaction, VendorTransaction, YearlyTransaction } from "../models/transaction";
import { type Vendor, type GroupVendor, groupedVendors } from "../models/vendor";
import { findVendor } from "./partner-lookups";

export const calculateTotalBonusPoints = (transactions: Transaction[]): number => {
  return transactions
    .filter(x => x.bonus_points)
    .reduce((acc, transaction) => {
      if (transaction.bonus_points! < 0 || transaction.activity?.includes("Refund")) {
        return acc;
      }
      return acc + transaction.bonus_points!;
    }, 0);
};

export const calculateTotalBonusPointsByProfile = (transactions: Transaction[]): PeopleTransaction[] => {
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.profile_id]) {
      acc[transaction.profile_id] = {
        profile_id: transaction.profile_id,
        value: 0,
      };
    }
    if (transaction.bonus_points && transaction.bonus_points > 0 && !transaction.activity?.includes("Refund")) {
      acc[transaction.profile_id].value += transaction.bonus_points;
    }
    return acc;
  }, {} as Record<string, PeopleTransaction>);

  return Object.values(groupedTransactions).sort((a, b) => b.value - a.value);
};

export const groupTransactionsByVendor = (transactions: Transaction[]): Record<Vendor, Transaction[]> => {
  const allVendors = Object.values(groupedVendors)
    .flatMap(x => x)
    .concat(Partner.Unknown);

  return transactions
    .filter(x => x.activity && x.bonus_points && x.bonus_points > 0 && !x.activity?.includes("Refund"))
    .reduce((acc, transaction) => {
      const vendor = allVendors.find(vendor => transaction.activity.includes(vendor)) ?? findVendor(transaction);
      (acc[vendor] ??= []).push(transaction);
      return acc;
    }, {} as Record<Vendor, Transaction[]>);
};

export const getUnknownTransactions = (transactions: Transaction[]): Set<string> => {
  const vendorTransactions = groupTransactionsByVendor(transactions);
  return new Set(vendorTransactions[Partner.Unknown].map(f => f.activity));
};

export const calculateVendorTransactions = (transactions: Transaction[]): VendorTransaction[] => {
  const vendorTransactions = groupTransactionsByVendor(transactions);

  return Object.entries(vendorTransactions).flatMap(([vendor, transactions]) => {
    const group = Object.entries(groupedVendors).find(([, vendors]) => vendors.includes(vendor as Vendor))?.[0] as GroupVendor;
    return transactions.map(transaction => ({
      year: new Date(transaction.date).getFullYear(),
      vendor: vendor as Vendor,
      value: transaction.bonus_points!,
      group: group,
      profile_id: transaction.profile_id,
    }));
  });
};

export const getEarliestDate = (transactions: Transaction[]): string | null => {
  if (transactions.length === 0) {
    return null;
  }
  return new Date(Math.min(...transactions.map(transaction => new Date(transaction.date).getTime()))).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

export const calculateYearlyPoints = (transactions: Transaction[]): YearlyTransaction[] => {
  const yearlyPoints: Record<number, { earned: number; spent: number }> = {};
  const uniqueNegativeTransactions = new Set<string>();

  transactions
    .filter(x => !!x.bonus_points)
    .forEach(transaction => {
      const year = new Date(transaction.date).getFullYear();
      if (!yearlyPoints[year]) {
        yearlyPoints[year] = { earned: 0, spent: 0 };
      }
      if (transaction.bonus_points) {
        if (transaction.bonus_points > 0 && !transaction.activity?.includes("Refund")) {
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

export const calculateQualifyingTransactions = (transactions: Transaction[], profiles: Profile[]): QualifyingTransaction[] => {
  return profiles
    .flatMap(profile => {
      const periodTransactions = transactions
        .filter(transaction => transaction.profile_id === profile.id && transaction.level_points)
        .reduce((acc, transaction) => {
          const date = new Date(transaction.date);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const periodLabel = month >= (profile.periode_start_month ?? 1) ? `${year} / ${year + 1}` : `${year - 1} / ${year}`;

          acc[periodLabel] = (acc[periodLabel] || 0) + transaction.level_points!;
          return acc;
        }, {} as Record<string, number>);

      return Object.entries(periodTransactions).map(([period, value]) => ({
        period,
        value,
        profile_id: profile.id,
      }));
    })
    .reverse();
};
