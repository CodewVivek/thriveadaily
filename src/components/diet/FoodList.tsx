import React from 'react';
import { FoodEntry } from '../../types';
import { Clock, Flame } from 'lucide-react';

interface FoodListProps {
  entries: FoodEntry[];
}

const FoodList: React.FC<FoodListProps> = ({ entries }) => {
  const mealTypeColors = {
    breakfast: 'bg-orange-100 text-orange-800 border-orange-200',
    lunch: 'bg-blue-100 text-blue-800 border-blue-200',
    dinner: 'bg-purple-100 text-purple-800 border-purple-200',
    snack: 'bg-green-100 text-green-800 border-green-200',
  };

  const mealTypeIcons = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎',
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No food entries yet</h3>
        <p className="text-gray-500">Start by adding your first meal or snack</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{entry.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${mealTypeColors[entry.mealType]}`}>
                  {mealTypeIcons[entry.mealType]} {entry.mealType}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {entry.quantity} {entry.unit}
              </p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center text-lg font-bold text-emerald-600 mb-1">
                <Flame className="w-4 h-4 mr-1" />
                {entry.calories}
              </div>
              <div className="text-xs text-gray-500">calories</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-sm font-semibold text-blue-600">{entry.protein}g</div>
              <div className="text-xs text-gray-500">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-orange-600">{entry.carbs}g</div>
              <div className="text-xs text-gray-500">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-purple-600">{entry.fat}g</div>
              <div className="text-xs text-gray-500">Fat</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodList;