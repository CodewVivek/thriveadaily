import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import RegisterPage from './components/auth/RegisterPage';
import LoginPage from './components/auth/LoginPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import Navigation from './components/common/Navigation';
import Dashboard from './components/dashboard/Dashboard';
import DietTracker from './components/diet/DietTracker';
import WorkoutTracker from './components/workout/WorkoutTracker';
import WorkTracker from './components/work/WorkTracker';
import GoalsTracker from './components/goals/GoalsTracker';
import Profile from './components/profile/Profile';
import TimeTravel from './components/common/TimeTravel';
import MedicalReportAnalyzer from './components/common/MedicalReportAnalyzer';

function App() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showMedicalAnalyzer, setShowMedicalAnalyzer] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Thrive Daily...</p>
        </div>
      </div>
    );
  }

  // Handle authentication modals
  if (authMode === 'register') {
    return (
      <RegisterPage
        onBack={() => setAuthMode(null)}
        onSuccess={() => {
          setAuthMode(null);
          if (pendingAction) {
            setActiveTab(pendingAction);
            setPendingAction(null);
          }
        }}
        onLogin={() => setAuthMode('login')}
      />
    );
  }

  if (authMode === 'login') {
    return (
      <LoginPage
        onBack={() => setAuthMode(null)}
        onSuccess={() => {
          setAuthMode(null);
          if (pendingAction) {
            setActiveTab(pendingAction);
            setPendingAction(null);
          }
        }}
        onRegister={() => setAuthMode('register')}
        onForgotPassword={() => setAuthMode('forgot')}
      />
    );
  }

  if (authMode === 'forgot') {
    return (
      <ForgotPasswordPage
        onBack={() => setAuthMode('login')}
        onSuccess={() => setAuthMode('login')}
      />
    );
  }

  const handleProtectedAction = (action: string) => {
    if (!user) {
      setPendingAction(action);
      setAuthMode('login');
      return false;
    }
    return true;
  };

  const handleTabChange = (tab: string) => {
    // Check if action requires authentication
    const protectedTabs = ['goals', 'profile'];
    const protectedActions = ['diet-add', 'workout-add', 'work-add'];
    
    if (protectedTabs.includes(tab) || protectedActions.includes(tab)) {
      if (handleProtectedAction(tab)) {
        setActiveTab(tab);
      }
    } else {
      setActiveTab(tab);
    }
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard selectedDate={selectedDate} guestMode={!user} onProtectedAction={handleProtectedAction} />;
      case 'diet':
        return <DietTracker selectedDate={selectedDate} guestMode={!user} onProtectedAction={handleProtectedAction} />;
      case 'workout':
        return <WorkoutTracker selectedDate={selectedDate} guestMode={!user} onProtectedAction={handleProtectedAction} />;
      case 'work':
        return <WorkTracker selectedDate={selectedDate} guestMode={!user} onProtectedAction={handleProtectedAction} />;
      case 'goals':
        return <GoalsTracker />;
      case 'profile':
        return <Profile />;
      case 'timetravel':
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <TimeTravel
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              guestMode={!user}
            />
          </div>
        );
      default:
        return <Dashboard selectedDate={selectedDate} guestMode={!user} onProtectedAction={handleProtectedAction} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        selectedDate={selectedDate}
        onShowMedicalAnalyzer={() => setShowMedicalAnalyzer(true)}
        onShowAuth={() => setAuthMode('login')}
        user={user}
      />
      
      <div className="lg:pl-64">
        <main className="pb-20 lg:pb-8">
          {renderActiveComponent()}
        </main>
      </div>

      {showMedicalAnalyzer && (
        <MedicalReportAnalyzer
          onClose={() => setShowMedicalAnalyzer(false)}
          onAnalysisComplete={(analysis) => {
            console.log('Medical analysis completed:', analysis);
            setShowMedicalAnalyzer(false);
          }}
          guestMode={!user}
          onProtectedAction={handleProtectedAction}
        />
      )}
    </div>
  );
}

export default App;