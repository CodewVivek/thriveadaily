import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  unit: string;
  target: number;
  icon: LucideIcon;
  color: 'emerald' | 'blue' | 'purple' | 'orange';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, unit, target, icon: Icon, color }) => {
  const percentage = Math.min((value / target) * 100, 100);
  
  const colorClasses = {
    emerald: {
      bg: 'from-emerald-500 to-teal-600',
      text: 'text-emerald-600',
      progress: 'bg-emerald-500',
    },
    blue: {
      bg: 'from-blue-500 to-indigo-600',
      text: 'text-blue-600',
      progress: 'bg-blue-500',
    },
    purple: {
      bg: 'from-purple-500 to-pink-600',
      text: 'text-purple-600',
      progress: 'bg-purple-500',
    },
    orange: {
      bg: 'from-orange-500 to-red-600',
      text: 'text-orange-600',
      progress: 'bg-orange-500',
    },
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color].bg} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{unit}</div>
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">Progress</span>
        <span className={`text-xs font-medium ${colorClasses[color].text}`}>
          {Math.round(percentage)}%
        </span>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorClasses[color].progress} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Target: {target} {unit}
      </div>
    </div>
  );
};

export default StatsCard;