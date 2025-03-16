import type { GroupVendor, Vendor } from "./vendor";

export interface Transaction {
  id?: number;
  user_id: string;
  date: string;
  activity: string;
  bonus_points?: number;
  level_points?: number;
  profile_id: string;
}

export interface VendorTransaction {
  year: number;
  vendor: Vendor;
  value: number;
  group: GroupVendor;
  profile_id: string;
}

export interface YearlyTransaction {
  year: number;
  spent: number;
  earned: number;
}

export interface QualifyingTransaction {
  period: string;
  value: number;
  profile_id: string;
}

export interface PeopleTransaction {
  profile_id: string;
  value: number;
}

export interface SummarizedTransaction {
  activity: string;
  year: number;
  bonus_points: number;
}
