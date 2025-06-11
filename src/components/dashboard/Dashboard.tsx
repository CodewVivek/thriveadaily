import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Calendar, TrendingUp, Award, Flame, Plus } from 'lucide-react';
import StatsCard from './StatsCard';
import ProgressChart from './ProgressChart';
import RecentActivity from './RecentActivity';
import StreakCounter from './StreakCounter';

interface DashboardProps {
  selectedDate: string;
}

const Dashboard: React.FC<DashboardProps> = ({ selectedDate }) => {
  const { user } = useAuth();
  const [profile, setProfile] = React.useState<any>(null);
  const [todayStats, setTodayStats] = React.useState({
    calories: 0,
    workouts: 0,
    workHours: 0,
    goals: 0,
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
          .select('duration')
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

      setTodayStats({
        calories,
        workouts,
        workHours: Math.round(workHours * 10) / 10,
        goals: activeGoals,
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
    </div>
  );
};

export default Dashboard;