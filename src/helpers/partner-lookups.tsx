import {
  AirlinePartner,
  ScandinavianAirlinesPartner,
} from "../models/partners";
import type { Transaction } from "../models/transaction";

export const getSasKey = (
  transaction: Transaction
): ScandinavianAirlinesPartner => {
  const activity = transaction.activity!;
  switch (true) {
    case activity.includes("Buy Extra Points"):
    case activity.includes("Buy Basic Points"):
      return ScandinavianAirlinesPartner.PointPurchase;
    case activity.includes("Claim | Points Earned"):
      return ScandinavianAirlinesPartner.Claim;
    case activity.includes("Conscious Traveler Reward"):
      return ScandinavianAirlinesPartner.ConsciousTraveler;
    case activity.includes("SASBIOFUEL"):
    case activity.includes("Biofuel"):
      return ScandinavianAirlinesPartner.BioFuel;
    default:
      return ScandinavianAirlinesPartner.Flights;
  }
};

export const isSasTransaction = (transaction: Transaction): boolean => {
  const activity = transaction.activity!;
  switch (true) {
    case activity.includes("SK") &&
      transaction.level_points &&
      transaction.level_points > 0:
    case activity.includes("Conscious Traveler Reward"):
    case activity.includes("SASBIOFUEL"):
    case activity.includes("Biofuel"):
    case activity.includes("BEP old"):
    case activity.includes("Special Accrual"):
    case activity.includes("Buy Extra Points"):
    case activity.includes("Buy Basic Points"):
    case activity.includes("Claim | Points Earned"):
      return true;
    default:
      return false;
  }
};

export const isPartnerFlight = (activity: string): boolean => {
  return Object.keys(AirlinePartner).some((key) =>
    activity.includes(`| ${key}`)
  );
};

export const getPartnerFlightKey = (activity: string): string | undefined => {
  const key = Object.keys(AirlinePartner).find((key) =>
    activity.includes(`| ${key}`)
  );
  return key ? AirlinePartner[key as keyof typeof AirlinePartner] : undefined;
};

export const isRadisson = (transaction: Transaction): boolean => {
  const activity = transaction.activity!;
  switch (true) {
    case activity.includes("Radisson Hotels | Points Earned"):
    case activity.includes("Rezidor SAS"):
      return true;
    default:
      return false;
  }
};
