import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { X, Plus, Zap, Clock, Weight } from 'lucide-react';

interface ExerciseFormProps {
  onClose: () => void;
  selectedDate: string;
  isFuture?: boolean;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onClose, selectedDate, isFuture = false }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    category: 'strength',
    sets: '3',
    reps: '10',
    weight: '',
    duration: '',
  });
  const [loading, setLoading] = useState(false);

  const exerciseCategories = [
    'strength',
    'cardio',
    'flexibility',
    'sports',
    'other'
  ];

  const commonExercises = {
    strength: ['Push-ups', 'Pull-ups', 'Squats', 'Deadlifts', 'Bench Press', 'Shoulder Press'],
    cardio: ['Running', 'Cycling', 'Swimming', 'Jump Rope', 'Rowing', 'Elliptical'],
    flexibility: ['Yoga', 'Stretching', 'Pilates', 'Foam Rolling'],
    sports: ['Basketball', 'Soccer', 'Tennis', 'Golf', 'Volleyball'],
    other: ['Walking', 'Hiking', 'Dancing', 'Martial Arts']
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('exercises')
        .insert({
          user_id: user.id,
          name: formData.name,
          category: formData.category,
          sets: Number(formData.sets),
          reps: Number(formData.reps),
          weight: formData.weight ? Number(formData.weight) : null,
          duration: formData.duration ? Number(formData.duration) : null,
          date: selectedDate,
        });

      if (error) throw error;
      onClose();
    } catch (error) {
      console.error('Error adding exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isCardio = formData.category === 'cardio';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Zap className="w-5 h-5 text-blue-600 mr-2" />
            {isFuture ? 'Plan Exercise' : 'Add Exercise'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exercise Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {exerciseCategories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exercise Name
            </label>
            <div className="space-y-2">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Bench Press"
                required
              />
              
              {/* Quick select buttons */}
              <div className="flex flex-wrap gap-2">
                {commonExercises[formData.category as keyof typeof commonExercises]?.map(exercise => (
                  <button
                    key={exercise}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, name: exercise }))}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  >
                    {exercise}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cardio vs Strength UI */}
          {isCardio ? (
            // Cardio: Only Duration + optional notes
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                min="1"
                required
                placeholder="e.g., 30"
              />
            </div>
          ) : (
            // Strength: Show sets, reps, weight, mins
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sets
                  </label>
                  <input
                    type="number"
                    name="sets"
                    value={formData.sets}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reps
                  </label>
                  <input
                    type="number"
                    name="reps"
                    value={formData.reps}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Weight className="w-4 h-4 mr-2 text-purple-500" />
                    Weight (lbs) <span className="text-gray-400 ml-1">(optional)</span>
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    step="0.5"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    Duration (min) <span className="text-gray-400 ml-1">(optional)</span>
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="1"
                  />
                </div>
              </div>
            </>
          )}

          {/* Status indicator for future workouts */}
          {isFuture && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-blue-800">
                  Status: Planned
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {isFuture ? 'Plan Exercise' : 'Add Exercise'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExerciseForm;