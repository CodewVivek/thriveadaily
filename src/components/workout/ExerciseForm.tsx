import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus } from 'lucide-react';
import { Exercise } from '../../types';

interface ExerciseFormProps {
  onClose: () => void;
  selectedDate: string;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onClose, selectedDate }) => {
  const { addExercise } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    category: 'strength',
    sets: '3',
    reps: '10',
    weight: '',
    duration: '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const exercise: Exercise = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      sets: Number(formData.sets),
      reps: Number(formData.reps),
      weight: formData.weight ? Number(formData.weight) : undefined,
      duration: formData.duration ? Number(formData.duration) : undefined,
      date: selectedDate,
    };

    addExercise(exercise);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add Exercise</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (lbs) <span className="text-gray-400">(optional)</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (min) <span className="text-gray-400">(optional)</span>
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
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Exercise
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExerciseForm;