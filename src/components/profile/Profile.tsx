import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { User, Settings, Award, TrendingUp, Save, Clock, Droplets, Heart, Activity } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    weight: '',
    height: '',
    medical_conditions: '',
    wake_time: '07:00',
    sleep_time: '23:00',
    water_intake_goal: '8',
    preferred_workout: 'cardio',
    goals: {
      weightTarget: '',
      dailyCalories: '',
      workoutFrequency: '',
      workHours: '',
    }
  });

  React.useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || '',
          age: profileData.age?.toString() || '',
          weight: profileData.weight?.toString() || '',
          height: profileData.height?.toString() || '',
          medical_conditions: profileData.medical_conditions || '',
          wake_time: profileData.wake_time || '07:00',
          sleep_time: profileData.sleep_time || '23:00',
          water_intake_goal: profileData.water_intake_goal?.toString() || '8',
          preferred_workout: profileData.preferred_workout || 'cardio',
          goals: {
            weightTarget: profileData.goals?.weightTarget?.toString() || '',
            dailyCalories: profileData.goals?.dailyCalories?.toString() || '',
            workoutFrequency: profileData.goals?.workoutFrequency?.toString() || '',
            workHours: profileData.goals?.workHours?.toString() || '',
          }
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('goals.')) {
      const goalKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        goals: {
          ...prev.goals,
          [goalKey]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const updateData = {
        full_name: formData.full_name,
        age: formData.age ? parseInt(formData.age) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        medical_conditions: formData.medical_conditions,
        wake_time: formData.wake_time,
        sleep_time: formData.sleep_time,
        water_intake_goal: formData.water_intake_goal ? parseInt(formData.water_intake_goal) : null,
        preferred_workout: formData.preferred_workout,
        goals: {
          weightTarget: formData.goals.weightTarget ? parseFloat(formData.goals.weightTarget) : null,
          dailyCalories: formData.goals.dailyCalories ? parseInt(formData.goals.dailyCalories) : null,
          workoutFrequency: formData.goals.workoutFrequency ? parseInt(formData.goals.workoutFrequency) : null,
          workHours: formData.goals.workHours ? parseInt(formData.goals.workHours) : null,
        },
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;
      
      setIsEditing(false);
      loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadProfile(); // Reset form data
  };

  const workoutOptions = [
    { value: 'cardio', label: 'Cardio' },
    { value: 'strength', label: 'Strength Training' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'pilates', label: 'Pilates' },
    { value: 'sports', label: 'Sports' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'mixed', label: 'Mixed Training' },
  ];

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
            <p className="text-gray-600 mt-1">Manage your personal information and health goals</p>
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
                disabled={loading}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Cannot be changed)
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
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
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
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

          {/* Health & Lifestyle */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Health & Lifestyle</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Conditions
                </label>
                <textarea
                  name="medical_conditions"
                  value={formData.medical_conditions}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="List any medical conditions, allergies, or health concerns..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    Wake Time
                  </label>
                  <input
                    type="time"
                    name="wake_time"
                    value={formData.wake_time}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-500" />
                    Sleep Time
                  </label>
                  <input
                    type="time"
                    name="sleep_time"
                    value={formData.sleep_time}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Droplets className="w-4 h-4 mr-2 text-blue-500" />
                    Daily Water Goal (glasses)
                  </label>
                  <input
                    type="number"
                    name="water_intake_goal"
                    value={formData.water_intake_goal}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    min="1"
                    max="20"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-green-500" />
                    Preferred Workout Style
                  </label>
                  <select
                    name="preferred_workout"
                    value={formData.preferred_workout}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    {workoutOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Goals</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight Target (kg)
                </label>
                <input
                  type="number"
                  name="goals.weightTarget"
                  value={formData.goals.weightTarget}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Calories
                </label>
                <input
                  type="number"
                  name="goals.dailyCalories"
                  value={formData.goals.dailyCalories}
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
                  name="goals.workoutFrequency"
                  value={formData.goals.workoutFrequency}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min="1"
                  max="7"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Hours per Day
                </label>
                <input
                  type="number"
                  name="goals.workHours"
                  value={formData.goals.workHours}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min="1"
                  max="16"
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
              {formData.weight && formData.height && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">BMI</span>
                  <span className="font-semibold text-gray-900">
                    {((parseFloat(formData.weight) / Math.pow(parseFloat(formData.height) / 100, 2))).toFixed(1)}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="font-semibold text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
              
              {formData.wake_time && formData.sleep_time && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sleep Duration</span>
                  <span className="font-semibold text-gray-900">
                    {(() => {
                      const wake = new Date(`2000-01-01T${formData.wake_time}`);
                      const sleep = new Date(`2000-01-01T${formData.sleep_time}`);
                      if (sleep > wake) sleep.setDate(sleep.getDate() + 1);
                      const diff = (wake.getTime() - sleep.getTime()) / (1000 * 60 * 60);
                      return `${diff.toFixed(1)}h`;
                    })()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Health Summary */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center mb-4">
              <Heart className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">Health Summary</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-indigo-100">Water Goal</span>
                <span className="font-medium">{formData.water_intake_goal} glasses/day</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-100">Workout Style</span>
                <span className="font-medium capitalize">{formData.preferred_workout}</span>
              </div>
              {formData.medical_conditions && (
                <div className="pt-2 border-t border-indigo-400">
                  <span className="text-indigo-100 text-xs">Medical Notes:</span>
                  <p className="text-sm mt-1 line-clamp-3">{formData.medical_conditions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">Keep Going!</h3>
            </div>
            <p className="text-emerald-100 text-sm mb-4">
              Your profile is {profile ? '85%' : '15%'} complete. Add more details to get better recommendations.
            </p>
            <div className="text-xs text-emerald-200">
              "The groundwork for all happiness is good health." - Leigh Hunt
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;