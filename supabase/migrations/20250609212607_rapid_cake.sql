/*
  # Create exercises table

  1. New Tables
    - `exercises`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `category` (text)
      - `sets` (integer)
      - `reps` (integer)
      - `weight` (numeric, optional)
      - `duration` (integer, optional)
      - `date` (date)
      - `photo_url` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `exercises` table
    - Add policies for users to manage their own exercises
*/

CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'strength',
  sets integer NOT NULL DEFAULT 1,
  reps integer NOT NULL DEFAULT 1,
  weight numeric,
  duration integer,
  date date NOT NULL DEFAULT CURRENT_DATE,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own exercises"
  ON exercises
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercises"
  ON exercises
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercises"
  ON exercises
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercises"
  ON exercises
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);