import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Edit3, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface TimeTravelProps {
  onDateSelect: (date: string) => void;
  selectedDate: string;
}

interface DayData {
  date: string;
  dietLogged: boolean;
  workoutLogged: boolean;
  workLogged: boolean;
  totalEntries: number;
}

const TimeTravel: React.FC<TimeTravelProps> = ({ onDateSelect, selectedDate }) => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dayData, setDayData] = useState<Record<string, DayData>>({});
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      loadMonthData();
    }
  }, [currentMonth, user]);

  const loadMonthData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const startDate = startOfMonth.toISOString().split('T')[0];
      const endDate = endOfMonth.toISOString().split('T')[0];

      // Fetch data for the month
      const [foodData, exerciseData, workData] = await Promise.all([
        supabase
          .from('food_entries')
          .select('date')
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate),
        supabase
          .from('exercises')
          .select('date')
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate),
        supabase
          .from('work_sessions')
          .select('date')
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate),
      ]);

      // Process data by date
      const dataByDate: Record<string, DayData> = {};
      
      // Initialize all days in month
      for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        dataByDate[dateStr] = {
          date: dateStr,
          dietLogged: false,
          workoutLogged: false,
          workLogged: false,
          totalEntries: 0,
        };
      }

      // Mark days with food entries
      foodData.data?.forEach(entry => {
        if (dataByDate[entry.date]) {
          dataByDate[entry.date].dietLogged = true;
          dataByDate[entry.date].totalEntries++;
        }
      });

      // Mark days with exercises
      exerciseData.data?.forEach(entry => {
        if (dataByDate[entry.date]) {
          dataByDate[entry.date].workoutLogged = true;
          dataByDate[entry.date].totalEntries++;
        }
      });

      // Mark days with work sessions
      workData.data?.forEach(entry => {
        if (dataByDate[entry.date]) {
          dataByDate[entry.date].workLogged = true;
          dataByDate[entry.date].totalEntries++;
        }
      });

      setDayData(dataByDate);
    } catch (error) {
      console.error('Error loading month data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayStatus = (date: Date) => {
    const dateStr = formatDate(date);
    return dayData[dateStr];
  };

  const days = getDaysInMonth();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="w-6 h-6 text-emerald-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Time Travel Mode</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-lg font-semibold text-gray-900 min-w-[140px] text-center">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dateStr = formatDate(date);
          const dayStatus = getDayStatus(date);
          const isSelected = dateStr === selectedDate;
          const isTodayDate = isToday(date);
          const isCurrentMonthDate = isCurrentMonth(date);

          return (
            <button
              key={index}
              onClick={() => onDateSelect(dateStr)}
              className={`
                relative p-2 h-12 text-sm rounded-lg transition-all duration-200 hover:bg-gray-50
                ${isSelected ? 'bg-emerald-500 text-white hover:bg-emerald-600' : ''}
                ${isTodayDate && !isSelected ? 'bg-emerald-50 text-emerald-700 font-semibold' : ''}
                ${!isCurrentMonthDate ? 'text-gray-300' : 'text-gray-700'}
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-xs">{date.getDate()}</span>
                
                {/* Activity indicators */}
                {isCurrentMonthDate && dayStatus && (
                  <div className="flex space-x-0.5 mt-0.5">
                    {dayStatus.dietLogged && (
                      <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
                    )}
                    {dayStatus.workoutLogged && (
                      <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                    )}
                    {dayStatus.workLogged && (
                      <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-purple-500'}`} />
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />
              <span>Diet</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
              <span>Workout</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-1" />
              <span>Work</span>
            </div>
          </div>
          <div className="text-gray-500">
            Click any date to view or edit
          </div>
        </div>
      </div>

      {/* Selected Date Info */}
      {selectedDate && dayData[selectedDate] && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            <Edit3 className="w-4 h-4 text-gray-500" />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center">
              {dayData[selectedDate].dietLogged ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <XCircle className="w-4 h-4 text-gray-400 mr-2" />
              )}
              <span className="text-sm text-gray-700">Diet</span>
            </div>
            
            <div className="flex items-center">
              {dayData[selectedDate].workoutLogged ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <XCircle className="w-4 h-4 text-gray-400 mr-2" />
              )}
              <span className="text-sm text-gray-700">Workout</span>
            </div>
            
            <div className="flex items-center">
              {dayData[selectedDate].workLogged ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <XCircle className="w-4 h-4 text-gray-400 mr-2" />
              )}
              <span className="text-sm text-gray-700">Work</span>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-2xl">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-emerald-500 mr-2 animate-spin" />
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTravel;