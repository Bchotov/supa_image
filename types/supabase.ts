export interface Database {
  public: {
    Tables: {
      news: {
        Row: {
          id: string
          created_at: string
          title: string
          content: string
          cover_image: string
          slug: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          content: string
          cover_image: string
          slug: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          content?: string
          cover_image?: string
          slug?: string
        }
      }
    }
  }
} 