import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp } from 'lucide-react';

const ProgressChart: React.FC = () => {
  const { foodEntries, exercises, workSessions } = useApp();

  // Get last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const dayFoodEntries = foodEntries.filter(entry => entry.date === date);
    const dayExercises = exercises.filter(exercise => exercise.date === date);
    const dayWorkSessions = workSessions.filter(session => session.date === date);

    return {
      date,
      calories: dayFoodEntries.reduce((sum, entry) => sum + entry.calories, 0),
      workouts: dayExercises.length,
      workHours: dayWorkSessions.reduce((sum, session) => sum + session.duration, 0) / 60,
    };
  });

  const maxCalories = Math.max(...chartData.map(d => d.calories), 2000);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Weekly Progress</h3>
          <p className="text-sm text-gray-600">Your activity over the last 7 days</p>
        </div>
        <TrendingUp className="w-6 h-6 text-emerald-600" />
      </div>

      <div className="space-y-4">
        {chartData.map((day, index) => {
          const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
          const caloriesPercentage = (day.calories / maxCalories) * 100;
          
          return (
            <div key={day.date} className="flex items-center space-x-4">
              <div className="w-8 text-xs font-medium text-gray-600">{dayName}</div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Calories</span>
                  <span className="text-xs font-medium text-gray-700">{day.calories}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
                    style={{ width: `${caloriesPercentage}%` }}
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <div className="text-center">
                  <div className="text-xs font-medium text-blue-600">{day.workouts}</div>
                  <div className="text-xs text-gray-400">WO</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-purple-600">{day.workHours.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">HR</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressChart;