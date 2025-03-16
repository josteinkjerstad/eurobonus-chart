import {
  AirlinePartner,
  CreditCardPartner,
  EuroBonusShopPartner,
  HotelPartner,
  Partner,
  RentalCarPartner,
  ScandinavianAirlinesPartner,
} from "../models/partners";
import type { Transaction } from "../models/transaction";
import type { Vendor } from "../models/vendor";
import "../utils/extensions";

const sasActivities = [
  "Conscious Traveler Reward",
  "SASBIOFUEL",
  "Biofuel",
  "BEP old",
  "Special Accrual",
  "Buy Extra Points",
  "Buy Basic Points",
  "Claim | Points Earned",
  "Transfer Extra Points",
  "Scandinavian Airlines System | Points Corrections",
  "EuroBonus intro",
];

export const getSasKey = (transaction: Transaction): ScandinavianAirlinesPartner => {
  const activity = transaction.activity!;
  switch (true) {
    case activity.includesAny(["Buy Extra Points", "Buy Basic Points"]):
      return ScandinavianAirlinesPartner.PointPurchase;
    case activity.includes("Transfer Extra Points"):
      return ScandinavianAirlinesPartner.PointTransfers;
    case activity.includes("Claim | Points Earned"):
      return ScandinavianAirlinesPartner.Claim;
    case activity.includes("Conscious Traveler Reward"):
      return ScandinavianAirlinesPartner.ConsciousTraveler;
    case activity.toLowerCase().includes("biofuel"):
      return ScandinavianAirlinesPartner.BioFuel;
    case activity.includes("EuroBonus intro"):
      return ScandinavianAirlinesPartner.Intro;
    default:
      return ScandinavianAirlinesPartner.Flights;
  }
};

export const getPartnerFlightKey = (activity: string): Vendor => {
  let key = Object.keys(AirlinePartner).find(key => activity.includes(`| ${key}`));

  if (key == AirlinePartner.LR || key == AirlinePartner.TA) {
    key = AirlinePartner.AV;
  }

  return key ? AirlinePartner[key as keyof typeof AirlinePartner] : Partner.Unknown;
};

export const isSas = (transaction: Transaction): boolean => {
  const activity = transaction.activity!;
  return (activity.includes("SK") && transaction.level_points && transaction.level_points > 0) || activity.includesAny(sasActivities);
};

const isAmex = (activity: string): boolean => activity.includes("Amex");
const isAvis = (activity: string): boolean => activity.startsWith("ra ");
const isNorgesgruppen = (activity: string): boolean => activity.includes("NorgesGruppen");
const isRadisson = (activity: string): boolean => activity.includesAny(["Radisson", "Rezidor SAS"]);
const isEuroBonusEarnShop = (activity: string): boolean => activity.includesAny(["EuroBonus Earn Shop", "EuroBonus Shop (NOK)"]);
const isPartnerFlight = (activity: string): boolean => activity.includesAny(Object.keys(AirlinePartner).map(key => `| ${key}`));

export const findVendor = (transaction: Transaction): Vendor => {
  switch (true) {
    case isSas(transaction):
      return getSasKey(transaction);
    case isPartnerFlight(transaction.activity!):
      return getPartnerFlightKey(transaction.activity!);
    case isRadisson(transaction.activity!):
      return HotelPartner.Radisson;
    case isEuroBonusEarnShop(transaction.activity!):
      return EuroBonusShopPartner.EuroBonusShop;
    case isAmex(transaction.activity!):
      return CreditCardPartner.Amex;
    case isAvis(transaction.activity!):
      return RentalCarPartner.Avis;
    case isNorgesgruppen(transaction.activity!):
      return Partner.Trumf;
    default:
      console.log(`Unknown transaction: ${transaction.activity} ${transaction.bonus_points} ${transaction.date}`);
      return Partner.Unknown;
  }
};
