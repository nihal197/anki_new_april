import { supabase } from '@/lib/supabase';

export class BaseService {
  protected supabase = supabase;
} 