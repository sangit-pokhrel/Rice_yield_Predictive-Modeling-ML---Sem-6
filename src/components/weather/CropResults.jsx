
import React, { useState, useEffect } from "react";
import { ArrowRight, Loader } from "lucide-react";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";

export const SAMPLE_IMAGE_URL = "sandbox:/mnt/data/19f4a51c-0c3d-4a08-a420-412cfe67ed24.png";

export default function CropAssessmentPage() {
    const navigate = useNavigate();
  const [location, setLocation] = useState({ lat: null, lng: null, name: "Loading..." });
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    cropStage: "germination",
    daysFromGermination: 30,
    soilMoisture: "moderate",
    humidity: 65,
    ph: 7,
    phosphorus: 20,
    nitrogen: 30,
    organicContent: 2.5,
    waterSource: "rainwater",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({
          lat: latitude,
          lng: longitude,
          name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
        });
      },
      () => {
        setLocation({ lat: 27.7172, lng: 85.324, name: "Kathmandu (Default)" });
      }
    );
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/crop/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropData: formData,
          location: location,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("AI server error");
        setLoading(false);
        return;
      }

      // Store both languages
      sessionStorage.setItem("crop_EN", data.englishSuggestion);
      sessionStorage.setItem("crop_NP", data.nepaliSuggestion);
      sessionStorage.setItem("cropAssessmentData", JSON.stringify(formData));
      sessionStorage.setItem("location", JSON.stringify(location));

     navigate("/result")
    } catch (error) {
      console.error(error);
      alert("Server not reachable");
    } finally {
      // keep loading true until redirect or set false after error
      setLoading(false);
    }
  };

  const cropStages = [
    { value: "germination", label: "🌱 Germination (0–7 days)" },
    { value: "early_growth", label: "🌿 Early Growth (7–30 days)" },
    { value: "vegetative", label: "🌾 Vegetative (30–60 days)" },
    { value: "panicle", label: "🎋 Panicle Formation (60–90 days)" },
    { value: "flowering", label: "🌸 Flowering (90–100 days)" },
    { value: "maturation", label: "🌾 Maturation (100–120 days)" },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 mt-16 relative">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-3">Crop Stage Assessment</h1>
          <p className="text-gray-600 mb-6">Provide crop details for AI-powered guidance</p>

          <div className="bg-white p-4 rounded-xl shadow mb-6">
            <strong>Location:</strong> {location.name}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Crop stage */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4">Crop Stage</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cropStages.map((stage) => (
                  <button
                    key={stage.value}
                    type="button"
                    onClick={() => handleInputChange("cropStage", stage.value)}
                    className={`p-4 rounded-lg border-2 transition ${
                      formData.cropStage === stage.value
                        ? "bg-green-100 border-green-500"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Days */}
            <div className="bg-white p-6 rounded-xl shadow">
              <label className="text-lg font-bold">
                Days from Germination: {formData.daysFromGermination}
              </label>
              <input
                type="range"
                min="0"
                max="150"
                value={formData.daysFromGermination}
                onChange={(e) => handleInputChange("daysFromGermination", +e.target.value)}
                className="w-full mt-2"
              />
            </div>

            {/* Soil moisture */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4">Soil Moisture</h2>
              <div className="grid grid-cols-3 gap-3">
                {["dry", "moderate", "wet"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleInputChange("soilMoisture", m)}
                    className={`p-4 rounded-lg border-2 transition ${
                      formData.soilMoisture === m
                        ? "bg-green-100 border-green-500"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Soil Data */}
            <div className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["humidity", 0, 100, 1, "%"],
                ["ph", 5, 9, 0.1, ""],
                ["phosphorus", 0, 100, 1, "mg/kg"],
                ["nitrogen", 0, 150, 1, "mg/kg"],
                ["organicContent", 0, 10, 0.1, "%"],
              ].map(([field, min, max, step, unit]) => (
                <div key={field}>
                  <label className="font-semibold text-gray-700">
                    {field}: {formData[field]}
                    {unit}
                  </label>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, +e.target.value)}
                    className="w-full"
                  />
                </div>
              ))}

              {/* Water Source */}
              <div>
                <label className="font-semibold">Water Source</label>
                <select
                  value={formData.waterSource}
                  onChange={(e) => handleInputChange("waterSource", e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="rainwater">Rainwater</option>
                  <option value="well">Well</option>
                  <option value="canal">Canal</option>
                  <option value="river">River</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-600 text-white rounded-lg text-lg font-bold flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="animate-spin" /> : "Get AI Prediction"}
              {!loading && <ArrowRight />}
            </button>
          </form>
        </div>

        {/* Loading modal / overlay */}
        {loading && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            role="status"
            aria-live="polite"
            aria-label="Generating AI recommendation"
          >
            <div className="bg-white rounded-xl p-6 w-[90%] max-w-md mx-auto shadow-lg flex flex-col items-center gap-4">
              <Loader className="w-12 h-12 animate-spin text-green-600" />
              <div className="text-lg font-semibold text-gray-900">Generating recommendation…</div>
              <div className="text-sm text-gray-600 text-center">
                The AI is analyzing your crop data — this can take a few seconds.
              </div>

              {/* Indeterminate progress bar */}
              <div className="w-full mt-4">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-green-500 animate-[progress_2.5s_linear_infinite]"
                    style={{
                      width: "40%",
                      // create a simple CSS keyframe via inline style is not possible;
                      // tailwind's animate-pulse provides a subtle shimmer instead:
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Starting</span>
                  <span>Estimating…</span>
                </div>
              </div>

              <div className="text-xs text-gray-400 mt-2">Tip: keep this page open until the result appears.</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
