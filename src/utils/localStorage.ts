import { User, FoodEntry, Exercise, WorkSession, Goal, Achievement, Streak } from '../types';

const STORAGE_KEYS = {
  user: 'tracker_user',
  foodEntries: 'tracker_food_entries',
  exercises: 'tracker_exercises',
  workSessions: 'tracker_work_sessions',
  goals: 'tracker_goals',
  achievements: 'tracker_achievements',
  streaks: 'tracker_streaks',
};

export const storage = {
  // User
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.user);
    return data ? JSON.parse(data) : null;
  },
  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  },

  // Food Entries
  getFoodEntries: (): FoodEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.foodEntries);
    return data ? JSON.parse(data) : [];
  },
  setFoodEntries: (entries: FoodEntry[]): void => {
    localStorage.setItem(STORAGE_KEYS.foodEntries, JSON.stringify(entries));
  },
  addFoodEntry: (entry: FoodEntry): void => {
    const entries = storage.getFoodEntries();
    entries.push(entry);
    storage.setFoodEntries(entries);
  },

  // Exercises
  getExercises: (): Exercise[] => {
    const data = localStorage.getItem(STORAGE_KEYS.exercises);
    return data ? JSON.parse(data) : [];
  },
  setExercises: (exercises: Exercise[]): void => {
    localStorage.setItem(STORAGE_KEYS.exercises, JSON.stringify(exercises));
  },
  addExercise: (exercise: Exercise): void => {
    const exercises = storage.getExercises();
    exercises.push(exercise);
    storage.setExercises(exercises);
  },

  // Work Sessions
  getWorkSessions: (): WorkSession[] => {
    const data = localStorage.getItem(STORAGE_KEYS.workSessions);
    return data ? JSON.parse(data) : [];
  },
  setWorkSessions: (sessions: WorkSession[]): void => {
    localStorage.setItem(STORAGE_KEYS.workSessions, JSON.stringify(sessions));
  },
  addWorkSession: (session: WorkSession): void => {
    const sessions = storage.getWorkSessions();
    sessions.push(session);
    storage.setWorkSessions(sessions);
  },

  // Goals
  getGoals: (): Goal[] => {
    const data = localStorage.getItem(STORAGE_KEYS.goals);
    return data ? JSON.parse(data) : [];
  },
  setGoals: (goals: Goal[]): void => {
    localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals));
  },
  addGoal: (goal: Goal): void => {
    const goals = storage.getGoals();
    goals.push(goal);
    storage.setGoals(goals);
  },

  // Achievements
  getAchievements: (): Achievement[] => {
    const data = localStorage.getItem(STORAGE_KEYS.achievements);
    return data ? JSON.parse(data) : [];
  },
  setAchievements: (achievements: Achievement[]): void => {
    localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(achievements));
  },
  addAchievement: (achievement: Achievement): void => {
    const achievements = storage.getAchievements();
    achievements.push(achievement);
    storage.setAchievements(achievements);
  },

  // Streaks
  getStreaks: (): Streak => {
    const data = localStorage.getItem(STORAGE_KEYS.streaks);
    return data ? JSON.parse(data) : { diet: 0, workout: 0, work: 0 };
  },
  setStreaks: (streaks: Streak): void => {
    localStorage.setItem(STORAGE_KEYS.streaks, JSON.stringify(streaks));
  },
};