import { BaseService } from './BaseService';

export class ProgressService extends BaseService {
  async updateProgress(userId: string, topicId: string, completionPercentage: number, timeSpent: number) {
    // Check if a record exists
    const { data, error } = await this.supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    if (data) {
      // Update existing record
      const { error: updateError } = await this.supabase
        .from('user_progress')
        .update({
          completion_percentage: completionPercentage,
          time_spent: data.time_spent + timeSpent,
          last_studied: new Date().toISOString()
        })
        .eq('id', data.id);
      
      if (updateError) throw updateError;
    } else {
      // Insert new record
      const { error: insertError } = await this.supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          topic_id: topicId,
          completion_percentage: completionPercentage,
          time_spent: timeSpent,
          last_studied: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
    }

    // Update streak when user makes progress
    await this.updateStreak(userId);

    // Add points for completing a session
    await this.addPoints(userId, 10); // Add 10 points for each progress update
  }

  async getProgressByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from('user_progress')
      .select(`
        *,
        topics:topic_id (
          id,
          title,
          subject_id
        ),
        subjects:topics!inner (
          id,
          name
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }

  async getProgressByUserAndTopic(userId: string, topicId: string) {
    const { data, error } = await this.supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  }

  async getUserAnalytics(userId: string) {
    // Get strengths and weaknesses
    const { data: responses, error: responsesError } = await this.supabase
      .from('user_responses')
      .select(`
        is_correct,
        time_taken,
        questions!inner(subject_id, topic_id, difficulty)
      `)
      .eq('user_id', userId);
    
    if (responsesError) throw responsesError;
    
    // Process data to compute analytics
    const subjectPerformance = {};
    const averageTime = responses.length > 0 
      ? responses.reduce((acc, item) => acc + (item.time_taken || 0), 0) / responses.length 
      : 0;
    
    // Get total study time
    const { data: progress, error: progressError } = await this.supabase
      .from('user_progress')
      .select('time_spent')
      .eq('user_id', userId);
    
    if (progressError) throw progressError;
    
    const totalStudyTime = progress.reduce((acc, item) => acc + item.time_spent, 0);
    
    // Calculate completion
    const { data: completedTopics, error: completionError } = await this.supabase
      .from('user_progress')
      .select('topic_id')
      .eq('user_id', userId)
      .eq('completion_percentage', 100);
    
    if (completionError) throw completionError;

    // Get user streaks and points
    const { data: streakData, error: streakError } = await this.supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (streakError && streakError.code !== 'PGRST116') {
      throw streakError;
    }

    const { data: pointsData, error: pointsError } = await this.supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (pointsError && pointsError.code !== 'PGRST116') {
      throw pointsError;
    }
    
    return {
      totalResponses: responses.length,
      correctResponses: responses.filter(r => r.is_correct).length,
      averageTime,
      totalStudyTime,
      completedTopics: completedTopics.length,
      streakDays: streakData?.current_streak || 0,
      longestStreak: streakData?.longest_streak || 0, 
      totalPoints: pointsData?.total_points || 0
    };
  }

  // Method to update user streak
  async updateStreak(userId: string) {
    // Get existing streak data
    const { data: streakData, error: streakError } = await this.supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (streakError && streakError.code !== 'PGRST116') {
      throw streakError;
    }
    
    if (streakData) {
      // Check if last activity was yesterday
      const lastActivity = new Date(streakData.last_activity_date);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      
      let currentStreak = streakData.current_streak;
      
      // If user already logged in today, don't update streak
      if (streakData.last_activity_date === today) {
        return;
      }
      // If user logged in yesterday, increment streak
      else if (streakData.last_activity_date === yesterdayString) {
        currentStreak += 1;
      } 
      // Otherwise reset streak to 1
      else {
        currentStreak = 1;
      }
      
      // Update streak record
      const { error: updateError } = await this.supabase
        .from('user_streaks')
        .update({
          current_streak: currentStreak,
          longest_streak: Math.max(currentStreak, streakData.longest_streak),
          last_activity_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('id', streakData.id);
        
      if (updateError) throw updateError;
    } else {
      // Create new streak record with streak of 1
      const { error: insertError } = await this.supabase
        .from('user_streaks')
        .insert({
          user_id: userId,
          current_streak: 1,
          longest_streak: 1,
          last_activity_date: today
        });
        
      if (insertError) throw insertError;
    }
  }
  
  // Method to add points to user
  async addPoints(userId: string, pointsToAdd: number) {
    // Get existing points data
    const { data: pointsData, error: pointsError } = await this.supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (pointsError && pointsError.code !== 'PGRST116') {
      throw pointsError;
    }
    
    if (pointsData) {
      // Update existing points
      const { error: updateError } = await this.supabase
        .from('user_points')
        .update({
          total_points: pointsData.total_points + pointsToAdd,
          updated_at: new Date().toISOString()
        })
        .eq('id', pointsData.id);
        
      if (updateError) throw updateError;
    } else {
      // Create new points record
      const { error: insertError } = await this.supabase
        .from('user_points')
        .insert({
          user_id: userId,
          total_points: pointsToAdd
        });
        
      if (insertError) throw insertError;
    }
  }

  // Method to get user profile data
  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  }

  // Method to get formatted progress data with subjects
  async getFormattedProgressData(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('user_progress')
        .select(`
          *,
          topics:topic_id (
            id,
            title,
            subject_id
          ),
          subjects:topic_id(
            subject:subject_id (
              id,
              name
            )
          )
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Transform data to a more accessible format
      return data.map(item => {
        const subjectInfo = item.subjects?.subject;
        return {
          ...item,
          subjectInfo: {
            id: subjectInfo?.id || null,
            name: subjectInfo?.name || 'Unknown Subject'
          }
        };
      });
    } catch (error) {
      console.error('Error fetching formatted progress data:', error);
      return [];
    }
  }

  // Method to get user achievements with details
  async getUserAchievements(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('user_achievements')
        .select(`
          id,
          unlocked_at,
          achievement:achievement_id (
            id,
            title,
            description,
            icon
          )
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        unlockedAt: item.unlocked_at,
        name: item.achievement?.title || 'Unknown Achievement',
        description: item.achievement?.description || '',
        icon: item.achievement?.icon || 'award'
      }));
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }
  }
  
  // Record a practice session to track user activity
  async recordPracticeSession(
    userId: string,
    subjectId: string,
    topicId: string,
    questionsAttempted: number,
    questionsCorrect: number,
    durationSeconds: number
  ) {
    try {
      // Create practice session record
      const { data, error } = await this.supabase
        .from('user_practice_sessions')
        .insert({
          user_id: userId,
          subject_id: subjectId,
          topic_id: topicId,
          questions_attempted: questionsAttempted,
          questions_correct: questionsCorrect,
          duration_seconds: durationSeconds,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update user streak and points
      await this.updateStreak(userId);
      await this.addPoints(userId, questionsCorrect * 10); // 10 points per correct answer
      
      return data;
    } catch (error) {
      console.error('Error recording practice session:', error);
      return null;
    }
  }
}

export const progressService = new ProgressService(); 