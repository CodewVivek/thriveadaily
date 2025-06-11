import React from 'react';
import { Activity, Target, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface NutritionSummaryProps {
  entries: any[];
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ entries }) => {
  const { user } = useAuth();
  const [goals, setGoals] = React.useState({
    proteinTarget: 150,
    carbTarget: 250,
    fatTarget: 70,
  });

  React.useEffect(() => {
    if (user) {
      loadUserGoals();
    }
  }, [user]);

  const loadUserGoals = async () => {
    if (!user) return;
    
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('goals')
        .eq('id', user.id)
        .single();

      if (profileData?.goals) {
        setGoals({
          proteinTarget: profileData.goals.proteinTarget || 150,
          carbTarget: profileData.goals.carbTarget || 250,
          fatTarget: profileData.goals.fatTarget || 70,
        });
      }
    } catch (error) {
      console.error('Error loading user goals:', error);
    }
  };

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
      target: goals.proteinTarget,
      icon: Activity,
    },
    {
      name: 'Carbs',
      value: totals.carbs,
      unit: 'g',
      color: 'orange',
      target: goals.carbTarget,
      icon: TrendingUp,
    },
    {
      name: 'Fat',
      value: totals.fat,
      unit: 'g',
      color: 'purple',
      target: goals.fatTarget,
      icon: Target,
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      progress: 'bg-blue-500',
      ring: 'ring-blue-200',
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      progress: 'bg-orange-500',
      ring: 'ring-orange-200',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      progress: 'bg-purple-500',
      ring: 'ring-purple-200',
    },
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Award className="w-5 h-5 text-emerald-600 mr-2" />
          Nutrition Summary vs Goals
        </h3>
        <div className="text-sm text-gray-500">
          Daily targets
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {macroData.map((macro) => {
          const IconComponent = macro.icon;
          const percentage = Math.min((macro.value / macro.target) * 100, 100);
          const colors = colorClasses[macro.color as keyof typeof colorClasses];
          const isOnTrack = percentage >= 80 && percentage <= 120;
          
          return (
            <div key={macro.name} className={`p-4 rounded-xl ${colors.bg} ${isOnTrack ? `ring-2 ${colors.ring}` : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <IconComponent className={`w-5 h-5 ${colors.text} mr-2`} />
                  <span className="text-sm font-medium text-gray-700">{macro.name}</span>
                  {isOnTrack && <Award className="w-4 h-4 text-green-500 ml-2" />}
                </div>
                <span className={`text-lg font-bold ${colors.text}`}>
                  {Math.round(macro.value)}{macro.unit}
                </span>
              </div>
              
              <div className="w-full bg-white rounded-full h-3 mb-2 shadow-inner">
                <div
                  className={`h-3 rounded-full ${colors.progress} transition-all duration-500 relative`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                >
                  {percentage > 100 && (
                    <div className="absolute right-0 top-0 h-3 w-2 bg-red-500 rounded-r-full animate-pulse" />
                  )}
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-600">
                <span>Target: {macro.target}{macro.unit}</span>
                <span className={percentage > 120 ? 'text-red-600 font-medium' : percentage < 80 ? 'text-yellow-600 font-medium' : 'text-green-600 font-medium'}>
                  {Math.round(percentage)}%
                </span>
              </div>
              
              {/* Status indicator */}
              <div className="mt-2 text-xs">
                {percentage > 120 && <span className="text-red-600">⚠️ Over target</span>}
                {percentage >= 80 && percentage <= 120 && <span className="text-green-600">✅ On track</span>}
                {percentage < 80 && <span className="text-yellow-600">📈 Need more</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Progress Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Daily Progress</h4>
            <p className="text-sm text-gray-600">
              {macroData.filter(m => {
                const pct = (m.value / m.target) * 100;
                return pct >= 80 && pct <= 120;
              }).length} of 3 macros on track
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">
              {Math.round((macroData.filter(m => {
                const pct = (m.value / m.target) * 100;
                return pct >= 80 && pct <= 120;
              }).length / 3) * 100)}%
            </div>
            <div className="text-sm text-emerald-700">Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;