import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Eye,
  Gauge,
} from "lucide-react";
import Header from "../../common/Header";
import { ensureGoogleMaps } from "../utils/googleMaps";

const IMAGE_URL = "/mnt/data/e7f0d612-a73d-4824-8602-3340f5692563.png";

// Helper to get short day name for a date string
const getDayName = (isoDate) => {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString(undefined, { weekday: "short" });
  } catch (e) {
    return isoDate;
  }
};

const GOOGLE_API_KEY = "AIzaSyDUO3oOP7ICjWw3Kv8jfh-n0JgynO-iPeM";
const GOOGLE_KEY = "AIzaSyDUO3oOP7ICjWw3Kv8jfh-n0JgynO-iPeM";

let googleMapsReady = null;

function loadGoogle(apiKey) {
  if (googleMapsReady) return googleMapsReady;

  googleMapsReady = new Promise((resolve, reject) => {
    if (window.google?.maps?.places) return resolve();

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject("Google Maps failed to load");
    document.head.appendChild(script);
  });

  return googleMapsReady;
}

export default function WeatherPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    name: "Loading...",
  });
  const [weatherData, setWeatherData] = useState(null);
  const [rainfallForecast, setRainfallForecast] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI for change/search location
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // AI suggestion
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            lat: latitude,
            lng: longitude,
            name: `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`,
          });
          fetchWeatherData(latitude, longitude);
          console.log("Fetched location:", latitude, longitude);
        },
        () => {
          // fallback to Kathmandu coords
          setLocation({
            lat: 27.7172,
            lng: 85.324,
            name: "Kathmandu (Default)",
          });
          fetchWeatherData(27.7172, 85.324);
        }
      );
    } else {
      // no geolocation available
      setLocation({ lat: 27.7172, lng: 85.324, name: "Kathmandu (Default)" });
      fetchWeatherData(27.7172, 85.324);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * fetchWeatherData:
   * - will fetch a 7-day forecast from Open-Meteo (free, no-key) and
   *   transform it into the shape used by the UI (day, rainfall, chance)
   * - if the API fails or network blocked, falls back to a small mock so UI still works
   */
  const fetchWeatherData = async (lat, lng) => {
    try {
      setLoading(true);

      // Try Open-Meteo daily forecast for 7 days. Adjust fields as needed.
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=rain_sum,precipitation_probability_mean,precipitation_probability_max,temperature_2m_max&temperature_unit=celsius&timezone=auto&forecast_days=7`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Open-Meteo fetch failed");
      const json = await res.json();

      // Build rainfallForecast array expected by the UI
      const dates = json?.daily?.time || [];
      const rainSum = json?.daily?.rain_sum || [];
      // use precipitation_probability_max where available, else mean, else 0
      const chanceArr =
        json?.daily?.precipitation_probability_max ||
        json?.daily?.precipitation_probability_mean ||
        [];

      const forecast = dates.map((date, i) => ({
        date,
        day: getDayName(date),
        rainfall: typeof rainSum[i] === "number" ? Math.round(rainSum[i]) : 0,
        chance: typeof chanceArr[i] === "number" ? Math.round(chanceArr[i]) : 0,
      }));

      // Current weather summary (basic) — Open-Meteo offers current_weather but it is limited; we keep a lightweight summary here
      const current = {
        temperature:
          json?.current_weather?.temperature ??
          Math.round(json?.daily?.temperature_2m_max?.[0] ?? 0),
        humidity: json?.current_weather?.relativehumidity ?? 65,
        windSpeed: Math.round(json?.current_weather?.windspeed ?? 10),
        rainfall: forecast[0]?.rainfall ?? 0,
        visibility: 10,
        pressure: 1013,
        condition: "Partly Cloudy",
        feelsLike: json?.current_weather?.temperature ?? 0,
      };

      setWeatherData(current);
      setRainfallForecast(forecast);
      setSelectedDay(forecast[0] ?? null);

      // compute and attach summary to the current card (we store it into state via weatherDataSummary)
      const totalRain = forecast.reduce((s, d) => s + (d.rainfall || 0), 0);
      const avgChance = Math.round(
        forecast.reduce((s, d) => s + (d.chance || 0), 0) /
          Math.max(1, forecast.length)
      );
      const heaviest = forecast.reduce(
        (best, d) => (d.rainfall > (best?.rainfall ?? -1) ? d : best),
        null
      );

      setWeatherData((prev) => ({
        ...current,
        summary: { totalRain, avgChance, heaviestDay: heaviest },
      }));
    } catch (error) {
      console.warn("Weather API failed, using mock data:", error);

      // fallback mock (keeps old UI behaviour)
      const mockWeather = {
        temperature: 28,
        humidity: 65,
        windSpeed: 12,
        rainfall: 0,
        visibility: 10,
        pressure: 1013,
        condition: "Partly Cloudy",
        feelsLike: 26,
      };

      const mockRainfall = [
        { day: "Mon", rainfall: 0, chance: 10 },
        { day: "Tue", rainfall: 5, chance: 30 },
        { day: "Wed", rainfall: 15, chance: 70 },
        { day: "Thu", rainfall: 8, chance: 50 },
        { day: "Fri", rainfall: 2, chance: 20 },
        { day: "Sat", rainfall: 0, chance: 10 },
        { day: "Sun", rainfall: 12, chance: 60 },
      ];

      setWeatherData({
        ...mockWeather,
        summary: { totalRain: 42, avgChance: 36, heaviestDay: mockRainfall[2] },
      });
      setRainfallForecast(mockRainfall);
      setSelectedDay(mockRainfall[0]);
    } finally {
      setLoading(false);
    }
  };

  // const searchLocation = async (q) => {
  //   if (!q || q.trim().length < 2) {
  //     setResults([]);
  //     return;
  //   }

  //   setSearchLoading(true);
  //   setSearchError(null);

  //   try {
  //     // Ensure Google Maps API is loaded
  //     await loadGoogleMaps();

  //     const autocompleteService = new window.google.maps.places.AutocompleteService();

  //     const predictions = await new Promise((resolve) => {
  //       autocompleteService.getPlacePredictions(
  //         { input: q },
  //         (preds, status) => {
  //           if (
  //             status !== window.google.maps.places.PlacesServiceStatus.OK ||
  //             !preds
  //           ) {
  //             resolve([]);
  //           } else {
  //             resolve(preds);
  //           }
  //         }
  //       );
  //     });

  //     // Convert predictions → full location details
  //     const placeService = new window.google.maps.places.PlacesService(
  //       document.createElement("div")
  //     );

  //     const details = await Promise.all(
  //       predictions.slice(0, 6).map(
  //         (p) =>
  //           new Promise((resolve) => {
  //             placeService.getDetails(
  //               {
  //                 placeId: p.place_id,
  //                 fields: ["name", "geometry", "formatted_address", "types"],
  //               },
  //               (place, status) => {
  //                 if (
  //                   status ===
  //                     window.google.maps.places.PlacesServiceStatus.OK &&
  //                   place
  //                 ) {
  //                   resolve({
  //                     name: place.formatted_address || place.name,
  //                     lat: place.geometry.location.lat(),
  //                     lon: place.geometry.location.lng(),
  //                     type: place.types?.[0] || "place",
  //                   });
  //                 } else {
  //                   resolve(null);
  //                 }
  //               }
  //             );
  //           })
  //       )
  //     );

  //     setResults(details.filter(Boolean));
  //   } catch (err) {
  //     console.error("Google Places search error:", err);
  //     setSearchError("Failed to search locations");
  //   } finally {
  //     setSearchLoading(false);
  //   }
  // };

  const searchLocation = async (q) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      await loadGoogle(GOOGLE_KEY);

      const service = new window.google.maps.places.AutocompleteService();

      service.getPlacePredictions(
        { input: q, types: ["(cities)"] }, // faster
        (predictions, status) => {
          setSearchLoading(false);

          if (
            status !== window.google.maps.places.PlacesServiceStatus.OK ||
            !predictions
          ) {
            setResults([]);
            return;
          }

          // Only show suggestion text (FAST)
          setResults(
            predictions.slice(0, 6).map((p) => ({
              place_id: p.place_id,
              name: p.description,
            }))
          );
        }
      );
    } catch (err) {
      console.error(err);
      setSearchError("Location search failed");
      setSearchLoading(false);
    }
  };
  const fetchLocationDetails = async (place_id) => {
    await loadGoogle(GOOGLE_KEY);

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    return new Promise((resolve, reject) => {
      service.getDetails(
        {
          placeId: place_id,
          fields: ["geometry", "formatted_address"],
        },
        (place, status) => {
          if (status === "OK" && place) {
            resolve({
              name: place.formatted_address,
              lat: place.geometry.location.lat(),
              lon: place.geometry.location.lng(),
            });
          } else {
            reject("Failed to fetch details");
          }
        }
      );
    });
  };
  const handleSelectResult = async (item) => {
    setSearchLoading(true);

    const data = await fetchLocationDetails(item.place_id);

    setLocation({ lat: data.lat, lng: data.lon, name: data.name });

    setSearchOpen(false);
    setQuery("");
    setResults([]);

    fetchWeatherData(data.lat, data.lon);

    setSearchLoading(false);
  };

  // const handleSelectResult = (r) => {
  //   setLocation({ lat: r.lat, lng: r.lon, name: r.name })
  //   setSearchOpen(false)
  //   setQuery("")
  //   setResults([])
  //   // fetch weather for selected coords
  //   fetchWeatherData(r.lat, r.lon)
  // }

  // Mock AI suggestion generator — replace by a backend or LLM call if you have one
  const fetchAISuggestion = async () => {
    navigate("/crop-assessment")
    // setAiSuggestion(null);
    // setAiLoading(true);
    // try {
    //   // Basic heuristic example: if 7-day total rain > 20mm, suggest delaying irrigation
    //   const totalRain =
    //     weatherData?.summary?.totalRain ??
    //     rainfallForecast.reduce((s, d) => s + (d.rainfall || 0), 0);

    //   await new Promise((r) => setTimeout(r, 500)); // simulate call

    //   if (totalRain > 20) {
    //     setAiSuggestion(
    //       `AI Suggestion: Expected total rainfall for next 7 days is ${totalRain} mm. Consider delaying irrigation and focus on drainage/pest checks.`
    //     );
    //   } else {
    //     setAiSuggestion(
    //       `AI Suggestion: Low expected rainfall (${totalRain} mm). Schedule irrigation and monitor soil moisture.`
    //     );
    //   }
    // } catch (e) {
    //   setAiSuggestion("AI Suggestion could not be generated.");
    // } finally {
    //   setAiLoading(false);
    // }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 sm:p-8 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Weather & Rainfall
              </h1>

              {/* Location display: name + lat/lng */}
              <div className="text-gray-600 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  <span className="font-medium text-gray-800">
                    {location.name}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mt-2 sm:mt-0">
                  {location.lat !== null && location.lng !== null ? (
                    <span>
                      Lat:{" "}
                      <span className="font-medium text-gray-800">
                        {Number(location.lat).toFixed(4)}
                      </span>
                      , Lng:{" "}
                      <span className="font-medium text-gray-800">
                        {Number(location.lng).toFixed(4)}
                      </span>
                    </span>
                  ) : (
                    <span>Lat/Lng unavailable</span>
                  )}
                </div>
              </div>
            </div>

            {/* Change Location + Back + AI button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen((s) => !s)}
                className="px-4 py-2 bg-white border rounded-lg text-sm hover:shadow transition"
                aria-expanded={searchOpen}
              >
                {searchOpen ? "Close" : "Change location"}
              </button>

              <button
                onClick={() => fetchAISuggestion()}
                className="px-4 py-2 bg-yellow-50 border rounded-lg text-sm hover:shadow transition"
                aria-label="AI suggestion"
                title="Check AI suggestion for your crop"
              >
                {aiLoading
                  ? "Checking..."
                  : "Check AI suggestion for your crop"}
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                aria-label="Back to form"
              >
                Back to Form
              </button>
            </div>
          </div>

          {/* Location search area */}
          {searchOpen && (
            <div className="mb-6">
              <div className="max-w-2xl">
                <div className="flex gap-2">
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      // perform search after small debounce - simple immediate call here
                      searchLocation(e.target.value);
                    }}
                    placeholder="Search for a city / village / landmark (e.g. Tulsipur, Nepal)"
                    className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none"
                  />
                  <button
                    onClick={() => searchLocation(query)}
                    className="px-4 py-2 bg-green-600 text-white rounded-r-lg"
                    aria-label="Search location"
                  >
                    Search
                  </button>
                </div>

                <div className="mt-2">
                  {searchLoading && (
                    <div className="text-sm text-gray-500">Searching...</div>
                  )}
                  {searchError && (
                    <div className="text-sm text-red-500">{searchError}</div>
                  )}
                  {results.length > 0 && (
                    <ul className="mt-2 bg-white border rounded-md overflow-hidden shadow-sm">
                      {results.map((r, i) => (
                        <li key={i}>
                          <button
                            onClick={() => handleSelectResult(r)}
                            className="w-full text-left px-4 py-3 hover:bg-green-50 transition flex items-start gap-3"
                          >
                            <div className="text-xs text-gray-500 w-40">
                              {r.type}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-800 truncate">
                                {r.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {r.lat && r.lon ? (
                                  <>
                                    {r.lat.toFixed(4)}, {r.lon.toFixed(4)}
                                  </>
                                ) : (
                                  "Tap to load"
                                )}
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!searchLoading && !results.length && query.length >= 2 && (
                    <div className="text-sm text-gray-500 mt-2">
                      No results found
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Current Weather Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="text-center">
                <Cloud className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <p className="text-5xl font-bold text-gray-900 mb-2">
                  {weatherData?.temperature}°C
                </p>
                <p className="text-gray-600 text-lg mb-4">
                  {weatherData?.condition}
                </p>
                <p className="text-sm text-gray-500">
                  Feels like {weatherData?.feelsLike}°C
                </p>

                {/* New: 7-day summary on the card */}
                {weatherData?.summary && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100 text-left text-sm">
                    <p className="font-semibold text-gray-800 mb-1">
                      7-day summary
                    </p>
                    <p className="text-xs text-gray-600">
                      Total expected rainfall:{" "}
                      <span className="font-medium text-blue-700">
                        {weatherData.summary.totalRain} mm
                      </span>
                    </p>
                    <p className="text-xs text-gray-600">
                      Average precipitation chance:{" "}
                      <span className="font-medium">
                        {weatherData.summary.avgChance}%
                      </span>
                    </p>
                    <p className="text-xs text-gray-600">
                      Heaviest day:{" "}
                      <span className="font-medium">
                        {weatherData.summary.heaviestDay?.day ||
                          weatherData.summary.heaviestDay?.date ||
                          "N/A"}
                      </span>{" "}
                      —{" "}
                      <span className="font-medium text-blue-700">
                        {weatherData.summary.heaviestDay?.rainfall ?? 0} mm
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition">
                <div className="flex items-center gap-3 mb-3">
                  <Droplets className="w-6 h-6 text-blue-500" />
                  <span className="text-sm text-gray-600 font-medium">
                    Humidity
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {weatherData?.humidity}%
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition">
                <div className="flex items-center gap-3 mb-3">
                  <Wind className="w-6 h-6 text-blue-500" />
                  <span className="text-sm text-gray-600 font-medium">
                    Wind
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {weatherData?.windSpeed} km/h
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition">
                <div className="flex items-center gap-3 mb-3">
                  <Gauge className="w-6 h-6 text-blue-500" />
                  <span className="text-sm text-gray-600 font-medium">
                    Pressure
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {weatherData?.pressure} mb
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-6 h-6 text-blue-500" />
                  <span className="text-sm text-gray-600 font-medium">
                    Visibility
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {weatherData?.visibility} km
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition">
                <div className="flex items-center gap-3 mb-3">
                  <CloudRain className="w-6 h-6 text-blue-500" />
                  <span className="text-sm text-gray-600 font-medium">
                    Current Rain
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {weatherData?.rainfall} mm
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition">
                <div className="flex items-center gap-3 mb-3">
                  <Sun className="w-6 h-6 text-yellow-500" />
                  <span className="text-sm text-gray-600 font-medium">
                    UV Index
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>

          {/* 7-Day Rainfall Forecast */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              7-Day Rainfall Forecast
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
              {rainfallForecast.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(day)}
                  className={`p-4 rounded-xl transition border-2 text-left ${
                    selectedDay?.day === day.day
                      ? "bg-green-100 border-green-500 shadow-lg"
                      : "bg-gray-50 border-gray-200 hover:border-green-300"
                  }`}
                >
                  <p className="font-bold text-gray-900 mb-3">{day.day}</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <CloudRain className="w-5 h-5 text-blue-500" />
                      <span className="text-lg font-semibold text-gray-900">
                        {day.rainfall}mm
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${day.chance}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 text-center">
                      {day.chance}% chance
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Day Details */}
            {selectedDay && (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {selectedDay.day} - Detailed Forecast
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Expected Rainfall
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {selectedDay.rainfall} mm
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Probability</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {selectedDay.chance}%
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Recommendation</p>
                    <p className="text-lg font-semibold text-green-600">
                      {selectedDay.rainfall > 10
                        ? "🌾 Good for planting"
                        : "💧 Consider irrigation"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4 p-4 bg-white rounded-lg border-l-4 border-green-500">
                  ℹ️ Based on forecast,{" "}
                  {selectedDay.rainfall > 10
                    ? "expected rainfall should benefit crop growth"
                    : "irrigation may be needed"}
                  . Monitor weather updates regularly.
                </p>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Farmer Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="font-semibold text-blue-900 mb-2">
                  💧 Irrigation Status
                </p>
                <p className="text-sm text-blue-800">
                  With current humidity at {weatherData?.humidity}%, irrigation
                  may be needed soon.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="font-semibold text-green-900 mb-2">
                  🌾 Pest Management
                </p>
                <p className="text-sm text-green-800">
                  Current conditions are favorable. Monitor crops for pests
                  after rain.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <p className="font-semibold text-yellow-900 mb-2">
                  ☀️ Crop Care
                </p>
                <p className="text-sm text-yellow-800">
                  Wind speed is moderate. Good time for fertilizer application
                  if no rain expected.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <p className="font-semibold text-purple-900 mb-2">
                  📊 Next Action
                </p>
                <p className="text-sm text-purple-800">
                  Review 7-day forecast before planning next farming activity.
                </p>
              </div>
            </div>

            {/* AI suggestion area */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-700 font-medium mb-2">
                AI Recommendation
              </p>
              {aiLoading ? (
                <p className="text-sm text-gray-500">
                  Generating suggestion...
                </p>
              ) : aiSuggestion ? (
                <p className="text-sm text-gray-700">{aiSuggestion}</p>
              ) : (
                <p className="text-sm text-gray-500">
                  Click "Check AI suggestion for your crop" to get a short
                  recommendation based on the 7-day forecast.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// import React, { useState, useEffect } from "react"
// import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge } from "lucide-react"
// import Header from "../../common/Header"

// const IMAGE_URL = "/mnt/data/e7f0d612-a73d-4824-8602-3340f5692563.png"

// export default function WeatherPage() {
//   const [location, setLocation] = useState({ lat: null, lng: null, name: "Loading..." })
//   const [weatherData, setWeatherData] = useState(null)
//   const [rainfallForecast, setRainfallForecast] = useState([])
//   const [selectedDay, setSelectedDay] = useState(null)
//   const [loading, setLoading] = useState(true)

//   // UI for change/search location
//   const [searchOpen, setSearchOpen] = useState(false)
//   const [query, setQuery] = useState("")
//   const [results, setResults] = useState([])
//   const [searchLoading, setSearchLoading] = useState(false)
//   const [searchError, setSearchError] = useState(null)

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords
//           setLocation({
//             lat: latitude,
//             lng: longitude,
//             name: `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`,
//           })
//           fetchWeatherData(latitude, longitude)
//         },
//         () => {
//           // fallback to Kathmandu coords
//           setLocation({ lat: 27.7172, lng: 85.324, name: "Kathmandu (Default)" })
//           fetchWeatherData(27.7172, 85.324)
//         },
//       )
//     } else {
//       // no geolocation available
//       setLocation({ lat: 27.7172, lng: 85.324, name: "Kathmandu (Default)" })
//       fetchWeatherData(27.7172, 85.324)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const fetchWeatherData = async (lat, lng) => {
//     try {
//       setLoading(true)
//       // Mock weather data — replace this with a real API call if you have one
//       const mockWeather = {
//         temperature: 28,
//         humidity: 65,
//         windSpeed: 12,
//         rainfall: 0,
//         visibility: 10,
//         pressure: 1013,
//         condition: "Partly Cloudy",
//         feelsLike: 26,
//       }

//       const mockRainfall = [
//         { day: "Mon", rainfall: 0, chance: 10 },
//         { day: "Tue", rainfall: 5, chance: 30 },
//         { day: "Wed", rainfall: 15, chance: 70 },
//         { day: "Thu", rainfall: 8, chance: 50 },
//         { day: "Fri", rainfall: 2, chance: 20 },
//         { day: "Sat", rainfall: 0, chance: 10 },
//         { day: "Sun", rainfall: 12, chance: 60 },
//       ]

//       // mimic network delay
//       await new Promise((r) => setTimeout(r, 300))

//       setWeatherData(mockWeather)
//       setRainfallForecast(mockRainfall)
//       setSelectedDay(mockRainfall[0])
//     } catch (error) {
//       console.error("Error fetching weather data:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Search using Nominatim (OpenStreetMap). Replace or proxy if you prefer.
//   const searchLocation = async (q) => {
//     if (!q || q.trim().length < 2) {
//       setResults([])
//       return
//     }
//     setSearchLoading(true)
//     setSearchError(null)
//     try {
//       const encoded = encodeURIComponent(q)
//       const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encoded}`
//       const res = await fetch(url, {
//         headers: {
//           // Nominatim requires a valid User-Agent in server side. In-browser this may be okay.
//           "Accept-Language": "en",
//         },
//       })
//       if (!res.ok) throw new Error("Search failed")
//       const data = await res.json()
//       const parsed = data.map((d) => ({
//         name: d.display_name,
//         lat: parseFloat(d.lat),
//         lon: parseFloat(d.lon),
//         type: d.type,
//       }))
//       setResults(parsed)
//     } catch (err) {
//       console.warn(err)
//       setSearchError("Failed to search locations")
//     } finally {
//       setSearchLoading(false)
//     }
//   }

//   const handleSelectResult = (r) => {
//     setLocation({ lat: r.lat, lng: r.lon, name: r.name })
//     setSearchOpen(false)
//     setQuery("")
//     setResults([])
//     // fetch weather for selected coords
//     fetchWeatherData(r.lat, r.lon)
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading weather data...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <Header />
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 sm:p-8 mt-20">
//         <div className="max-w-6xl mx-auto">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Weather & Rainfall</h1>

//               {/* Location display: name + lat/lng */}
//               <div className="text-gray-600 flex flex-col sm:flex-row sm:items-center sm:gap-3">
//                 <div className="flex items-center gap-2">
//                   <span className="text-lg">📍</span>
//                   <span className="font-medium text-gray-800">{location.name}</span>
//                 </div>

//                 <div className="text-sm text-gray-600 mt-2 sm:mt-0">
//                   {location.lat !== null && location.lng !== null ? (
//                     <span>
//                       Lat: <span className="font-medium text-gray-800">{Number(location.lat).toFixed(4)}</span>, Lng:{" "}
//                       <span className="font-medium text-gray-800">{Number(location.lng).toFixed(4)}</span>
//                     </span>
//                   ) : (
//                     <span>Lat/Lng unavailable</span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Change Location + Back */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setSearchOpen((s) => !s)}
//                 className="px-4 py-2 bg-white border rounded-lg text-sm hover:shadow transition"
//                 aria-expanded={searchOpen}
//               >
//                 {searchOpen ? "Close" : "Change location"}
//               </button>

//               <button
//                 onClick={() => (window.location.href = "/")}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
//                 aria-label="Back to form"
//               >
//                 Back to Form
//               </button>
//             </div>
//           </div>

//           {/* Location search area */}
//           {searchOpen && (
//             <div className="mb-6">
//               <div className="max-w-2xl">
//                 <div className="flex gap-2">
//                   <input
//                     value={query}
//                     onChange={(e) => {
//                       setQuery(e.target.value)
//                       // perform search after small debounce - simple immediate call here
//                       searchLocation(e.target.value)
//                     }}
//                     placeholder="Search for a city / village / landmark (e.g. Tulsipur, Nepal)"
//                     className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none"
//                   />
//                   <button
//                     onClick={() => searchLocation(query)}
//                     className="px-4 py-2 bg-green-600 text-white rounded-r-lg"
//                     aria-label="Search location"
//                   >
//                     Search
//                   </button>
//                 </div>

//                 <div className="mt-2">
//                   {searchLoading && <div className="text-sm text-gray-500">Searching...</div>}
//                   {searchError && <div className="text-sm text-red-500">{searchError}</div>}
//                   {results.length > 0 && (
//                     <ul className="mt-2 bg-white border rounded-md overflow-hidden shadow-sm">
//                       {results.map((r, i) => (
//                         <li key={i}>
//                           <button
//                             onClick={() => handleSelectResult(r)}
//                             className="w-full text-left px-4 py-3 hover:bg-green-50 transition flex items-start gap-3"
//                           >
//                             <div className="text-xs text-gray-500 w-40">{r.type}</div>
//                             <div className="flex-1">
//                               <div className="font-medium text-gray-800 truncate">{r.name}</div>
//                               <div className="text-xs text-gray-500">{r.lat.toFixed(4)}, {r.lon.toFixed(4)}</div>
//                             </div>
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                   {!searchLoading && !results.length && query.length >= 2 && (
//                     <div className="text-sm text-gray-500 mt-2">No results found</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Current Weather Card */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//             <div className="lg:col-span-1 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
//               <div className="text-center">
//                 <Cloud className="w-16 h-16 text-blue-500 mx-auto mb-4" />
//                 <p className="text-5xl font-bold text-gray-900 mb-2">{weatherData?.temperature}°C</p>
//                 <p className="text-gray-600 text-lg mb-4">{weatherData?.condition}</p>
//                 <p className="text-sm text-gray-500">Feels like {weatherData?.feelsLike}°C</p>
//               </div>
//             </div>

//             {/* Quick Stats */}
//             <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
//               <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition">
//                 <div className="flex items-center gap-3 mb-3">
//                   <Droplets className="w-6 h-6 text-blue-500" />
//                   <span className="text-sm text-gray-600 font-medium">Humidity</span>
//                 </div>
//                 <p className="text-2xl font-bold text-gray-900">{weatherData?.humidity}%</p>
//               </div>

//               <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition">
//                 <div className="flex items-center gap-3 mb-3">
//                   <Wind className="w-6 h-6 text-blue-500" />
//                   <span className="text-sm text-gray-600 font-medium">Wind</span>
//                 </div>
//                 <p className="text-2xl font-bold text-gray-900">{weatherData?.windSpeed} km/h</p>
//               </div>

//               <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition">
//                 <div className="flex items-center gap-3 mb-3">
//                   <Gauge className="w-6 h-6 text-blue-500" />
//                   <span className="text-sm text-gray-600 font-medium">Pressure</span>
//                 </div>
//                 <p className="text-2xl font-bold text-gray-900">{weatherData?.pressure} mb</p>
//               </div>

//               <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition">
//                 <div className="flex items-center gap-3 mb-3">
//                   <Eye className="w-6 h-6 text-blue-500" />
//                   <span className="text-sm text-gray-600 font-medium">Visibility</span>
//                 </div>
//                 <p className="text-2xl font-bold text-gray-900">{weatherData?.visibility} km</p>
//               </div>

//               <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition">
//                 <div className="flex items-center gap-3 mb-3">
//                   <CloudRain className="w-6 h-6 text-blue-500" />
//                   <span className="text-sm text-gray-600 font-medium">Current Rain</span>
//                 </div>
//                 <p className="text-2xl font-bold text-gray-900">{weatherData?.rainfall} mm</p>
//               </div>

//               <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition">
//                 <div className="flex items-center gap-3 mb-3">
//                   <Sun className="w-6 h-6 text-yellow-500" />
//                   <span className="text-sm text-gray-600 font-medium">UV Index</span>
//                 </div>
//                 <p className="text-2xl font-bold text-gray-900">5</p>
//               </div>
//             </div>
//           </div>

//           {/* 7-Day Rainfall Forecast */}
//           <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">7-Day Rainfall Forecast</h2>

//             <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
//               {rainfallForecast.map((day, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedDay(day)}
//                   className={`p-4 rounded-xl transition border-2 text-left ${
//                     selectedDay?.day === day.day
//                       ? "bg-green-100 border-green-500 shadow-lg"
//                       : "bg-gray-50 border-gray-200 hover:border-green-300"
//                   }`}
//                 >
//                   <p className="font-bold text-gray-900 mb-3">{day.day}</p>
//                   <div className="flex flex-col gap-2">
//                     <div className="flex items-center justify-between">
//                       <CloudRain className="w-5 h-5 text-blue-500" />
//                       <span className="text-lg font-semibold text-gray-900">{day.rainfall}mm</span>
//                     </div>
//                     <div className="bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-blue-500 h-2 rounded-full transition-all"
//                         style={{ width: `${day.chance}%` }}
//                       ></div>
//                     </div>
//                     <p className="text-xs text-gray-600 text-center">{day.chance}% chance</p>
//                   </div>
//                 </button>
//               ))}
//             </div>

//             {/* Selected Day Details */}
//             {selectedDay && (
//               <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
//                 <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedDay.day} - Detailed Forecast</h3>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                   <div className="bg-white rounded-lg p-4">
//                     <p className="text-sm text-gray-600 mb-2">Expected Rainfall</p>
//                     <p className="text-3xl font-bold text-blue-600">{selectedDay.rainfall} mm</p>
//                   </div>
//                   <div className="bg-white rounded-lg p-4">
//                     <p className="text-sm text-gray-600 mb-2">Probability</p>
//                     <p className="text-3xl font-bold text-blue-600">{selectedDay.chance}%</p>
//                   </div>
//                   <div className="bg-white rounded-lg p-4">
//                     <p className="text-sm text-gray-600 mb-2">Recommendation</p>
//                     <p className="text-lg font-semibold text-green-600">
//                       {selectedDay.rainfall > 10 ? "🌾 Good for planting" : "💧 Consider irrigation"}
//                     </p>
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-600 mt-4 p-4 bg-white rounded-lg border-l-4 border-green-500">
//                   ℹ️ Based on forecast,{" "}
//                   {selectedDay.rainfall > 10 ? "expected rainfall should benefit crop growth" : "irrigation may be needed"}.
//                   Monitor weather updates regularly.
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Recommendations */}
//           <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Farmer Recommendations</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
//                 <p className="font-semibold text-blue-900 mb-2">💧 Irrigation Status</p>
//                 <p className="text-sm text-blue-800">
//                   With current humidity at {weatherData?.humidity}%, irrigation may be needed soon.
//                 </p>
//               </div>
//               <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
//                 <p className="font-semibold text-green-900 mb-2">🌾 Pest Management</p>
//                 <p className="text-sm text-green-800">Current conditions are favorable. Monitor crops for pests after rain.</p>
//               </div>
//               <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
//                 <p className="font-semibold text-yellow-900 mb-2">☀️ Crop Care</p>
//                 <p className="text-sm text-yellow-800">Wind speed is moderate. Good time for fertilizer application if no rain expected.</p>
//               </div>
//               <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
//                 <p className="font-semibold text-purple-900 mb-2">📊 Next Action</p>
//                 <p className="text-sm text-purple-800">Review 7-day forecast before planning next farming activity.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }
