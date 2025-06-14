
-- Create tracked_users table to store users tracked by the beacon
CREATE TABLE public.tracked_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  cookie_id TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  first_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  page_views INTEGER NOT NULL DEFAULT 0,
  session_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(website_id, cookie_id)
);

-- Create user_events table to store user interactions
CREATE TABLE public.user_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  tracked_user_id UUID NOT NULL REFERENCES public.tracked_users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  url TEXT NOT NULL,
  referrer TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL
);

-- Add Row Level Security (RLS)
ALTER TABLE public.tracked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Create policies for tracked_users (accessible via website ownership)
CREATE POLICY "Users can view tracked users for their websites" 
  ON public.tracked_users 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.websites 
      WHERE websites.id = tracked_users.website_id 
      AND websites.user_id = auth.uid()
    )
  );

CREATE POLICY "Tracked users can be inserted" 
  ON public.tracked_users 
  FOR INSERT 
  WITH CHECK (true); -- Allow beacon to insert tracked users

CREATE POLICY "Tracked users can be updated" 
  ON public.tracked_users 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.websites 
      WHERE websites.id = tracked_users.website_id 
      AND websites.user_id = auth.uid()
    )
  );

-- Create policies for user_events (accessible via website ownership)
CREATE POLICY "Users can view events for their websites" 
  ON public.user_events 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.websites 
      WHERE websites.id = user_events.website_id 
      AND websites.user_id = auth.uid()
    )
  );

CREATE POLICY "Events can be inserted" 
  ON public.user_events 
  FOR INSERT 
  WITH CHECK (true); -- Allow beacon to insert events

-- Create indexes for performance
CREATE INDEX idx_tracked_users_website_id ON public.tracked_users(website_id);
CREATE INDEX idx_tracked_users_cookie_id ON public.tracked_users(cookie_id);
CREATE INDEX idx_user_events_website_id ON public.user_events(website_id);
CREATE INDEX idx_user_events_tracked_user_id ON public.user_events(tracked_user_id);
CREATE INDEX idx_user_events_timestamp ON public.user_events(timestamp);
