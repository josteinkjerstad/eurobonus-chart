import { act } from "react";
import {
  AirlinePartner,
  CreditCardPartner,
  EuroBonusShopPartner,
  HomePartner,
  HotelPartner,
  Partner,
  RentalCarPartner,
  RestaurantPartnerNorway,
  ScandinavianAirlinesPartner,
  TravelPartner,
} from "../models/partners";
import type { Transaction } from "../models/transaction";
import type { Vendor } from "../models/vendor";
import "../utils/extensions";

const sasPnrRelatedActivities = [
  "E389452733",
  "EMD 117",
  "PNR",
  "Added missing points from pnr",
  "WTU85U | Points Earned",
  "Corrected pts to original flight",
  "OTGJMU | Points Earned",
  "P3CIWD | Extra Points",
  "Basic points added",
  "Accrual for upgr",
  "Double Up Summer Campaign",
];

const sasXmasCalendar = ["Chr calender", "chr caleneder", "chr calender"];
const sasEurobonusHotel = ["EuroBonus-Hotel", "Hotels,"];

const sasBioFuel = [
  "biofuel points",
  "SASBIOFUEL",
  "Biofuel",
  "biofuel",
  "bio ticket campaign",
  "BIO ticket campaign",
  "Campaign Bio ticket",
  "BIO Ticket campaign",
  "MISSING BIO fuel",
  "BIOFUEL CAMP",
  "BIO FUEL CAMPAIGN",
  "missing biofuel campaign",
  "Consious traveler rewards",
  "Goodwill BIOFUEL",
  "Good will BIOFUEL",
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
  "| Basic Points",
  "PTS DIFF",
  "TP old",
  "SAS  | Points Earned",
  "RES ID",
  "Double points campaign",
  "Double Points Campaign",
  "OnD",
  "plusgrade saver",
  ...sasXmasCalendar,
  ...sasPnrRelatedActivities,
  ...sasBioFuel,
  ...sasEurobonusHotel,
];

const skPointsEarned = /.*SK\d{4} \| Points Earned/;

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
    case activity.includesAny(sasXmasCalendar):
      return ScandinavianAirlinesPartner.ChristmasCalendar;
    case activity.includesAny(sasEurobonusHotel):
      return ScandinavianAirlinesPartner.Hotels;
    default:
      return ScandinavianAirlinesPartner.Flights;
  }
};

export const getPartnerFlightKey = (activity: string): Vendor => {
  const key = Object.keys(AirlinePartner).find(key => activity.includes(`| ${key}`));

  return key ? AirlinePartner[key as keyof typeof AirlinePartner] : Partner.Unknown;
};

const isSas = (activity: string): boolean => activity.includesAny(sasActivities) || skPointsEarned.test(activity) || activity == " | ";
const isAmex = (activity: string): boolean => activity.includes("Amex");
const isAvianca = (activity: string): boolean => activity.includesAny(aviancaIataCodes.map(x => `| ${x}`));
const isWideroe = (activity: string): boolean => activity.includes("Missing BP for WF");
const isAvis = (activity: string): boolean =>
  activity.toLowerCase().startsWith("ra ") || activity.includesAny(["Rental agreement number", "Avis", "AVIS"]);
const isNorgesgruppen = (activity: string): boolean => activity.includesAny(["NorgesGruppen", "Norgesgruppen"]);
const isRadisson = (activity: string): boolean => activity.includesAny(["Radisson", "Rezidor SAS"]);
const isEuroBonusEarnShop = (activity: string): boolean => activity.includesAny(["EuroBonus Earn Shop", "EuroBonus Shop (NOK)", "Onlineshopping"]);
const isPartnerFlight = (activity: string): boolean => activity.includesAny(Object.keys(AirlinePartner).map(key => `| ${key}`));
const isCartel = (activity: string): boolean => activity.includesAny(["Salsa", "cartel"]);
const isMPH = (activity: string): boolean => activity.includesAny(["Miles Per Hour", "milesperhour"]);
const isScandic = (activity: string): boolean => activity.includesAny(["Scandic", "SCANDIC"]);
const isSmartHotel = (activity: string): boolean => activity.includesAny(["Smarthotel", "SmartHotel"]);
const isDnb = (activity: string): boolean => activity.includesAny(["DNB Rewards"]);
const isSasMc = (activity: string): boolean => activity.includesAny(["MasterCard Reward Norway"]);
const isLunar = (activity: string): boolean => activity.includesAny(["Lunar NO"]);
const isDn = (activity: string): boolean => activity.includesAny(["Dagens Näringsliv"]);
const isFjordkraft = (activity: string): boolean => activity.includesAny(["Fjordkraft"]);
const isTravelWallet = (activity: string): boolean => activity.includesAny(["Travel Wallet"]);
const isFlytoget = (activity: string): boolean => activity.includesAny(["Flytoget"]);
export const isRefund = (activity: string): boolean =>
  activity.includesAny(["Refund", "Scandinavian Airlines Spec Actv | Points Corrections", "SAS EuroBonus | Points Corrections"]);

export const findVendor = (transaction: Transaction): Vendor => {
  switch (true) {
    case isSas(transaction.activity):
      return getSasKey(transaction.activity!);
    case isAvianca(transaction.activity):
      return AirlinePartner.AV;
    case isWideroe(transaction.activity):
      return AirlinePartner.WF;
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
    case isMPH(transaction.activity!):
      return EuroBonusShopPartner.MilesPerHour;
    case isCartel(transaction.activity!):
      return RestaurantPartnerNorway.Cartels;
    case isScandic(transaction.activity!):
      return HotelPartner.Scandic;
    case isSmartHotel(transaction.activity!):
      return HotelPartner.SmartHotel;
    case isDnb(transaction.activity!):
      return CreditCardPartner.Dnb;
    case isSasMc(transaction.activity!):
      return CreditCardPartner.SasMC;
    case isLunar(transaction.activity!):
      return CreditCardPartner.Lunar;
    case isDn(transaction.activity!):
      return HomePartner.DagensNæringsliv;
    case isFjordkraft(transaction.activity!):
      return HomePartner.Fjordkraft;
    case isTravelWallet(transaction.activity!):
      return CreditCardPartner.TravelWallet;
    case isFlytoget(transaction.activity!):
      return TravelPartner.Flytoget;
    default:
      console.log(`Unknown transaction: ${transaction.activity} ${transaction.bonus_points} ${transaction.date}`);
      return Partner.Unknown;
  }
};
