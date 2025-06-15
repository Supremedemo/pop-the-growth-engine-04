
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface TemplateCustomization {
  id: string;
  user_id: string;
  template_base_id: string;
  customization_data: any;
  template_name: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface GamifiedTemplate {
  id: string;
  name: string;
  description: string;
  category: 'spin-wheel' | 'scratch-card' | 'slot-machine' | 'memory-game' | 'quiz' | 'survey';
  preview_image: string;
  default_config: any;
  level_required: number;
}

export const useTemplateCustomization = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Default gamified templates
  const gamifiedTemplates: GamifiedTemplate[] = [
    {
      id: 'spin-wheel',
      name: 'Spin the Wheel',
      description: 'Classic spin wheel with customizable prizes and colors',
      category: 'spin-wheel',
      preview_image: '/placeholder.svg',
      level_required: 1,
      default_config: {
        prizes: ['10% Off', '20% Off', 'Free Shipping', 'Try Again', '30% Off', 'Free Gift'],
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
        backgroundColor: '#ffffff',
        textColor: '#333333',
        buttonText: 'Spin to Win!',
        centerText: 'SPIN',
        showConfetti: true
      }
    },
    {
      id: 'scratch-card',
      name: 'Scratch Card',
      description: 'Interactive scratch card with hidden rewards',
      category: 'scratch-card',
      preview_image: '/placeholder.svg',
      level_required: 2,
      default_config: {
        scratchImage: '/placeholder.svg',
        revealText: 'You Won 20% Off!',
        backgroundColor: '#f8f9fa',
        cardColor: '#silver',
        textColor: '#333333',
        buttonText: 'Claim Your Prize',
        showSparkles: true
      }
    },
    {
      id: 'slot-machine',
      name: 'Slot Machine',
      description: 'Fun slot machine with animated reels',
      category: 'slot-machine',
      preview_image: '/placeholder.svg',
      level_required: 3,
      default_config: {
        symbols: ['🍒', '🍋', '🍊', '🍇', '⭐', '💎'],
        backgroundColor: '#1a1a2e',
        machineColor: '#16213e',
        textColor: '#ffffff',
        buttonText: 'Pull the Lever!',
        winMessages: ['Jackpot!', 'Winner!', 'Lucky you!'],
        showLights: true
      }
    },
    {
      id: 'memory-game',
      name: 'Memory Game',
      description: 'Match cards to win prizes',
      category: 'memory-game',
      preview_image: '/placeholder.svg',
      level_required: 4,
      default_config: {
        cardCount: 8,
        cardBackColor: '#4ECDC4',
        cardFrontColor: '#ffffff',
        backgroundColor: '#f8f9fa',
        textColor: '#333333',
        buttonText: 'Start Game',
        prizes: ['5% Off', '15% Off', '25% Off', 'Free Shipping'],
        showTimer: true
      }
    },
    {
      id: 'quiz',
      name: 'Interactive Quiz',
      description: 'Engage users with a fun quiz',
      category: 'quiz',
      preview_image: '/placeholder.svg',
      level_required: 5,
      default_config: {
        questions: [
          {
            question: 'What\'s your favorite season?',
            options: ['Spring', 'Summer', 'Fall', 'Winter']
          }
        ],
        backgroundColor: '#ffffff',
        primaryColor: '#4ECDC4',
        textColor: '#333333',
        buttonText: 'Start Quiz',
        showProgress: true
      }
    }
  ];

  // Get user customizations
  const { data: customizations, isLoading } = useQuery({
    queryKey: ['template-customizations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('template_customizations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching customizations:', error);
        return [];
      }
      
      return data as TemplateCustomization[];
    },
    enabled: !!user
  });

  // Save customization
  const saveCustomizationMutation = useMutation({
    mutationFn: async (customization: Omit<TemplateCustomization, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('template_customizations')
        .insert({
          ...customization,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Template customization saved!');
      queryClient.invalidateQueries({ queryKey: ['template-customizations'] });
    },
    onError: (error) => {
      console.error('Error saving customization:', error);
      toast.error('Failed to save customization');
    }
  });

  // Update customization
  const updateCustomizationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TemplateCustomization> }) => {
      const { data, error } = await supabase
        .from('template_customizations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Template updated!');
      queryClient.invalidateQueries({ queryKey: ['template-customizations'] });
    },
    onError: (error) => {
      console.error('Error updating customization:', error);
      toast.error('Failed to update template');
    }
  });

  // Delete customization
  const deleteCustomizationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('template_customizations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Template deleted!');
      queryClient.invalidateQueries({ queryKey: ['template-customizations'] });
    },
    onError: (error) => {
      console.error('Error deleting customization:', error);
      toast.error('Failed to delete template');
    }
  });

  return {
    gamifiedTemplates,
    customizations: customizations || [],
    isLoading,
    saveCustomization: saveCustomizationMutation.mutate,
    updateCustomization: updateCustomizationMutation.mutate,
    deleteCustomization: deleteCustomizationMutation.mutate,
    isSaving: saveCustomizationMutation.isPending,
    isUpdating: updateCustomizationMutation.isPending,
    isDeleting: deleteCustomizationMutation.isPending
  };
};
