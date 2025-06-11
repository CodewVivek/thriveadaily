import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Plus, Dumbbell, Calendar, TrendingUp, Zap } from 'lucide-react';
import ExerciseForm from './ExerciseForm';
import ExerciseList from './ExerciseList';
import WorkoutStats from './WorkoutStats';

interface WorkoutTrackerProps {
  selectedDate: string;
}

const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({ selectedDate }) => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      loadExercises();
    }
  }, [user, selectedDate]);

  const loadExercises = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: exerciseData } = await supabase
        .from('exercises')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', selectedDate)
        .order('created_at', { ascending: false });

      setExercises(exerciseData || []);
    } catch (error) {
      console.error('Error loading exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  
  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const isFuture = new Date(selectedDate) > new Date();

  // Calculate calories burned using MET formula
  const calculateCaloriesBurned = (exercise: any, userWeight = 70) => {
    const metValues: Record<string, number> = {
      'strength': 6.0,
      'cardio': 8.0,
      'flexibility': 2.5,
      'sports': 7.0,
      'other': 4.0,
    };
    
    const met = metValues[exercise.category] || 4.0;
    const durationHours = (exercise.duration || 30) / 60; // Default 30 min if no duration
    
    // MET formula: (MET * weight in kg * 0.0175) * duration in hours
    return Math.round(met * userWeight * 0.0175 * durationHours);
  };

  const totalCaloriesBurned = exercises.reduce((sum, ex) => sum + calculateCaloriesBurned(ex), 0);

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
            <p className="text-gray-600 mt-1">
              {isFuture 
                ? "Plan your future workouts" 
                : isToday 
                  ? "Track your exercises and progress" 
                  : `Review workouts from ${new Date(selectedDate).toLocaleDateString()}`
              }
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            {isFuture ? 'Plan Exercise' : 'Add Exercise'}
          </button>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {isFuture ? 'Planning Date:' : 'Workout Date:'}
              </span>
            </div>
            <input
              type="date"
              value={selectedDate}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Workout Stats */}
      <WorkoutStats exercises={exercises} selectedDate={selectedDate} />

      {/* Today's Workout Summary */}
      {exercises.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isFuture ? 'Planned Workout' : isToday ? "Today's Workout" : 'Workout Summary'}
              </h3>
              <p className="text-sm text-gray-600">
                {exercises.length} exercises {isFuture ? 'planned' : 'completed'}
              </p>
            </div>
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-orange-500 mr-2" />
              <span className="text-lg font-bold text-orange-600">
                {totalCaloriesBurned} cal burned
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {exercises.reduce((sum, ex) => sum + ex.sets, 0)}
              </div>
              <div className="text-sm text-blue-700">Total Sets</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-xl">
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {exercises.reduce((sum, ex) => sum + (ex.weight || 0) * ex.sets, 0)}
              </div>
              <div className="text-sm text-indigo-700">Total Weight (lbs)</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {Math.round(exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0))}
              </div>
              <div className="text-sm text-purple-700">Duration (min)</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {totalCaloriesBurned}
              </div>
              <div className="text-sm text-orange-700">Calories Burned</div>
            </div>
          </div>
        </div>
      )}

      {/* Exercise List */}
      <ExerciseList exercises={exercises} selectedDate={selectedDate} />

      {/* Add Exercise Form Modal */}
      {showAddForm && (
        <ExerciseForm 
          onClose={() => {
            setShowAddForm(false);
            loadExercises();
          }} 
          selectedDate={selectedDate}
          isFuture={isFuture}
        />
      )}
    </div>
  );
};

export default WorkoutTracker;