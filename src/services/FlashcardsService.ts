import { BaseService } from './BaseService';
import type { Database } from '@/types/supabase';

type Flashcard = Database['public']['Tables']['flashcards']['Row'];

export class FlashcardsService extends BaseService {
  async getBySubjectAndTopic(subjectId: string, topicId?: string) {
    let query = this.supabase
      .from('flashcards')
      .select('*')
      .eq('subject_id', subjectId);
    
    if (topicId) {
      query = query.eq('topic_id', topicId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from('flashcards')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(flashcard: {
    front: string;
    back: string;
    subject_id: string;
    topic_id?: string;
  }) {
    const { data, error } = await this.supabase
      .from('flashcards')
      .insert(flashcard)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Flashcard, 'id' | 'created_at'>>) {
    const { data, error } = await this.supabase
      .from('flashcards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from('flashcards')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async recordResponse(userId: string, flashcardId: string, response: string, isCorrect: boolean, timeTaken: number) {
    const { error } = await this.supabase
      .from('user_responses')
      .insert({
        user_id: userId,
        flashcard_id: flashcardId,
        response,
        is_correct: isCorrect,
        time_taken: timeTaken
      });
    
    if (error) throw error;
  }
}

export const flashcardsService = new FlashcardsService(); 