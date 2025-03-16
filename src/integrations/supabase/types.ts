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
      plenary_sessions: {
        Row: {
          analysis_result: Json | null
          analyzed: boolean
          collected_at: string
          content: string
          date: string
          id: string
          source_url: string | null
          title: string
          xml_data: Json | null
        }
        Insert: {
          analysis_result?: Json | null
          analyzed?: boolean
          collected_at?: string
          content: string
          date: string
          id?: string
          source_url?: string | null
          title: string
          xml_data?: Json | null
        }
        Update: {
          analysis_result?: Json | null
          analyzed?: boolean
          collected_at?: string
          content?: string
          date?: string
          id?: string
          source_url?: string | null
          title?: string
          xml_data?: Json | null
        }
        Relationships: []
      }
      topic_analyses: {
        Row: {
          analysis_data: Json | null
          analysis_date: string
          analyzed_at: string | null
          content_id: string
          content_type: string
          id: string
          keywords: string[] | null
          relevant_extracts: Json | null
          sentiment: string | null
          summary: string | null
          topic_id: string | null
          topics: string[]
        }
        Insert: {
          analysis_data?: Json | null
          analysis_date?: string
          analyzed_at?: string | null
          content_id: string
          content_type: string
          id?: string
          keywords?: string[] | null
          relevant_extracts?: Json | null
          sentiment?: string | null
          summary?: string | null
          topic_id?: string | null
          topics: string[]
        }
        Update: {
          analysis_data?: Json | null
          analysis_date?: string
          analyzed_at?: string | null
          content_id?: string
          content_type?: string
          id?: string
          keywords?: string[] | null
          relevant_extracts?: Json | null
          sentiment?: string | null
          summary?: string | null
          topic_id?: string | null
          topics?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "topic_analyses_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_mentions: {
        Row: {
          content_id: string
          content_type: string
          detected_at: string
          id: string
          is_notified: boolean
          mention_context: string | null
          topic_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          detected_at?: string
          id?: string
          is_notified?: boolean
          mention_context?: string | null
          topic_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          detected_at?: string
          id?: string
          is_notified?: boolean
          mention_context?: string | null
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_mentions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_subscriptions: {
        Row: {
          created_at: string
          id: string
          topic_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          topic_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_subscriptions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          keywords: string[]
          name: string
          topics_source: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          keywords: string[]
          name: string
          topics_source?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          keywords?: string[]
          name?: string
          topics_source?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tweets: {
        Row: {
          analysis_result: Json | null
          analyzed: boolean
          collected_at: string
          content: string
          id: string
          posted_at: string
          tweet_id: string
          user_handle: string
          user_name: string | null
        }
        Insert: {
          analysis_result?: Json | null
          analyzed?: boolean
          collected_at?: string
          content: string
          id?: string
          posted_at: string
          tweet_id: string
          user_handle: string
          user_name?: string | null
        }
        Update: {
          analysis_result?: Json | null
          analyzed?: boolean
          collected_at?: string
          content?: string
          id?: string
          posted_at?: string
          tweet_id?: string
          user_handle?: string
          user_name?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          last_login: string | null
          name: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          last_login?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_login?: string | null
          name?: string | null
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
