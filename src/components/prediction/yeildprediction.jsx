import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';

// ============================================================================
// CONFIGURATION - Update these values for your setup
// ============================================================================
const API_CONFIG = {
  PREDICTION_URL: 'http://localhost:8000/predict',
  // Add your OpenAI API key here (or use environment variable in production)
  OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY_HERE'
};

// ============================================================================
// CONSTANTS
// ============================================================================
const CHART_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

const featureNames = {
  'Season_Tmean_mean': 'Mean Temperature',
  'Season_Tmax_mean': 'Max Temperature',
  'Season_Tmin_mean': 'Min Temperature',
  'Season_Rainfall_sum': 'Total Rainfall',
  'Season_Rainfall_mean': 'Avg Rainfall',
  'Season_Humidity_mean': 'Humidity',
  'area': 'Farm Area'
};

const featureDescriptions = {
  'Season_Tmean_mean': 'Average temperature during growing season',
  'Season_Tmax_mean': 'Maximum temperature during growing season',
  'Season_Tmin_mean': 'Minimum temperature during growing season',
  'Season_Rainfall_sum': 'Total rainfall during growing season',
  'Season_Rainfall_mean': 'Average monthly rainfall',
  'Season_Humidity_mean': 'Average relative humidity',
  'area': 'Total cultivated land area'
};

// ============================================================================
// AI SUGGESTION SERVICE
// ============================================================================
async function getAISuggestions(predictionData, inputData) {
  const prompt = `You are an agricultural expert advisor for rice farmers in Nepal's Dang District. 
Based on the following prediction data and input parameters, provide practical farming suggestions.

**Prediction Results:**
- Predicted Yield: ${predictionData.predicted_yield_MT_per_HA.toFixed(2)} MT/HA
- Total Expected Production: ${(predictionData.predicted_yield_MT_per_HA * inputData.land_area).toFixed(2)} MT

**Input Parameters:**
- Land Area: ${inputData.land_area} Hectares
- Location: ${inputData.location}, ${inputData.region}
- Rice Type: ${inputData.rice_type}
- Season: Year ${inputData.year}

**Climate Conditions:**
- Mean Temperature: ${inputData.season_tmean}°C
- Max Temperature: ${inputData.season_tmax}°C
- Min Temperature: ${inputData.season_tmin}°C
- Total Rainfall: ${inputData.season_rain_sum} mm
- Average Rainfall: ${inputData.season_rain_mean} mm
- Humidity: ${inputData.humidity}%

**Soil Parameters:**
- Soil pH: ${inputData.soil_ph}
- Nitrogen: ${inputData.nitrogen} kg/ha
- Phosphorus: ${inputData.phosphorus} kg/ha
- Organic Matter: ${inputData.organic}%
- Water Source: ${inputData.water_source}

**Most Important Factors (from ML model):**
${predictionData.feature_importances.slice(0, 3).map((f, i) => 
  `${i + 1}. ${featureNames[f.feature] || f.feature}: ${(f.importance * 100).toFixed(1)}% importance`
).join('\n')}

Please provide:
1. **Yield Assessment** (1-2 sentences about whether this yield is good/average/poor for the region)
2. **Top 3 Actionable Recommendations** (specific, practical tips the farmer can implement)
3. **Risk Factors** (1-2 potential concerns based on the data)
4. **Optimal Actions for Next Season** (2-3 preparation tips)

Keep the response concise, practical, and suitable for smallholder farmers. Use simple language.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('AI suggestion error:', error);
    return generateFallbackSuggestions(predictionData, inputData);
  }
}

// Fallback suggestions if AI is unavailable
function generateFallbackSuggestions(predictionData, inputData) {
  const yield_value = predictionData.predicted_yield_MT_per_HA;
  const yieldLevel = yield_value >= 4 ? 'excellent' : yield_value >= 3.5 ? 'good' : yield_value >= 3 ? 'average' : 'below average';
  
  return `## Yield Assessment
Your predicted yield of ${yield_value.toFixed(2)} MT/HA is **${yieldLevel}** for Dang District.

## Top 3 Recommendations
1. **Temperature Management**: With mean temperature at ${inputData.season_tmean}°C, ensure adequate water supply during hot periods to prevent heat stress.
2. **Nutrient Optimization**: Your nitrogen level (${inputData.nitrogen} kg/ha) is good. Consider split application for better uptake.
3. **Water Management**: With ${inputData.season_rain_sum}mm total rainfall, ${inputData.water_source === 'Irrigation' ? 'supplement with irrigation during dry spells' : 'consider installing irrigation backup'}.

## Risk Factors
- High temperatures (${inputData.season_tmax}°C max) may cause spikelet sterility if humidity drops
- Monitor for pests during humid conditions (${inputData.humidity}% humidity)

## Next Season Preparation
- Test soil pH before planting (current: ${inputData.soil_ph})
- Prepare field drainage for monsoon season
- Consider crop rotation to maintain soil health`;
}

// ============================================================================
// LOADING SPINNER COMPONENT
// ============================================================================
function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}

// ============================================================================
// INPUT FORM COMPONENT
// ============================================================================
function PredictionForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    land_area: 1.5,
    unit: 'Hectares',
    region: 'Dang',
    location: 'Ward-3',
    rice_type: 'Improved',
    humidity: 72.5,
    soil_ph: 6.4,
    phosphorus: 25,
    nitrogen: 240,
    organic: 3.2,
    water_source: 'Irrigation',
    season_rain_sum: 450,
    season_rain_mean: 56.25,
    season_tmean: 29.8,
    season_tmax: 33.5,
    season_tmin: 24.1,
    year: 2024
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        🌱 Enter Farm Details
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Land Area */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Land Area (ha)</label>
          <input
            type="number"
            name="land_area"
            value={formData.land_area}
            onChange={handleChange}
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Region */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Region</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Dang">Dang</option>
            <option value="Banke">Banke</option>
            <option value="Bardiya">Bardiya</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Rice Type */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Rice Type</label>
          <select
            name="rice_type"
            value={formData.rice_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Improved">Improved</option>
            <option value="Traditional">Traditional</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Climate Section Header */}
        <div className="col-span-full mt-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Climate Parameters</p>
        </div>

        {/* Mean Temperature */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Mean Temp (°C)</label>
          <input
            type="number"
            name="season_tmean"
            value={formData.season_tmean}
            onChange={handleChange}
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Max Temperature */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Max Temp (°C)</label>
          <input
            type="number"
            name="season_tmax"
            value={formData.season_tmax}
            onChange={handleChange}
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Min Temperature */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Min Temp (°C)</label>
          <input
            type="number"
            name="season_tmin"
            value={formData.season_tmin}
            onChange={handleChange}
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Humidity */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Humidity (%)</label>
          <input
            type="number"
            name="humidity"
            value={formData.humidity}
            onChange={handleChange}
            step="0.5"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Total Rainfall */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Total Rainfall (mm)</label>
          <input
            type="number"
            name="season_rain_sum"
            value={formData.season_rain_sum}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Avg Rainfall */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Avg Rainfall (mm)</label>
          <input
            type="number"
            name="season_rain_mean"
            value={formData.season_rain_mean}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Soil Section Header */}
        <div className="col-span-full mt-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Soil Parameters</p>
        </div>

        {/* Soil pH */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Soil pH</label>
          <input
            type="number"
            name="soil_ph"
            value={formData.soil_ph}
            onChange={handleChange}
            step="0.1"
            min="4"
            max="9"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Nitrogen */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nitrogen (kg/ha)</label>
          <input
            type="number"
            name="nitrogen"
            value={formData.nitrogen}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Phosphorus */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Phosphorus (kg/ha)</label>
          <input
            type="number"
            name="phosphorus"
            value={formData.phosphorus}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Organic Matter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Organic Matter (%)</label>
          <input
            type="number"
            name="organic"
            value={formData.organic}
            onChange={handleChange}
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Water Source */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Water Source</label>
          <select
            name="water_source"
            value={formData.water_source}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Irrigation">Irrigation</option>
            <option value="Rainfed">Rainfed</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="2020"
            max="2030"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Predicting...
            </span>
          ) : (
            '🌾 Predict Rice Yield'
          )}
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// AI SUGGESTIONS COMPONENT
// ============================================================================
function AISuggestions({ suggestions, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          🤖 AI-Powered Farming Suggestions
        </h3>
        <LoadingSpinner message="Generating personalized suggestions..." />
      </div>
    );
  }

  if (!suggestions) return null;

  // Parse markdown-style headers
  const formatSuggestions = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return (
          <h4 key={index} className="text-base font-semibold text-emerald-700 mt-4 mb-2">
            {line.replace('## ', '')}
          </h4>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className="font-semibold text-gray-800 mt-2">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      } else if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 text-gray-700 text-sm">
            {line.replace('- ', '')}
          </li>
        );
      } else if (line.match(/^\d+\./)) {
        return (
          <li key={index} className="ml-4 text-gray-700 text-sm list-decimal">
            {line.replace(/^\d+\.\s*/, '')}
          </li>
        );
      } else if (line.trim()) {
        return (
          <p key={index} className="text-gray-700 text-sm">
            {line}
          </p>
        );
      }
      return null;
    });
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-lg p-6 border border-emerald-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🤖</span>
        AI-Powered Farming Suggestions
      </h3>
      <div className="prose prose-sm max-w-none">
        {formatSuggestions(suggestions)}
      </div>
    </div>
  );
}

// ============================================================================
// RESULTS DISPLAY COMPONENT
// ============================================================================
function ResultsDisplay({ data, inputData }) {
  const predictedYield = data.predicted_yield_MT_per_HA;
  const totalProduction = predictedYield * inputData.land_area;

  const yieldLevel = predictedYield >= 4 ? 'Excellent' : predictedYield >= 3.5 ? 'Good' : predictedYield >= 3 ? 'Average' : 'Below Average';
  const yieldEmoji = predictedYield >= 4 ? '🎉' : predictedYield >= 3.5 ? '✅' : predictedYield >= 3 ? '📊' : '⚠️';
  const yieldColorClass = predictedYield >= 4 ? 'text-emerald-600' : predictedYield >= 3.5 ? 'text-green-600' : predictedYield >= 3 ? 'text-yellow-600' : 'text-red-600';
  const yieldBgClass = predictedYield >= 4 ? 'from-emerald-500 to-green-600' : predictedYield >= 3.5 ? 'from-green-500 to-teal-600' : predictedYield >= 3 ? 'from-yellow-500 to-amber-600' : 'from-red-500 to-orange-600';

  const featureImportanceData = data.feature_importances.map((item, index) => ({
    name: featureNames[item.feature] || item.feature,
    importance: parseFloat((item.importance * 100).toFixed(1)),
    fill: CHART_COLORS[index % CHART_COLORS.length]
  }));

  const modelComparisonData = Object.entries(data.model_info.model_metrics)
    .map(([name, metrics]) => ({
      name: name,
      accuracy: parseFloat(metrics.AccuracyLikePct.toFixed(1)),
      trainMAE: parseFloat(metrics.Train_MAE.toFixed(3)),
      testMAE: parseFloat(metrics.Test_MAE.toFixed(3)),
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  const radarData = [
    { subject: 'Mean Temp', A: (inputData.season_tmean / 40) * 100 },
    { subject: 'Max Temp', A: (inputData.season_tmax / 45) * 100 },
    { subject: 'Min Temp', A: (inputData.season_tmin / 35) * 100 },
    { subject: 'Humidity', A: inputData.humidity },
    { subject: 'Rainfall', A: Math.min((inputData.season_rain_sum / 800) * 100, 100) },
  ];

  return (
    <div className="space-y-6">
      {/* Main Prediction Card */}
      <div className={`bg-gradient-to-r ${yieldBgClass} rounded-2xl shadow-xl p-6 text-white`}>
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div className="md:col-span-2">
            <p className="text-white/80 text-sm uppercase tracking-wide">Predicted Yield</p>
            <p className="text-5xl font-bold">{predictedYield.toFixed(2)}</p>
            <p className="text-white/80">MT/HA</p>
          </div>
          <div className="border-l border-white/30 pl-4">
            <p className="text-white/80 text-sm uppercase tracking-wide">Farm Area</p>
            <p className="text-3xl font-bold">{inputData.land_area}</p>
            <p className="text-white/80">Hectares</p>
          </div>
          <div className="border-l border-white/30 pl-4">
            <p className="text-white/80 text-sm uppercase tracking-wide">Total Production</p>
            <p className="text-3xl font-bold">{totalProduction.toFixed(2)}</p>
            <p className="text-white/80">Metric Tons</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/30 text-center">
          <span className="text-xl font-semibold">
            {yieldEmoji} {yieldLevel} Yield Expected
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Feature Importance */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h3 className="font-semibold text-gray-700 mb-4">🎯 Feature Importance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={featureImportanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis type="number" domain={[0, 50]} unit="%" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => [`${v}%`, 'Importance']} />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {featureImportanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Climate Radar */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h3 className="font-semibold text-gray-700 mb-4">🌡️ Climate Conditions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar name="Values" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.5} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Model Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h3 className="font-semibold text-gray-700 mb-4">🤖 Model Accuracy</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={modelComparisonData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={50} />
              <YAxis domain={[65, 80]} unit="%" tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => [`${v}%`, 'Accuracy']} />
              <Bar dataKey="accuracy" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Input Summary */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h3 className="font-semibold text-gray-700 mb-4">📋 Input Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-600 font-medium">Location</p>
              <p className="font-semibold text-gray-800">{inputData.location}, {inputData.region}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-green-600 font-medium">Rice Type</p>
              <p className="font-semibold text-gray-800">{inputData.rice_type}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="text-xs text-amber-600 font-medium">Water Source</p>
              <p className="font-semibold text-gray-800">{inputData.water_source}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-xs text-purple-600 font-medium">Soil pH</p>
              <p className="font-semibold text-gray-800">{inputData.soil_ph}</p>
            </div>
            <div className="bg-teal-50 rounded-lg p-3">
              <p className="text-xs text-teal-600 font-medium">Nitrogen</p>
              <p className="font-semibold text-gray-800">{inputData.nitrogen} kg/ha</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-3">
              <p className="text-xs text-pink-600 font-medium">Phosphorus</p>
              <p className="font-semibold text-gray-800">{inputData.phosphorus} kg/ha</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================
export default function RiceYieldDashboard() {
  const [predictionData, setPredictionData] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    setPredictionData(null);
    setAiSuggestions(null);

    try {
      // Call your prediction API
      const response = await fetch(API_CONFIG.PREDICTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setPredictionData(data);
      setInputData(formData);
      setLoading(false);

      // Get AI suggestions
      setAiLoading(true);
      const suggestions = await getAISuggestions(data, formData);
      setAiSuggestions(suggestions);
      setAiLoading(false);

    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message);
      setLoading(false);
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">🌾 Rice Yield Prediction System</h1>
          <p className="text-gray-500">Dang District, Nepal • ML-Powered Agricultural Insights</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">⚠️ Error: {error}</p>
            <p className="text-red-600 text-sm mt-1">Please check if your API server is running at {API_CONFIG.PREDICTION_URL}</p>
          </div>
        )}

        {/* Input Form */}
        <div className="mb-6">
          <PredictionForm onSubmit={handlePredict} loading={loading} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <LoadingSpinner message="Analyzing your farm data..." />
          </div>
        )}

        {/* Results */}
        {predictionData && inputData && !loading && (
          <div className="space-y-6">
            <ResultsDisplay data={predictionData} inputData={inputData} />
            <AISuggestions suggestions={aiSuggestions} loading={aiLoading} />
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Rice Yield Prediction System • Dang District, Nepal</p>
          <p>Powered by Machine Learning & AI | Data: 1990-2024</p>
        </div>
      </div>
    </div>
  );
}