import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus } from 'lucide-react';
import { Goal } from '../../types';

interface GoalFormProps {
  onClose: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onClose }) => {
  const { addGoal } = useApp();
  const [formData, setFormData] = useState({
    type: 'diet' as const,
    title: '',
    target: '',
    unit: '',
    deadline: '',
  });

  const goalPresets = {
    diet: [
      { title: 'Lose 10 pounds', target: 10, unit: 'lbs' },
      { title: 'Drink 8 glasses of water daily', target: 8, unit: 'glasses/day' },
      { title: 'Eat 5 servings of vegetables daily', target: 5, unit: 'servings/day' },
      { title: 'Stay under daily calorie goal', target: 2000, unit: 'calories/day' },
    ],
    workout: [
      { title: 'Workout 4 times per week', target: 4, unit: 'times/week' },
      { title: 'Run 5 miles per week', target: 5, unit: 'miles/week' },
      { title: 'Complete 100 push-ups', target: 100, unit: 'push-ups' },
      { title: 'Increase bench press by 20 lbs', target: 20, unit: 'lbs' },
    ],
    work: [
      { title: 'Work 40 hours per week', target: 40, unit: 'hours/week' },
      { title: 'Complete 5 projects', target: 5, unit: 'projects' },
      { title: 'Focus for 8 hours daily', target: 8, unit: 'hours/day' },
      { title: 'Attend 10 meetings', target: 10, unit: 'meetings' },
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goal: Goal = {
      id: Date.now().toString(),
      type: formData.type,
      title: formData.title,
      target: Number(formData.target),
      current: 0,
      unit: formData.unit,
      deadline: formData.deadline,
      achieved: false,
    };

    addGoal(goal);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePresetClick = (preset: { title: string; target: number; unit: string }) => {
    setFormData(prev => ({
      ...prev,
      title: preset.title,
      target: preset.target.toString(),
      unit: preset.unit,
    }));
  };

  // Set default deadline to 30 days from now
  React.useEffect(() => {
    const defaultDeadline = new Date();
    defaultDeadline.setDate(defaultDeadline.getDate() + 30);
    setFormData(prev => ({
      ...prev,
      deadline: defaultDeadline.toISOString().split('T')[0],
    }));
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add New Goal</h2>
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
              Goal Category
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            >
              <option value="diet">Diet & Nutrition</option>
              <option value="workout">Workout & Fitness</option>
              <option value="work">Work & Productivity</option>
            </select>
          </div>

          {/* Goal Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Presets
            </label>
            <div className="grid grid-cols-1 gap-2">
              {goalPresets[formData.type].map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="text-sm font-medium text-gray-900">{preset.title}</div>
                  <div className="text-xs text-gray-500">
                    Target: {preset.target} {preset.unit}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goal Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Lose 10 pounds"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Value
              </label>
              <input
                type="number"
                name="target"
                value={formData.target}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                step="0.1"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., lbs, hours"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              required
            />
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
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;