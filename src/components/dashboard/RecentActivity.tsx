import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Utensils, Dumbbell, Briefcase } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const { foodEntries, exercises, workSessions } = useApp();

  // Combine and sort all activities
  const allActivities = [
    ...foodEntries.slice(-5).map(entry => ({
      id: entry.id,
      type: 'food' as const,
      title: entry.name,
      subtitle: `${entry.calories} calories`,
      time: entry.date,
      icon: Utensils,
      color: 'emerald',
    })),
    ...exercises.slice(-5).map(exercise => ({
      id: exercise.id,
      type: 'exercise' as const,
      title: exercise.name,
      subtitle: `${exercise.sets} sets × ${exercise.reps} reps`,
      time: exercise.date,
      icon: Dumbbell,
      color: 'blue',
    })),
    ...workSessions.slice(-5).map(session => ({
      id: session.id,
      type: 'work' as const,
      title: session.task,
      subtitle: `${Math.round(session.duration)} minutes`,
      time: session.date,
      icon: Briefcase,
      color: 'purple',
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-600">Your latest logged activities</p>
        </div>
        <Clock className="w-6 h-6 text-gray-400" />
      </div>

      <div className="space-y-4">
        {allActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No recent activity</p>
            <p className="text-gray-400 text-xs mt-1">Start logging your diet, workouts, or work sessions</p>
          </div>
        ) : (
          allActivities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[activity.color]}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.subtitle}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(activity.time).toLocaleDateString()}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentActivity;