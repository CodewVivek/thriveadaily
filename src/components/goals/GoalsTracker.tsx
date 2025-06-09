import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Target, Trophy, Calendar } from 'lucide-react';
import GoalForm from './GoalForm';
import GoalsList from './GoalsList';
import GoalsStats from './GoalsStats';

const GoalsTracker: React.FC = () => {
  const { goals } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'diet' | 'workout' | 'work'>('all');

  const filteredGoals = filterType === 'all' 
    ? goals 
    : goals.filter(goal => goal.type === filterType);

  const activeGoals = filteredGoals.filter(goal => !goal.achieved);
  const completedGoals = filteredGoals.filter(goal => goal.achieved);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Target className="w-8 h-8 text-orange-600 mr-3" />
              Goals Tracker
            </h1>
            <p className="text-gray-600 mt-1">Set and track your health and productivity goals</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Goal
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-6">
          <div className="flex space-x-1">
            {[
              { key: 'all', label: 'All Goals', icon: Target },
              { key: 'diet', label: 'Diet', icon: Target },
              { key: 'workout', label: 'Workout', icon: Target },
              { key: 'work', label: 'Work', icon: Target },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilterType(tab.key as any)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    filterType === tab.key
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Goals Stats */}
      <GoalsStats goals={filteredGoals} />

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-orange-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Active Goals</h2>
            <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
              {activeGoals.length}
            </span>
          </div>
          <GoalsList goals={activeGoals} />
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Trophy className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Completed Goals</h2>
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              {completedGoals.length}
            </span>
          </div>
          <GoalsList goals={completedGoals} />
        </div>
      )}

      {/* Empty State */}
      {filteredGoals.length === 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-500 mb-4">Set your first goal to start tracking your progress</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
          >
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Add Goal Form Modal */}
      {showAddForm && (
        <GoalForm onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
};

export default GoalsTracker;