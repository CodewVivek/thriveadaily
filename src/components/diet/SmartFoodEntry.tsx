import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { searchFood, NutritionData } from '../../services/nutritionApi';
import { X, Plus, Search, Loader, Camera, Zap, Target } from 'lucide-react';
import PhotoCapture from '../common/PhotoCapture';

interface SmartFoodEntryProps {
  onClose: () => void;
  selectedDate: string;
}

const SmartFoodEntry: React.FC<SmartFoodEntryProps> = ({ onClose, selectedDate }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NutritionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<NutritionData | null>(null);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    quantity: '1',
    mealType: 'breakfast' as const,
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Food suggestions for autocomplete
  const foodSuggestions = [
    'Bread', 'Broccoli', 'Banana', 'Chicken Breast', 'Rice', 'Egg', 'Apple', 'Salmon',
    'Oatmeal', 'Yogurt', 'Spinach', 'Sweet Potato', 'Avocado', 'Quinoa', 'Almonds',
    'Tuna', 'Pasta', 'Cheese', 'Milk', 'Orange', 'Carrots', 'Beef', 'Turkey', 'Beans'
  ];

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    
    // Show suggestions as user types
    if (value.length >= 2) {
      const filtered = foodSuggestions.filter(food => 
        food.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setSuggestions([]);
    try {
      const results = await searchFood(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching food:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectFood = (food: NutritionData) => {
    setSelectedFood(food);
    setFormData(prev => ({
      ...prev,
      quantity: '1', // Reset to 1 for easier calculation
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFood || !user) return;

    const quantity = Number(formData.quantity);
    const multiplier = quantity / selectedFood.serving_qty;

    try {
      const { error } = await supabase
        .from('food_entries')
        .insert({
          user_id: user.id,
          name: selectedFood.food_name,
          calories: Math.round(selectedFood.nf_calories * multiplier),
          protein: Math.round(selectedFood.nf_protein * multiplier * 10) / 10,
          carbs: Math.round(selectedFood.nf_total_carbohydrate * multiplier * 10) / 10,
          fat: Math.round(selectedFood.nf_total_fat * multiplier * 10) / 10,
          quantity: quantity,
          unit: 'grams', // Default unit as requested
          meal_type: formData.mealType,
          date: selectedDate,
          photo_url: capturedPhoto,
        });

      if (error) throw error;
      onClose();
    } catch (error) {
      console.error('Error adding food entry:', error);
    }
  };

  const handlePhotoCapture = (photoData: string) => {
    setCapturedPhoto(photoData);
    setShowPhotoCapture(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Zap className="w-5 h-5 text-emerald-600 mr-2" />
              Smart Food Entry
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {!selectedFood ? (
            <div className="space-y-4">
              {/* Search with Autocomplete */}
              <div className="relative">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchInputChange(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      placeholder="Type food name (e.g., Br...)"
                    />
                  </div>
                  <button
                    onClick={() => handleSearch()}
                    disabled={loading}
                    className="px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  </button>
                </div>

                {/* Autocomplete Suggestions */}
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 shadow-lg z-10">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setSuggestions([]);
                          handleSearch(suggestion);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Photo Button */}
              <button
                onClick={() => setShowPhotoCapture(true)}
                className="w-full border-2 border-dashed border-gray-300 py-4 rounded-xl hover:border-emerald-500 transition-colors duration-200 flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2 text-gray-500" />
                <span className="text-gray-600">Add Photo</span>
              </button>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-emerald-600" />
                    Search Results
                  </h3>
                  {searchResults.map((food, index) => (
                    <button
                      key={index}
                      onClick={() => selectFood(food)}
                      className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
                    >
                      <div className="font-medium text-gray-900">{food.food_name}</div>
                      <div className="text-sm text-gray-600">
                        {food.serving_qty} {food.serving_unit} • {Math.round(food.nf_calories)} cal
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        P: {Math.round(food.nf_protein)}g • C: {Math.round(food.nf_total_carbohydrate)}g • F: {Math.round(food.nf_total_fat)}g
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected Food */}
              <div className="p-4 bg-emerald-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{selectedFood.food_name}</h3>
                  <button
                    type="button"
                    onClick={() => setSelectedFood(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Per {selectedFood.serving_qty} {selectedFood.serving_unit} • {Math.round(selectedFood.nf_calories)} cal
                </div>
              </div>

              {/* Captured Photo */}
              {capturedPhoto && (
                <div className="relative">
                  <img src={capturedPhoto} alt="Food" className="w-full h-32 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => setCapturedPhoto(null)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Quantity (in grams) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (grams)
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  step="1"
                  min="1"
                  required
                />
              </div>

              {/* Meal Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type
                </label>
                <select
                  value={formData.mealType}
                  onChange={(e) => setFormData(prev => ({ ...prev, mealType: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="breakfast">🌅 Breakfast</option>
                  <option value="lunch">☀️ Lunch</option>
                  <option value="dinner">🌙 Dinner</option>
                  <option value="snack">🍎 Snack</option>
                </select>
              </div>

              {/* Auto-calculated Nutrition Preview */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-emerald-600" />
                  Auto-calculated Nutrition
                </h4>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-emerald-600">
                      {Math.round(selectedFood.nf_calories * (Number(formData.quantity) / 100))}
                    </div>
                    <div className="text-gray-500">Cal</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">
                      {Math.round(selectedFood.nf_protein * (Number(formData.quantity) / 100) * 10) / 10}g
                    </div>
                    <div className="text-gray-500">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-orange-600">
                      {Math.round(selectedFood.nf_total_carbohydrate * (Number(formData.quantity) / 100) * 10) / 10}g
                    </div>
                    <div className="text-gray-500">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-purple-600">
                      {Math.round(selectedFood.nf_total_fat * (Number(formData.quantity) / 100) * 10) / 10}g
                    </div>
                    <div className="text-gray-500">Fat</div>
                  </div>
                </div>
              </div>

              {/* Add Photo Button */}
              {!capturedPhoto && (
                <button
                  type="button"
                  onClick={() => setShowPhotoCapture(true)}
                  className="w-full border-2 border-dashed border-gray-300 py-3 rounded-xl hover:border-emerald-500 transition-colors duration-200 flex items-center justify-center"
                >
                  <Camera className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Add Photo</span>
                </button>
              )}

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedFood(null)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Food
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {showPhotoCapture && (
        <PhotoCapture
          onPhotoCapture={handlePhotoCapture}
          onClose={() => setShowPhotoCapture(false)}
        />
      )}
    </>
  );
};

export default SmartFoodEntry;