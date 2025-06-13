import React from 'react';
import { Target, Utensils, Dumbbell, Briefcase, TrendingUp, Users, Award, Calendar, Sparkles, Zap, Heart, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onSkipToApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn, onSkipToApp }) => {
  const features = [
    {
      icon: Utensils,
      title: 'Smart Nutrition Tracking',
      description: 'AI-powered food recognition with automatic macro calculations. Just snap a photo or search our database of millions of foods.',
    },
    {
      icon: Dumbbell,
      title: 'Intelligent Fitness Logging',
      description: 'Track workouts with precision. Monitor strength gains, endurance improvements, and celebrate every milestone.',
    },
    {
      icon: Briefcase,
      title: 'Productivity Mastery',
      description: 'Focus sessions with smart timers. Analyze your peak performance hours and optimize your workflow.',
    },
    {
      icon: Calendar,
      title: 'Time Travel Analytics',
      description: 'Review any past date with detailed insights. Back-fill missed logs and maintain your perfect tracking streak.',
    },
    {
      icon: Sparkles,
      title: 'AI Medical Analysis',
      description: 'Upload medical reports for instant analysis. Get personalized diet plans, workout recommendations, and health insights.',
    },
    {
      icon: Zap,
      title: 'Real-time Insights',
      description: 'Beautiful dashboards with actionable insights. See patterns, trends, and opportunities for growth.',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Active Thrivers' },
    { number: '2M+', label: 'Meals Tracked' },
    { number: '1M+', label: 'Workouts Logged' },
    { number: '5M+', label: 'Focus Hours' },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      content: 'Thrive Daily transformed my chaotic routine into a structured path to success. The insights are incredible!',
      avatar: '👩‍💻'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Fitness Coach',
      content: 'Finally, an app that understands the connection between nutrition, fitness, and productivity. Game changer!',
      avatar: '💪'
    },
    {
      name: 'Emily Watson',
      role: 'Entrepreneur',
      content: 'The medical report analysis feature helped me understand my health better than any doctor visit.',
      avatar: '🚀'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Thrive Daily
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onSkipToApp}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 flex items-center"
            >
              Browse App <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={onSignIn}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Already have an account? <span className="text-indigo-600">Sign In</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
                  <Heart className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-yellow-800" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Thrive Every
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Single Day</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              The ultimate wellness companion with AI-powered medical analysis, smart nutrition tracking, 
              and comprehensive health insights. Transform your daily habits into extraordinary results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Your Journey
              </button>
              <button
                onClick={onSkipToApp}
                className="border-2 border-indigo-500 text-indigo-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-indigo-50 transition-all duration-300 flex items-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Explore Features
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-pink-400 to-red-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Thrive</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help you build lasting healthy habits and achieve extraordinary results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-600">
              See what our community has to say about their transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people who have already started their journey to better health, fitness, and productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Thriving Today
            </button>
            <button
              onClick={onSkipToApp}
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300"
            >
              Try Without Signing Up
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Thrive Daily</span>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-400">
              © 2024 Thrive Daily. Built with passion for your success.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;