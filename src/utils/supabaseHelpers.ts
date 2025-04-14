
import { supabase } from '@/integrations/supabase/client';

// Generic helper function for type-safe Supabase operations
export function supabaseTable<T>(table: string) {
  // This is a workaround for TypeScript until the generated types are updated
  // @ts-ignore - Ignore TypeScript errors for now
  return supabase.from(table) as unknown as ReturnType<typeof supabase.from<T>>;
}

// Specific functions for our tables
export function leadsTable() {
  return supabaseTable('leads');
}

export function autoresponderConnectionsTable() {
  return supabaseTable('autoresponder_connections');
}
