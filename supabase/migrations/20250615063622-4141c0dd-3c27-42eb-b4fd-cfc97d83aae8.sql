
-- Create user progression tracking table
CREATE TABLE public.user_progression (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  total_points INTEGER NOT NULL DEFAULT 0,
  templates_used INTEGER NOT NULL DEFAULT 0,
  campaigns_created INTEGER NOT NULL DEFAULT 0,
  achievements_unlocked TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points_reward INTEGER NOT NULL DEFAULT 0,
  unlock_condition JSONB NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements tracking
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create gamified template customizations table
CREATE TABLE public.template_customizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_base_id TEXT NOT NULL, -- References the base template ID from frontend
  customization_data JSONB NOT NULL DEFAULT '{}',
  template_name TEXT NOT NULL,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_customizations ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_progression
CREATE POLICY "Users can view their own progression" 
  ON public.user_progression FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progression" 
  ON public.user_progression FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progression" 
  ON public.user_progression FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for achievements (read-only for users)
CREATE POLICY "Anyone can view achievements" 
  ON public.achievements FOR SELECT 
  TO authenticated
  USING (true);

-- RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" 
  ON public.user_achievements FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" 
  ON public.user_achievements FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for template_customizations
CREATE POLICY "Users can manage their own customizations" 
  ON public.template_customizations FOR ALL 
  USING (auth.uid() = user_id);

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, points_reward, unlock_condition, category) VALUES
('First Steps', 'Create your first gamified template', 'Star', 100, '{"templates_used": 1}', 'templates'),
('Game Master', 'Use 10 different gamified templates', 'GamepadIcon', 200, '{"templates_used": 10}', 'templates'),
('High Roller', 'Create a spin wheel popup', 'RotateCcw', 150, '{"template_types": ["spin-wheel"]}', 'templates'),
('Speed Gamer', 'Setup a game popup in under 2 minutes', 'Rocket', 100, '{"quick_setup": true}', 'speed'),
('Lucky Winner', 'Generate 100+ leads with game templates', 'Trophy', 300, '{"leads_generated": 100}', 'performance'),
('Customization King', 'Customize 5 different templates', 'Crown', 250, '{"customizations_made": 5}', 'customization'),
('Campaign Master', 'Create 5 successful campaigns', 'Target', 400, '{"campaigns_created": 5}', 'campaigns'),
('Level Up', 'Reach level 5', 'TrendingUp', 500, '{"level": 5}', 'progression');

-- Function to update user progression
CREATE OR REPLACE FUNCTION public.update_user_progression(
  p_user_id UUID,
  p_action TEXT,
  p_data JSONB DEFAULT '{}'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_progression RECORD;
  new_points INTEGER := 0;
  new_level INTEGER;
BEGIN
  -- Get or create user progression
  INSERT INTO public.user_progression (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  SELECT * INTO current_progression 
  FROM public.user_progression 
  WHERE user_id = p_user_id;
  
  -- Calculate points based on action
  CASE p_action
    WHEN 'template_used' THEN
      new_points := 50;
      UPDATE public.user_progression 
      SET templates_used = templates_used + 1
      WHERE user_id = p_user_id;
    WHEN 'campaign_created' THEN
      new_points := 100;
      UPDATE public.user_progression 
      SET campaigns_created = campaigns_created + 1
      WHERE user_id = p_user_id;
    WHEN 'template_customized' THEN
      new_points := 25;
    WHEN 'achievement_unlocked' THEN
      new_points := COALESCE((p_data->>'points')::INTEGER, 0);
  END CASE;
  
  -- Update total points
  UPDATE public.user_progression 
  SET 
    total_points = total_points + new_points,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Calculate new level (every 500 points = 1 level)
  SELECT total_points INTO current_progression.total_points
  FROM public.user_progression 
  WHERE user_id = p_user_id;
  
  new_level := GREATEST(1, (current_progression.total_points / 500) + 1);
  
  -- Update level if changed
  IF new_level > current_progression.level THEN
    UPDATE public.user_progression 
    SET level = new_level
    WHERE user_id = p_user_id;
  END IF;
  
  RETURN TRUE;
END;
$$;
