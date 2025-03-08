export interface Transaction {
  id?: number;
  user_id: number;
  date: string;
  activity?: string;
  bonus_points?: number;
  level_points?: number;
}