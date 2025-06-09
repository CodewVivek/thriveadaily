import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Settings, Award, TrendingUp, Save } from 'lucide-react';
import { User as UserType } from '../../types';

const Profile: React.FC = () => {
  const { user, setUser, achievements } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    weightTarget: user?.goals.weightTarget || '',
    dailyCalories: user?.goals.dailyCalories || '',
    workoutFrequency: user?.goals.workoutFrequency || '',
    workHours: user?.goals.workHours || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser: UserType = {
      id: user?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      age: Number(formData.age),
      weight: Number(formData.weight),
      height: Number(formData.height),
      goals: {
        weightTarget: Number(formData.weightTarget),
        dailyCalories: Number(formData.dailyCalories),
        workoutFrequency: Number(formData.workoutFrequency),
        workHours: Number(formData.workHours),
      },
      createdAt: user?.createdAt || new Date().toISOString(),
    };

    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        age: user.age.toString(),
        weight: user.weight.toString(),
        height: user.height.toString(),
        weightTarget: user.goals.weightTarget.toString(),
        dailyCalories: user.goals.dailyCalories.toString(),
        workoutFrequency: user.goals.workoutFrequency.toString(),
        workHours: user.goals.workHours.toString(),
      });
    }
    setIsEditing(false);
  };

  // Initialize user if not exists
  React.useEffect(() => {
    if (!user) {
      const defaultUser: UserType = {
        id: Date.now().toString(),
        name: 'User',
        email: 'user@example.com',
        age: 25,
        weight: 150,
        height: 68,
        goals: {
          weightTarget: 140,
          dailyCalories: 2000,
          workoutFrequency: 4,
          workHours: 8,
        },
        createdAt: new Date().toISOString(),
      };
      setUser(defaultUser);
    }
  }, [user, setUser]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <User className="w-8 h-8 text-indigo-600 mr-3" />
              Profile
            </h1>
            <p className="text-gray-600 mt-1">Manage your personal information and goals</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
            >
              <Settings className="w-5 h-5 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (inches)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Goals</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight Target (lbs)
                </label>
                <input
                  type="number"
                  name="weightTarget"
                  value={formData.weightTarget}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Calories
                </label>
                <input
                  type="number"
                  name="dailyCalories"
                  value={formData.dailyCalories}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workouts per Week
                </label>
                <input
                  type="number"
                  name="workoutFrequency"
                  value={formData.workoutFrequency}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Hours per Day
                </label>
                <input
                  type="number"
                  name="workHours"
                  value={formData.workHours}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Stats</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">BMI</span>
                <span className="font-semibold text-gray-900">
                  {((user.weight / (user.height * user.height)) * 703).toFixed(1)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="font-semibold text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Achievements</span>
                <span className="font-semibold text-gray-900">
                  {achievements.length}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <Award className="w-5 h-5 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
            </div>
            
            {achievements.length === 0 ? (
              <p className="text-gray-500 text-sm">No achievements yet. Keep tracking to unlock your first achievement!</p>
            ) : (
              <div className="space-y-3">
                {achievements.slice(-3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{achievement.title}</div>
                      <div className="text-xs text-gray-500">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">Keep Going!</h3>
            </div>
            <p className="text-indigo-100 text-sm mb-4">
              You're making great progress. Stay consistent with your tracking to reach your goals.
            </p>
            <div className="text-xs text-indigo-200">
              "Success is the sum of small efforts repeated day in and day out."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;