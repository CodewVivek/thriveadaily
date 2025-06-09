/*
  # Create work sessions table

  1. New Tables
    - `work_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `task` (text)
      - `category` (text)
      - `duration` (integer, in minutes)
      - `completed` (boolean)
      - `date` (date)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz, optional)
      - `photo_url` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `work_sessions` table
    - Add policies for users to manage their own work sessions
*/

CREATE TABLE IF NOT EXISTS work_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  task text NOT NULL,
  category text NOT NULL DEFAULT 'development',
  duration integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  date date NOT NULL DEFAULT CURRENT_DATE,
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own work sessions"
  ON work_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own work sessions"
  ON work_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own work sessions"
  ON work_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own work sessions"
  ON work_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);