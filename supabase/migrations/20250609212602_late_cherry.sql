/*
  # Create food entries table

  1. New Tables
    - `food_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `calories` (numeric)
      - `protein` (numeric)
      - `carbs` (numeric)
      - `fat` (numeric)
      - `quantity` (numeric)
      - `unit` (text)
      - `meal_type` (text)
      - `date` (date)
      - `photo_url` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `food_entries` table
    - Add policies for users to manage their own food entries
*/

CREATE TABLE IF NOT EXISTS food_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  calories numeric NOT NULL DEFAULT 0,
  protein numeric NOT NULL DEFAULT 0,
  carbs numeric NOT NULL DEFAULT 0,
  fat numeric NOT NULL DEFAULT 0,
  quantity numeric NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'serving',
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  date date NOT NULL DEFAULT CURRENT_DATE,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own food entries"
  ON food_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food entries"
  ON food_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food entries"
  ON food_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food entries"
  ON food_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);