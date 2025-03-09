import { AirlinePartner, CreditCardPartner, EurobonusShopPartner, NewspaperPartner, Partner, RentalCarPartner } from "./Partners";

export type Vendor = Partner | EurobonusShopPartner | AirlinePartner | RentalCarPartner | CreditCardPartner | NewspaperPartner;

export enum GroupVendor {
    CarRental = "Rental cars",
    EuroBonusEarnShop = "EuroBonus Earn Shop",
    AirlinePartner = "Partner Airlines",
    CreditCardPartner = "Credit Cards",
    NewspaperPartner = "Newspapers",
}

export const groupedVendors : Record<GroupVendor, Vendor[]> = {
    [GroupVendor.CarRental]: Object.values(RentalCarPartner),
    [GroupVendor.EuroBonusEarnShop]: Object.values(EurobonusShopPartner),
    [GroupVendor.AirlinePartner]: Object.values(AirlinePartner),
    [GroupVendor.CreditCardPartner]: Object.values(CreditCardPartner),
    [GroupVendor.NewspaperPartner]: Object.values(NewspaperPartner),
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
            return "WiderøeKortet";
        case NewspaperPartner.DagensNæringsliv:
            return "Dagens Næringsliv";
        default:
            return vendor;
    }
}
