import { AirlinePartner, CreditCardPartner, EurobonusShopPartner, HotelPartner, NewspaperPartner, Partner, RentalCarPartner } from "./partners";

export type Vendor = Partner | EurobonusShopPartner | AirlinePartner | RentalCarPartner | CreditCardPartner | NewspaperPartner | HotelPartner;

export enum GroupVendor {
    CarRental = "Rental cars",
    EuroBonusEarnShop = "EuroBonus Shopping",
    AirlinePartner = "Partner Airlines",
    CreditCardPartner = "Credit Cards",
    NewspaperPartner = "Newspapers",
    HotelPartner = "Hotels",
}

export const groupedVendors : Record<GroupVendor, Vendor[]> = {
    [GroupVendor.CarRental]: Object.values(RentalCarPartner),
    [GroupVendor.EuroBonusEarnShop]: Object.values(EurobonusShopPartner),
    [GroupVendor.AirlinePartner]: Object.values(AirlinePartner),
    [GroupVendor.CreditCardPartner]: Object.values(CreditCardPartner),
    [GroupVendor.NewspaperPartner]: Object.values(NewspaperPartner),
    [GroupVendor.HotelPartner]: Object.values(HotelPartner),
}

export const getDisplayName = (vendor: Vendor | GroupVendor): string => {
    switch (vendor) {
        case Partner.SasFlights:
            return "Scandinavian Airlines";
        case Partner.Trumf:
            return "Norgesgruppen";
        case Partner.Fjordkraft:
            return "Fjordkraft";
        case Partner.Flytoget:
            return "Flytoget";
        case Partner.Other:
            return "Unknown";
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
        case NewspaperPartner.DagensNæringsliv:
            return "Dagens Næringsliv";
        case HotelPartner.Radisson:
            return "Radisson Hotels";
        case HotelPartner.Scandic:
            return "Scandic Hotels";
        default:
            return vendor;
    }
}
