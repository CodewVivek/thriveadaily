import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LandingPage from './components/auth/LandingPage';
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
  const [authMode, setAuthMode] = useState<'landing' | 'login' | 'register' | 'forgot'>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showMedicalAnalyzer, setShowMedicalAnalyzer] = useState(false);
  const [skipLanding, setSkipLanding] = useState(false);

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

  // Skip landing page and go directly to dashboard for browsing
  if (!user && skipLanding) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          selectedDate={selectedDate}
          onShowMedicalAnalyzer={() => setShowMedicalAnalyzer(true)}
          onShowAuth={() => setSkipLanding(false)}
        />
        
        <div className="lg:pl-64">
          <main className="pb-20 lg:pb-8">
            <Dashboard selectedDate={selectedDate} guestMode={true} />
          </main>
        </div>

        {showMedicalAnalyzer && (
          <MedicalReportAnalyzer
            onClose={() => setShowMedicalAnalyzer(false)}
            onAnalysisComplete={(analysis) => {
              console.log('Medical analysis completed:', analysis);
              setShowMedicalAnalyzer(false);
            }}
            guestMode={true}
          />
        )}
      </div>
    );
  }

  if (!user) {
    switch (authMode) {
      case 'register':
        return (
          <RegisterPage
            onBack={() => setAuthMode('landing')}
            onSuccess={() => setActiveTab('dashboard')}
          />
        );
      case 'login':
        return (
          <LoginPage
            onBack={() => setAuthMode('landing')}
            onSuccess={() => setActiveTab('dashboard')}
            onRegister={() => setAuthMode('register')}
            onForgotPassword={() => setAuthMode('forgot')}
          />
        );
      case 'forgot':
        return (
          <ForgotPasswordPage
            onBack={() => setAuthMode('login')}
            onSuccess={() => setAuthMode('login')}
          />
        );
      default:
        return (
          <LandingPage
            onGetStarted={() => setAuthMode('register')}
            onSignIn={() => setAuthMode('login')}
            onSkipToApp={() => setSkipLanding(true)}
          />
        );
    }
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard selectedDate={selectedDate} />;
      case 'diet':
        return <DietTracker selectedDate={selectedDate} />;
      case 'workout':
        return <WorkoutTracker selectedDate={selectedDate} />;
      case 'work':
        return <WorkTracker selectedDate={selectedDate} />;
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
            />
          </div>
        );
      default:
        return <Dashboard selectedDate={selectedDate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        selectedDate={selectedDate}
        onShowMedicalAnalyzer={() => setShowMedicalAnalyzer(true)}
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
        />
      )}
    </div>
  );
}

export default App;