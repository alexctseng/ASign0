export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          updated_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          updated_at?: string | null
        }
        Update: {
          full_name?: string | null
          updated_at?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          file_path: string
          status: string
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          file_path: string
          status?: string
          owner_id: string
        }
        Update: {
          title?: string
          file_path?: string
          status?: string
        }
      }
      // ... other tables remain the same
    }
  }
} 