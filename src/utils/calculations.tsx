import { Status } from "../enums/status";
import { PointBucketRanges, PointBuckets } from "../models/buckets";
import { Partner } from "../models/partners";
import type { Profile } from "../models/profile";
import type { PeopleTransaction, QualifyingTransaction, Transaction, VendorTransaction, YearlyTransaction } from "../models/transaction";
import { type Vendor, type GroupVendor, groupedVendors } from "../models/vendor";
import type { ViatrumfTransaction } from "../models/viatrumf_transaction";
import { findVendor, isRefund } from "./partner-lookups";

export const calculateTotalEuroBonusPoints = (transactions: Transaction[]): number => {
  return transactions
    .filter(x => x.bonus_points)
    .reduce((acc, transaction) => {
      if (transaction.bonus_points! < 0 || isRefund(transaction.activity)) {
        return acc;
      }
      return acc + transaction.bonus_points!;
    }, 0);
};

export const calculateTotalViatrumfPoints = (transactions: ViatrumfTransaction[]): number => {
  return transactions
    .filter(x => x.status === Status.Transferred)
    .reduce((acc, transaction) => {
      return acc + transaction.trumf_bonus!;
    }, 0);
};

export const calculateTotalEuroBonusPointsByProfile = (transactions: Transaction[]): PeopleTransaction[] => {
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.profile_id]) {
      acc[transaction.profile_id] = {
        profile_id: transaction.profile_id,
        value: 0,
      };
    }
    if (transaction.bonus_points && transaction.bonus_points > 0 && !isRefund(transaction.activity)) {
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
    .filter(x => x.activity && x.bonus_points && x.bonus_points > 0 && !isRefund(x.activity))
    .reduce((acc, transaction) => {
      const vendor = allVendors.find(vendor => transaction.activity.includes(vendor)) ?? findVendor(transaction);
      (acc[vendor] ??= []).push(transaction);
      return acc;
    }, {} as Record<Vendor, Transaction[]>);
};

export const getUnknownTransactions = (transactions: Transaction[]): Set<string> => {
  const vendorTransactions = groupTransactionsByVendor(transactions);
  return new Set(vendorTransactions[Partner.Unknown]?.map(f => f.activity) ?? []);
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

export const getLatestDate = (transactions: Transaction[]): string | null => {
  if (transactions.length === 0) {
    return null;
  }
  return new Date(Math.max(...transactions.map(transaction => new Date(transaction.date).getTime()))).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
        if (transaction.bonus_points > 0 && !isRefund(transaction.activity)) {
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

export const CalculateCurrentYearEstimatedPoints = (yearlyPoints: YearlyTransaction[]): number => {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31);
  const daysElapsed = Math.floor((new Date().getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const totalDaysInYear = Math.floor((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const pointsThisYear = yearlyPoints.find(x => x.year === currentYear)?.earned || 0;
  return Math.round((pointsThisYear / daysElapsed) * totalDaysInYear);
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
    .sort((a, b) => {
      const [startYearA] = a.period.split(" / ").map(Number);
      const [startYearB] = b.period.split(" / ").map(Number);
      return startYearB - startYearA;
    })
    .reverse();
};

export const calculateAverages = (points: number[]) => {
  if (points.length === 0) return { average: 0, median: 0, lowest: 0, highest: 0 };

  const total = points.reduce((sum, point) => sum + point, 0);
  const average = Math.round(total / points.length);

  const sortedPoints = [...points].sort((a, b) => a - b);
  const mid = Math.floor(sortedPoints.length / 2);
  const median = sortedPoints.length % 2 === 0 ? Math.round((sortedPoints[mid - 1] + sortedPoints[mid]) / 2) : sortedPoints[mid];

  const lowest = Math.min(...points);
  const highest = Math.max(...points);

  return { average, median, lowest, highest };
};

export const groupPointsByRange = (points: number[]): Record<PointBuckets, number> => {
  const buckets: Record<PointBuckets, number> = Object.keys(PointBucketRanges).reduce((acc, bucket) => {
    acc[bucket as PointBuckets] = 0;
    return acc;
  }, {} as Record<PointBuckets, number>);

  points.forEach(point => {
    for (const [bucket, [min, max]] of Object.entries(PointBucketRanges)) {
      if (point >= min && (max === null || point <= max)) {
        buckets[bucket as PointBuckets]++;
        break;
      }
    }
  });

  return buckets;
};
