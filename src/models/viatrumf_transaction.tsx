import type { Status } from "../enums/status";

export interface ViatrumfTransaction {
  id?: number;
  store: string;
  purchase_date: string;
  purchase_amount: number;
  trumf_bonus: number;
  status: Status;
  profile_id?: string;
  user_id?: string;
}
