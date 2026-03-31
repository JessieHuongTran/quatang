export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          preferred_language: string
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          preferred_language?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          preferred_language?: string
          created_at?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          id: string
          user_id: string
          bank_name: string | null
          bank_id: string | null
          account_number: string | null
          account_name: string | null
          momo_phone: string | null
          zalopay_phone: string | null
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bank_name?: string | null
          bank_id?: string | null
          account_number?: string | null
          account_name?: string | null
          momo_phone?: string | null
          zalopay_phone?: string | null
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bank_name?: string | null
          bank_id?: string | null
          account_number?: string | null
          account_name?: string | null
          momo_phone?: string | null
          zalopay_phone?: string | null
          is_primary?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'payment_methods_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      registries: {
        Row: {
          id: string
          user_id: string
          title: string
          type: string
          slug: string
          description: string | null
          event_date: string | null
          is_public: boolean
          theme: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: string
          slug: string
          description?: string | null
          event_date?: string | null
          is_public?: boolean
          theme?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: string
          slug?: string
          description?: string | null
          event_date?: string | null
          is_public?: boolean
          theme?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'registries_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      registry_items: {
        Row: {
          id: string
          registry_id: string
          name: string
          photo_url: string | null
          price_estimate: number | null
          buy_url: string | null
          is_group_gift: boolean
          target_amount: number | null
          current_amount: number
          is_fully_funded: boolean
          is_purchased: boolean
          purchased_by_name: string | null
          purchased_at: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          registry_id: string
          name: string
          photo_url?: string | null
          price_estimate?: number | null
          buy_url?: string | null
          is_group_gift?: boolean
          target_amount?: number | null
          current_amount?: number
          is_fully_funded?: boolean
          is_purchased?: boolean
          purchased_by_name?: string | null
          purchased_at?: string | null
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          registry_id?: string
          name?: string
          photo_url?: string | null
          price_estimate?: number | null
          buy_url?: string | null
          is_group_gift?: boolean
          target_amount?: number | null
          current_amount?: number
          is_fully_funded?: boolean
          is_purchased?: boolean
          purchased_by_name?: string | null
          purchased_at?: string | null
          position?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'registry_items_registry_id_fkey'
            columns: ['registry_id']
            isOneToOne: false
            referencedRelation: 'registries'
            referencedColumns: ['id']
          }
        ]
      }
      contributions: {
        Row: {
          id: string
          registry_item_id: string
          contributor_name: string
          contributor_email: string | null
          contributor_message: string | null
          amount: number
          payment_method: string
          transfer_note: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          registry_item_id: string
          contributor_name: string
          contributor_email?: string | null
          contributor_message?: string | null
          amount: number
          payment_method: string
          transfer_note?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          registry_item_id?: string
          contributor_name?: string
          contributor_email?: string | null
          contributor_message?: string | null
          amount?: number
          payment_method?: string
          transfer_note?: string | null
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'contributions_registry_item_id_fkey'
            columns: ['registry_item_id']
            isOneToOne: false
            referencedRelation: 'registry_items'
            referencedColumns: ['id']
          }
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

export type RegistryType = 'pregnancy' | 'birthday' | 'wedding' | 'graduation' | 'housewarming' | 'thoi_noi'

export type Registry = Database['public']['Tables']['registries']['Row']
export type RegistryItem = Database['public']['Tables']['registry_items']['Row']
export type Contribution = Database['public']['Tables']['contributions']['Row']
export type PaymentMethod = Database['public']['Tables']['payment_methods']['Row']
export type UserProfile = Database['public']['Tables']['users']['Row']
