import type { GroupVendor, Vendor } from "./vendor";

export interface Transaction {
  id?: number;
  user_id: number;
  date: string;
  activity?: string;
  bonus_points?: number;
  level_points?: number;
}

export interface VendorTransaction {
  year: number;
  vendor: Vendor;
  value: number;
  group: GroupVendor;
}

export interface YearlyTransaction {
  year: number;
  spent: number;
  earned: number;
}