export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      data_sources: {
        Row: {
          base_url: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          last_synced_at: string | null
          name: string
          source_type: Database["public"]["Enums"]["data_source_type"]
          total_records: number | null
        }
        Insert: {
          base_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          name: string
          source_type: Database["public"]["Enums"]["data_source_type"]
          total_records?: number | null
        }
        Update: {
          base_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          name?: string
          source_type?: Database["public"]["Enums"]["data_source_type"]
          total_records?: number | null
        }
        Relationships: []
      }
      political_events: {
        Row: {
          created_at: string
          description: string | null
          diff_added: string | null
          diff_removed: string | null
          entities: string[] | null
          event_timestamp: string
          event_type: Database["public"]["Enums"]["political_event_type"]
          evidence_count: number | null
          hash: string
          id: string
          politician_id: string
          raw_data: Json | null
          sentiment: Database["public"]["Enums"]["sentiment_type"] | null
          source: Database["public"]["Enums"]["data_source_type"] | null
          source_handle: string | null
          source_url: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          diff_added?: string | null
          diff_removed?: string | null
          entities?: string[] | null
          event_timestamp?: string
          event_type: Database["public"]["Enums"]["political_event_type"]
          evidence_count?: number | null
          hash?: string
          id?: string
          politician_id: string
          raw_data?: Json | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
          source?: Database["public"]["Enums"]["data_source_type"] | null
          source_handle?: string | null
          source_url?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          diff_added?: string | null
          diff_removed?: string | null
          entities?: string[] | null
          event_timestamp?: string
          event_type?: Database["public"]["Enums"]["political_event_type"]
          evidence_count?: number | null
          hash?: string
          id?: string
          politician_id?: string
          raw_data?: Json | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
          source?: Database["public"]["Enums"]["data_source_type"] | null
          source_handle?: string | null
          source_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "political_events_politician_id_fkey"
            columns: ["politician_id"]
            isOneToOne: false
            referencedRelation: "politicians"
            referencedColumns: ["id"]
          },
        ]
      }
      politician_finances: {
        Row: {
          annual_salary: number | null
          created_at: string
          currency: string | null
          declaration_year: number | null
          declared_assets: number | null
          declared_debt: number | null
          id: string
          notes: string | null
          politician_id: string
          property_value: number | null
          salary_source: string | null
          side_income: number | null
          updated_at: string
        }
        Insert: {
          annual_salary?: number | null
          created_at?: string
          currency?: string | null
          declaration_year?: number | null
          declared_assets?: number | null
          declared_debt?: number | null
          id?: string
          notes?: string | null
          politician_id: string
          property_value?: number | null
          salary_source?: string | null
          side_income?: number | null
          updated_at?: string
        }
        Update: {
          annual_salary?: number | null
          created_at?: string
          currency?: string | null
          declaration_year?: number | null
          declared_assets?: number | null
          declared_debt?: number | null
          id?: string
          notes?: string | null
          politician_id?: string
          property_value?: number | null
          salary_source?: string | null
          side_income?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "politician_finances_politician_id_fkey"
            columns: ["politician_id"]
            isOneToOne: false
            referencedRelation: "politicians"
            referencedColumns: ["id"]
          },
        ]
      }
      politician_investments: {
        Row: {
          company_name: string
          created_at: string
          currency: string | null
          disclosure_date: string | null
          estimated_value: number | null
          id: string
          investment_type: string
          is_active: boolean | null
          notes: string | null
          politician_id: string
          sector: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          currency?: string | null
          disclosure_date?: string | null
          estimated_value?: number | null
          id?: string
          investment_type?: string
          is_active?: boolean | null
          notes?: string | null
          politician_id: string
          sector?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          currency?: string | null
          disclosure_date?: string | null
          estimated_value?: number | null
          id?: string
          investment_type?: string
          is_active?: boolean | null
          notes?: string | null
          politician_id?: string
          sector?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "politician_investments_politician_id_fkey"
            columns: ["politician_id"]
            isOneToOne: false
            referencedRelation: "politicians"
            referencedColumns: ["id"]
          },
        ]
      }
      politician_positions: {
        Row: {
          created_at: string
          data_source: string | null
          defense_priority: number | null
          economic_score: number | null
          economy_priority: number | null
          education_priority: number | null
          environment_priority: number | null
          environmental_score: number | null
          eu_integration_score: number | null
          healthcare_priority: number | null
          id: string
          ideology_label: string | null
          immigration_score: number | null
          justice_priority: number | null
          key_positions: Json | null
          politician_id: string
          science_priority: number | null
          social_score: number | null
          social_welfare_priority: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_source?: string | null
          defense_priority?: number | null
          economic_score?: number | null
          economy_priority?: number | null
          education_priority?: number | null
          environment_priority?: number | null
          environmental_score?: number | null
          eu_integration_score?: number | null
          healthcare_priority?: number | null
          id?: string
          ideology_label?: string | null
          immigration_score?: number | null
          justice_priority?: number | null
          key_positions?: Json | null
          politician_id: string
          science_priority?: number | null
          social_score?: number | null
          social_welfare_priority?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_source?: string | null
          defense_priority?: number | null
          economic_score?: number | null
          economy_priority?: number | null
          education_priority?: number | null
          environment_priority?: number | null
          environmental_score?: number | null
          eu_integration_score?: number | null
          healthcare_priority?: number | null
          id?: string
          ideology_label?: string | null
          immigration_score?: number | null
          justice_priority?: number | null
          key_positions?: Json | null
          politician_id?: string
          science_priority?: number | null
          social_score?: number | null
          social_welfare_priority?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "politician_positions_politician_id_fkey"
            columns: ["politician_id"]
            isOneToOne: true
            referencedRelation: "politicians"
            referencedColumns: ["id"]
          },
        ]
      }
      politicians: {
        Row: {
          biography: string | null
          birth_year: number | null
          city: string | null
          committees: string[] | null
          continent: string | null
          country_code: string
          country_name: string
          created_at: string
          data_source: Database["public"]["Enums"]["data_source_type"] | null
          enriched_at: string | null
          external_id: string | null
          id: string
          in_office_since: string | null
          jurisdiction: string | null
          name: string
          net_worth: string | null
          party_abbreviation: string | null
          party_name: string | null
          photo_url: string | null
          role: string | null
          source_url: string | null
          top_donors: string[] | null
          twitter_handle: string | null
          updated_at: string
          wikipedia_data: Json | null
          wikipedia_image_url: string | null
          wikipedia_summary: string | null
          wikipedia_url: string | null
        }
        Insert: {
          biography?: string | null
          birth_year?: number | null
          city?: string | null
          committees?: string[] | null
          continent?: string | null
          country_code: string
          country_name: string
          created_at?: string
          data_source?: Database["public"]["Enums"]["data_source_type"] | null
          enriched_at?: string | null
          external_id?: string | null
          id?: string
          in_office_since?: string | null
          jurisdiction?: string | null
          name: string
          net_worth?: string | null
          party_abbreviation?: string | null
          party_name?: string | null
          photo_url?: string | null
          role?: string | null
          source_url?: string | null
          top_donors?: string[] | null
          twitter_handle?: string | null
          updated_at?: string
          wikipedia_data?: Json | null
          wikipedia_image_url?: string | null
          wikipedia_summary?: string | null
          wikipedia_url?: string | null
        }
        Update: {
          biography?: string | null
          birth_year?: number | null
          city?: string | null
          committees?: string[] | null
          continent?: string | null
          country_code?: string
          country_name?: string
          created_at?: string
          data_source?: Database["public"]["Enums"]["data_source_type"] | null
          enriched_at?: string | null
          external_id?: string | null
          id?: string
          in_office_since?: string | null
          jurisdiction?: string | null
          name?: string
          net_worth?: string | null
          party_abbreviation?: string | null
          party_name?: string | null
          photo_url?: string | null
          role?: string | null
          source_url?: string | null
          top_donors?: string[] | null
          twitter_handle?: string | null
          updated_at?: string
          wikipedia_data?: Json | null
          wikipedia_image_url?: string | null
          wikipedia_summary?: string | null
          wikipedia_url?: string | null
        }
        Relationships: []
      }
      scrape_runs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          records_created: number | null
          records_fetched: number | null
          records_updated: number | null
          source_id: string | null
          source_type: Database["public"]["Enums"]["data_source_type"]
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          records_created?: number | null
          records_fetched?: number | null
          records_updated?: number | null
          source_id?: string | null
          source_type: Database["public"]["Enums"]["data_source_type"]
          started_at?: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          records_created?: number | null
          records_fetched?: number | null
          records_updated?: number | null
          source_id?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"]
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "scrape_runs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
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
      data_source_type:
        | "eu_parliament"
        | "un_digital_library"
        | "twitter"
        | "official_record"
        | "news"
        | "financial_filing"
        | "parliamentary_record"
        | "court_filing"
        | "lobby_register"
      political_event_type:
        | "vote"
        | "speech"
        | "committee_join"
        | "committee_leave"
        | "election"
        | "appointment"
        | "resignation"
        | "scandal"
        | "policy_change"
        | "party_switch"
        | "legislation_sponsored"
        | "foreign_meeting"
        | "lobbying_meeting"
        | "corporate_event"
        | "financial_disclosure"
        | "social_media"
        | "travel"
        | "donation_received"
        | "public_statement"
        | "court_case"
        | "media_appearance"
      sentiment_type: "positive" | "negative" | "neutral"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      data_source_type: [
        "eu_parliament",
        "un_digital_library",
        "twitter",
        "official_record",
        "news",
        "financial_filing",
        "parliamentary_record",
        "court_filing",
        "lobby_register",
      ],
      political_event_type: [
        "vote",
        "speech",
        "committee_join",
        "committee_leave",
        "election",
        "appointment",
        "resignation",
        "scandal",
        "policy_change",
        "party_switch",
        "legislation_sponsored",
        "foreign_meeting",
        "lobbying_meeting",
        "corporate_event",
        "financial_disclosure",
        "social_media",
        "travel",
        "donation_received",
        "public_statement",
        "court_case",
        "media_appearance",
      ],
      sentiment_type: ["positive", "negative", "neutral"],
    },
  },
} as const
