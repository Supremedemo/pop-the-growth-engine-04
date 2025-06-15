
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  email_confirmed_at: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

export const useUserManagement = () => {
  const { user } = useAuth();
  const [resetMethod, setResetMethod] = useState<'password' | 'email'>('email');

  // Get current user profile data
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Get user data from auth.users (via RPC or direct query won't work, so we use the auth user)
      const profile: UserProfile = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || null,
        username: user.user_metadata?.username || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        email_confirmed_at: user.email_confirmed_at || null,
        created_at: user.created_at || '',
        last_sign_in_at: user.last_sign_in_at || null,
      };
      
      return profile;
    },
    enabled: !!user
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ email, newPassword }: { email?: string; newPassword?: string }) => {
      if (resetMethod === 'email' && email) {
        // Send password reset email
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`
        });
        if (error) throw error;
        return { method: 'email' };
      } else if (resetMethod === 'password' && newPassword) {
        // Update password directly (requires current session)
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (error) throw error;
        return { method: 'password' };
      }
      throw new Error('Invalid reset method or missing parameters');
    },
    onSuccess: (data) => {
      if (data.method === 'email') {
        toast.success('Password reset email sent successfully!');
      } else {
        toast.success('Password updated successfully!');
      }
    },
    onError: (error: any) => {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to reset password');
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async ({ fullName, username }: { fullName?: string; username?: string }) => {
      const updates: any = {};
      if (fullName !== undefined) updates.full_name = fullName;
      if (username !== undefined) updates.username = username;
      
      const { error } = await supabase.auth.updateUser({
        data: updates
      });
      if (error) throw error;
      
      return updates;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  });

  // Send email OTP
  const sendEmailOTP = async () => {
    if (!user?.email) {
      toast.error('No email address found');
      return;
    }
    
    const { error } = await supabase.auth.signInWithOtp({
      email: user.email,
      options: {
        shouldCreateUser: false
      }
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('OTP sent to your email');
    }
  };

  return {
    userProfile,
    isLoading,
    resetMethod,
    setResetMethod,
    resetPassword: resetPasswordMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    sendEmailOTP,
    isResettingPassword: resetPasswordMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending
  };
};
