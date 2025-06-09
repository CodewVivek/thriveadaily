import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Utensils, Target, Camera } from 'lucide-react';
import SmartFoodEntry from './SmartFoodEntry';
import FoodList from './FoodList';
import NutritionSummary from './NutritionSummary';

interface DietTrackerProps {
  selectedDate: string;
}

const DietTracker: React.FC<DietTrackerProps> = ({ selectedDate }) => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [foodEntries, setFoodEntries] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, selectedDate]);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Load food entries for selected date
      const { data: entriesData } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', selectedDate)
        .order('created_at', { ascending: false });

      setFoodEntries(entriesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = foodEntries.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMealType = selectedMealType === 'all' || entry.meal_type === selectedMealType;
    return matchesSearch && matchesMealType;
  });

  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const dailyGoal = profile?.goals?.dailyCalories || 2000;

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Utensils className="w-8 h-8 text-emerald-600 mr-3" />
              Diet Tracker
            </h1>
            <p className="text-gray-600 mt-1">
              {isToday 
                ? "Track your meals and nutrition" 
                : `Viewing meals for ${new Date(selectedDate).toLocaleDateString()}`
              }
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Food
          </button>
        </div>

        {/* Calories Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isToday ? "Today's Calories" : "Calories"}
              </h3>
              <p className="text-sm text-gray-600">
                {totalCalories} / {dailyGoal} kcal
              </p>
            </div>
            <Target className="w-6 h-6 text-emerald-600" />
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
              style={{ width: `${Math.min((totalCalories / dailyGoal) * 100, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress: {Math.round((totalCalories / dailyGoal) * 100)}%</span>
            <span>Remaining: {Math.max(dailyGoal - totalCalories, 0)} kcal</span>
          </div>
        </div>
      </div>

      {/* Nutrition Summary */}
      <NutritionSummary entries={foodEntries} />

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search foods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Meals</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>
      </div>

      {/* Food List */}
      <FoodList entries={filteredEntries} onRefresh={loadData} />

      {/* Smart Food Entry Modal */}
      {showAddForm && (
        <SmartFoodEntry 
          onClose={() => {
            setShowAddForm(false);
            loadData(); // Refresh data after adding
          }} 
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default DietTracker;