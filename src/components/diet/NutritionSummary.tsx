import React from 'react';
import { FoodEntry } from '../../types';
import { Activity, Target, TrendingUp } from 'lucide-react';

interface NutritionSummaryProps {
  entries: FoodEntry[];
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ entries }) => {
  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const macroData = [
    {
      name: 'Protein',
      value: totals.protein,
      unit: 'g',
      color: 'blue',
      target: 150,
      icon: Activity,
    },
    {
      name: 'Carbs',
      value: totals.carbs,
      unit: 'g',
      color: 'orange',
      target: 250,
      icon: TrendingUp,
    },
    {
      name: 'Fat',
      value: totals.fat,
      unit: 'g',
      color: 'purple',
      target: 70,
      icon: Target,
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      progress: 'bg-blue-500',
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      progress: 'bg-orange-500',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      progress: 'bg-purple-500',
    },
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Nutrition Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {macroData.map((macro) => {
          const IconComponent = macro.icon;
          const percentage = Math.min((macro.value / macro.target) * 100, 100);
          const colors = colorClasses[macro.color as keyof typeof colorClasses];
          
          return (
            <div key={macro.name} className={`p-4 rounded-xl ${colors.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <IconComponent className={`w-5 h-5 ${colors.text} mr-2`} />
                  <span className="text-sm font-medium text-gray-700">{macro.name}</span>
                </div>
                <span className={`text-lg font-bold ${colors.text}`}>
                  {Math.round(macro.value)}{macro.unit}
                </span>
              </div>
              
              <div className="w-full bg-white rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full ${colors.progress} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-600">
                <span>Target: {macro.target}{macro.unit}</span>
                <span>{Math.round(percentage)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NutritionSummary;