import React, { useState } from 'react';
import { X, Upload, FileText, Brain, Target, CheckCircle, AlertCircle, User } from 'lucide-react';

interface MedicalReportAnalyzerProps {
  onClose: () => void;
  onAnalysisComplete: (analysis: any) => void;
  guestMode?: boolean;
}

const MedicalReportAnalyzer: React.FC<MedicalReportAnalyzerProps> = ({ 
  onClose, 
  onAnalysisComplete, 
  guestMode = false 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const analyzeReport = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    
    // Simulate AI analysis with more comprehensive results
    setTimeout(() => {
      const mockAnalysis = {
        conditions: ['Type 2 Diabetes', 'Hypertension', 'Vitamin D Deficiency', 'High Cholesterol'],
        recommendations: {
          diet: 'Low-carb, Mediterranean diet with emphasis on omega-3 fatty acids',
          calorieLimit: 1800,
          workout: 'Low-impact cardio 30min daily, strength training 3x/week',
          restrictions: ['Limit sodium to 2300mg/day', 'Avoid processed sugars', 'Monitor carb intake to 150g/day', 'Increase fiber to 35g/day'],
          supplements: ['Vitamin D3 2000 IU daily', 'Omega-3 1000mg daily', 'Magnesium 400mg daily'],
          restPeriods: 'Ensure 7-8 hours sleep, 10min meditation daily'
        },
        followUpQuestions: [
          {
            id: 'vegetarian',
            question: 'Are you vegetarian or vegan?',
            options: ['No', 'Vegetarian', 'Vegan']
          },
          {
            id: 'allergies',
            question: 'Do you have any food allergies?',
            options: ['None', 'Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Other']
          },
          {
            id: 'activity_level',
            question: 'What is your current activity level?',
            options: ['Sedentary', 'Lightly active', 'Moderately active', 'Very active']
          },
          {
            id: 'energy_level',
            question: 'How would you rate your energy levels?',
            options: ['Very low', 'Low', 'Moderate', 'High', 'Very high']
          },
          {
            id: 'sleep_quality',
            question: 'How is your sleep quality?',
            options: ['Poor', 'Fair', 'Good', 'Excellent']
          }
        ]
      };
      
      setAnalysis(mockAnalysis);
      setAnalyzing(false);
    }, 3000);
  };

  const handleQuestionResponse = (questionId: string, answer: string) => {
    setUserResponses(prev => ({ ...prev, [questionId]: answer }));
  };

  const completeAnalysis = () => {
    if (guestMode) {
      setShowSignInPrompt(true);
      return;
    }

    const finalAnalysis = {
      ...analysis,
      userPreferences: userResponses,
      personalizedPlan: generatePersonalizedPlan()
    };
    
    onAnalysisComplete(finalAnalysis);
  };

  const generatePersonalizedPlan = () => {
    let plan = { ...analysis.recommendations };
    
    // Adjust based on dietary preferences
    if (userResponses.vegetarian === 'Vegetarian') {
      plan.diet = 'Vegetarian Mediterranean diet with plant-based proteins';
      plan.supplements = [...plan.supplements, 'B12 supplement', 'Iron supplement'];
    } else if (userResponses.vegetarian === 'Vegan') {
      plan.diet = 'Plant-based Mediterranean diet with complete amino acid profiles';
      plan.supplements = [...plan.supplements, 'B12 supplement', 'Iron supplement', 'Zinc supplement'];
    }
    
    // Adjust calories based on activity level
    if (userResponses.activity_level === 'Sedentary') {
      plan.calorieLimit = Math.max(plan.calorieLimit - 200, 1400);
      plan.workout = 'Gentle walking 20min daily, basic strength exercises 2x/week';
    } else if (userResponses.activity_level === 'Very active') {
      plan.calorieLimit += 400;
      plan.workout = 'High-intensity cardio 45min daily, advanced strength training 4x/week';
    }
    
    // Adjust based on energy levels
    if (userResponses.energy_level === 'Very low' || userResponses.energy_level === 'Low') {
      plan.supplements = [...plan.supplements, 'CoQ10 supplement', 'B-Complex vitamins'];
      plan.restPeriods = 'Prioritize 8-9 hours sleep, 15min meditation, power naps if needed';
    }
    
    return plan;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Brain className="w-6 h-6 text-indigo-600 mr-2" />
            AI Medical Report Analyzer
            {guestMode && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Demo Mode
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {guestMode && !file && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                You're in demo mode. Sign in to save your analysis and get personalized recommendations.
              </span>
            </div>
          </div>
        )}

        {showSignInPrompt && (
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl mb-6">
            <div className="text-center">
              <User className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign In to Save Your Analysis</h3>
              <p className="text-gray-600 mb-4">
                Create an account to save your personalized health plan and track your progress over time.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Maybe Later
                </button>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  Sign In Now
                </button>
              </div>
            </div>
          </div>
        )}

        {!file && !showSignInPrompt && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Medical Report</h3>
            <p className="text-gray-600 mb-6">
              Upload your medical report (PDF or image) for AI analysis and personalized recommendations
            </p>
            
            <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 cursor-pointer">
              <Upload className="w-5 h-5 mr-2" />
              Choose File
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {file && !analyzing && !analysis && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">File Uploaded Successfully</h3>
            <p className="text-gray-600 mb-2">{file.name}</p>
            <p className="text-sm text-gray-500 mb-6">
              Ready to analyze your medical report with AI
            </p>
            
            <button
              onClick={analyzeReport}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center mx-auto"
            >
              <Brain className="w-5 h-5 mr-2" />
              Analyze Report
            </button>
          </div>
        )}

        {analyzing && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Brain className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Report...</h3>
            <p className="text-gray-600 mb-4">
              AI is extracting conditions and generating personalized recommendations
            </p>
            <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            {/* Detected Conditions */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h3 className="font-semibold text-red-800 mb-3">Detected Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.conditions.map((condition: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                AI Recommendations
              </h3>
              <div className="space-y-3 text-sm">
                <div><strong>Diet Type:</strong> {analysis.recommendations.diet}</div>
                <div><strong>Daily Calorie Limit:</strong> {analysis.recommendations.calorieLimit} kcal</div>
                <div><strong>Recommended Workout:</strong> {analysis.recommendations.workout}</div>
                <div><strong>Rest & Recovery:</strong> {analysis.recommendations.restPeriods}</div>
                <div>
                  <strong>Dietary Restrictions:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {analysis.recommendations.restrictions.map((restriction: string, index: number) => (
                      <li key={index}>{restriction}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Recommended Supplements:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {analysis.recommendations.supplements.map((supplement: string, index: number) => (
                      <li key={index}>{supplement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Follow-up Questions */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h3 className="font-semibold text-purple-800 mb-4">Help us personalize your plan</h3>
              <div className="space-y-4">
                {analysis.followUpQuestions.map((question: any) => (
                  <div key={question.id}>
                    <p className="text-sm font-medium text-gray-700 mb-2">{question.question}</p>
                    <div className="flex flex-wrap gap-2">
                      {question.options.map((option: string) => (
                        <button
                          key={option}
                          onClick={() => handleQuestionResponse(question.id, option)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                            userResponses[question.id] === option
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Analysis */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={completeAnalysis}
                disabled={analysis.followUpQuestions.some((q: any) => !userResponses[q.id])}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {guestMode ? 'View Full Analysis' : 'Apply Recommendations'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalReportAnalyzer;