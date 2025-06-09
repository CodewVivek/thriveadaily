import React from 'react';
import { Exercise } from '../../types';
import { BarChart, TrendingUp, Calendar, Target } from 'lucide-react';

interface WorkoutStatsProps {
  exercises: Exercise[];
}

const WorkoutStats: React.FC<WorkoutStatsProps> = ({ exercises }) => {
  const totalWorkouts = exercises.length;
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const totalWeight = exercises.reduce((sum, ex) => sum + (ex.weight || 0) * ex.sets, 0);
  const totalDuration = exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);

  const categoryBreakdown = exercises.reduce((acc, ex) => {
    acc[ex.category] = (acc[ex.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    {
      title: 'Total Workouts',
      value: totalWorkouts,
      unit: 'sessions',
      icon: Calendar,
      color: 'blue',
    },
    {
      title: 'Total Sets',
      value: totalSets,
      unit: 'sets',
      icon: BarChart,
      color: 'green',
    },
    {
      title: 'Total Weight',
      value: Math.round(totalWeight),
      unit: 'lbs',
      icon: Target,
      color: 'purple',
    },
    {
      title: 'Total Time',
      value: Math.round(totalDuration),
      unit: 'minutes',
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">This Week's Stats</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.title} className={`p-4 rounded-xl ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
              <div className="flex items-center justify-between mb-2">
                <IconComponent className="w-5 h-5" />
                <span className="text-xl font-bold">{stat.value}</span>
              </div>
              <div className="text-sm font-medium">{stat.title}</div>
              <div className="text-xs opacity-80">{stat.unit}</div>
            </div>
          );
        })}
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryBreakdown).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Exercise Categories</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryBreakdown).map(([category, count]) => (
              <div key={category} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                <span className="font-medium">{category}</span>
                <span className="text-gray-500 ml-1">({count})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutStats;