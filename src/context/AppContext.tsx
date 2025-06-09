import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, FoodEntry, Exercise, WorkSession, Goal, Achievement, Streak } from '../types';
import { storage } from '../utils/localStorage';

interface AppContextType {
  user: User | null;
  setUser: (user: User) => void;
  foodEntries: FoodEntry[];
  exercises: Exercise[];
  workSessions: WorkSession[];
  goals: Goal[];
  achievements: Achievement[];
  streaks: Streak;
  addFoodEntry: (entry: FoodEntry) => void;
  addExercise: (exercise: Exercise) => void;
  addWorkSession: (session: WorkSession) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  addAchievement: (achievement: Achievement) => void;
  updateStreaks: (streaks: Streak) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workSessions, setWorkSessions] = useState<WorkSession[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streaks, setStreaks] = useState<Streak>({ diet: 0, workout: 0, work: 0 });

  useEffect(() => {
    // Load data from localStorage on app start
    const savedUser = storage.getUser();
    const savedFoodEntries = storage.getFoodEntries();
    const savedExercises = storage.getExercises();
    const savedWorkSessions = storage.getWorkSessions();
    const savedGoals = storage.getGoals();
    const savedAchievements = storage.getAchievements();
    const savedStreaks = storage.getStreaks();

    if (savedUser) setUserState(savedUser);
    setFoodEntries(savedFoodEntries);
    setExercises(savedExercises);
    setWorkSessions(savedWorkSessions);
    setGoals(savedGoals);
    setAchievements(savedAchievements);
    setStreaks(savedStreaks);
  }, []);

  const setUser = (userData: User) => {
    setUserState(userData);
    storage.setUser(userData);
  };

  const addFoodEntry = (entry: FoodEntry) => {
    const updatedEntries = [...foodEntries, entry];
    setFoodEntries(updatedEntries);
    storage.setFoodEntries(updatedEntries);
  };

  const addExercise = (exercise: Exercise) => {
    const updatedExercises = [...exercises, exercise];
    setExercises(updatedExercises);
    storage.setExercises(updatedExercises);
  };

  const addWorkSession = (session: WorkSession) => {
    const updatedSessions = [...workSessions, session];
    setWorkSessions(updatedSessions);
    storage.setWorkSessions(updatedSessions);
  };

  const addGoal = (goal: Goal) => {
    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    storage.setGoals(updatedGoals);
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, ...updates } : goal
    );
    setGoals(updatedGoals);
    storage.setGoals(updatedGoals);
  };

  const addAchievement = (achievement: Achievement) => {
    const updatedAchievements = [...achievements, achievement];
    setAchievements(updatedAchievements);
    storage.setAchievements(updatedAchievements);
  };

  const updateStreaks = (newStreaks: Streak) => {
    setStreaks(newStreaks);
    storage.setStreaks(newStreaks);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        foodEntries,
        exercises,
        workSessions,
        goals,
        achievements,
        streaks,
        addFoodEntry,
        addExercise,
        addWorkSession,
        addGoal,
        updateGoal,
        addAchievement,
        updateStreaks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};