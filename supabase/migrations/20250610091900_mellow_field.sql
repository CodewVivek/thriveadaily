/*
  # Create authentication trigger for new user profiles

  1. Database Trigger
    - Creates a trigger that fires when a new user is created in auth.users
    - Automatically creates a corresponding profile in the profiles table
    - Uses the user's metadata (username, full_name) from the signup process

  2. Security
    - Trigger runs with security definer to bypass RLS during profile creation
    - Ensures every authenticated user gets a profile automatically
*/

-- Create the trigger that fires when a new user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the handle_new_user function to properly handle the profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', ''),
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$;