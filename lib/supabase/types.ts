export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      events: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          end_time: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          location: string | null
          pdf_url: string | null
          start_date: string
          start_time: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          location?: string | null
          pdf_url?: string | null
          start_date: string
          start_time?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          location?: string | null
          pdf_url?: string | null
          start_date?: string
          start_time?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [{ foreignKeyName: "events_created_by_fkey"; columns: ["created_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
      join_requests: {
        Row: {
          admin_note: string | null
          birth_year: number | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          message: string | null
          phone: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_note?: string | null
          birth_year?: number | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          message?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_note?: string | null
          birth_year?: number | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [{ foreignKeyName: "join_requests_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
      links: {
        Row: { description: string | null; id: string; sort_order: number | null; title: string; url: string }
        Insert: { description?: string | null; id?: string; sort_order?: number | null; title: string; url: string }
        Update: { description?: string | null; id?: string; sort_order?: number | null; title?: string; url?: string }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          created_at: string | null
          id: string
          is_read: boolean | null
          replied_at: string | null
          reply: string | null
          sender_email: string
          sender_id: string | null
          sender_name: string
          subject: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          replied_at?: string | null
          reply?: string | null
          sender_email: string
          sender_id?: string | null
          sender_name: string
          subject: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          replied_at?: string | null
          reply?: string | null
          sender_email?: string
          sender_id?: string | null
          sender_name?: string
          subject?: string
        }
        Relationships: [{ foreignKeyName: "messages_sender_id_fkey"; columns: ["sender_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
      page_views: {
        Row: { country: string | null; created_at: string | null; id: number; page: string; referrer: string | null; user_agent: string | null }
        Insert: { country?: string | null; created_at?: string | null; id?: number; page: string; referrer?: string | null; user_agent?: string | null }
        Update: { country?: string | null; created_at?: string | null; id?: number; page?: string; referrer?: string | null; user_agent?: string | null }
        Relationships: []
      }
      photo_albums: {
        Row: {
          cover_url: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          event_id: string | null
          id: string
          is_published: boolean | null
          title: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_id?: string | null
          id?: string
          is_published?: boolean | null
          title: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_id?: string | null
          id?: string
          is_published?: boolean | null
          title?: string
        }
        Relationships: [
          { foreignKeyName: "photo_albums_created_by_fkey"; columns: ["created_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "photo_albums_event_id_fkey"; columns: ["event_id"]; isOneToOne: false; referencedRelation: "events"; referencedColumns: ["id"] }
        ]
      }
      photos: {
        Row: { album_id: string; caption: string | null; created_at: string | null; id: string; sort_order: number | null; thumbnail_url: string | null; url: string }
        Insert: { album_id: string; caption?: string | null; created_at?: string | null; id?: string; sort_order?: number | null; thumbnail_url?: string | null; url: string }
        Update: { album_id?: string; caption?: string | null; created_at?: string | null; id?: string; sort_order?: number | null; thumbnail_url?: string | null; url?: string }
        Relationships: [{ foreignKeyName: "photos_album_id_fkey"; columns: ["album_id"]; isOneToOne: false; referencedRelation: "photo_albums"; referencedColumns: ["id"] }]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          email: string
          full_name: string | null
          id: string
          joined_at: string | null
          label: string | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          email: string
          full_name?: string | null
          id: string
          joined_at?: string | null
          label?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          email?: string
          full_name?: string | null
          id?: string
          joined_at?: string | null
          label?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: { key: string; updated_at: string | null; updated_by: string | null; value: string }
        Insert: { key: string; updated_at?: string | null; updated_by?: string | null; value: string }
        Update: { key?: string; updated_at?: string | null; updated_by?: string | null; value?: string }
        Relationships: [{ foreignKeyName: "site_content_updated_by_fkey"; columns: ["updated_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
      starred_events: {
        Row: { created_at: string | null; event_id: string; user_id: string }
        Insert: { created_at?: string | null; event_id: string; user_id: string }
        Update: { created_at?: string | null; event_id?: string; user_id?: string }
        Relationships: [
          { foreignKeyName: "starred_events_event_id_fkey"; columns: ["event_id"]; isOneToOne: false; referencedRelation: "events"; referencedColumns: ["id"] },
          { foreignKeyName: "starred_events_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }
        ]
      }
      vorstand: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          image_url: string | null
          is_active: boolean | null
          label: string
          phone: string | null
          profile_id: string | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          label: string
          phone?: string | null
          profile_id?: string | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          label?: string
          phone?: string | null
          profile_id?: string | null
          sort_order?: number | null
        }
        Relationships: [{ foreignKeyName: "vorstand_profile_id_fkey"; columns: ["profile_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Event = Tables<'events'>
export type Profile = Tables<'profiles'>
export type PhotoAlbum = Tables<'photo_albums'>
export type Photo = Tables<'photos'>
export type JoinRequest = Tables<'join_requests'>
export type Message = Tables<'messages'>
export type VorstandMember = Tables<'vorstand'>
