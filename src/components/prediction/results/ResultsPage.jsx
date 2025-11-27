
import React, { useState, useEffect } from "react"
import Header from "../../common/Header"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

/**
 * ResultsPage.jsx
 * Displays rice yield prediction results with visualizations and AI suggestions
 * Supports English and Nepali languages
 */

const CHART_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6']

// Feature name translations
const featureNames = {
  en: {
    'Season_Tmean_mean': 'Mean Temperature',
    'Season_Tmax_mean': 'Max Temperature',
    'Season_Tmin_mean': 'Min Temperature',
    'Season_Rainfall_sum': 'Total Rainfall',
    'Season_Rainfall_mean': 'Avg Rainfall',
    'Season_Humidity_mean': 'Humidity',
    'area': 'Farm Area'
  },
  np: {
    'Season_Tmean_mean': 'औसत तापमान',
    'Season_Tmax_mean': 'अधिकतम तापमान',
    'Season_Tmin_mean': 'न्यूनतम तापमान',
    'Season_Rainfall_sum': 'कुल वर्षा',
    'Season_Rainfall_mean': 'औसत वर्षा',
    'Season_Humidity_mean': 'आर्द्रता',
    'area': 'खेत क्षेत्रफल'
  }
}

// Page translations
const translations = {
  en: {
    title: "Prediction Results",
    subtitle: "Your AI-powered rice yield prediction",
    predictedYield: "Predicted Yield",
    farmArea: "Farm Area",
    totalProduction: "Total Production",
    mtPerHa: "MT/HA",
    hectares: "Hectares",
    metricTons: "Metric Tons",
    excellent: "Excellent Yield Expected! 🎉",
    good: "Good Yield Expected ✅",
    average: "Average Yield Expected 📊",
    belowAvg: "Below Average Yield ⚠️",
    tabResults: "Results",
    tabCharts: "Charts",
    tabAI: "AI Advisor",
    tabDetails: "Details",
    featureImportance: "Feature Importance",
    climateConditions: "Climate Conditions",
    modelAccuracy: "Model Accuracy",
    factorDistribution: "Factor Distribution",
    inputSummary: "Your Input Summary",
    location: "Location",
    riceType: "Rice Type",
    waterSource: "Water Source",
    soilPh: "Soil pH",
    nitrogen: "Nitrogen",
    phosphorus: "Phosphorus",
    aiAdvisor: "AI Farming Advisor",
    getAISuggestions: "Get AI Suggestions",
    generating: "Generating advice...",
    aiDescription: "Click the button to get personalized farming recommendations based on your prediction results.",
    backToForm: "← Make Another Prediction",
    printResults: "Print Results",
    shareResults: "Share",
    yieldAssessment: "Yield Assessment",
    recommendations: "Recommendations",
    riskFactors: "Risk Factors",
    nextSeason: "Next Season Preparation",
    timestamp: "Prediction Time",
    accuracy: "Accuracy",
  },
  np: {
    title: "भविष्यवाणी परिणामहरू",
    subtitle: "तपाईंको AI-संचालित धान उत्पादन भविष्यवाणी",
    predictedYield: "अनुमानित उत्पादन",
    farmArea: "खेत क्षेत्रफल",
    totalProduction: "कुल उत्पादन",
    mtPerHa: "मे.ट./हे.",
    hectares: "हेक्टर",
    metricTons: "मेट्रिक टन",
    excellent: "उत्कृष्ट उत्पादन अपेक्षित! 🎉",
    good: "राम्रो उत्पादन अपेक्षित ✅",
    average: "औसत उत्पादन अपेक्षित 📊",
    belowAvg: "औसत भन्दा कम ⚠️",
    tabResults: "परिणाम",
    tabCharts: "चार्ट",
    tabAI: "AI सल्लाहकार",
    tabDetails: "विवरण",
    featureImportance: "महत्वपूर्ण कारकहरू",
    climateConditions: "जलवायु अवस्था",
    modelAccuracy: "मोडेल शुद्धता",
    factorDistribution: "कारक वितरण",
    inputSummary: "तपाईंको इनपुट सारांश",
    location: "स्थान",
    riceType: "धानको प्रकार",
    waterSource: "पानीको स्रोत",
    soilPh: "माटोको pH",
    nitrogen: "नाइट्रोजन",
    phosphorus: "फस्फोरस",
    aiAdvisor: "AI कृषि सल्लाहकार",
    getAISuggestions: "AI सुझाव प्राप्त गर्नुहोस्",
    generating: "सल्लाह तयार गर्दै...",
    aiDescription: "तपाईंको भविष्यवाणी परिणामको आधारमा व्यक्तिगत कृषि सिफारिसहरू प्राप्त गर्न बटन क्लिक गर्नुहोस्।",
    backToForm: "← अर्को भविष्यवाणी गर्नुहोस्",
    printResults: "प्रिन्ट गर्नुहोस्",
    shareResults: "साझा गर्नुहोस्",
    yieldAssessment: "उत्पादन मूल्यांकन",
    recommendations: "सिफारिसहरू",
    riskFactors: "जोखिम कारकहरू",
    nextSeason: "अर्को सिजनको तयारी",
    timestamp: "भविष्यवाणी समय",
    accuracy: "शुद्धता",
  }
}

// AI Suggestions Component
function AISuggestions({ predictionData, inputData, lang, t }) {
  const [suggestions, setSuggestions] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateSuggestions = async () => {
    setLoading(true)
    
    const langInstruction = lang === 'np' 
      ? 'Please respond in Nepali language (नेपाली भाषामा जवाफ दिनुहोस्).' 
      : 'Please respond in English.'
    
    const prompt = `You are an agricultural expert advisor for rice farmers in Nepal's Dang District. ${langInstruction}

Based on the following prediction data and input parameters, provide practical farming suggestions.

**Prediction Results:**
- Predicted Yield: ${predictionData.predicted_yield_MT_per_HA.toFixed(2)} MT/HA
- Total Expected Production: ${(predictionData.predicted_yield_MT_per_HA * inputData.land_area).toFixed(2)} MT

**Input Parameters:**
- Land Area: ${inputData.land_area} Hectares
- Location: ${inputData.location}, ${inputData.region}
- Rice Type: ${inputData.rice_type}
- Year: ${inputData.year}

**Climate Conditions:**
- Mean Temperature: ${inputData.season_tmean}°C
- Max Temperature: ${inputData.season_tmax}°C  
- Min Temperature: ${inputData.season_tmin}°C
- Total Rainfall: ${inputData.season_rain_sum} mm
- Humidity: ${inputData.humidity}%

**Soil Parameters:**
- Soil pH: ${inputData.soil_ph}
- Nitrogen: ${inputData.nitrogen} kg/ha
- Phosphorus: ${inputData.phosphorus} kg/ha
- Organic Matter: ${inputData.organic}%
- Water Source: ${inputData.water_source}

**Most Important Factors (from ML model):**
${predictionData.feature_importances?.slice(0, 3).map((f, i) => 
  `${i + 1}. ${featureNames.en[f.feature] || f.feature}: ${(f.importance * 100).toFixed(1)}% importance`
).join('\n') || 'Temperature and rainfall are key factors'}

Please provide:
1. **${lang === 'np' ? 'उत्पादन मूल्यांकन' : 'YIELD ASSESSMENT'}** (1-2 sentences about whether this yield is good/average/poor)
2. **${lang === 'np' ? 'शीर्ष ३ सिफारिसहरू' : 'TOP 3 RECOMMENDATIONS'}** (specific, practical tips)
3. **${lang === 'np' ? 'जोखिम कारकहरू' : 'RISK FACTORS'}** (1-2 potential concerns)
4. **${lang === 'np' ? 'अर्को सिजनको तयारी' : 'NEXT SEASON PREP'}** (2-3 preparation tips)

Keep it concise and practical for smallholder farmers. Use simple language.`

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      })
      const result = await response.json()
      setSuggestions(result.content[0].text)
    } catch (error) {
      console.error('AI error:', error)
      setSuggestions(getFallbackSuggestions(predictionData, inputData, lang))
    }
    setLoading(false)
  }

  const getFallbackSuggestions = (data, input, language) => {
    const y = data.predicted_yield_MT_per_HA
    
    if (language === 'np') {
      const level = y >= 4 ? 'उत्कृष्ट' : y >= 3.5 ? 'राम्रो' : y >= 3 ? 'औसत' : 'औसत भन्दा कम'
      return `**उत्पादन मूल्यांकन**
तपाईंको अनुमानित उत्पादन ${y.toFixed(2)} मे.ट./हे. दाङ जिल्लाको लागि ${level} छ।

**शीर्ष ३ सिफारिसहरू**
• फूल फुल्ने अवस्थामा तापमान निगरानी गर्नुहोस् - उच्च तापमान (${input.season_tmax}°C) ले दाना भर्नमा असर गर्न सक्छ
• नाइट्रोजन (${input.nitrogen} kg/ha) विभाजित मात्रामा प्रयोग गर्नुहोस्
• ${input.water_source === 'Irrigation' ? 'सुख्खा समयमा सिंचाई गर्नुहोस्' : 'सिंचाई प्रणाली स्थापना गर्ने बारेमा सोच्नुहोस्'}

**जोखिम कारकहरू**
• उच्च तापमानले दाना नबन्ने समस्या ल्याउन सक्छ
• ${input.humidity}% आर्द्रतामा रोग लाग्न सक्छ

**अर्को सिजनको तयारी**
• रोप्नु अघि माटोको pH (हाल: ${input.soil_ph}) जाँच गर्नुहोस्
• मनसुन अघि निकास व्यवस्था तयार गर्नुहोस्`
    }
    
    const level = y >= 4 ? 'excellent' : y >= 3.5 ? 'good' : y >= 3 ? 'average' : 'below average'
    return `**YIELD ASSESSMENT**
Your predicted yield of ${y.toFixed(2)} MT/HA is ${level} for Dang District.

**TOP 3 RECOMMENDATIONS**
• Monitor temperature during flowering - high temps (${input.season_tmax}°C) can reduce grain filling
• Apply nitrogen (${input.nitrogen} kg/ha) in split doses for better absorption
• ${input.water_source === 'Irrigation' ? 'Supplement irrigation during dry spells' : 'Consider installing irrigation backup'}

**RISK FACTORS**
• Heat stress possible during peak temperatures
• Monitor for blast disease at ${input.humidity}% humidity

**NEXT SEASON PREP**
• Test soil pH (current: ${input.soil_ph}) before planting
• Prepare drainage channels before monsoon`
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-6 border border-emerald-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
          <span className="text-2xl">🤖</span> {t.aiAdvisor}
        </h3>
        {!suggestions && (
          <button
            onClick={generateSuggestions}
            disabled={loading}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-gray-400 transition-all font-medium shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {t.generating}
              </span>
            ) : (
              `✨ ${t.getAISuggestions}`
            )}
          </button>
        )}
      </div>
      
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 mb-4"></div>
          <p className="text-gray-600">{t.generating}</p>
        </div>
      )}
      
      {suggestions && (
        <div className="prose prose-sm max-w-none">
          {suggestions.split('\n').map((line, i) => {
            if (line.startsWith('**') && line.endsWith('**')) {
              return (
                <h4 key={i} className="text-emerald-700 font-bold mt-5 mb-2 text-base border-b border-emerald-200 pb-1">
                  {line.replace(/\*\*/g, '')}
                </h4>
              )
            } else if (line.startsWith('•') || line.startsWith('-')) {
              return (
                <div key={i} className="flex items-start gap-2 my-2 ml-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <p className="text-gray-700 text-sm">{line.replace(/^[•-]\s*/, '')}</p>
                </div>
              )
            } else if (line.trim()) {
              return <p key={i} className="text-gray-700 text-sm my-2">{line}</p>
            }
            return null
          })}
        </div>
      )}
      
      {!suggestions && !loading && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🌾</div>
          <p className="text-gray-500 text-sm max-w-md mx-auto">{t.aiDescription}</p>
        </div>
      )}
    </div>
  )
}

export default function ResultsPage() {
  const [lang, setLang] = useState('en')
  const [predictionData, setPredictionData] = useState(null)
  const [inputData, setInputData] = useState(null)
  const [activeTab, setActiveTab] = useState('results')
  const t = translations[lang]
  const fn = featureNames[lang]

  useEffect(() => {
    // Load data from sessionStorage
    const savedLang = sessionStorage.getItem('riceLang')
    const savedPrediction = sessionStorage.getItem('ricePredictionResult')
    const savedPayload = sessionStorage.getItem('riceApiPayload')

    if (savedLang) setLang(savedLang)
    if (savedPrediction) setPredictionData(JSON.parse(savedPrediction))
    if (savedPayload) setInputData(JSON.parse(savedPayload))
  }, [])

  // Redirect if no data
  if (!predictionData || !inputData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center mt-16">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🌾</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {lang === 'en' ? 'No Prediction Data' : 'कुनै भविष्यवाणी डाटा छैन'}
            </h2>
            <p className="text-gray-600 mb-4">
              {lang === 'en' ? 'Please make a prediction first' : 'कृपया पहिले भविष्यवाणी गर्नुहोस्'}
            </p>
            <a href="/" className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700">
              {lang === 'en' ? 'Go to Form' : 'फारममा जानुहोस्'}
            </a>
          </div>
        </div>
      </>
    )
  }

  const predictedYield = predictionData.predicted_yield_MT_per_HA
  const totalProduction = predictedYield * inputData.land_area

  // Yield status
  const yieldLevel = predictedYield >= 4 ? 'excellent' : predictedYield >= 3.5 ? 'good' : predictedYield >= 3 ? 'average' : 'belowAvg'
  const yieldBg = predictedYield >= 4 ? 'from-emerald-500 to-green-600' : predictedYield >= 3.5 ? 'from-green-500 to-teal-600' : predictedYield >= 3 ? 'from-yellow-500 to-amber-600' : 'from-red-500 to-orange-600'

  // Prepare chart data
  const featureData = predictionData.feature_importances?.map((item, i) => ({
    name: fn[item.feature] || item.feature,
    importance: parseFloat((item.importance * 100).toFixed(1)),
    fill: CHART_COLORS[i % CHART_COLORS.length]
  })) || []

  const modelData = predictionData.model_info?.model_metrics 
    ? Object.entries(predictionData.model_info.model_metrics).map(([name, m]) => ({
        name: name.replace('Regression', ''),
        accuracy: parseFloat(m.AccuracyLikePct.toFixed(1))
      })).sort((a, b) => b.accuracy - a.accuracy)
    : []

  const radarData = [
    { subject: lang === 'en' ? 'Mean Temp' : 'औसत ताप', A: (inputData.season_tmean / 40) * 100 },
    { subject: lang === 'en' ? 'Max Temp' : 'अधि. ताप', A: (inputData.season_tmax / 45) * 100 },
    { subject: lang === 'en' ? 'Humidity' : 'आर्द्रता', A: inputData.humidity },
    { subject: lang === 'en' ? 'Rainfall' : 'वर्षा', A: Math.min((inputData.season_rain_sum / 800) * 100, 100) },
    { subject: lang === 'en' ? 'Soil pH' : 'pH', A: (inputData.soil_ph / 8) * 100 },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-amber-50 py-8 px-4 mt-16">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Language Toggle + Actions */}
          <div className="flex justify-between items-center">
            <a href="/" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.backToForm}
            </a>
            <div className="flex items-center gap-3">
              <button onClick={() => window.print()} className="text-gray-500 hover:text-gray-700 text-sm">
                🖨️ {t.printResults}
              </button>
              <div className="inline-flex rounded-lg border border-green-200 bg-white p-1">
                <button onClick={() => setLang('en')} className={`px-3 py-1 text-sm rounded-md transition-all ${lang === 'en' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-green-50'}`}>
                  English
                </button>
                <button onClick={() => setLang('np')} className={`px-3 py-1 text-sm rounded-md transition-all ${lang === 'np' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-green-50'}`}>
                  नेपाली
                </button>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">{t.title}</h1>
            <p className="text-gray-500">{t.subtitle}</p>
          </div>

          {/* Main Prediction Card */}
          <div className={`bg-gradient-to-r ${yieldBg} rounded-2xl shadow-2xl p-6 text-white`}>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="md:col-span-2">
                <p className="text-white/80 text-sm uppercase tracking-wider">{t.predictedYield}</p>
                <p className="text-5xl md:text-6xl font-bold my-2">{predictedYield.toFixed(2)}</p>
                <p className="text-white/80">{t.mtPerHa}</p>
              </div>
              <div className="border-l border-white/30">
                <p className="text-white/80 text-sm uppercase tracking-wider">{t.farmArea}</p>
                <p className="text-3xl font-bold my-2">{inputData.land_area.toFixed(2)}</p>
                <p className="text-white/80">{t.hectares}</p>
              </div>
              <div className="border-l border-white/30">
                <p className="text-white/80 text-sm uppercase tracking-wider">{t.totalProduction}</p>
                <p className="text-3xl font-bold my-2">{totalProduction.toFixed(2)}</p>
                <p className="text-white/80">{t.metricTons}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/30 text-center">
              <span className="text-xl font-semibold">{t[yieldLevel]}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['results', 'charts', 'ai', 'details'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
                }`}
              >
                {tab === 'results' && '📊'} {tab === 'charts' && '📈'} {tab === 'ai' && '🤖'} {tab === 'details' && '📋'}{' '}
                {tab === 'results' ? t.tabResults : tab === 'charts' ? t.tabCharts : tab === 'ai' ? t.tabAI : t.tabDetails}
              </button>
            ))}
          </div>

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Feature Importance */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🎯 {t.featureImportance}
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={featureData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" domain={[0, 50]} unit="%" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => [`${v}%`, lang === 'en' ? 'Importance' : 'महत्व']} />
                    <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                      {featureData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Climate Radar */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🌡️ {t.climateConditions}
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.5} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Charts Tab */}
          {activeTab === 'charts' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Model Accuracy */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🤖 {t.modelAccuracy}
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={modelData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis domain={[65, 80]} unit="%" tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => [`${v}%`, t.accuracy]} />
                    <Bar dataKey="accuracy" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🥧 {t.factorDistribution}
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={featureData.slice(0, 5)} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="importance" label={({name, importance}) => `${importance}%`}>
                      {featureData.slice(0, 5).map((e, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, lang === 'en' ? 'Importance' : 'महत्व']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {featureData.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Tab */}
          {activeTab === 'ai' && (
            <AISuggestions predictionData={predictionData} inputData={inputData} lang={lang} t={t} />
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                📋 {t.inputSummary}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs text-green-600 font-medium">{t.location}</p>
                  <p className="font-bold text-gray-800">{inputData.location}, {inputData.region}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-blue-600 font-medium">{t.riceType}</p>
                  <p className="font-bold text-gray-800">{inputData.rice_type}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-xs text-amber-600 font-medium">{t.waterSource}</p>
                  <p className="font-bold text-gray-800">{inputData.water_source}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-xs text-purple-600 font-medium">{t.soilPh}</p>
                  <p className="font-bold text-gray-800">{inputData.soil_ph}</p>
                </div>
                <div className="bg-teal-50 rounded-xl p-4">
                  <p className="text-xs text-teal-600 font-medium">{t.nitrogen}</p>
                  <p className="font-bold text-gray-800">{inputData.nitrogen} kg/ha</p>
                </div>
                <div className="bg-pink-50 rounded-xl p-4">
                  <p className="text-xs text-pink-600 font-medium">{t.phosphorus}</p>
                  <p className="font-bold text-gray-800">{inputData.phosphorus} kg/ha</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-xs text-orange-600 font-medium">{lang === 'en' ? 'Mean Temp' : 'औसत ताप'}</p>
                  <p className="font-bold text-gray-800">{inputData.season_tmean}°C</p>
                </div>
                <div className="bg-cyan-50 rounded-xl p-4">
                  <p className="text-xs text-cyan-600 font-medium">{lang === 'en' ? 'Total Rain' : 'कुल वर्षा'}</p>
                  <p className="font-bold text-gray-800">{inputData.season_rain_sum} mm</p>
                </div>
              </div>
              
              {predictionData.timestamp_utc && (
                <div className="mt-6 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
                  {t.timestamp}: {new Date(predictionData.timestamp_utc).toLocaleString(lang === 'np' ? 'ne-NP' : 'en-US')}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-gray-400 py-4">
            <p>{lang === 'en' ? 'Rice Yield Prediction System • Dang District, Nepal' : 'धान उत्पादन भविष्यवाणी प्रणाली • दाङ जिल्ला, नेपाल'}</p>
            <p className="text-xs">{lang === 'en' ? 'Powered by Machine Learning & AI' : 'मेशिन लर्निङ र AI द्वारा संचालित'}</p>
          </div>
        </div>
      </div>
    </>
  )
}