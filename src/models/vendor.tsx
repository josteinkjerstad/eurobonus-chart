import {
  AirlinePartner,
  CreditCardPartner,
  EurobonusShopPartner,
  HotelPartner,
  HouseholdPartner,
  Partner,
  RentalCarPartner,
  RestaurantPartner,
  ScandinavianAirlinesPartner,
} from "./partners";

export type Vendor =
  | Partner
  | EurobonusShopPartner
  | AirlinePartner
  | RentalCarPartner
  | CreditCardPartner
  | HotelPartner
  | HouseholdPartner
  | ScandinavianAirlinesPartner
  | RestaurantPartner;

export enum GroupVendor {
  CarRental = "Car Rentals",
  EuroBonusEarnShop = "EuroBonus Shopping",
  AirlinePartner = "Airline partners",
  CreditCardPartner = "Credit Cards",
  HotelPartner = "Hotels",
  HouseholdPartner = "Household Services",
  ScandinavianAirlines = "Scandinavian Airlines",
  NorgesGruppen = "NorgesGruppen",
  Restaurants = "Restaurants",
}

export const groupedVendors: Record<GroupVendor, Vendor[]> = {
  [GroupVendor.CarRental]: Object.values(RentalCarPartner),
  [GroupVendor.EuroBonusEarnShop]: Object.values(EurobonusShopPartner),
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
  [GroupVendor.Restaurants]: Object.values(RestaurantPartner),
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
    case HotelPartner.Scandic:
      return "Scandic Hotels";
    case EurobonusShopPartner.EuroBonusShop:
      return "EuroBonus Shop";
    case HouseholdPartner.LiveNation:
      return "Live Nation";
    default:
      return vendor;
  }
};
