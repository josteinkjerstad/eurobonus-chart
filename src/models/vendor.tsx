import {
  AirlinePartner,
  CreditCardPartner,
  EuroBonusShopPartner,
  HotelPartner,
  HouseholdPartner,
  Partner,
  RentalCarPartner,
  ScandinavianAirlinesPartner,
} from "./partners";

export type Vendor =
  | Partner
  | EuroBonusShopPartner
  | AirlinePartner
  | RentalCarPartner
  | CreditCardPartner
  | HotelPartner
  | HouseholdPartner
  | ScandinavianAirlinesPartner;

export enum GroupVendor {
  CarRental = "Car Rentals",
  EuroBonusEarnShop = "EuroBonus Shopping",
  AirlinePartner = "Airline partners",
  CreditCardPartner = "Credit Cards",
  HotelPartner = "Hotels",
  HouseholdPartner = "Household Services",
  ScandinavianAirlines = "Scandinavian Airlines",
  NorgesGruppen = "NorgesGruppen",
}

export const groupedVendors: Record<GroupVendor, Vendor[]> = {
  [GroupVendor.CarRental]: Object.values(RentalCarPartner),
  [GroupVendor.EuroBonusEarnShop]: Object.values(EuroBonusShopPartner),
  [GroupVendor.AirlinePartner]: [
    Partner.Flytoget,
    ...Object.values(AirlinePartner),
  ],
  [GroupVendor.CreditCardPartner]: Object.values(CreditCardPartner),
  [GroupVendor.HotelPartner]: Object.values(HotelPartner),
  [GroupVendor.HouseholdPartner]: Object.values(HouseholdPartner),
  [GroupVendor.ScandinavianAirlines]: Object.values(
    ScandinavianAirlinesPartner
  ),
  [GroupVendor.NorgesGruppen]: [Partner.Trumf],
};

export const getDisplayName = (vendor: Vendor | GroupVendor): string => {
  switch (vendor) {
    case Partner.Trumf:
      return "Trumf";
    case Partner.Flytoget:
      return "Flytoget";
    case Partner.Unknown:
      return "Unknown";
    case HouseholdPartner.Fjordkraft:
      return "Fjordkraft";
    case HouseholdPartner.Verisure:
      return "Verisure";
    case HouseholdPartner.DagensNæringsliv:
      return "Dagens Næringsliv";
    case CreditCardPartner.Amex:
      return "American Express";
    case CreditCardPartner.Dnb:
      return "DNB";
    case CreditCardPartner.Lunar:
      return "Lunar";
    case CreditCardPartner.SasMC:
      return "SAS MasterCard";
    case CreditCardPartner.TravelWallet:
      return "Travel Wallet";
    case CreditCardPartner.WideroeKortet:
      return "Widerøe-kortet";
    case HotelPartner.Radisson:
      return "Radisson Hotels";
    case HotelPartner.Scandic:
      return "Scandic Hotels";
    case EuroBonusShopPartner.EuroBonusShop:
      return "EuroBonus Shop";
    case HouseholdPartner.LiveNation:
      return "Live Nation";
    default:
      return vendor;
  }
};
