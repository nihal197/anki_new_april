import { BaseService } from './BaseService';
import type { Database } from '@/types/supabase';

type Subject = Database['public']['Tables']['subjects']['Row'];
type Topic = Database['public']['Tables']['topics']['Row'];

export class SubjectsService extends BaseService {
  async getAll() {
    const { data, error } = await this.supabase
      .from('subjects')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from('subjects')
      .select('*, topics(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(name: string, description?: string) {
    const { data, error } = await this.supabase
      .from('subjects')
      .insert({
        name,
        description,
        created_by: (await this.supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Subject, 'id' | 'created_at' | 'created_by'>>) {
    const { data, error } = await this.supabase
      .from('subjects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from('subjects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async addTopic(subjectId: string, title: string, content?: string, orderIndex?: number) {
    // Get the current max order index if not provided
    let nextOrderIndex = orderIndex;
    if (nextOrderIndex === undefined) {
      const { data: topics } = await this.supabase
        .from('topics')
        .select('order_index')
        .eq('subject_id', subjectId)
        .order('order_index', { ascending: false })
        .limit(1);
      
      nextOrderIndex = topics && topics.length > 0 ? topics[0].order_index + 1 : 0;
    }

    const { data, error } = await this.supabase
      .from('topics')
      .insert({
        subject_id: subjectId,
        title,
        content,
        order_index: nextOrderIndex
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateTopic(id: string, updates: Partial<Omit<Topic, 'id' | 'created_at'>>) {
    const { data, error } = await this.supabase
      .from('topics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteTopic(id: string) {
    const { error } = await this.supabase
      .from('topics')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

export const subjectsService = new SubjectsService(); 