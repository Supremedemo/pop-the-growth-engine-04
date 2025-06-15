
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface UserProgression {
  id: string;
  user_id: string;
  level: number;
  total_points: number;
  templates_used: number;
  campaigns_created: number;
  achievements_unlocked: string[];
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points_reward: number;
  unlock_condition: any;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement;
}

export const useGamification = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user progression
  const { data: userProgression, isLoading: isLoadingProgression } = useQuery({
    queryKey: ['user-progression', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_progression')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user progression:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user
  });

  // Get all achievements
  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('points_reward', { ascending: true });
      
      if (error) {
        console.error('Error fetching achievements:', error);
        return [];
      }
      
      return data as Achievement[];
    }
  });

  // Get user achievements
  const { data: userAchievements } = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching user achievements:', error);
        return [];
      }
      
      return data as UserAchievement[];
    },
    enabled: !!user
  });

  // Update user progression
  const updateProgressionMutation = useMutation({
    mutationFn: async ({ action, data }: { action: string; data?: any }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data: result, error } = await supabase.rpc('update_user_progression', {
        p_user_id: user.id,
        p_action: action,
        p_data: data || {}
      });
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progression'] });
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
    },
    onError: (error) => {
      console.error('Error updating progression:', error);
      toast.error('Failed to update progression');
    }
  });

  // Unlock achievement
  const unlockAchievementMutation = useMutation({
    mutationFn: async (achievementId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId
        });
      
      if (error) throw error;
      
      // Update progression with achievement points
      const achievement = achievements?.find(a => a.id === achievementId);
      if (achievement) {
        await updateProgressionMutation.mutateAsync({
          action: 'achievement_unlocked',
          data: { points: achievement.points_reward }
        });
      }
    },
    onSuccess: (_, achievementId) => {
      const achievement = achievements?.find(a => a.id === achievementId);
      if (achievement) {
        toast.success(`Achievement unlocked: ${achievement.name}! +${achievement.points_reward} points`);
      }
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
    },
    onError: (error: any) => {
      if (error.code !== '23505') { // Not a duplicate key error
        console.error('Error unlocking achievement:', error);
        toast.error('Failed to unlock achievement');
      }
    }
  });

  // Check for new achievements
  const checkAchievements = async () => {
    if (!userProgression || !achievements || !userAchievements) return;
    
    const unlockedAchievementIds = userAchievements.map(ua => ua.achievement_id);
    
    for (const achievement of achievements) {
      if (unlockedAchievementIds.includes(achievement.id)) continue;
      
      const condition = achievement.unlock_condition;
      let shouldUnlock = false;
      
      // Check various unlock conditions
      if (condition.templates_used && userProgression.templates_used >= condition.templates_used) {
        shouldUnlock = true;
      }
      if (condition.campaigns_created && userProgression.campaigns_created >= condition.campaigns_created) {
        shouldUnlock = true;
      }
      if (condition.level && userProgression.level >= condition.level) {
        shouldUnlock = true;
      }
      
      if (shouldUnlock) {
        unlockAchievementMutation.mutate(achievement.id);
      }
    }
  };

  // Auto-check achievements when progression changes
  useEffect(() => {
    if (userProgression && achievements && userAchievements) {
      checkAchievements();
    }
  }, [userProgression, achievements, userAchievements]);

  const getProgressToNextLevel = () => {
    if (!userProgression) return { current: 0, required: 500, percentage: 0 };
    
    const currentLevelPoints = (userProgression.level - 1) * 500;
    const nextLevelPoints = userProgression.level * 500;
    const currentProgress = userProgression.total_points - currentLevelPoints;
    const requiredForNext = nextLevelPoints - currentLevelPoints;
    
    return {
      current: currentProgress,
      required: requiredForNext,
      percentage: Math.min((currentProgress / requiredForNext) * 100, 100)
    };
  };

  return {
    userProgression,
    achievements: achievements || [],
    userAchievements: userAchievements || [],
    isLoadingProgression,
    updateProgression: updateProgressionMutation.mutate,
    unlockAchievement: unlockAchievementMutation.mutate,
    getProgressToNextLevel,
    isUpdatingProgression: updateProgressionMutation.isPending
  };
};
