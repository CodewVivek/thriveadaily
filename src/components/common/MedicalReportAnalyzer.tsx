import React, { useState } from 'react';
import { X, Upload, FileText, Brain, Target, CheckCircle } from 'lucide-react';

interface MedicalReportAnalyzerProps {
  onClose: () => void;
  onAnalysisComplete: (analysis: any) => void;
}

const MedicalReportAnalyzer: React.FC<MedicalReportAnalyzerProps> = ({ onClose, onAnalysisComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const analyzeReport = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    
    // Simulate AI analysis (in real app, this would call an AI service)
    setTimeout(() => {
      const mockAnalysis = {
        conditions: ['Type 2 Diabetes', 'Hypertension', 'High Cholesterol'],
        recommendations: {
          diet: 'Low-carb, Mediterranean diet',
          calorieLimit: 1800,
          workout: 'Low-impact cardio, strength training',
          restrictions: ['Limit sodium', 'Avoid processed sugars', 'Monitor carb intake']
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
            options: ['None', 'Nuts', 'Dairy', 'Gluten', 'Other']
          },
          {
            id: 'activity_level',
            question: 'What is your current activity level?',
            options: ['Sedentary', 'Lightly active', 'Moderately active', 'Very active']
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
    const finalAnalysis = {
      ...analysis,
      userPreferences: userResponses,
      personalizedPlan: generatePersonalizedPlan()
    };
    
    onAnalysisComplete(finalAnalysis);
  };

  const generatePersonalizedPlan = () => {
    // Generate personalized plan based on analysis + user responses
    let plan = { ...analysis.recommendations };
    
    if (userResponses.vegetarian === 'Vegetarian') {
      plan.diet = 'Vegetarian Mediterranean diet';
    } else if (userResponses.vegetarian === 'Vegan') {
      plan.diet = 'Plant-based Mediterranean diet';
    }
    
    if (userResponses.activity_level === 'Sedentary') {
      plan.calorieLimit = Math.max(plan.calorieLimit - 200, 1400);
      plan.workout = 'Gentle walking, basic strength exercises';
    } else if (userResponses.activity_level === 'Very active') {
      plan.calorieLimit += 300;
      plan.workout = 'High-intensity cardio, advanced strength training';
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
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {!file && (
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
              <div className="space-y-2 text-sm">
                <div><strong>Diet Type:</strong> {analysis.recommendations.diet}</div>
                <div><strong>Daily Calorie Limit:</strong> {analysis.recommendations.calorieLimit} kcal</div>
                <div><strong>Recommended Workout:</strong> {analysis.recommendations.workout}</div>
                <div>
                  <strong>Restrictions:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {analysis.recommendations.restrictions.map((restriction: string, index: number) => (
                      <li key={index}>{restriction}</li>
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
                Apply Recommendations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalReportAnalyzer;