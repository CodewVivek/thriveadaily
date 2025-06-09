import React from 'react';
import { WorkSession } from '../../types';
import { Clock, CheckCircle, Circle } from 'lucide-react';

interface WorkSessionListProps {
  sessions: WorkSession[];
}

const WorkSessionList: React.FC<WorkSessionListProps> = ({ sessions }) => {
  const categoryColors = {
    development: 'bg-blue-100 text-blue-800 border-blue-200',
    design: 'bg-pink-100 text-pink-800 border-pink-200',
    meetings: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    research: 'bg-green-100 text-green-800 border-green-200',
    planning: 'bg-purple-100 text-purple-800 border-purple-200',
    testing: 'bg-red-100 text-red-800 border-red-200',
    documentation: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-purple-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No work sessions today</h3>
        <p className="text-gray-500">Start a work session to track your productivity</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Sessions</h3>
      
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">{session.task}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[session.category as keyof typeof categoryColors] || categoryColors.other}`}>
                    {session.category}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {session.completed ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(session.duration)} min
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {session.startTime && new Date(session.startTime).toLocaleTimeString()}
                {session.endTime && (
                  <>
                    {' - '}
                    {new Date(session.endTime).toLocaleTimeString()}
                  </>
                )}
              </div>
              <div>
                {session.completed ? 'Completed' : 'In Progress'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkSessionList;