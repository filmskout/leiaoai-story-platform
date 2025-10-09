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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          session_id: string | null
          tokens: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          session_id?: string | null
          tokens?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          session_id?: string | null
          tokens?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_sessions: {
        Row: {
          ai_model: string | null
          ai_model_old: string
          created_at: string | null
          id: string
          is_active: boolean | null
          language: string | null
          message_count: number | null
          session_id: string
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_model?: string | null
          ai_model_old: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          message_count?: number | null
          session_id: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_model?: string | null
          ai_model_old?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          message_count?: number | null
          session_id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      anonymous_likes: {
        Row: {
          client_ip: string
          created_at: string
          id: string
          story_id: string
        }
        Insert: {
          client_ip: string
          created_at?: string
          id?: string
          story_id: string
        }
        Update: {
          client_ip?: string
          created_at?: string
          id?: string
          story_id?: string
        }
        Relationships: []
      }
      anonymous_shares: {
        Row: {
          client_ip: string
          created_at: string
          id: string
          metadata: Json | null
          share_type: string | null
          story_id: string
        }
        Insert: {
          client_ip: string
          created_at?: string
          id?: string
          metadata?: Json | null
          share_type?: string | null
          story_id: string
        }
        Update: {
          client_ip?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          share_type?: string | null
          story_id?: string
        }
        Relationships: []
      }
      bp_analysis_reports: {
        Row: {
          analysis_result: Json | null
          created_at: string | null
          file_name: string
          file_url: string
          id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          analysis_result?: Json | null
          created_at?: string | null
          file_name: string
          file_url: string
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          analysis_result?: Json | null
          created_at?: string | null
          file_name?: string
          file_url?: string
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bp_analysis_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_plans: {
        Row: {
          analysis_result: Json | null
          analysis_summary: string | null
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          updated_at: string | null
          upload_status: string | null
          user_id: string
        }
        Insert: {
          analysis_result?: Json | null
          analysis_summary?: string | null
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          updated_at?: string | null
          upload_status?: string | null
          user_id: string
        }
        Update: {
          analysis_result?: Json | null
          analysis_summary?: string | null
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          updated_at?: string | null
          upload_status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      images: {
        Row: {
          bucket: string | null
          created_at: string | null
          description: string | null
          file_size: number | null
          id: string
          image_data: string | null
          image_url: string | null
          mime_type: string | null
          name: string
          storage_type: string | null
          updated_at: string | null
          uploaded_by: string
        }
        Insert: {
          bucket?: string | null
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          id?: string
          image_data?: string | null
          image_url?: string | null
          mime_type?: string | null
          name: string
          storage_type?: string | null
          updated_at?: string | null
          uploaded_by: string
        }
        Update: {
          bucket?: string | null
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          id?: string
          image_data?: string | null
          image_url?: string | null
          mime_type?: string | null
          name?: string
          storage_type?: string | null
          updated_at?: string | null
          uploaded_by?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_statistics: {
        Row: {
          category: string | null
          description: string | null
          display_label: string | null
          id: number
          is_active: boolean | null
          metric_name: string
          metric_value: number
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          display_label?: string | null
          id?: number
          is_active?: boolean | null
          metric_name: string
          metric_value?: number
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          description?: string | null
          display_label?: string | null
          id?: number
          is_active?: boolean | null
          metric_name?: string
          metric_value?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_region: string | null
          avatar_base64: string | null
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          language_preference: string | null
          location: string | null
          preferences: Json | null
          preferred_chat_model: string | null
          preferred_image_model: string | null
          social_links: Json | null
          theme_preference: string | null
          updated_at: string | null
          user_id: string
          username: string | null
          website: string | null
          website_url: string | null
        }
        Insert: {
          ai_region?: string | null
          avatar_base64?: string | null
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          language_preference?: string | null
          location?: string | null
          preferences?: Json | null
          preferred_chat_model?: string | null
          preferred_image_model?: string | null
          social_links?: Json | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          website?: string | null
          website_url?: string | null
        }
        Update: {
          ai_region?: string | null
          avatar_base64?: string | null
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          language_preference?: string | null
          location?: string | null
          preferences?: Json | null
          preferred_chat_model?: string | null
          preferred_image_model?: string | null
          social_links?: Json | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          website?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      social_stats: {
        Row: {
          days_active: number | null
          id: string
          last_activity_at: string | null
          total_comments_made: number | null
          total_likes_given: number | null
          total_likes_received: number | null
          total_shares_made: number | null
          total_stories_published: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          days_active?: number | null
          id?: string
          last_activity_at?: string | null
          total_comments_made?: number | null
          total_likes_given?: number | null
          total_likes_received?: number | null
          total_shares_made?: number | null
          total_stories_published?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          days_active?: number | null
          id?: string
          last_activity_at?: string | null
          total_comments_made?: number | null
          total_likes_given?: number | null
          total_likes_received?: number | null
          total_shares_made?: number | null
          total_stories_published?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          author_id: string
          category: string | null
          comments_count: number | null
          content: string
          cover_image_url: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          language: string | null
          likes_count: number | null
          published_at: string | null
          read_time_minutes: number | null
          saves_count: number | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id: string
          category?: string | null
          comments_count?: number | null
          content: string
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          language?: string | null
          likes_count?: number | null
          published_at?: string | null
          read_time_minutes?: number | null
          saves_count?: number | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string | null
          comments_count?: number | null
          content?: string
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          language?: string | null
          likes_count?: number | null
          published_at?: string | null
          read_time_minutes?: number | null
          saves_count?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      story_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      story_comments: {
        Row: {
          author_name: string | null
          content: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          like_count: number | null
          parent_id: string | null
          story_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          author_name?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          like_count?: number | null
          parent_id?: string | null
          story_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          author_name?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          like_count?: number | null
          parent_id?: string | null
          story_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      story_likes: {
        Row: {
          created_at: string | null
          id: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          story_id?: string
          user_id?: string
        }
        Relationships: []
      }
      story_media: {
        Row: {
          alt_text: string | null
          created_at: string | null
          file_size: number | null
          height: number | null
          id: string
          media_name: string | null
          media_type: string
          media_url: string
          mime_type: string | null
          story_id: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          file_size?: number | null
          height?: number | null
          id?: string
          media_name?: string | null
          media_type: string
          media_url: string
          mime_type?: string | null
          story_id: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          file_size?: number | null
          height?: number | null
          id?: string
          media_name?: string | null
          media_type?: string
          media_url?: string
          mime_type?: string | null
          story_id?: string
          width?: number | null
        }
        Relationships: []
      }
      story_saves: {
        Row: {
          created_at: string | null
          id: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          story_id?: string
          user_id?: string
        }
        Relationships: []
      }
      story_tag_assignments: {
        Row: {
          created_at: string | null
          id: string
          story_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          story_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          story_id?: string
          tag_id?: string
        }
        Relationships: []
      }
      story_tags: {
        Row: {
          color: string | null
          created_at: string | null
          display_name: string
          id: string
          is_active: boolean | null
          name: string
          usage_count: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          name: string
          usage_count?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          name?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      story_views: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          story_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          story_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          story_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          completed_at: string | null
          created_at: string | null
          id: string
          progress: number | null
          target_value: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          target_value: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          target_value?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string | null
          created_at: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type?: string | null
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string | null
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_description: string | null
          badge_name: string
          badge_type: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_description?: string | null
          badge_name: string
          badge_type: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_description?: string | null
          badge_name?: string
          badge_type?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_bmc_saves: {
        Row: {
          bmc_data: Json
          created_at: string | null
          description: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bmc_data: Json
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bmc_data?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_bp_submissions: {
        Row: {
          bp_data: Json
          created_at: string | null
          id: string
          submission_description: string | null
          submission_title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bp_data: Json
          created_at?: string | null
          id?: string
          submission_description?: string | null
          submission_title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bp_data?: Json
          created_at?: string | null
          id?: string
          submission_description?: string | null
          submission_title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          story_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          story_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          story_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_likes: {
        Row: {
          created_at: string | null
          id: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          story_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          preferred_ai_model: string | null
          preferred_image_model: string | null
          preferred_language: string | null
          theme_preference: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferred_ai_model?: string | null
          preferred_image_model?: string | null
          preferred_language?: string | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          preferred_ai_model?: string | null
          preferred_image_model?: string | null
          preferred_language?: string | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          location_latitude: number | null
          location_longitude: number | null
          location_name: string | null
          updated_at: string | null
          user_id: string
          username: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          location_latitude?: number | null
          location_longitude?: number | null
          location_name?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          location_latitude?: number | null
          location_longitude?: number | null
          location_name?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      user_saves: {
        Row: {
          created_at: string | null
          id: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          story_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_shares: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          share_type: string | null
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          share_type?: string | null
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          share_type?: string | null
          story_id?: string
          user_id?: string
        }
        Relationships: []
      }
      website_stats: {
        Row: {
          avg_response_time: number | null
          created_at: string | null
          id: number
          total_bp_analysis: number | null
          total_qa: number | null
          total_users: number | null
          updated_at: string | null
        }
        Insert: {
          avg_response_time?: number | null
          created_at?: string | null
          id?: number
          total_bp_analysis?: number | null
          total_qa?: number | null
          total_users?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_response_time?: number | null
          created_at?: string | null
          id?: number
          total_bp_analysis?: number | null
          total_qa?: number | null
          total_users?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      chat_sessions: {
        Row: {
          ai_model: string | null
          created_at: string | null
          id: string | null
          is_active: boolean | null
          language: string | null
          message_count: number | null
          session_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_model?: string | null
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          language?: string | null
          message_count?: number | null
          session_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_model?: string | null
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          language?: string | null
          message_count?: number | null
          session_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      increment_message_count: {
        Args: { session_uuid: string }
        Returns: undefined
      }
      increment_question_count: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
    Enums: {},
  },
} as const
