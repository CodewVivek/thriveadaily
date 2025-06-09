// Nutritionix API service for automatic macronutrient detection
const NUTRITIONIX_APP_ID = import.meta.env.VITE_NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = import.meta.env.VITE_NUTRITIONIX_API_KEY;

export interface NutritionData {
  food_name: string;
  serving_qty: number;
  serving_unit: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_carbohydrate: number;
  nf_total_fat: number;
}

export const searchFood = async (query: string): Promise<NutritionData[]> => {
  if (!NUTRITIONIX_APP_ID || !NUTRITIONIX_API_KEY) {
    // Fallback to mock data if API keys are not available
    return getMockNutritionData(query);
  }

  try {
    const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
      },
      body: JSON.stringify({
        query: query,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch nutrition data');
    }

    const data = await response.json();
    return data.foods || [];
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    // Fallback to mock data
    return getMockNutritionData(query);
  }
};

// Mock nutrition data for common foods
const getMockNutritionData = (query: string): NutritionData[] => {
  const mockData: Record<string, NutritionData> = {
    'chicken breast': {
      food_name: 'Chicken Breast',
      serving_qty: 1,
      serving_unit: 'piece',
      nf_calories: 231,
      nf_protein: 43.5,
      nf_total_carbohydrate: 0,
      nf_total_fat: 5,
    },
    'banana': {
      food_name: 'Banana',
      serving_qty: 1,
      serving_unit: 'medium',
      nf_calories: 105,
      nf_protein: 1.3,
      nf_total_carbohydrate: 27,
      nf_total_fat: 0.4,
    },
    'rice': {
      food_name: 'White Rice',
      serving_qty: 1,
      serving_unit: 'cup',
      nf_calories: 205,
      nf_protein: 4.3,
      nf_total_carbohydrate: 45,
      nf_total_fat: 0.4,
    },
    'egg': {
      food_name: 'Egg',
      serving_qty: 1,
      serving_unit: 'large',
      nf_calories: 70,
      nf_protein: 6,
      nf_total_carbohydrate: 0.6,
      nf_total_fat: 5,
    },
    'apple': {
      food_name: 'Apple',
      serving_qty: 1,
      serving_unit: 'medium',
      nf_calories: 95,
      nf_protein: 0.5,
      nf_total_carbohydrate: 25,
      nf_total_fat: 0.3,
    },
    'salmon': {
      food_name: 'Salmon',
      serving_qty: 1,
      serving_unit: 'fillet',
      nf_calories: 231,
      nf_protein: 25,
      nf_total_carbohydrate: 0,
      nf_total_fat: 14,
    },
    'broccoli': {
      food_name: 'Broccoli',
      serving_qty: 1,
      serving_unit: 'cup',
      nf_calories: 25,
      nf_protein: 3,
      nf_total_carbohydrate: 5,
      nf_total_fat: 0.3,
    },
    'oatmeal': {
      food_name: 'Oatmeal',
      serving_qty: 1,
      serving_unit: 'cup',
      nf_calories: 154,
      nf_protein: 5.3,
      nf_total_carbohydrate: 28,
      nf_total_fat: 3,
    },
  };

  const searchKey = query.toLowerCase();
  const match = Object.keys(mockData).find(key => 
    searchKey.includes(key) || key.includes(searchKey)
  );

  if (match) {
    return [mockData[match]];
  }

  // Default fallback
  return [{
    food_name: query,
    serving_qty: 1,
    serving_unit: 'serving',
    nf_calories: 100,
    nf_protein: 5,
    nf_total_carbohydrate: 15,
    nf_total_fat: 3,
  }];
};