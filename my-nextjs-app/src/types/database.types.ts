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
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          updated_at?: string | null
          created_at?: string
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
          id?: string
          title: string
          file_path: string
          status?: string
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          file_path?: string
          status?: string
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      signatures: {
        Row: {
          id: string
          document_id: string
          signer_id: string
          signature_data: string
          position_x: number
          position_y: number
          page_number: number
          width: number
          height: number
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          signer_id: string
          signature_data: string
          position_x: number
          position_y: number
          page_number: number
          width: number
          height: number
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          signer_id?: string
          signature_data?: string
          position_x?: number
          position_y?: number
          page_number?: number
          width?: number
          height?: number
          created_at?: string
        }
      }
      document_shares: {
        Row: {
          id: string
          document_id: string
          shared_with: string
          permissions: string
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          shared_with: string
          permissions?: string
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          shared_with?: string
          permissions?: string
          created_at?: string
        }
      }
    }
  }
} 