import React from 'react';
import { WorkSession } from '../../types';
import { BarChart, TrendingUp, Clock, Target } from 'lucide-react';

interface ProductivityStatsProps {
  sessions: WorkSession[];
}

const ProductivityStats: React.FC<ProductivityStatsProps> = ({ sessions }) => {
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const avgSessionLength = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
  const completedSessions = sessions.filter(s => s.completed).length;

  const categoryBreakdown = sessions.reduce((acc, session) => {
    acc[session.category] = (acc[session.category] || 0) + session.duration;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryBreakdown).sort(([,a], [,b]) => b - a)[0];

  const stats = [
    {
      title: 'Total Hours',
      value: totalHours,
      unit: 'hours',
      icon: Clock,
      color: 'purple',
    },
    {
      title: 'Sessions',
      value: totalSessions,
      unit: 'completed',
      icon: BarChart,
      color: 'blue',
    },
    {
      title: 'Avg Session',
      value: avgSessionLength,
      unit: 'minutes',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Focus Rate',
      value: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
      unit: '%',
      icon: Target,
      color: 'orange',
    },
  ];

  const colorClasses = {
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">This Week's Productivity</h3>
      
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
          <h4 className="text-sm font-medium text-gray-700 mb-3">Time by Category</h4>
          <div className="space-y-2">
            {Object.entries(categoryBreakdown)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([category, minutes]) => {
                const percentage = (minutes / totalMinutes) * 100;
                return (
                  <div key={category} className="flex items-center space-x-3">
                    <div className="w-20 text-xs font-medium text-gray-600 capitalize">
                      {category}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 w-12 text-right">
                      {Math.round(minutes)}m
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductivityStats;