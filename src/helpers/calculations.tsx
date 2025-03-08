import type { Transaction } from "../models/transaction";
import { Partner, CreditCardPartner, RentalCarPartner, EurobonusShopPartner, AirlinePartner, NewspaperPartner } from "../models/Partners";
import type { Vendor } from "../models/vendor";

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

export const calculateVendorPoints = (
  transactions: Transaction[]
): Record<string, number> => {
  const vendorPoints: Record<string, number> = {};

  const allVendors = [
    ...Object.values(Partner),
    ...Object.values(CreditCardPartner),
    ...Object.values(RentalCarPartner),
    ...Object.values(EurobonusShopPartner),
    ...Object.values(NewspaperPartner),
    ...Object.values(AirlinePartner),
  ];

  allVendors.forEach(vendor => {
    vendorPoints[vendor] = 0;
  });

  console.log(allVendors);

  transactions
    .filter(x => x.bonus_points && x.bonus_points > 0 && !x.activity?.includes("Refund"))
    .forEach(transaction => {
      const activity = transaction.activity!;
      const bonusPoints = transaction.bonus_points!;

      const vendor = allVendors.find(vendor => activity.includes(vendor));
      if (vendor) {
        vendorPoints[vendor] += bonusPoints;
      } else if (isSasOrConsciousTraveler(transaction)) {
        vendorPoints[Partner.SasFlights] += bonusPoints;
      } else if (isPartnerFlight(activity)) {
        const key = getPartnerFlightKey(activity);
        console.log(key);
        vendorPoints[key!] += bonusPoints;
      } else if (activity.startsWith("ra ")) {
        vendorPoints[RentalCarPartner.Avis] += bonusPoints;
      }
      else {
        console.log(`Unknown vendor: ${activity}`);
        vendorPoints[Partner.Other] += bonusPoints;
      }
    });

  return vendorPoints;
};