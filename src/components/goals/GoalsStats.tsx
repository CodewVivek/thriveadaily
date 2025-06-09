import React from 'react';
import { Goal } from '../../types';
import { Target, Trophy, Calendar, TrendingUp } from 'lucide-react';

interface GoalsStatsProps {
  goals: Goal[];
}

const GoalsStats: React.FC<GoalsStatsProps> = ({ goals }) => {
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.achieved).length;
  const activeGoals = totalGoals - completedGoals;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Goals by type
  const goalsByType = goals.reduce((acc, goal) => {
    acc[goal.type] = (acc[goal.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Overdue goals
  const now = new Date();
  const overdueGoals = goals.filter(goal => 
    !goal.achieved && new Date(goal.deadline) < now
  ).length;

  const stats = [
    {
      title: 'Total Goals',
      value: totalGoals,
      unit: 'goals',
      icon: Target,
      color: 'blue',
    },
    {
      title: 'Completed',
      value: completedGoals,
      unit: 'achieved',
      icon: Trophy,
      color: 'green',
    },
    {
      title: 'Active Goals',
      value: activeGoals,
      unit: 'in progress',
      icon: TrendingUp,
      color: 'orange',
    },
    {
      title: 'Success Rate',
      value: completionRate,
      unit: '%',
      icon: Calendar,
      color: 'purple',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  if (totalGoals === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Goals Overview</h3>
      
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

      {/* Goals by Type */}
      {Object.keys(goalsByType).length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Goals by Category</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(goalsByType).map(([type, count]) => (
              <div key={type} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                <span className="font-medium capitalize">{type}</span>
                <span className="text-gray-500 ml-1">({count})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overdue Warning */}
      {overdueGoals > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-sm font-medium text-red-800">
              {overdueGoals} goal{overdueGoals > 1 ? 's' : ''} overdue
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsStats;