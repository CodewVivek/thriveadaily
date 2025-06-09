import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Dumbbell, Calendar, TrendingUp } from 'lucide-react';
import ExerciseForm from './ExerciseForm';
import ExerciseList from './ExerciseList';
import WorkoutStats from './WorkoutStats';

const WorkoutTracker: React.FC = () => {
  const { exercises } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const dayExercises = exercises.filter(exercise => exercise.date === selectedDate);
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  const thisWeekExercises = exercises.filter(ex => 
    new Date(ex.date) >= thisWeekStart
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Dumbbell className="w-8 h-8 text-blue-600 mr-3" />
              Workout Tracker
            </h1>
            <p className="text-gray-600 mt-1">Track your exercises and progress</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Exercise
          </button>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Workout Date:</span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Workout Stats */}
      <WorkoutStats exercises={thisWeekExercises} />

      {/* Today's Workout Summary */}
      {dayExercises.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDate === new Date().toISOString().split('T')[0] ? "Today's Workout" : 'Workout Summary'}
              </h3>
              <p className="text-sm text-gray-600">
                {dayExercises.length} exercises completed
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {dayExercises.reduce((sum, ex) => sum + ex.sets, 0)}
              </div>
              <div className="text-sm text-blue-700">Total Sets</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-xl">
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {dayExercises.reduce((sum, ex) => sum + (ex.weight || 0) * ex.sets, 0)}
              </div>
              <div className="text-sm text-indigo-700">Total Weight (lbs)</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {Math.round(dayExercises.reduce((sum, ex) => sum + (ex.duration || 0), 0))}
              </div>
              <div className="text-sm text-purple-700">Duration (min)</div>
            </div>
          </div>
        </div>
      )}

      {/* Exercise List */}
      <ExerciseList exercises={dayExercises} selectedDate={selectedDate} />

      {/* Add Exercise Form Modal */}
      {showAddForm && (
        <ExerciseForm 
          onClose={() => setShowAddForm(false)} 
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default WorkoutTracker;