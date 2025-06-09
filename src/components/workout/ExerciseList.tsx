import React from 'react';
import { Exercise } from '../../types';
import { Clock, Weight, Repeat, Hash } from 'lucide-react';

interface ExerciseListProps {
  exercises: Exercise[];
  selectedDate: string;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, selectedDate }) => {
  const categoryColors = {
    strength: 'bg-blue-100 text-blue-800 border-blue-200',
    cardio: 'bg-red-100 text-red-800 border-red-200',
    flexibility: 'bg-green-100 text-green-800 border-green-200',
    sports: 'bg-orange-100 text-orange-800 border-orange-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const categoryIcons = {
    strength: '💪',
    cardio: '❤️',
    flexibility: '🧘',
    sports: '⚽',
    other: '🏃',
  };

  if (exercises.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises logged</h3>
        <p className="text-gray-500">
          {selectedDate === new Date().toISOString().split('T')[0] 
            ? "Start your workout by adding an exercise" 
            : "No exercises were logged on this date"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <div key={exercise.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[exercise.category as keyof typeof categoryColors]}`}>
                  {categoryIcons[exercise.category as keyof typeof categoryIcons]} {exercise.category}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-sm font-semibold text-gray-900">{exercise.sets}</div>
                <div className="text-xs text-gray-500">Sets</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Repeat className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-sm font-semibold text-gray-900">{exercise.reps}</div>
                <div className="text-xs text-gray-500">Reps</div>
              </div>
            </div>
            
            {exercise.weight && (
              <div className="flex items-center space-x-2">
                <Weight className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">{exercise.weight} lbs</div>
                  <div className="text-xs text-gray-500">Weight</div>
                </div>
              </div>
            )}
            
            {exercise.duration && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">{exercise.duration} min</div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;