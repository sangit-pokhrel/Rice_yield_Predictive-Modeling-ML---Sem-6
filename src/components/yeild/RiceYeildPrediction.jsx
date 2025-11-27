import React, { useEffect, useRef, useState } from "react";
import Header from "../common/Header";


export default function RiceYeildPrediction() {
  const IMAGE_PATH = "https://images.pexels.com/photos/1438516/pexels-photo-1438516.jpeg";

  const t = {
    area: "Farm Area (ha)",
    location: "Location",
    predict: "Predict",
    defaults: "Use sensible defaults",
    showAdvanced: "See advanced options",
    hideAdvanced: "Hide advanced options",
    locations: ["Tulsipur", "Ghorahi", "Naubasta", "Lamahi", "Other"],
  };

  const [formData, setFormData] = useState({
    area: "",
    location: "",
    rainfall: "",
    temperature: "",
    pH: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    humidity: "",
  });

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 0..100
  const [prediction, setPrediction] = useState(null);

  const resultsRef = useRef(null);
  const progressTimerRef = useRef(null);

  const sensibleDefaults = {
    rainfall: "1200",
    temperature: "25",
    pH: "6.5",
    nitrogen: "200",
    phosphorus: "50",
    potassium: "150",
    humidity: "70",
  };

  function applyDefaults() {
    setFormData((p) => ({ ...p, ...sensibleDefaults }));
    setAdvancedOpen(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }

  function handleSelectChange(e) {
    setFormData((p) => ({ ...p, location: e.target.value }));
  }

  // Simulate progressive loading (visually) while "prediction" runs.
  function startProgressSimulation(durationMs = 1500) {
    clearInterval(progressTimerRef.current);
    setProgress(0);

    const start = Date.now();
    const end = start + durationMs;
    progressTimerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - start;
      const pct = Math.min(95, Math.round((elapsed / durationMs) * 95)); // grow to 95% during work
      setProgress(pct);
      if (now >= end) {
        clearInterval(progressTimerRef.current);
      }
    }, 80);
  }

  // Main submit handler: runs the "prediction", shows loading/progress, then reveals results and scrolls.
  function handleSubmit(e) {
    e.preventDefault();
    // Basic validation: require area
    if (!formData.area || Number(formData.area) <= 0) {
      alert("Please enter a valid farm area.");
      return;
    }

    // Start loading UI
    setLoading(true);
    startProgressSimulation(1600);

    // Simulate async prediction delay (replace with real API call if available)
    setTimeout(() => {
      // ensure final progress 100%
      clearInterval(progressTimerRef.current);
      setProgress(100);

      // compute prediction using same heuristic
      const data = { ...sensibleDefaults, ...formData };
      const area = parseFloat(data.area || 0);
      const baseYield = area * 50;
      const rainfallFactor = Math.min(parseFloat(data.rainfall) || 0 / 1500, 1) * 0.3;
      const tempFactor = ((parseFloat(data.temperature || 25) - 20) / 10) * 0.2;
      const pHFactor = ((7 - Math.abs(parseFloat(data.pH || 6.5) - 7)) / 3) * 0.15;
      const nutrientFactor =
        ((parseFloat(data.nitrogen || 200) + parseFloat(data.phosphorus || 50) + parseFloat(data.potassium || 150)) /
          3000) *
        0.35;

      const adjustedYield = baseYield * (1 + rainfallFactor + tempFactor + pHFactor + nutrientFactor);

      let suggestion = "";
      if (adjustedYield > 3000) {
        suggestion = "Excellent yield expected — keep irrigation and pest checks on schedule.";
      } else if (adjustedYield > 2000) {
        suggestion = "Good yield expected — follow fertilizer recommendations from a local extension.";
      } else {
        suggestion = "Average yield expected — consider soil health and water improvements.";
      }

      // Save results
      setPrediction({
        yield: Math.round(adjustedYield),
        suggestion,
        inputs: data,
        timestamp: new Date().toISOString(),
      });

      // small delay to let progress show 100% then remove loading state
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        // scroll to results
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 250);
    }, 1700); // simulated server time
  }

  // Cleanup interval when component unmounts
  useEffect(() => {
    return () => clearInterval(progressTimerRef.current);
  }, []);

  return (
    <div className="min-h-screen relative bg-slate-50">
        <Header />
      {/* Full-bleed background image */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage: `url('${IMAGE_PATH}')`,
        }}
        aria-hidden
      />

      {/* dark overlay for legibility */}
      <div className="absolute inset-0 bg-black/45" />

      {/* centered form card */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full md:w-4/5 max-w-4xl  bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-2 text-center">Rice Yield Prediction</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 font-medium mb-1">{t.area}</label>
              <input
                name="area"
                type="number"
                step="0.1"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. 2.5"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 font-medium mb-1">{t.location}</label>
              <select
                value={formData.location}
                onChange={handleSelectChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                <option value="">Select location</option>
                {t.locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 text-base font-medium disabled:opacity-60"
                disabled={loading}
              >
                {/* arrow icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M18 6l3 6-3 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {loading ? "Predicting..." : t.predict}
              </button>

              <button
                type="button"
                onClick={applyDefaults}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
                disabled={loading}
              >
                {t.defaults}
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setAdvancedOpen((s) => !s)}
                className="w-full flex items-center justify-between px-3 py-2 mt-1 border rounded-md bg-white text-slate-700"
                aria-expanded={advancedOpen}
                disabled={loading}
              >
                <span className="text-sm">{advancedOpen ? t.hideAdvanced : t.showAdvanced}</span>
                <svg className={`w-4 h-4 transform ${advancedOpen ? "rotate-180" : "rotate-0"}`} viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {advancedOpen && (
              <div className="mt-2 space-y-2 border-t pt-3">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Rainfall (mm)</label>
                  <input
                    name="rainfall"
                    type="number"
                    value={formData.rainfall}
                    onChange={handleChange}
                    placeholder="1200"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1">Temperature (°C)</label>
                  <input
                    name="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder="25"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1">Soil pH</label>
                  <input
                    name="pH"
                    type="number"
                    step="0.1"
                    value={formData.pH}
                    onChange={handleChange}
                    placeholder="6.5"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Nitrogen</label>
                    <input
                      name="nitrogen"
                      type="number"
                      value={formData.nitrogen}
                      onChange={handleChange}
                      placeholder="200"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Phosphorus</label>
                    <input
                      name="phosphorus"
                      type="number"
                      value={formData.phosphorus}
                      onChange={handleChange}
                      placeholder="50"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Potassium</label>
                    <input
                      name="potassium"
                      type="number"
                      value={formData.potassium}
                      onChange={handleChange}
                      placeholder="150"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1">Humidity (%)</label>
                  <input
                    name="humidity"
                    type="number"
                    value={formData.humidity}
                    onChange={handleChange}
                    placeholder="70"
                    max="100"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                    disabled={loading}
                  />
                </div>
              </div>
            )}
          </form>

          {/* Loading bar */}
          {loading && (
            <div className="mt-4">
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-green-500 transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-200">Running analysis...</div>
            </div>
          )}
        </div>
      </div>

      {/* Results section (separate block below hero) */}
      <section ref={resultsRef} id="results-section" className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {prediction ? (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Prediction Analysis</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
                  <div className="text-sm text-slate-600">Predicted yield</div>
                  <div className="text-3xl font-bold text-green-700">{prediction.yield}</div>
                  <div className="text-xs text-slate-500 mt-1">kg (approx)</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 md:col-span-2">
                  <div className="text-sm font-medium text-slate-700">Recommendations</div>
                  <p className="mt-2 text-sm text-slate-600">{prediction.suggestion}</p>

                  <div className="mt-4">
                    <div className="text-xs text-slate-500 uppercase font-medium">Inputs used</div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-700">
                      <div>Area: <span className="font-medium">{prediction.inputs.area || "—"}</span></div>
                      <div>Location: <span className="font-medium">{prediction.inputs.location || "—"}</span></div>
                      <div>Rainfall: <span className="font-medium">{prediction.inputs.rainfall}</span></div>
                      <div>Temperature: <span className="font-medium">{prediction.inputs.temperature}</span></div>
                      <div>pH: <span className="font-medium">{prediction.inputs.pH}</span></div>
                      <div>Humidity: <span className="font-medium">{prediction.inputs.humidity}</span></div>
                      <div>N: <span className="font-medium">{prediction.inputs.nitrogen}</span></div>
                      <div>P: <span className="font-medium">{prediction.inputs.phosphorus}</span></div>
                      <div>K: <span className="font-medium">{prediction.inputs.potassium}</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
                >
                  Back to form
                </button>

                <button
                  onClick={() => {
                    // reset for a new run
                    setPrediction(null);
                    setFormData({
                      area: "",
                      location: "",
                      rainfall: "",
                      temperature: "",
                      pH: "",
                      nitrogen: "",
                      phosphorus: "",
                      potassium: "",
                      humidity: "",
                    });
                    setAdvancedOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  New Prediction
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500/80">
              <p className="text-lg">No prediction yet — complete the form above and click “Predict”.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
