import React, { useState } from 'react';
import { X, Play, Plus, Shuffle } from 'lucide-react';

interface WorkSessionFormProps {
  onClose: () => void;
  onStartSession: (task: string, category: string) => void;
  taskSuggestions: string[];
  randomTask: string;
}

const WorkSessionForm: React.FC<WorkSessionFormProps> = ({ 
  onClose, 
  onStartSession, 
  taskSuggestions, 
  randomTask 
}) => {
  const [formData, setFormData] = useState({
    task: '',
    category: 'development',
  });

  const categories = [
    'development',
    'design',
    'meetings',
    'research',
    'planning',
    'testing',
    'documentation',
    'study',
    'other'
  ];

  const handleStartSession = () => {
    if (formData.task.trim()) {
      onStartSession(formData.task, formData.category);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const useRandomTask = () => {
    setFormData(prev => ({ ...prev, task: randomTask }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Start Work Session</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Task Suggestions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Task Description
              </label>
              <button
                type="button"
                onClick={useRandomTask}
                className="flex items-center text-xs text-purple-600 hover:text-purple-700"
              >
                <Shuffle className="w-3 h-3 mr-1" />
                Random
              </button>
            </div>
            
            <input
              type="text"
              name="task"
              value={formData.task}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Working on user authentication"
              required
            />
            
            {/* Quick Task Suggestions */}
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-1">
                {taskSuggestions.slice(0, 6).map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, task: suggestion }))}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleStartSession}
              disabled={!formData.task.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Timer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkSessionForm;