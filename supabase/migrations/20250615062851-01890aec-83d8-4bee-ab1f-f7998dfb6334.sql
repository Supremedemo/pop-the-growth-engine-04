
-- Create a simple table to track email confirmations
CREATE TABLE public.email_confirmations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  confirmed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_confirmations ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see their own confirmations
CREATE POLICY "Users can view their own confirmations" 
  ON public.email_confirmations 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own confirmations
CREATE POLICY "Users can create their own confirmations" 
  ON public.email_confirmations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Function to handle email confirmation
CREATE OR REPLACE FUNCTION public.handle_email_confirmation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert confirmation record when user email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    INSERT INTO public.email_confirmations (user_id)
    VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to track email confirmations
CREATE TRIGGER on_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_email_confirmation();
