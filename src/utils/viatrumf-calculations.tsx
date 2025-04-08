import { TrumfCurrency } from "../enums/trumfCurrency";
import type { ViatrumfVendorTransaction } from "../models/transaction";
import type { ViatrumfTransaction } from "../models/viatrumf_transaction";

export const calculateViatrumfVendorTransactions = (transactions: ViatrumfTransaction[]): ViatrumfVendorTransaction[] =>
  transactions.map(transaction => ({
    vendor: transaction.store,
    year: new Date(transaction.purchase_date).getFullYear(),
    value: transaction.trumf_bonus ?? 0,
    status: transaction.status,
    profile_id: transaction.profile_id!,
  }));

export const getTrumfValue = (value: number, currency: TrumfCurrency): number => {
  switch (currency) {
    case TrumfCurrency.Sas13_5:
      return Math.round(value * 13.5);
    case TrumfCurrency.Sas10:
      return Math.round(value * 10);
    default:
      return value;
  }
};

export const getLatestViatrumfDate = (transactions: ViatrumfTransaction[]): string | null => {
  if (transactions.length === 0) {
    return null;
  }
  return new Date(Math.max(...transactions.map(transaction => new Date(transaction.purchase_date).getTime()))).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getEarliestViatrumfDate = (transactions: ViatrumfTransaction[]): string | null => {
  if (transactions.length === 0) {
    return null;
  }
  return new Date(Math.min(...transactions.map(transaction => new Date(transaction.purchase_date).getTime()))).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};
