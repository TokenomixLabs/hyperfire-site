export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          description: string | null
          education_unlock_ids: string[] | null
          id: string
          is_active: boolean | null
          membership_tier: string
          name: string
          price_amount: number | null
          price_currency: string | null
          revenue_share_percent: number | null
          stripe_price_id: string | null
          stripe_product_id: string
        }
        Insert: {
          description?: string | null
          education_unlock_ids?: string[] | null
          id?: string
          is_active?: boolean | null
          membership_tier: string
          name: string
          price_amount?: number | null
          price_currency?: string | null
          revenue_share_percent?: number | null
          stripe_price_id?: string | null
          stripe_product_id: string
        }
        Update: {
          description?: string | null
          education_unlock_ids?: string[] | null
          id?: string
          is_active?: boolean | null
          membership_tier?: string
          name?: string
          price_amount?: number | null
          price_currency?: string | null
          revenue_share_percent?: number | null
          stripe_price_id?: string | null
          stripe_product_id?: string
        }
        Relationships: []
      }
      stripe_accounts: {
        Row: {
          connected_at: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          stripe_account_id: string
          user_id: string
        }
        Insert: {
          connected_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          stripe_account_id: string
          user_id: string
        }
        Update: {
          connected_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          stripe_account_id?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          customer_user_id: string | null
          funnel_id: string | null
          id: string
          metadata: Json | null
          payout_status: string | null
          platform_amount: number | null
          product_id: string | null
          referrer_amount: number | null
          referrer_user_id: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          stripe_payout_id: string | null
          stripe_session_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          customer_user_id?: string | null
          funnel_id?: string | null
          id?: string
          metadata?: Json | null
          payout_status?: string | null
          platform_amount?: number | null
          product_id?: string | null
          referrer_amount?: number | null
          referrer_user_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_payout_id?: string | null
          stripe_session_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          customer_user_id?: string | null
          funnel_id?: string | null
          id?: string
          metadata?: Json | null
          payout_status?: string | null
          platform_amount?: number | null
          product_id?: string | null
          referrer_amount?: number | null
          referrer_user_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_payout_id?: string | null
          stripe_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tiers: {
        Row: {
          changed_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          previous_tier: string | null
          tier: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          changed_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          previous_tier?: string | null
          tier: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          changed_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          previous_tier?: string | null
          tier?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tiers_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_unlocks: {
        Row: {
          content_id: string
          content_type: string
          id: string
          is_active: boolean | null
          transaction_id: string | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          id?: string
          is_active?: boolean | null
          transaction_id?: string | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          id?: string
          is_active?: boolean | null
          transaction_id?: string | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_unlocks_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
