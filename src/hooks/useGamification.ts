import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Badge {
  id: string;
  badge_type: string;
  badge_name: string;
  badge_description: string;
  earned_at: string;
}

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  progress: number;
  target_value: number;
  completed_at: string | null;
}

interface GamificationState {
  badges: Badge[];
  achievements: Achievement[];
  leaderboard: any;
  isLoading: boolean;
  error: string | null;
}

export function useGamification() {
  const { user } = useAuth();
  const [state, setState] = useState<GamificationState>({
    badges: [],
    achievements: [],
    leaderboard: null,
    isLoading: false,
    error: null
  });

  // Load user badges
  const loadBadges = useCallback(async () => {
    if (!user) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke('gamification-system', {
        body: {
          action: 'get_user_badges',
          userId: user.id
        }
      });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        badges: data || [],
        isLoading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to load badges',
        isLoading: false
      }));
    }
  }, [user]);

  // Load user achievements
  const loadAchievements = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('gamification-system', {
        body: {
          action: 'get_user_achievements',
          userId: user.id
        }
      });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        achievements: data || []
      }));
    } catch (error: any) {
      console.error('Failed to load achievements:', error);
    }
  }, [user]);

  // Load leaderboard
  const loadLeaderboard = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('gamification-system', {
        body: {
          action: 'get_leaderboard'
        }
      });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        leaderboard: data
      }));
    } catch (error: any) {
      console.error('Failed to load leaderboard:', error);
    }
  }, []);

  // Check for new achievements
  const checkAchievements = useCallback(async (eventType: string, eventData?: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('gamification-system', {
        body: {
          action: 'check_achievements',
          userId: user.id,
          eventType,
          eventData
        }
      });

      if (error) throw error;

      // If new badges were earned, reload badges
      if (data?.newBadges?.length > 0) {
        await loadBadges();
        await loadAchievements();
        return data.newBadges;
      }

      return [];
    } catch (error: any) {
      console.error('Failed to check achievements:', error);
      return [];
    }
  }, [user, loadBadges, loadAchievements]);

  // Load all data when user changes
  useEffect(() => {
    if (user) {
      loadBadges();
      loadAchievements();
      loadLeaderboard();
    }
  }, [user, loadBadges, loadAchievements, loadLeaderboard]);

  return {
    ...state,
    loadBadges,
    loadAchievements,
    loadLeaderboard,
    checkAchievements
  };
}