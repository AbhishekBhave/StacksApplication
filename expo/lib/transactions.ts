import { supabase } from '@/lib/supabase';

export type TransactionRow = {
  id: string;
  amount: number | null;
  posted_date: string | null;
  raw_name: string | null;
  merchant_name: string | null;
  created_at: string;
};

export async function fetchTransactionsForUser(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('id, amount, posted_date, raw_name, merchant_name, created_at')
    .eq('user_id', userId)
    .eq('pending', false)
    .order('posted_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as TransactionRow[];
}
