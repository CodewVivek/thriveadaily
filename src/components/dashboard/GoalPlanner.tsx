import React, { useState } from 'react';
import { X, Target, Save, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface GoalPlannerProps {
  onClose: () => void;
  currentGoals: any;
  onSave: (goals: any) => void;
}

const GoalPlanner: React.FC<GoalPlannerProps> = ({ onClose, currentGoals, onSave }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState({
    dailyCalories: currentGoals?.dailyCalories || 2000,
    weeklyStudyHours: currentGoals?.weeklyStudyHours || 14,
    workoutFrequency: currentGoals?.workoutFrequency || 4,
    workHours: currentGoals?.workHours || 8,
    proteinTarget: currentGoals?.proteinTarget || 150,
    carbTarget: currentGoals?.carbTarget || 250,
    fatTarget: currentGoals?.fatTarget || 70,
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          goals: {
            ...currentGoals,
            ...goals,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      onSave(goals);
    } catch (error) {
      console.error('Error updating goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: number) => {
    setGoals(prev => ({ ...prev, [key]: value }));
  };

  const goalPresets = [
    {
      name: 'Weight Loss',
      icon: '🎯',
      goals: {
        dailyCalories: 1800,
        proteinTarget: 140,
        carbTarget: 180,
        fatTarget: 60,
        workoutFrequency: 5,
      }
    },
    {
      name: 'Muscle Gain',
      icon: '💪',
      goals: {
        dailyCalories: 2500,
        proteinTarget: 180,
        carbTarget: 300,
        fatTarget: 85,
        workoutFrequency: 4,
      }
    },
    {
      name: 'Maintenance',
      icon: '⚖️',
      goals: {
        dailyCalories: 2200,
        proteinTarget: 150,
        carbTarget: 250,
        fatTarget: 75,
        workoutFrequency: 3,
      }
    },
    {
      name: 'Student Focus',
      icon: '📚',
      goals: {
        weeklyStudyHours: 20,
        workHours: 6,
        dailyCalories: 2000,
        workoutFrequency: 3,
      }
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Target className="w-6 h-6 text-indigo-600 mr-2" />
              Goal Planner
            </h2>
            <p className="text-gray-600">Customize your daily and weekly targets</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Presets</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {goalPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setGoals(prev => ({ ...prev, ...preset.goals }))}
                className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-center"
              >
                <div className="text-2xl mb-2">{preset.icon}</div>
                <div className="text-sm font-medium text-gray-900">{preset.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Nutrition Goals */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Calories
              </label>
              <input
                type="number"
                value={goals.dailyCalories}
                onChange={(e) => handleInputChange('dailyCalories', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1000"
                max="5000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Protein Target (g)
              </label>
              <input
                type="number"
                value={goals.proteinTarget}
                onChange={(e) => handleInputChange('proteinTarget', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="50"
                max="300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carbs Target (g)
              </label>
              <input
                type="number"
                value={goals.carbTarget}
                onChange={(e) => handleInputChange('carbTarget', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="50"
                max="500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fat Target (g)
              </label>
              <input
                type="number"
                value={goals.fatTarget}
                onChange={(e) => handleInputChange('fatTarget', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="30"
                max="200"
              />
            </div>
          </div>
        </div>

        {/* Activity Goals */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Study Hours
              </label>
              <input
                type="number"
                value={goals.weeklyStudyHours}
                onChange={(e) => handleInputChange('weeklyStudyHours', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
                max="60"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workouts per Week
              </label>
              <input
                type="number"
                value={goals.workoutFrequency}
                onChange={(e) => handleInputChange('workoutFrequency', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
                max="7"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Work Hours
              </label>
              <input
                type="number"
                value={goals.workHours}
                onChange={(e) => handleInputChange('workHours', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
                max="16"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Save Goals
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalPlanner;