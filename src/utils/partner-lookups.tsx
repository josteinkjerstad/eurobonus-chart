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

const sasBioFuel = [
  "biofuel points",
  "SASBIOFUEL",
  "Biofuel",
  "bio ticket campaign",
  "BIO ticket campaign",
  "Campaign Bio ticket",
  "BIO Ticket campaign",
  "MISSING BIO fuel",
];
const aviancaIataCodes = [
  "AV", // Avianca
  "LR", // Avianca Costa Rica
  "T0", // Avianca El Salvador
  "2K", // Avianca Ecuador
  "P5", // Avianca Peru
  "O6", // Avianca Brazil
  "VH", // Avianca Venezuela
  "PU", // Avianca Uruguay
  "GU", // Avianca Guatemala
];

const sasActivities = [
  "Conscious Traveler Reward",
  "BEP old",
  "BBP old",
  "Special Accrual",
  "Buy Extra Points",
  "Buy Basic Points",
  "Claim | Points Earned",
  "Transfer Extra Points",
  "Points Corrections",
  "EuroBonus intro",
  "SAS EuroBonus | Points Corrections",
  "Scandinavian Airlines System | Points Earned",
  "| SK ",
  "SASUPGRADE incentive",
  "| undefined",
  "PTS DIFF",
  "TP old",
  "SAS  | Points Earned",
  "Flight: SK1456 | Points Earned",
  "RES ID",
  "Double points campaign",
  "EMD 117",
  "Added missing points from pnr",
  ...sasBioFuel,
];

export const getSasKey = (activity: string): ScandinavianAirlinesPartner => {
  switch (true) {
    case activity.includesAny(["Buy Extra Points", "Buy Basic Points"]):
      return ScandinavianAirlinesPartner.PointPurchase;
    case activity.includes("Transfer Extra Points"):
      return ScandinavianAirlinesPartner.PointTransfers;
    case activity.includes("Claim | Points Earned"):
      return ScandinavianAirlinesPartner.Claim;
    case activity.includes("Conscious Traveler Reward"):
      return ScandinavianAirlinesPartner.ConsciousTraveler;
    case activity.includesAny(sasBioFuel):
      return ScandinavianAirlinesPartner.BioFuel;
    case activity.includes("EuroBonus intro"):
      return ScandinavianAirlinesPartner.Intro;
    default:
      return ScandinavianAirlinesPartner.Flights;
  }
};

export const getPartnerFlightKey = (activity: string): Vendor => {
  const key = Object.keys(AirlinePartner).find(key => activity.includes(`| ${key}`));

  return key ? AirlinePartner[key as keyof typeof AirlinePartner] : Partner.Unknown;
};

const isSas = (activity: string): boolean => activity.includesAny(sasActivities);
const isAmex = (activity: string): boolean => activity.includes("Amex");
const isAvianca = (activity: string): boolean => activity.includesAny(aviancaIataCodes.map(x => `| ${x}`));
const isAvis = (activity: string): boolean => activity.toLowerCase().startsWith("ra ") || activity.includesAny(["Avis", "AVIS"]);
const isNorgesgruppen = (activity: string): boolean => activity.includesAny(["NorgesGruppen", "Norgesgruppen"]);
const isRadisson = (activity: string): boolean => activity.includesAny(["Radisson", "Rezidor SAS"]);
const isEuroBonusEarnShop = (activity: string): boolean => activity.includesAny(["EuroBonus Earn Shop", "EuroBonus Shop (NOK)", "Onlineshopping"]);
const isPartnerFlight = (activity: string): boolean => activity.includesAny(Object.keys(AirlinePartner).map(key => `| ${key}`));
export const isRefund = (activity: string): boolean => activity.includesAny(["Refund", "Scandinavian Airlines Spec Actv | Points Corrections"]);

export const findVendor = (transaction: Transaction): Vendor => {
  switch (true) {
    case isSas(transaction.activity):
      return getSasKey(transaction.activity!);
    case isAvianca(transaction.activity):
      return AirlinePartner.AV;
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
