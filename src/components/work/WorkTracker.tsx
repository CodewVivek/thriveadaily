import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Plus, Briefcase, Play, Pause, Clock, AlertCircle } from 'lucide-react';
import WorkSessionForm from './WorkSessionForm';
import WorkSessionList from './WorkSessionList';
import ProductivityStats from './ProductivityStats';
import ActiveTimer from './ActiveTimer';

interface WorkTrackerProps {
  selectedDate: string;
}

const WorkTracker: React.FC<WorkTrackerProps> = ({ selectedDate }) => {
  const { user } = useAuth();
  const [workSessions, setWorkSessions] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeSession, setActiveSession] = useState<{
    task: string;
    category: string;
    startTime: Date;
  } | null>(null);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      loadWorkSessions();
    }
  }, [user, selectedDate]);

  const loadWorkSessions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: sessionData } = await supabase
        .from('work_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', selectedDate)
        .order('created_at', { ascending: false });

      setWorkSessions(sessionData || []);
    } catch (error) {
      console.error('Error loading work sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const todayHours = workSessions.reduce((sum, session) => sum + session.duration, 0) / 60;

  const handleStopSession = () => {
    setShowStopConfirm(true);
  };

  const confirmStopSession = async () => {
    if (!activeSession || !user) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - activeSession.startTime.getTime()) / 1000 / 60);

    try {
      const { error } = await supabase
        .from('work_sessions')
        .insert({
          user_id: user.id,
          task: activeSession.task,
          category: activeSession.category,
          duration: duration,
          completed: true,
          date: selectedDate,
          start_time: activeSession.startTime.toISOString(),
          end_time: endTime.toISOString(),
        });

      if (error) throw error;
      
      setActiveSession(null);
      setShowStopConfirm(false);
      loadWorkSessions();
    } catch (error) {
      console.error('Error saving work session:', error);
    }
  };

  // Task suggestions
  const taskSuggestions = [
    "Clean inbox",
    "Complete daily report", 
    "Brainstorm new ideas",
    "Review project progress",
    "Update documentation",
    "Team meeting preparation",
    "Code review",
    "Research new technologies",
    "Plan next sprint",
    "Client communication"
  ];

  const getRandomTask = () => {
    return taskSuggestions[Math.floor(Math.random() * taskSuggestions.length)];
  };

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
              <>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Session
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(true);
                    // Pre-fill with random task suggestion
                  }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
                  title="Quick start with suggested task"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={handleStopSession}
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
              <h3 className="text-lg font-semibold text-gray-900">
                {isToday ? "Today's Progress" : `Progress for ${new Date(selectedDate).toLocaleDateString()}`}
              </h3>
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
          onStop={() => setShowStopConfirm(true)}
        />
      )}

      {/* Productivity Stats */}
      <ProductivityStats sessions={workSessions} />

      {/* Work Sessions List */}
      <WorkSessionList sessions={workSessions} />

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
          taskSuggestions={taskSuggestions}
          randomTask={getRandomTask()}
        />
      )}

      {/* Stop Confirmation Modal */}
      {showStopConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-orange-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Stop Work Session?</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to stop and save this session? Your progress will be recorded.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowStopConfirm(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Continue Working
              </button>
              <button
                onClick={confirmStopSession}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Stop & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkTracker;