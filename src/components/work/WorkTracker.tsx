import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Briefcase, Play, Pause, Clock } from 'lucide-react';
import WorkSessionForm from './WorkSessionForm';
import WorkSessionList from './WorkSessionList';
import ProductivityStats from './ProductivityStats';
import ActiveTimer from './ActiveTimer';

const WorkTracker: React.FC = () => {
  const { workSessions } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeSession, setActiveSession] = useState<{
    task: string;
    category: string;
    startTime: Date;
  } | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = workSessions.filter(session => session.date === today);
  const thisWeekSessions = workSessions.filter(session => {
    const sessionDate = new Date(session.date);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return sessionDate >= weekStart;
  });

  const todayHours = todaySessions.reduce((sum, session) => sum + session.duration, 0) / 60;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Briefcase className="w-8 h-8 text-purple-600 mr-3" />
              Work Tracker
            </h1>
            <p className="text-gray-600 mt-1">Track your productivity and work sessions</p>
          </div>
          <div className="flex gap-3">
            {!activeSession ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Session
              </button>
            ) : (
              <button
                onClick={() => setActiveSession(null)}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
              >
                <Pause className="w-5 h-5 mr-2" />
                Stop Session
              </button>
            )}
          </div>
        </div>

        {/* Today's Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Today's Progress</h3>
              <p className="text-sm text-gray-600">
                {Math.round(todayHours * 10) / 10} hours worked
              </p>
            </div>
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-500"
              style={{ width: `${Math.min((todayHours / 8) * 100, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Target: 8 hours</span>
            <span>{Math.round((todayHours / 8) * 100)}% complete</span>
          </div>
        </div>
      </div>

      {/* Active Timer */}
      {activeSession && (
        <ActiveTimer 
          session={activeSession} 
          onStop={(duration) => {
            // Handle session completion
            setActiveSession(null);
          }}
        />
      )}

      {/* Productivity Stats */}
      <ProductivityStats sessions={thisWeekSessions} />

      {/* Work Sessions List */}
      <WorkSessionList sessions={todaySessions} />

      {/* Add Session Form Modal */}
      {showAddForm && (
        <WorkSessionForm 
          onClose={() => setShowAddForm(false)}
          onStartSession={(task, category) => {
            setActiveSession({
              task,
              category,
              startTime: new Date(),
            });
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
};

export default WorkTracker;