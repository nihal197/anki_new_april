import { BaseService } from './BaseService';
import type { Database } from '@/types/supabase';

type Achievement = Database['public']['Tables']['achievements']['Row'];

export class AchievementsService extends BaseService {
  async getAll() {
    const { data, error } = await this.supabase
      .from('achievements')
      .select('*')
      .order('title');
    
    if (error) throw error;
    return data;
  }

  async getUserAchievements(userId: string) {
    const { data, error } = await this.supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievement_id (*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }

  async unlockAchievement(userId: string, achievementId: string) {
    // Check if already unlocked
    const { data: existing } = await this.supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();
    
    if (existing) {
      return; // Already unlocked
    }
    
    const { error } = await this.supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId
      });
    
    if (error) throw error;
  }

  async create(achievement: {
    title: string;
    description: string;
    criteria: Record<string, unknown>;
    icon?: string;
  }) {
    const { data, error } = await this.supabase
      .from('achievements')
      .insert(achievement)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Achievement, 'id' | 'created_at'>>) {
    const { data, error } = await this.supabase
      .from('achievements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from('achievements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // This method should be called periodically to check if a user has earned new achievements
  async checkAchievements(userId: string) {
    // Get all achievements
    const { data: achievements } = await this.supabase
      .from('achievements')
      .select('*')
      .order('title');
    
    if (!achievements) return;
    
    // Get user stats
    const { data: responses } = await this.supabase
      .from('user_responses')
      .select('id, is_correct')
      .eq('user_id', userId);
    
    const { data: progress } = await this.supabase
      .from('user_progress')
      .select('completion_percentage')
      .eq('user_id', userId)
      .eq('completion_percentage', 100);
    
    // Get already unlocked achievements
    const { data: unlockedAchievements } = await this.supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);
    
    const unlockedIds = unlockedAchievements?.map(ua => ua.achievement_id) || [];
    
    // Stats for criteria matching
    const stats = {
      totalResponses: responses?.length || 0,
      correctResponses: responses?.filter(r => r.is_correct).length || 0,
      completedTopics: progress?.length || 0
    };
    
    // Check each achievement
    for (const achievement of achievements) {
      if (unlockedIds.includes(achievement.id)) {
        continue; // Already unlocked
      }
      
      // Check if criteria is met
      const criteria = achievement.criteria as Record<string, unknown>;
      let criteriaMatched = true;
      
      for (const [key, value] of Object.entries(criteria)) {
        if (stats[key] < value) {
          criteriaMatched = false;
          break;
        }
      }
      
      if (criteriaMatched) {
        await this.unlockAchievement(userId, achievement.id);
      }
    }
  }
}

export const achievementsService = new AchievementsService(); 