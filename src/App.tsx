import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LandingPage from './components/auth/LandingPage';
import RegisterPage from './components/auth/RegisterPage';
import LoginPage from './components/auth/LoginPage';
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
  const [authMode, setAuthMode] = useState<'landing' | 'login' | 'register'>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showMedicalAnalyzer, setShowMedicalAnalyzer] = useState(false);

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

  if (!user) {
    switch (authMode) {
      case 'register':
        return (
          <RegisterPage
            onBack={() => setAuthMode('landing')}
            onSuccess={() => {
              // User will be automatically logged in after successful registration
              // The useAuth hook will detect the auth state change and update the user
              // Automatically navigate to dashboard
              setActiveTab('dashboard');
            }}
          />
        );
      case 'login':
        return (
          <LoginPage
            onBack={() => setAuthMode('landing')}
            onSuccess={() => {
              // User will be automatically logged in after successful login
              // The useAuth hook will detect the auth state change and update the user
              // Automatically navigate to dashboard
              setActiveTab('dashboard');
            }}
            onRegister={() => setAuthMode('register')}
          />
        );
      default:
        return (
          <LandingPage
            onGetStarted={() => setAuthMode('register')}
            onSignIn={() => setAuthMode('login')}
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
      
      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="pb-20 lg:pb-8">
          {renderActiveComponent()}
        </main>
      </div>

      {/* Medical Report Analyzer Modal */}
      {showMedicalAnalyzer && (
        <MedicalReportAnalyzer
          onClose={() => setShowMedicalAnalyzer(false)}
          onAnalysisComplete={(analysis) => {
            console.log('Medical analysis completed:', analysis);
            setShowMedicalAnalyzer(false);
            // You could update user goals based on the analysis here
          }}
        />
      )}
    </div>
  );
}

export default App;