// src/CropPredictionResultsPage.jsx
import React, { useEffect, useState } from "react";
import { TrendingUp, AlertCircle, CheckCircle, BarChart3 } from "lucide-react";

// Uploaded file path (local sandbox file). Your build/tooling will transform this to a usable URL.
export const SAMPLE_IMAGE_URL = "sandbox:/mnt/data/19f4a51c-0c3d-4a08-a420-412cfe67ed24.png";

export default function CropPredictTwo() {
  const [formData, setFormData] = useState(null);
  const [location, setLocation] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve data from sessionStorage
    const storedFormData = sessionStorage.getItem("cropAssessmentData");
    const storedLocation = sessionStorage.getItem("location");

    if (storedFormData && storedLocation) {
      setFormData(JSON.parse(storedFormData));
      setLocation(JSON.parse(storedLocation));
      generatePredictions(JSON.parse(storedFormData), JSON.parse(storedLocation));
    } else {
      // If no data, redirect to assessment page
      window.location.href = "/crop-assessment";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generatePredictions = async (data, loc) => {
    try {
      // Simulate ChatGPT API call / AI backend
      // In production, call your backend endpoint (POST) with data + loc
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mocked prediction response
      const mockPrediction = {
        yieldEstimate: "5.8 tons/hectare",
        confidence: "92%",
        expectedProduction: "2.9 tons on 0.5 hectares",
        qualityGrade: "A+ (Premium)",
        recommendations: [
          {
            category: "Irrigation",
            advice:
              "With moderate soil moisture, plan for irrigation every 5-7 days during flowering stage. Current humidity levels support growth.",
            priority: "high",
          },
          {
            category: "Fertilizer",
            advice: `Nitrogen level at ${data.nitrogen} mg/kg is good. Apply additional 30kg/hectare urea at panicle initiation stage.`,
            priority: "high",
          },
          {
            category: "Pest Management",
            advice:
              "At current stage, monitor for stem borers and leaf folders. Consider preventive spraying with recommended pesticides.",
            priority: "medium",
          },
          {
            category: "Water Management",
            advice: `Using ${data.waterSource}, maintain 5cm standing water during tillering and 7cm during flowering.`,
            priority: "high",
          },
          {
            category: "Soil Care",
            advice: `Soil pH at ${data.ph} is optimal for rice. Organic content at ${data.organicContent}% - consider adding organic matter.`,
            priority: "medium",
          },
        ],
        risks: [
          { risk: "High humidity levels may increase fungal disease risk", mitigation: "Ensure proper field drainage" },
          {
            risk: "Days from germination suggests mid-season stage - critical period",
            mitigation: "Close monitoring required for optimal yields",
          },
        ],
        schedule: [
          { phase: "Current Stage", action: "Monitor water levels, check for pests", daysLeft: 20 },
          { phase: "Next 20 days", action: "Apply second dose of fertilizer, continue irrigation", daysLeft: 20 },
          { phase: "Final 30 days", action: "Reduce water, prepare for harvesting", daysLeft: 30 },
        ],
      };

      setPredictions(mockPrediction);
    } catch (error) {
      console.error("Error generating predictions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Generating AI predictions...</p>
        </div>
      </div>
    );
  }

  if (!predictions || !formData || !location) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No prediction data available</p>
          <a href="/crop-assessment" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Go back to assessment
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">AI Crop Prediction Results</h1>
          <p className="text-gray-600">Personalized recommendations based on your crop assessment</p>
        </div>

        {/* Location & Assessment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <p className="text-sm text-gray-600 font-semibold mb-1">Location</p>
            <p className="text-lg text-gray-900">{location.name}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <p className="text-sm text-gray-600 font-semibold mb-1">Crop Stage</p>
            <p className="text-lg text-gray-900">{formData.cropStage.replace(/_/g, " ")}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <p className="text-sm text-gray-600 font-semibold mb-1">Days from Germination</p>
            <p className="text-lg text-gray-900">{formData.daysFromGermination} days</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <p className="text-sm text-gray-600 font-semibold mb-1">Soil Moisture</p>
            <p className="text-lg text-gray-900">{formData.soilMoisture}</p>
          </div>
        </div>

        {/* Main Predictions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Yield Estimate */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Yield Estimate</h2>
            </div>
            <p className="text-4xl font-bold mb-2">{predictions.yieldEstimate}</p>
            <p className="text-green-100 text-lg">{predictions.expectedProduction}</p>
            <div className="mt-4 pt-4 border-t border-green-400">
              <p className="text-sm">Confidence Level: {predictions.confidence}</p>
            </div>
          </div>

          {/* Quality Grade */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Quality Grade</h2>
            </div>
            <p className="text-4xl font-bold mb-2">{predictions.qualityGrade}</p>
            <p className="text-blue-100">Based on soil parameters and growing conditions</p>
            <div className="mt-4 pt-4 border-t border-blue-400">
              <p className="text-sm">Expected market premium: +15-20%</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-green-600" />
            AI Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${rec.priority === "high" ? "bg-red-50 border-red-500" : "bg-yellow-50 border-yellow-500"
                  }`}
              >
                <p className={`font-bold mb-2 ${rec.priority === "high" ? "text-red-900" : "text-yellow-900"}`}>
                  {rec.category}
                  <span
                    className={`ml-2 text-xs px-2 py-1 rounded ${rec.priority === "high" ? "bg-red-200 text-red-800" : "bg-yellow-200 text-yellow-800"
                      }`}
                  >
                    {rec.priority.toUpperCase()}
                  </span>
                </p>
                <p className={rec.priority === "high" ? "text-red-800" : "text-yellow-800"}>{rec.advice}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-orange-50 rounded-xl p-6 shadow-lg border border-orange-200 mb-8">
          <h2 className="text-2xl font-bold text-orange-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Risk Assessment
          </h2>
          <div className="space-y-4">
            {predictions.risks.map((risk, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
                <p className="font-semibold text-gray-900 mb-2">⚠️ {risk.risk}</p>
                <p className="text-gray-700">
                  <span className="font-semibold">Mitigation:</span> {risk.mitigation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Farming Schedule */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Next Steps & Schedule</h2>
          <div className="space-y-4">
            {predictions.schedule.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-gray-200">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1">{item.phase}</p>
                  <p className="text-gray-700 mb-2">{item.action}</p>
                  <p className="text-xs text-gray-600">Days remaining: {item.daysLeft}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <a href="/crop-assessment" className="flex-1 px-6 py-3 bg-white border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition font-bold">
            New Assessment
          </a>
          <a href="/weather-prediction" className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold">
            Check Weather
          </a>
          <button
            onClick={() => window.print()}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
          >
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
}
