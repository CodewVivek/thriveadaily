/*
  # Update profiles table schema

  1. Schema Updates
    - Add new fields for enhanced profile functionality
    - Medical conditions, sleep schedule, water intake, workout preferences
    - Remove username requirement (keep for existing data)

  2. Security
    - Maintain existing RLS policies
    - Update trigger function for new user creation
*/

-- Add new columns to profiles table
DO $$
BEGIN
  -- Add medical_conditions column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'medical_conditions'
  ) THEN
    ALTER TABLE profiles ADD COLUMN medical_conditions text;
  END IF;

  -- Add wake_time column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'wake_time'
  ) THEN
    ALTER TABLE profiles ADD COLUMN wake_time time DEFAULT '07:00';
  END IF;

  -- Add sleep_time column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'sleep_time'
  ) THEN
    ALTER TABLE profiles ADD COLUMN sleep_time time DEFAULT '23:00';
  END IF;

  -- Add water_intake_goal column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'water_intake_goal'
  ) THEN
    ALTER TABLE profiles ADD COLUMN water_intake_goal integer DEFAULT 8;
  END IF;

  -- Add preferred_workout column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'preferred_workout'
  ) THEN
    ALTER TABLE profiles ADD COLUMN preferred_workout text DEFAULT 'cardio';
  END IF;
END $$;

-- Make username nullable and provide default
ALTER TABLE profiles ALTER COLUMN username DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN username SET DEFAULT '';

-- Update the handle_new_user function
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

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();