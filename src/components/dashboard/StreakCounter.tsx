import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StreakCounterProps {
  title: string;
  streak: number;
  icon: LucideIcon;
  color: 'emerald' | 'blue' | 'purple';
}

const StreakCounter: React.FC<StreakCounterProps> = ({ title, streak, icon: Icon, color }) => {
  const colorClasses = {
    emerald: 'from-emerald-500 to-teal-600',
    blue: 'from-blue-500 to-indigo-600',
    purple: 'from-purple-500 to-pink-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8 text-white/90" />
        <div className="text-right">
          <div className="text-3xl font-bold">{streak}</div>
          <div className="text-sm text-white/80">days</div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-white/90">{title}</h3>
      <p className="text-sm text-white/70 mt-1">
        Keep it up! You're doing great.
      </p>
    </div>
  );
};

export default StreakCounter;