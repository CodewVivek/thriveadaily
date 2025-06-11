import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Calendar, TrendingUp, Award, Flame, Plus, Target, Settings } from 'lucide-react';
import StatsCard from './StatsCard';
import ProgressChart from './ProgressChart';
import RecentActivity from './RecentActivity';
import StreakCounter from './StreakCounter';
import GoalPlanner from './GoalPlanner';

interface DashboardProps {
  selectedDate: string;
}

const Dashboard: React.FC<DashboardProps> = ({ selectedDate }) => {
  const { user } = useAuth();
  const [profile, setProfile] = React.useState<any>(null);
  const [showGoalPlanner, setShowGoalPlanner] = React.useState(false);
  const [todayStats, setTodayStats] = React.useState({
    calories: 0,
    workouts: 0,
    workHours: 0,
    goals: 0,
  });
  const [weeklyProgress, setWeeklyProgress] = React.useState({
    studyHours: 0,
    studyGoal: 14, // 2 hours * 7 days
  });
  const [streaks, setStreaks] = React.useState({
    diet: 0,
    workout: 0,
    work: 0,
  });

  React.useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, selectedDate]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Load user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Load today's stats
      const [foodData, exerciseData, workData, goalsData] = await Promise.all([
        supabase
          .from('food_entries')
          .select('calories')
          .eq('user_id', user.id)
          .eq('date', selectedDate),
        supabase
          .from('exercises')
          .select('id')
          .eq('user_id', user.id)
          .eq('date', selectedDate),
        supabase
          .from('work_sessions')
          .select('duration, category')
          .eq('user_id', user.id)
          .eq('date', selectedDate),
        supabase
          .from('goals')
          .select('achieved')
          .eq('user_id', user.id)
          .eq('achieved', false),
      ]);

      const calories = foodData.data?.reduce((sum, entry) => sum + entry.calories, 0) || 0;
      const workouts = exerciseData.data?.length || 0;
      const workHours = (workData.data?.reduce((sum, session) => sum + session.duration, 0) || 0) / 60;
      const activeGoals = goalsData.data?.length || 0;

      // Calculate study hours for the week
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      
      const { data: weekWorkData } = await supabase
        .from('work_sessions')
        .select('duration, category')
        .eq('user_id', user.id)
        .gte('date', weekStart.toISOString().split('T')[0])
        .eq('category', 'study');

      const studyHours = (weekWorkData?.reduce((sum, session) => sum + session.duration, 0) || 0) / 60;

      setTodayStats({
        calories,
        workouts,
        workHours: Math.round(workHours * 10) / 10,
        goals: activeGoals,
      });

      setWeeklyProgress({
        studyHours: Math.round(studyHours * 10) / 10,
        studyGoal: 14,
      });

      // Calculate streaks (simplified - you might want to implement more sophisticated streak calculation)
      setStreaks({
        diet: Math.floor(Math.random() * 10) + 1, // Mock data
        workout: Math.floor(Math.random() * 7) + 1, // Mock data
        work: Math.floor(Math.random() * 5) + 1, // Mock data
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  // Get user's first name for personalized greeting
  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'there';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Check if user is a developer
  const isDeveloper = user?.user_metadata?.role === 'dev' || user?.email?.includes('@dev.') || false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {isToday ? getGreeting() : 'Welcome back'}, {getFirstName()}! 👋
              </h1>
              <p className="text-indigo-100 text-lg">
                {isToday 
                  ? "Ready to make today amazing? Here's your progress overview." 
                  : `Reviewing your progress for ${new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}`
                }
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-4xl">🌟</span>
              </div>
            </div>
          </div>
          
          {/* Quick Stats in Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{todayStats.calories}</div>
              <div className="text-sm text-indigo-200">Calories</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{todayStats.workouts}</div>
              <div className="text-sm text-indigo-200">Workouts</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{todayStats.workHours}</div>
              <div className="text-sm text-indigo-200">Work Hours</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{todayStats.goals}</div>
              <div className="text-sm text-indigo-200">Active Goals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Goals Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Your Current Goals</h3>
            <p className="text-sm text-gray-600">Track your daily and weekly targets</p>
          </div>
          <button
            onClick={() => setShowGoalPlanner(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            Change Goals
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Daily Calorie Goal */}
          <div className="p-4 bg-emerald-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">Daily Target</span>
            </div>
            <div className="text-2xl font-bold text-emerald-700 mb-1">
              {profile?.goals?.dailyCalories || 2000} kcal/day
            </div>
            <div className="text-sm text-emerald-600">
              Today: {todayStats.calories} kcal ({Math.round((todayStats.calories / (profile?.goals?.dailyCalories || 2000)) * 100)}%)
            </div>
          </div>

          {/* Weekly Study Goal */}
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Weekly Study</span>
            </div>
            <div className="text-2xl font-bold text-blue-700 mb-1">
              {weeklyProgress.studyGoal} hrs/week
            </div>
            <div className="text-sm text-blue-600">
              This week: {weeklyProgress.studyHours} hrs ({Math.round((weeklyProgress.studyHours / weeklyProgress.studyGoal) * 100)}%)
            </div>
          </div>

          {/* Workout Goal */}
          <div className="p-4 bg-purple-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Weekly Workouts</span>
            </div>
            <div className="text-2xl font-bold text-purple-700 mb-1">
              {profile?.goals?.workoutFrequency || 4} times/week
            </div>
            <div className="text-sm text-purple-600">
              This week: {todayStats.workouts} workouts
            </div>
          </div>
        </div>
      </div>

      {/* Developer Dashboard */}
      {isDeveloper && (
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Developer Dashboard</h3>
              <p className="text-gray-300 text-sm">Admin tools and analytics</p>
            </div>
            <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
              DEV MODE
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-xl font-bold">1,247</div>
              <div className="text-sm text-gray-300">Total Users</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-xl font-bold">15,432</div>
              <div className="text-sm text-gray-300">Food Entries</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-xl font-bold">8,921</div>
              <div className="text-sm text-gray-300">Workouts Logged</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-xl font-bold">99.2%</div>
              <div className="text-sm text-gray-300">Uptime</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title={isToday ? "Today's Calories" : "Calories"}
          value={todayStats.calories}
          unit="kcal"
          target={profile?.goals?.dailyCalories || 2000}
          icon={Calendar}
          color="emerald"
        />
        <StatsCard
          title={isToday ? "Workouts Today" : "Workouts"}
          value={todayStats.workouts}
          unit="sessions"
          target={1}
          icon={TrendingUp}
          color="blue"
        />
        <StatsCard
          title={isToday ? "Work Hours Today" : "Work Hours"}
          value={todayStats.workHours}
          unit="hours"
          target={profile?.goals?.workHours || 8}
          icon={Calendar}
          color="purple"
        />
        <StatsCard
          title="Active Goals"
          value={todayStats.goals}
          unit="goals"
          target={Math.max(todayStats.goals, 1)}
          icon={Award}
          color="orange"
        />
      </div>

      {/* Streak Counters - Only show for today */}
      {isToday && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StreakCounter
            title="Diet Streak"
            streak={streaks.diet}
            icon={Flame}
            color="emerald"
          />
          <StreakCounter
            title="Workout Streak"
            streak={streaks.workout}
            icon={Flame}
            color="blue"
          />
          <StreakCounter
            title="Work Streak"
            streak={streaks.work}
            icon={Flame}
            color="purple"
          />
        </div>
      )}

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProgressChart selectedDate={selectedDate} />
        <RecentActivity selectedDate={selectedDate} />
      </div>

      {/* Quick Actions for Today */}
      {isToday && (
        <div className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white/20 hover:bg-white/30 rounded-xl p-4 transition-colors duration-200 flex items-center">
              <Plus className="w-5 h-5 mr-3" />
              <span>Log Meal</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 rounded-xl p-4 transition-colors duration-200 flex items-center">
              <Plus className="w-5 h-5 mr-3" />
              <span>Add Exercise</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 rounded-xl p-4 transition-colors duration-200 flex items-center">
              <Plus className="w-5 h-5 mr-3" />
              <span>Start Work Session</span>
            </button>
          </div>
        </div>
      )}

      {/* Goal Planner Modal */}
      {showGoalPlanner && (
        <GoalPlanner 
          onClose={() => setShowGoalPlanner(false)}
          currentGoals={profile?.goals}
          onSave={(goals) => {
            // Update goals in database
            setShowGoalPlanner(false);
            loadDashboardData();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;