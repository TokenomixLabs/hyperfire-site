
export interface ESPConnection {
  id: string;
  provider: string;
  api_key: string;
  api_secret?: string;
  list_id: string;
  tag?: string;
  is_active: boolean;
  last_verified?: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  email: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  funnel_id: string | null;
  referrer_user_id: string | null;
  esp_status: string | null;
  esp_provider: string | null;
  esp_response: any;
  metadata: any;
  created_at: string;
}
