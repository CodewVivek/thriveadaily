import React from 'react';
import { Home, Utensils, Dumbbell, Briefcase, User, Target, Calendar, LogOut, Brain, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedDate: string;
  onShowMedicalAnalyzer: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, selectedDate, onShowMedicalAnalyzer }) => {
  const { signOut, user } = useAuth();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'diet', label: 'Diet', icon: Utensils },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'work', label: 'Work', icon: Briefcase },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'timetravel', label: 'Time Travel', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Check if user is a developer
  const isDeveloper = user?.user_metadata?.role === 'dev' || user?.email?.includes('vivekmanikonda113@gmail.com') || false;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5 lg:pb-4">
        <div className="flex items-center flex-shrink-0 px-6">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Thrive Daily
            </h1>
          </div>
        </div>

        {/* Date Display */}
        <div className="px-6 mt-4">
          <div className="text-sm text-gray-500">Viewing</div>
          <div className="text-lg font-semibold text-gray-900">{formatDate(selectedDate)}</div>
        </div>

        {/* AI Medical Analyzer */}
        <div className="px-3 mt-4">
          <button
            onClick={onShowMedicalAnalyzer}
            className="w-full group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl"
          >
            <Brain className="mr-3 h-5 w-5 text-white" />
            AI Medical Report
          </button>
        </div>

        <div className="mt-8 flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-3 space-y-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className={`mr-3 h-5 w-5 transition-all duration-200 ${
                    activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Developer Badge */}
          {isDeveloper && (
            <div className="px-3 mb-4">
              <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs font-bold text-yellow-800">DEVELOPER MODE</span>
                </div>
              </div>
            </div>
          )}

          {/* Sign Out Button */}
          <div className="px-3 pb-4">
            <button
              onClick={handleSignOut}
              className="w-full group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-500" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom">
        <div className="flex justify-around">
          {tabs.slice(0, 5).map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-indigo-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <IconComponent className={`h-5 w-5 mb-1 ${
                  activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'
                }`} />
                <span className={`text-xs font-medium ${
                  activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navigation;