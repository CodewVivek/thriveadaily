import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          age: number;
          weight: number;
          height: number;
          goals: {
            weightTarget: number;
            dailyCalories: number;
            workoutFrequency: number;
            workHours: number;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name: string;
          age?: number;
          weight?: number;
          height?: number;
          goals?: any;
        };
        Update: {
          username?: string;
          full_name?: string;
          age?: number;
          weight?: number;
          height?: number;
          goals?: any;
          updated_at?: string;
        };
      };
      food_entries: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          quantity: number;
          unit: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          date: string;
          photo_url?: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          quantity: number;
          unit: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          date: string;
          photo_url?: string;
        };
        Update: {
          name?: string;
          calories?: number;
          protein?: number;
          carbs?: number;
          fat?: number;
          quantity?: number;
          unit?: string;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          date?: string;
          photo_url?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          sets: number;
          reps: number;
          weight?: number;
          duration?: number;
          date: string;
          photo_url?: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          category: string;
          sets: number;
          reps: number;
          weight?: number;
          duration?: number;
          date: string;
          photo_url?: string;
        };
        Update: {
          name?: string;
          category?: string;
          sets?: number;
          reps?: number;
          weight?: number;
          duration?: number;
          date?: string;
          photo_url?: string;
        };
      };
      work_sessions: {
        Row: {
          id: string;
          user_id: string;
          task: string;
          category: string;
          duration: number;
          completed: boolean;
          date: string;
          start_time: string;
          end_time?: string;
          photo_url?: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          task: string;
          category: string;
          duration: number;
          completed: boolean;
          date: string;
          start_time: string;
          end_time?: string;
          photo_url?: string;
        };
        Update: {
          task?: string;
          category?: string;
          duration?: number;
          completed?: boolean;
          date?: string;
          start_time?: string;
          end_time?: string;
          photo_url?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          type: 'diet' | 'workout' | 'work';
          title: string;
          target: number;
          current: number;
          unit: string;
          deadline: string;
          achieved: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: 'diet' | 'workout' | 'work';
          title: string;
          target: number;
          current?: number;
          unit: string;
          deadline: string;
          achieved?: boolean;
        };
        Update: {
          type?: 'diet' | 'workout' | 'work';
          title?: string;
          target?: number;
          current?: number;
          unit?: string;
          deadline?: string;
          achieved?: boolean;
        };
      };
    };
  };
};