export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  goals: {
    weightTarget: number;
    dailyCalories: number;
    workoutFrequency: number;
    workHours: number;
  };
  createdAt: string;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  date: string;
}

export interface WorkSession {
  id: string;
  task: string;
  category: string;
  duration: number;
  completed: boolean;
  date: string;
  startTime: string;
  endTime?: string;
}

export interface Goal {
  id: string;
  type: 'diet' | 'workout' | 'work';
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  achieved: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'diet' | 'workout' | 'work';
}

export interface Streak {
  diet: number;
  workout: number;
  work: number;
}