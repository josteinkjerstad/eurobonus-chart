import type { Transaction, VendorTransaction } from "../models/transaction";
import { Partner, CreditCardPartner, RentalCarPartner, EurobonusShopPartner, AirlinePartner, NewspaperPartner, HotelPartner } from "../models/partners";
import { type Vendor, type GroupVendor, groupedVendors } from "../models/vendor";
import { act } from "react";

export const calculateTotalBonusPoints = (
  transactions: Transaction[]
): number => {
  return transactions.filter(x => x.bonus_points).reduce((acc, transaction) => {
    if (transaction.bonus_points! < 0) {
      return acc;
    }

    if (transaction.activity?.includes("Refund")) {
      return acc;
    }
    return acc + transaction.bonus_points!;
  }, 0);
};

const isSasOrConsciousTraveler = (transaction: Transaction): boolean => {
  const activity = transaction.activity!;
  switch (true) {
    case activity.includes("SK") && transaction.level_points && transaction.level_points > 0:
    case activity.includes("Conscious Traveler Reward"):
    case activity.includes("SASBIOFUEL"):
    case activity.includes("Biofuel"):
    case activity.includes("BEP old"):
    case activity.includes("SAS Special Accrual"):
    case activity.includes("Buy Extra Points"):
    case activity.includes("Claim | Points Earned"):
      return true;
    default:
      return false;
  }
};

const isRadisson = (transaction: Transaction): boolean => {
  const activity = transaction.activity!;
  switch (true) {
    case activity.includes("Radisson Hotels | Points Earned"):
    case activity.includes("Rezidor SAS"):
      return true;
    default:
      return false;
  }
};

const isPartnerFlight = (activity: string): boolean => {
  return Object.keys(AirlinePartner).some(key => activity.includes(`| ${key}`));
};

const getPartnerFlightKey = (activity: string): string | undefined => {
  const key = Object.keys(AirlinePartner).find(key => activity.includes(`| ${key}`));
  return key ? AirlinePartner[key as keyof typeof AirlinePartner] : undefined;
};

export const calculateVendorTransactions = (
  transactions: Transaction[]
): VendorTransaction[] => {
  const vendorTransactions: Record<string, Transaction[]> = {};

  const allVendors = [
    ...Object.values(Partner),
    ...Object.values(CreditCardPartner),
    ...Object.values(RentalCarPartner),
    ...Object.values(EurobonusShopPartner),
    ...Object.values(NewspaperPartner),
    ...Object.values(AirlinePartner),
    ...Object.values(HotelPartner),
  ];

  allVendors.forEach(vendor => {
    vendorTransactions[vendor] = [];
  });

  transactions
    .filter(x => x.bonus_points && x.bonus_points > 0 && !x.activity?.includes("Refund"))
    .forEach(transaction => {
      const activity = transaction.activity!;
      const vendor = allVendors.find(vendor => activity.includes(vendor));
      if (vendor) {
        vendorTransactions[vendor].push(transaction);
      } else if (isSasOrConsciousTraveler(transaction)) {
        vendorTransactions[Partner.SasFlights].push(transaction);
      } else if (isPartnerFlight(activity)) {
        const key = getPartnerFlightKey(activity);
        vendorTransactions[key!].push(transaction);
      } else if (isRadisson(transaction)) {
        vendorTransactions[HotelPartner.Radisson].push(transaction);
      }
      else if (activity.startsWith("ra ")) {
        vendorTransactions[RentalCarPartner.Avis].push(transaction);
      } else {
        console.error(`Unknown transaction: ${transaction.activity} ${transaction.bonus_points} ${transaction.date}`);
        vendorTransactions[Partner.Other].push(transaction);
      }
    });

  const vendorTransactionList: VendorTransaction[] = Object.entries(vendorTransactions).flatMap(
    ([vendor, transactions]) => {
      const group = Object.entries(groupedVendors).find(([, vendors]) => vendors.includes(vendor as Vendor))?.[0] as GroupVendor;
      return transactions.map(transaction => ({
        year: new Date(transaction.date).getFullYear(),
        vendor: vendor as Vendor,
        value: transaction.bonus_points!,
        group: group
      }));
    }
  );

  return vendorTransactionList;
};