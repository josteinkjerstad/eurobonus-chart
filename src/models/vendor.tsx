import {
  AirlinePartner,
  CreditCardPartner,
  EuroBonusShopPartner,
  HotelPartner,
  HomePartner,
  Partner,
  RentalCarPartner,
  RestaurantPartner,
  ScandinavianAirlinesPartner,
  TravelPartner,
} from "./partners";

export type Vendor =
  | Partner
  | EuroBonusShopPartner
  | AirlinePartner
  | RentalCarPartner
  | CreditCardPartner
  | HotelPartner
  | HomePartner
  | ScandinavianAirlinesPartner
  | RestaurantPartner
  | TravelPartner;

export enum GroupVendor {
  CarRental = "Car Rentals",
  EuroBonusEarnShop = "EuroBonus Shopping",
  AirlinePartner = "Airline partners",
  CreditCardPartner = "Credit Cards",
  HotelPartner = "Hotels",
  HomePartner = "Household",
  ScandinavianAirlines = "Scandinavian Airlines",
  NorgesGruppen = "NorgesGruppen",
  Restaurants = "Restaurants",
  TravelPartners = "Other Travel Partners",
}

export const groupedVendors: Record<GroupVendor, Vendor[]> = {
  [GroupVendor.CarRental]: Object.values(RentalCarPartner),
  [GroupVendor.EuroBonusEarnShop]: Object.values(EuroBonusShopPartner),
  [GroupVendor.AirlinePartner]: Object.values(AirlinePartner),
  [GroupVendor.CreditCardPartner]: Object.values(CreditCardPartner),
  [GroupVendor.HotelPartner]: Object.values(HotelPartner),
  [GroupVendor.HomePartner]: Object.values(HomePartner),
  [GroupVendor.ScandinavianAirlines]: Object.values(ScandinavianAirlinesPartner),
  [GroupVendor.NorgesGruppen]: [Partner.Trumf],
  [GroupVendor.Restaurants]: Object.values(RestaurantPartner),
  [GroupVendor.TravelPartners]: Object.values(TravelPartner),
};

export const getDisplayName = (vendor: Vendor | GroupVendor): string => {
  switch (vendor) {
    case Partner.Trumf:
      return "Trumf";
    case TravelPartner.Flytoget:
      return "Flytoget";
    case Partner.Unknown:
      return "Unknown";
    case HomePartner.Fjordkraft:
      return "Fjordkraft";
    case HomePartner.Verisure:
      return "Verisure";
    case HomePartner.DagensNæringsliv:
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
    case HotelPartner.EuroBonusHotels:
      return "EuroBonus Hotels";
    case EuroBonusShopPartner.EuroBonusShop:
      return "EuroBonus Shop";
    case HomePartner.LiveNation:
      return "Live Nation";
    default:
      return vendor;
  }
};
