import React from 'react';
import { useApp } from '../../context/AppContext';
import { Goal } from '../../types';
import { Calendar, CheckCircle, Circle, TrendingUp } from 'lucide-react';

interface GoalsListProps {
  goals: Goal[];
}

const GoalsList: React.FC<GoalsListProps> = ({ goals }) => {
  const { updateGoal } = useApp();

  const toggleGoalCompletion = (goalId: string, achieved: boolean) => {
    updateGoal(goalId, { achieved: !achieved });
  };

  const typeColors = {
    diet: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    workout: 'bg-blue-100 text-blue-800 border-blue-200',
    work: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const typeIcons = {
    diet: '🥗',
    workout: '💪',
    work: '💼',
  };

  if (goals.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const progress = Math.min((goal.current / goal.target) * 100, 100);
        const daysUntilDeadline = Math.ceil(
          (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        const isOverdue = daysUntilDeadline < 0;
        
        return (
          <div
            key={goal.id}
            className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${
              goal.achieved ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => toggleGoalCompletion(goal.id, goal.achieved)}
                    className="flex-shrink-0"
                  >
                    {goal.achieved ? (
                      <CheckCircle className="w-6 h-6 text-green-500 hover:text-green-600 transition-colors duration-200" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                    )}
                  </button>
                  
                  <h3 className={`text-lg font-semibold ${goal.achieved ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {goal.title}
                  </h3>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColors[goal.type]}`}>
                    {typeIcons[goal.type]} {goal.type}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {goal.current} / {goal.target}
                </div>
                <div className="text-sm text-gray-500">{goal.unit}</div>
              </div>
            </div>

            {!goal.achieved && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  {goal.achieved 
                    ? 'Completed!' 
                    : isOverdue 
                      ? `${Math.abs(daysUntilDeadline)} days overdue`
                      : `${daysUntilDeadline} days left`
                  }
                </span>
              </div>
              
              {!goal.achieved && (
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1 text-orange-500" />
                  <span className="text-orange-600 font-medium">
                    {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GoalsList;