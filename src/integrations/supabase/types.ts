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
      conversations: {
        Row: {
          channel: string | null
          closed_at: string | null
          created_at: string
          escalated: boolean | null
          escalated_to: string | null
          guest_id: string | null
          hotel_id: string | null
          id: string
          language: string | null
          last_message_at: string | null
          message_count: number | null
          messages: Json
          sentiment: string | null
          sentiment_score: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          channel?: string | null
          closed_at?: string | null
          created_at?: string
          escalated?: boolean | null
          escalated_to?: string | null
          guest_id?: string | null
          hotel_id?: string | null
          id?: string
          language?: string | null
          last_message_at?: string | null
          message_count?: number | null
          messages?: Json
          sentiment?: string | null
          sentiment_score?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          channel?: string | null
          closed_at?: string | null
          created_at?: string
          escalated?: boolean | null
          escalated_to?: string | null
          guest_id?: string | null
          hotel_id?: string | null
          id?: string
          language?: string | null
          last_message_at?: string | null
          message_count?: number | null
          messages?: Json
          sentiment?: string | null
          sentiment_score?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_escalated_to_fkey"
            columns: ["escalated_to"]
            isOneToOne: false
            referencedRelation: "hotel_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_leads: {
        Row: {
          challenges: string[] | null
          city: string | null
          contact_name: string
          created_at: string
          email: string
          hotel_name: string
          id: string
          message: string | null
          notes: string | null
          phone: string | null
          position: string | null
          preferred_lang: string | null
          rooms_count: number | null
          source: string | null
          stars: number | null
          status: string | null
        }
        Insert: {
          challenges?: string[] | null
          city?: string | null
          contact_name: string
          created_at?: string
          email: string
          hotel_name: string
          id?: string
          message?: string | null
          notes?: string | null
          phone?: string | null
          position?: string | null
          preferred_lang?: string | null
          rooms_count?: number | null
          source?: string | null
          stars?: number | null
          status?: string | null
        }
        Update: {
          challenges?: string[] | null
          city?: string | null
          contact_name?: string
          created_at?: string
          email?: string
          hotel_name?: string
          id?: string
          message?: string | null
          notes?: string | null
          phone?: string | null
          position?: string | null
          preferred_lang?: string | null
          rooms_count?: number | null
          source?: string | null
          stars?: number | null
          status?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          place_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          place_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          place_id?: number
          user_id?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          access_token: string | null
          allergies: string[] | null
          check_in: string | null
          check_out: string | null
          created_at: string
          dietary_restrictions: string[] | null
          full_name: string | null
          hotel_id: string
          id: string
          initials: string | null
          is_active: boolean | null
          language_pref: string | null
          loyalty_points: number | null
          pms_guest_id: string | null
          preferences: Json | null
          room_number: string
          tier: Database["public"]["Enums"]["guest_tier"] | null
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          allergies?: string[] | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          dietary_restrictions?: string[] | null
          full_name?: string | null
          hotel_id: string
          id?: string
          initials?: string | null
          is_active?: boolean | null
          language_pref?: string | null
          loyalty_points?: number | null
          pms_guest_id?: string | null
          preferences?: Json | null
          room_number: string
          tier?: Database["public"]["Enums"]["guest_tier"] | null
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          allergies?: string[] | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          dietary_restrictions?: string[] | null
          full_name?: string | null
          hotel_id?: string
          id?: string
          initials?: string | null
          is_active?: boolean | null
          language_pref?: string | null
          loyalty_points?: number | null
          pms_guest_id?: string | null
          preferences?: Json | null
          room_number?: string
          tier?: Database["public"]["Enums"]["guest_tier"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_staff: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string
          hotel_id: string
          id: string
          is_on_duty: boolean | null
          phone: string | null
          role: Database["public"]["Enums"]["staff_role"]
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          hotel_id: string
          id?: string
          is_on_duty?: boolean | null
          phone?: string | null
          role: Database["public"]["Enums"]["staff_role"]
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          hotel_id?: string
          id?: string
          is_on_duty?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_staff_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          ai_voice: string | null
          branding: Json | null
          city: string
          country: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          languages: string[] | null
          logo_url: string | null
          name: string
          rooms_count: number | null
          slug: string
          stars: number | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          ai_voice?: string | null
          branding?: Json | null
          city: string
          country?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          languages?: string[] | null
          logo_url?: string | null
          name: string
          rooms_count?: number | null
          slug: string
          stars?: number | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          ai_voice?: string | null
          branding?: Json | null
          city?: string
          country?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          languages?: string[] | null
          logo_url?: string | null
          name?: string
          rooms_count?: number | null
          slug?: string
          stars?: number | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      places: {
        Row: {
          category: Database["public"]["Enums"]["place_category"]
          contact_phone: string | null
          created_at: string
          description: Json | null
          distance_km: number | null
          hotel_id: string
          id: string
          image_url: string | null
          is_partner: boolean | null
          name: Json
          open_hours: Json | null
          partner_commission: number | null
          price_range: string | null
          rating: number | null
          reviews_count: number | null
          sort_order: number | null
          tag: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["place_category"]
          contact_phone?: string | null
          created_at?: string
          description?: Json | null
          distance_km?: number | null
          hotel_id: string
          id?: string
          image_url?: string | null
          is_partner?: boolean | null
          name: Json
          open_hours?: Json | null
          partner_commission?: number | null
          price_range?: string | null
          rating?: number | null
          reviews_count?: number | null
          sort_order?: number | null
          tag?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["place_category"]
          contact_phone?: string | null
          created_at?: string
          description?: Json | null
          distance_km?: number | null
          hotel_id?: string
          id?: string
          image_url?: string | null
          is_partner?: boolean | null
          name?: Json
          open_hours?: Json | null
          partner_commission?: number | null
          price_range?: string | null
          rating?: number | null
          reviews_count?: number | null
          sort_order?: number | null
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "places_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          assigned_team: string | null
          assigned_to: string | null
          completed_at: string | null
          conversation_id: string | null
          created_at: string
          description: string | null
          details: Json | null
          eta_minutes: number | null
          guest_id: string | null
          hotel_id: string | null
          id: string
          photo_url: string | null
          priority: Database["public"]["Enums"]["request_priority"] | null
          rating: number | null
          room: string
          routed_at: string | null
          stage: string
          started_at: string | null
          title: string | null
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_team?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          description?: string | null
          details?: Json | null
          eta_minutes?: number | null
          guest_id?: string | null
          hotel_id?: string | null
          id?: string
          photo_url?: string | null
          priority?: Database["public"]["Enums"]["request_priority"] | null
          rating?: number | null
          room?: string
          routed_at?: string | null
          stage?: string
          started_at?: string | null
          title?: string | null
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_team?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          description?: string | null
          details?: Json | null
          eta_minutes?: number | null
          guest_id?: string | null
          hotel_id?: string | null
          id?: string
          photo_url?: string | null
          priority?: Database["public"]["Enums"]["request_priority"] | null
          rating?: number | null
          room?: string
          routed_at?: string | null
          stage?: string
          started_at?: string | null
          title?: string | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "hotel_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      service_menus: {
        Row: {
          available: boolean | null
          category: Database["public"]["Enums"]["menu_category"]
          created_at: string
          currency: string | null
          description: Json | null
          emoji: string | null
          hotel_id: string
          id: string
          image_url: string | null
          name: Json
          price: number
          sort_order: number | null
          tags: string[] | null
        }
        Insert: {
          available?: boolean | null
          category: Database["public"]["Enums"]["menu_category"]
          created_at?: string
          currency?: string | null
          description?: Json | null
          emoji?: string | null
          hotel_id: string
          id?: string
          image_url?: string | null
          name: Json
          price: number
          sort_order?: number | null
          tags?: string[] | null
        }
        Update: {
          available?: boolean | null
          category?: Database["public"]["Enums"]["menu_category"]
          created_at?: string
          currency?: string | null
          description?: Json | null
          emoji?: string | null
          hotel_id?: string
          id?: string
          image_url?: string | null
          name?: Json
          price?: number
          sort_order?: number | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "service_menus_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          hotel_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          hotel_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          hotel_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
      user_hotel_ids: { Args: { _user_id: string }; Returns: string[] }
      user_works_at: {
        Args: { _hotel_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "owner" | "manager" | "staff"
      guest_tier: "standard" | "silver" | "gold" | "platinum"
      menu_category: "dining" | "spa" | "minibar" | "laundry"
      place_category: "food" | "culture" | "nightlife" | "nature" | "shopping"
      request_priority: "low" | "normal" | "high" | "urgent"
      staff_role:
        | "owner"
        | "manager"
        | "frontdesk"
        | "housekeeping"
        | "kitchen"
        | "engineering"
        | "spa"
        | "concierge"
      subscription_status: "trialing" | "active" | "past_due" | "canceled"
      subscription_tier: "trial" | "small" | "medium" | "pro"
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
      app_role: ["super_admin", "owner", "manager", "staff"],
      guest_tier: ["standard", "silver", "gold", "platinum"],
      menu_category: ["dining", "spa", "minibar", "laundry"],
      place_category: ["food", "culture", "nightlife", "nature", "shopping"],
      request_priority: ["low", "normal", "high", "urgent"],
      staff_role: [
        "owner",
        "manager",
        "frontdesk",
        "housekeeping",
        "kitchen",
        "engineering",
        "spa",
        "concierge",
      ],
      subscription_status: ["trialing", "active", "past_due", "canceled"],
      subscription_tier: ["trial", "small", "medium", "pro"],
    },
  },
} as const
