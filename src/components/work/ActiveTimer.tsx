import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { WorkSession } from '../../types';

interface ActiveTimerProps {
  session: {
    task: string;
    category: string;
    startTime: Date;
  };
  onStop: (duration: number) => void;
}

const ActiveTimer: React.FC<ActiveTimerProps> = ({ session, onStop }) => {
  const { addWorkSession } = useApp();
  const [isRunning, setIsRunning] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - session.startTime.getTime()) / 1000);
        setElapsed(diff);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, session.startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    const workSession: WorkSession = {
      id: Date.now().toString(),
      task: session.task,
      category: session.category,
      duration: Math.floor(elapsed / 60), // Convert to minutes
      completed: true,
      date: new Date().toISOString().split('T')[0],
      startTime: session.startTime.toISOString(),
      endTime: new Date().toISOString(),
    };

    addWorkSession(workSession);
    onStop(elapsed);
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white mb-8 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Active Session</h3>
          <p className="text-purple-100 text-sm">{session.task}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
            {session.category}
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold font-mono mb-2">
          {formatTime(elapsed)}
        </div>
        <div className="text-purple-100 text-sm">
          Started at {session.startTime.toLocaleTimeString()}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors duration-200"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Resume
            </>
          )}
        </button>
        
        <button
          onClick={handleStop}
          className="flex items-center px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-xl transition-colors duration-200"
        >
          <Square className="w-4 h-4 mr-2" />
          Stop & Save
        </button>
      </div>
    </div>
  );
};

export default ActiveTimer;