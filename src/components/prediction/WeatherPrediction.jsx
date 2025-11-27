// src/FarmerAssistance.jsx
import React, { useState, useEffect } from "react";
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  AlertTriangle,
  Volume2,
  Leaf,
  Waves,
  Bug,
  Scissors,
} from "lucide-react";

// If you want to reference the screenshot you uploaded, use this path (will be transformed on the server):
export const SAMPLE_IMAGE_URL =
  "sandbox:/mnt/data/19f4a51c-0c3d-4a08-a420-412cfe67ed24.png";

export default function FarmerAssistance() {
  const [language, setLanguage] = useState("en");
  const [weatherData, setWeatherData] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({
    lat: 27.7172,
    lon: 85.324,
    name: "Kathmandu",
  });

  const translations = {
    en: {
      title: "Smart Agriculture Assistant",
      subtitle: "AI-Powered Farming Recommendations",
      weatherForecast: "7-Day Weather Forecast",
      recommendation: "Rice Farming Recommendations",
      selectStage: "Select Rice Crop Stage",
      getRecommendations: "Get Recommendations",
      recommendations: "Recommendations",
      stages: {
        germination: "Germination",
        seedling: "Seedling",
        transplanting: "Transplanting",
        tillering: "Tillering",
        panicle: "Panicle Initiation",
        flowering: "Flowering",
        grainFilling: "Grain Filling",
        harvesting: "Harvesting",
      },
      playAudio: "Play Audio",
      high: "High",
      low: "Low",
      chance: "Chance",
      irrigation: "Irrigation Advice",
      fertilizer: "Fertilizer Timing",
      disease: "Disease Risk",
      fieldManagement: "Field Management",
      pestAlert: "Pest Alert",
      harvestTiming: "Harvest Timing",
    },
    ne: {
      title: "स्मार्ट कृषि सहायक",
      subtitle: "कृत्रिम बुद्धिमत्ता कृषि सुझाव",
      weatherForecast: "७ दिनको मौसम पूर्वानुमान",
      recommendation: "धान खेती सुझाव",
      selectStage: "धान फसलको चरण छनोट गर्नुहोस्",
      getRecommendations: "सुझाव प्राप्त गर्नुहोस्",
      recommendations: "सुझावहरु",
      stages: {
        germination: "अङ्कुरण",
        seedling: "बिरुवा",
        transplanting: "रोपाइ",
        tillering: "कुशिङ",
        panicle: "पुष्पक्रम शुरुआत",
        flowering: "फूलिङ",
        grainFilling: "दानाको भरवाइ",
        harvesting: "कटनी",
      },
      playAudio: "अडियो बजाउनुहोस्",
      high: "उच्च",
      low: "कम",
      chance: "सम्भावना",
      irrigation: "सिंचाई सलाह",
      fertilizer: "मल लगाउने समय",
      disease: "रोग जोखिम",
      fieldManagement: "खेत व्यवस्थापन",
      pestAlert: "कीट चेतावनी",
      harvestTiming: "कटनी समय",
    },
  };

  const t = translations[language];

  // Fetch weather data (7-day daily)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability,weathercode&timezone=auto&forecast_days=7`;
        const response = await fetch(url);
        const data = await response.json();

        // normalize property names from open-meteo (some endpoints use weathercode)
        // store daily as object { time: [], temperature_2m_max:[], ...}
        if (data && data.daily) {
          setWeatherData(data.daily);
        }
      } catch (error) {
        console.error("Weather fetch error:", error);
      }
    };
    fetchWeather();
  }, [location]);

  // Mock AI recommendations (replace with API call to your AI later)
  const generateRecommendations = () => {
    const stageRecommendations = {
      germination: {
        en: {
          irrigation: "Keep soil moist but not waterlogged. Maintain 60-70% soil moisture.",
          fertilizer: "No fertilizer needed at this stage. Focus on soil preparation.",
          disease: "Watch for seed rot. Ensure good drainage in seedbeds.",
          fieldManagement: "Prepare nursery beds with well-composted soil.",
          pestAlert: "Monitor for grasshoppers in nursery beds.",
          harvestTiming: "N/A - Too early in growth cycle.",
        },
        ne: {
          irrigation: "माटो सिक्त राख्नुहोस् तर डुबेको छैन। माटोको आर्द्रता ६०-७०% राख्नुहोस्।",
          fertilizer: "यो चरणमा मल लगाउनुहोस्। मिट्टी तयारीमा ध्यान दिनुहोस्।",
          disease: "बीज सडको लागि निरीक्षण गर्नुहोस्। बिरुवा क्षेत्रमा राम्रो जल निकासी सुनिश्चित गर्नुहोस्।",
          fieldManagement: "राम्रो कम्पोस्ट माटोको साथ बिरुवा क्षेत्र तयार गर्नुहोस्।",
          pestAlert: "बिरुवा क्षेत्रमा टिड्डीहरूको निरीक्षण गर्नुहोस्।",
          harvestTiming: "अभी धेरै छ - बृद्धि चक्रमा अलि भर आएको छ।",
        },
      },
      transplanting: {
        en: {
          irrigation: "Maintain 5-10cm water level in field after transplanting.",
          fertilizer: "Apply 50% basal N fertilizer before transplanting.",
          disease: "High risk of leaf blast due to moisture. Use fungicides if needed.",
          fieldManagement: "Ensure proper land preparation and leveling.",
          pestAlert: "Check for stem borers and leaf folders.",
          harvestTiming: "120-130 days after transplanting.",
        },
        ne: {
          irrigation: "रोपाइ पछि खेतमा ५-१० से.मी. पानीको स्तर राख्नुहोस्।",
          fertilizer: "रोपाइ अघि ५०% आधार N मल लगाउनुहोस्।",
          disease: "नमी को कारण पातको ब्लास्टको उच्च जोखिम। आवश्यक भएमा कवकनाशक प्रयोग गर्नुहोस्।",
          fieldManagement: "राम्रो मिट्टी तयारी र समतलता सुनिश्चित गर्नुहोस्।",
          pestAlert: "काण्ड बोरर र पत्ता फोल्डरहरू जाँच गर्नुहोस्।",
          harvestTiming: "रोपाइ पछि १२०-१३० दिन।",
        },
      },
    };

    return stageRecommendations[selectedStage] || stageRecommendations.germination;
  };

  const handleGetRecommendations = () => {
    if (!selectedStage) return;
    setLoading(true);
    setTimeout(() => {
      setRecommendations(generateRecommendations());
      setLoading(false);
    }, 500);
  };

  const playAudio = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "ne" ? "ne-NP" : "en-US";
      speechSynthesis.speak(utterance);
    }
  };

  const getWeatherIcon = (code) => {
    // Note: open-meteo uses "weathercode" (0-99). adapted mapping
    if (code === 0 || code === 1) return <Sun className="w-12 h-12 text-yellow-400" />;
    if (code === 2 || code === 3) return <Cloud className="w-12 h-12 text-gray-400" />;
    if (code >= 45 && code <= 48) return <Cloud className="w-12 h-12 text-gray-500" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-12 h-12 text-blue-400" />;
    if (code >= 80 && code <= 82) return <CloudRain className="w-12 h-12 text-blue-500" />;
    if (code >= 85 && code <= 86) return <CloudRain className="w-12 h-12 text-blue-600" />;
    return <Sun className="w-12 h-12 text-yellow-400" />;
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const stageOptions = [
    "germination",
    "seedling",
    "transplanting",
    "tillering",
    "panicle",
    "flowering",
    "grainFilling",
    "harvesting",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t.title}</h1>
              <p className="text-green-100 mt-1">{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLanguage(language === "en" ? "ne" : "en")}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition"
              >
                {language === "en" ? "नेपाली" : "English"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Weather Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Cloud className="w-8 h-8 text-blue-500" />
            {t.weatherForecast}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {weatherData?.time?.map((date, idx) => {
              const dateObj = new Date(date);
              const dayName = days[dateObj.getDay()];
              const rainChance = weatherData.precipitation_probability?.[idx] || 0;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl shadow-lg transition transform hover:scale-105 ${
                    rainChance > 60
                      ? "bg-blue-100"
                      : rainChance > 30
                      ? "bg-gray-100"
                      : "bg-yellow-100"
                  }`}
                >
                  <p className="font-semibold text-gray-700">{dayName}</p>
                  <p className="text-sm text-gray-600">
                    {dateObj.toLocaleDateString(language === "en" ? "en-US" : "ne-NP")}
                  </p>
                  <div className="my-3 flex justify-center">{getWeatherIcon(weatherData.weathercode?.[idx] ?? 0)}</div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">
                      {Math.round(weatherData.temperature_2m_max?.[idx] ?? 0)}° /{" "}
                      {Math.round(weatherData.temperature_2m_min?.[idx] ?? 0)}°
                    </p>
                    <p className="text-xs text-blue-600 mt-2">💧 {rainChance}% {t.chance}</p>
                  </div>
                  <button
                    onClick={() =>
                      playAudio(
                        language === "en"
                          ? `${dayName}: High ${weatherData.temperature_2m_max?.[idx]}°, Low ${weatherData.temperature_2m_min?.[idx]}°, Rain chance ${rainChance}%`
                          : `${dayName}: अधिकतम ${weatherData.temperature_2m_max?.[idx]}°, न्यूनतम ${weatherData.temperature_2m_min?.[idx]}°, पानी पर्न ${rainChance}% सम्भावना`
                      )
                    }
                    className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs py-1 rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    <Volume2 className="w-3 h-3" />
                    {t.playAudio}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recommendation Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            {t.recommendation}
          </h2>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-4">{t.selectStage}</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stageOptions.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`p-3 rounded-lg font-semibold transition text-sm md:text-base ${
                    selectedStage === stage ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-green-100"
                  }`}
                >
                  {t.stages[stage]}
                </button>
              ))}
            </div>
            <button
              onClick={handleGetRecommendations}
              disabled={!selectedStage || loading}
              className="mt-6 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg transition"
            >
              {loading ? "Loading..." : t.getRecommendations}
            </button>
          </div>

          {/* Recommendations Output */}
          {recommendations && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {t.recommendations} - {t.stages[selectedStage]}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <RecommendationCard
                  title={t.irrigation}
                  icon={<Waves className="w-6 h-6" />}
                  text={recommendations[language].irrigation}
                  color="blue"
                  onPlay={() => playAudio(recommendations[language].irrigation)}
                />
                <RecommendationCard
                  title={t.fertilizer}
                  icon={<Leaf className="w-6 h-6" />}
                  text={recommendations[language].fertilizer}
                  color="green"
                  onPlay={() => playAudio(recommendations[language].fertilizer)}
                />
                <RecommendationCard
                  title={t.disease}
                  icon={<AlertTriangle className="w-6 h-6" />}
                  text={recommendations[language].disease}
                  color="red"
                  onPlay={() => playAudio(recommendations[language].disease)}
                />
                <RecommendationCard
                  title={t.fieldManagement}
                  icon={<Wind className="w-6 h-6" />}
                  text={recommendations[language].fieldManagement}
                  color="amber"
                  onPlay={() => playAudio(recommendations[language].fieldManagement)}
                />
                <RecommendationCard
                  title={t.pestAlert}
                  icon={<Bug className="w-6 h-6" />}
                  text={recommendations[language].pestAlert}
                  color="purple"
                  onPlay={() => playAudio(recommendations[language].pestAlert)}
                />
                <RecommendationCard
                  title={t.harvestTiming}
                  icon={<Scissors className="w-6 h-6" />}
                  text={recommendations[language].harvestTiming}
                  color="indigo"
                  onPlay={() => playAudio(recommendations[language].harvestTiming)}
                />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function RecommendationCard({ title, icon, text, color, onPlay }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-lg flex items-center gap-2">
          {icon}
          {title}
        </h4>
        <button onClick={onPlay} className={`p-2 rounded-lg bg-white hover:scale-110 transition`}>
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm leading-relaxed">{text}</p>
      <div className="mt-3 flex items-center text-xs opacity-75">✓ {title}</div>
    </div>
  );
}
