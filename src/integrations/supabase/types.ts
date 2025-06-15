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
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean
          name: string
          points_reward: number
          unlock_condition: Json
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          icon: string
          id?: string
          is_active?: boolean
          name: string
          points_reward?: number
          unlock_condition?: Json
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          points_reward?: number
          unlock_condition?: Json
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          campaign_id: string | null
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_analytics: {
        Row: {
          campaign_id: string
          created_at: string
          deployment_id: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          page_url: string
          referrer: string | null
          revenue_value: number | null
          timestamp: string
          user_agent: string | null
          user_session: string | null
          website_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          deployment_id?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          page_url: string
          referrer?: string | null
          revenue_value?: number | null
          timestamp?: string
          user_agent?: string | null
          user_session?: string | null
          website_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          deployment_id?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          page_url?: string
          referrer?: string | null
          revenue_value?: number | null
          timestamp?: string
          user_agent?: string | null
          user_session?: string | null
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_analytics_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "campaign_deployments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_analytics_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_deployments: {
        Row: {
          campaign_id: string
          conversion_count: number
          created_at: string
          deployed_at: string | null
          deployment_config: Json
          id: string
          last_triggered_at: string | null
          rules: Json
          status: string
          trigger_count: number
          updated_at: string
          website_id: string
        }
        Insert: {
          campaign_id: string
          conversion_count?: number
          created_at?: string
          deployed_at?: string | null
          deployment_config?: Json
          id?: string
          last_triggered_at?: string | null
          rules?: Json
          status?: string
          trigger_count?: number
          updated_at?: string
          website_id: string
        }
        Update: {
          campaign_id?: string
          conversion_count?: number
          created_at?: string
          deployed_at?: string | null
          deployment_config?: Json
          id?: string
          last_triggered_at?: string | null
          rules?: Json
          status?: string
          trigger_count?: number
          updated_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_deployments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_deployments_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          canvas_data: Json
          created_at: string
          description: string | null
          display_settings: Json | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string
          targeting_rules: Json | null
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          canvas_data: Json
          created_at?: string
          description?: string | null
          display_settings?: Json | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string
          targeting_rules?: Json | null
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          canvas_data?: Json
          created_at?: string
          description?: string | null
          display_settings?: Json | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string
          targeting_rules?: Json | null
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "user_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      discovered_events: {
        Row: {
          created_at: string
          event_schema: Json
          event_type: string
          first_seen: string
          id: string
          is_conversion_event: boolean
          last_seen: string
          occurrence_count: number
          revenue_mapping: Json | null
          sample_payload: Json
          updated_at: string
          website_id: string
        }
        Insert: {
          created_at?: string
          event_schema?: Json
          event_type: string
          first_seen?: string
          id?: string
          is_conversion_event?: boolean
          last_seen?: string
          occurrence_count?: number
          revenue_mapping?: Json | null
          sample_payload?: Json
          updated_at?: string
          website_id: string
        }
        Update: {
          created_at?: string
          event_schema?: Json
          event_type?: string
          first_seen?: string
          id?: string
          is_conversion_event?: boolean
          last_seen?: string
          occurrence_count?: number
          revenue_mapping?: Json | null
          sample_payload?: Json
          updated_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovered_events_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      email_confirmations: {
        Row: {
          confirmed_at: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          confirmed_at?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          confirmed_at?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      event_queue: {
        Row: {
          attempts: number
          created_at: string
          event_type: string
          id: string
          last_error: string | null
          max_attempts: number
          payload: Json
          priority: number
          processed_at: string | null
          scheduled_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          event_type: string
          id?: string
          last_error?: string | null
          max_attempts?: number
          payload?: Json
          priority?: number
          processed_at?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          event_type?: string
          id?: string
          last_error?: string | null
          max_attempts?: number
          payload?: Json
          priority?: number
          processed_at?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      form_submission_rules: {
        Row: {
          actions: Json
          campaign_id: string | null
          conditions: Json
          created_at: string
          id: string
          is_active: boolean
          name: string
          priority: number
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actions?: Json
          campaign_id?: string | null
          conditions?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          priority?: number
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actions?: Json
          campaign_id?: string | null
          conditions?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          priority?: number
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          created_at: string
          delivered_webhook_ids: string[] | null
          form_data: Json
          id: string
          processed_at: string | null
          rule_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          delivered_webhook_ids?: string[] | null
          form_data: Json
          id?: string
          processed_at?: string | null
          rule_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          delivered_webhook_ids?: string[] | null
          form_data?: Json
          id?: string
          processed_at?: string | null
          rule_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "form_submission_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      gamified_templates: {
        Row: {
          category: string
          created_at: string
          css_template: string
          default_config: Json
          description: string
          html_template: string
          id: string
          is_active: boolean
          js_template: string
          level_required: number
          name: string
          preview_image: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          css_template: string
          default_config?: Json
          description: string
          html_template: string
          id?: string
          is_active?: boolean
          js_template: string
          level_required?: number
          name: string
          preview_image?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          css_template?: string
          default_config?: Json
          description?: string
          html_template?: string
          id?: string
          is_active?: boolean
          js_template?: string
          level_required?: number
          name?: string
          preview_image?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      template_customizations: {
        Row: {
          created_at: string
          customization_data: Json
          id: string
          is_favorite: boolean
          template_base_id: string
          template_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customization_data?: Json
          id?: string
          is_favorite?: boolean
          template_base_id: string
          template_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customization_data?: Json
          id?: string
          is_favorite?: boolean
          template_base_id?: string
          template_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      template_folders: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_folder_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_folder_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_folder_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_folders_parent_folder_id_fkey"
            columns: ["parent_folder_id"]
            isOneToOne: false
            referencedRelation: "template_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      tracked_users: {
        Row: {
          cookie_id: string
          created_at: string
          first_seen: string
          id: string
          ip_address: unknown | null
          last_seen: string
          page_views: number
          session_count: number
          user_agent: string | null
          website_id: string
        }
        Insert: {
          cookie_id: string
          created_at?: string
          first_seen?: string
          id?: string
          ip_address?: unknown | null
          last_seen?: string
          page_views?: number
          session_count?: number
          user_agent?: string | null
          website_id: string
        }
        Update: {
          cookie_id?: string
          created_at?: string
          first_seen?: string
          id?: string
          ip_address?: unknown | null
          last_seen?: string
          page_views?: number
          session_count?: number
          user_agent?: string | null
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracked_users_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_events: {
        Row: {
          event_data: Json | null
          event_type: string
          id: string
          referrer: string | null
          session_id: string
          timestamp: string
          tracked_user_id: string
          url: string
          website_id: string
        }
        Insert: {
          event_data?: Json | null
          event_type: string
          id?: string
          referrer?: string | null
          session_id: string
          timestamp?: string
          tracked_user_id: string
          url: string
          website_id: string
        }
        Update: {
          event_data?: Json | null
          event_type?: string
          id?: string
          referrer?: string | null
          session_id?: string
          timestamp?: string
          tracked_user_id?: string
          url?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_events_tracked_user_id_fkey"
            columns: ["tracked_user_id"]
            isOneToOne: false
            referencedRelation: "tracked_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_events_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progression: {
        Row: {
          achievements_unlocked: string[]
          campaigns_created: number
          created_at: string
          id: string
          level: number
          templates_used: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements_unlocked?: string[]
          campaigns_created?: number
          created_at?: string
          id?: string
          level?: number
          templates_used?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements_unlocked?: string[]
          campaigns_created?: number
          created_at?: string
          id?: string
          level?: number
          templates_used?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_templates: {
        Row: {
          canvas_data: Json
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          tags: string[] | null
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          canvas_data: Json
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          canvas_data?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_uploads: {
        Row: {
          created_at: string
          file_size: number
          filename: string
          folder_path: string | null
          id: string
          mime_type: string
          original_filename: string
          storage_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_size: number
          filename: string
          folder_path?: string | null
          id?: string
          mime_type: string
          original_filename: string
          storage_path: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_size?: number
          filename?: string
          folder_path?: string | null
          id?: string
          mime_type?: string
          original_filename?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_deliveries: {
        Row: {
          delivered_at: string | null
          delivery_status: string
          id: string
          response_body: string | null
          response_status: number | null
          submission_id: string | null
          user_id: string
          webhook_id: string
        }
        Insert: {
          delivered_at?: string | null
          delivery_status?: string
          id?: string
          response_body?: string | null
          response_status?: number | null
          submission_id?: string | null
          user_id: string
          webhook_id: string
        }
        Update: {
          delivered_at?: string | null
          delivery_status?: string
          id?: string
          response_body?: string | null
          response_status?: number | null
          submission_id?: string | null
          user_id?: string
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "form_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_deliveries_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          auth_config: Json
          auth_type: string
          created_at: string
          headers: Json
          id: string
          is_active: boolean
          last_test_response: string | null
          last_test_status: string | null
          last_tested_at: string | null
          method: string
          name: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          auth_config?: Json
          auth_type?: string
          created_at?: string
          headers?: Json
          id?: string
          is_active?: boolean
          last_test_response?: string | null
          last_test_status?: string | null
          last_tested_at?: string | null
          method?: string
          name: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          auth_config?: Json
          auth_type?: string
          created_at?: string
          headers?: Json
          id?: string
          is_active?: boolean
          last_test_response?: string | null
          last_test_status?: string | null
          last_tested_at?: string | null
          method?: string
          name?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      websites: {
        Row: {
          api_key: string
          beacon_id: string
          created_at: string
          domain: string
          id: string
          name: string
          tracking_enabled: boolean
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          api_key?: string
          beacon_id?: string
          created_at?: string
          domain: string
          id?: string
          name: string
          tracking_enabled?: boolean
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          api_key?: string
          beacon_id?: string
          created_at?: string
          domain?: string
          id?: string
          name?: string
          tracking_enabled?: boolean
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      process_queue_event: {
        Args: { event_id: string }
        Returns: boolean
      }
      queue_campaign_deployment: {
        Args: {
          p_campaign_id: string
          p_website_id: string
          p_rules?: Json
          p_config?: Json
        }
        Returns: string
      }
      trigger_event_discovery: {
        Args: { p_website_id: string }
        Returns: boolean
      }
      update_user_progression: {
        Args: { p_user_id: string; p_action: string; p_data?: Json }
        Returns: boolean
      }
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
