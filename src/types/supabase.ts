export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      creators: {
        Row: {
          id: string;
          name: string;
          slug: string;
          niche: string;
          reach: number;
          topics: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          niche: string;
          reach: number;
          topics: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          niche?: string;
          reach?: number;
          topics?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
