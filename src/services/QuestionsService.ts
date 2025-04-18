import { BaseService } from './BaseService';
import type { Database } from '@/types/supabase';

type Question = Database['public']['Tables']['questions']['Row'];

export class QuestionsService extends BaseService {
  async getBySubjectAndTopic(subjectId: string, topicId?: string) {
    let query = this.supabase
      .from('questions')
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
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(question: {
    question: string;
    options?: Record<string, unknown>;
    correct_answer: string;
    explanation?: string;
    difficulty: string;
    subject_id: string;
    topic_id?: string;
  }) {
    const { data, error } = await this.supabase
      .from('questions')
      .insert(question)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Question, 'id' | 'created_at'>>) {
    const { data, error } = await this.supabase
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from('questions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async recordResponse(userId: string, questionId: string, response: string, isCorrect: boolean, timeTaken: number) {
    const { error } = await this.supabase
      .from('user_responses')
      .insert({
        user_id: userId,
        question_id: questionId,
        response,
        is_correct: isCorrect,
        time_taken: timeTaken
      });
    
    if (error) throw error;
  }
}

export const questionsService = new QuestionsService(); 