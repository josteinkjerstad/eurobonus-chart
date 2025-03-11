export interface Profile {
  id: string;
  user_id?: string;
  display_name?: string;
  public?: boolean;
  parent_id?: string;
  periode_start_month?: number;
  created: string;
}
