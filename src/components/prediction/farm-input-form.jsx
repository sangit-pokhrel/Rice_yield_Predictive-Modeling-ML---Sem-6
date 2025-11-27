
// import React, { useEffect, useState } from "react"
// import Header from "../common/Header"

// /**
//  * FarmInputForm.jsx
//  * Modified to match the API payload structure for rice yield prediction
//  * Supports both basic and advanced input modes
//  */

// // Default climate values for Dang District (can be fetched from weather API)
// const DEFAULT_CLIMATE = {
//   dang: { season_rain_sum: 1350, season_rain_mean: 168.75, season_tmean: 25.5, season_tmax: 30.5, season_tmin: 20.5 },
//   sunsari: { season_rain_sum: 1450, season_rain_mean: 181.25, season_tmean: 26.2, season_tmax: 31.5, season_tmin: 21.0 },
//   morang: { season_rain_sum: 1500, season_rain_mean: 187.5, season_tmean: 26.5, season_tmax: 32.0, season_tmin: 21.5 },
//   jhapa: { season_rain_sum: 1600, season_rain_mean: 200.0, season_tmean: 26.8, season_tmax: 32.5, season_tmin: 22.0 },
//   kavre: { season_rain_sum: 1200, season_rain_mean: 150.0, season_tmean: 22.0, season_tmax: 27.0, season_tmin: 17.0 },
//   kathmandu: { season_rain_sum: 1100, season_rain_mean: 137.5, season_tmean: 21.5, season_tmax: 26.5, season_tmin: 16.5 },
// }

// // Unit conversion factors to hectares
// const UNIT_TO_HECTARES = {
//   hectares: 1,
//   meters: 0.0001,      // 1 sq meter = 0.0001 hectares
//   aana: 0.003175,      // 1 aana = 0.003175 hectares (Nepal)
//   kattha: 0.0338,      // 1 kattha = 0.0338 hectares (Nepal Terai)
//   bigha: 0.6773,       // 1 bigha = 0.6773 hectares (Nepal Terai)
//   ropani: 0.0509,      // 1 ropani = 0.0509 hectares (Nepal Hills)
// }

// // Translations
// const translations = {
//   en: {
//     title: "Rice Yield Prediction",
//     subtitle: "Enter your farm details to get AI-powered predictions",
//     farmInfo: "Farm Information",
//     farmInfoDesc: "Fill in your farm details for accurate predictions",
//     landArea: "Land Area",
//     unit: "Unit",
//     region: "Region",
//     selectRegion: "Select your region",
//     location: "Location / Ward",
//     locationPlaceholder: "e.g., Deukhuri-3, Ward-5",
//     riceType: "Rice Type",
//     selectRice: "Select rice variety",
//     showAdvanced: "See Advanced Options",
//     hideAdvanced: "Hide Advanced Options",
//     advancedTitle: "Advanced Soil & Environment",
//     humidity: "Humidity (%)",
//     soilPh: "Soil pH",
//     phosphorus: "Phosphorus (kg/ha)",
//     nitrogen: "Nitrogen (kg/ha)",
//     organic: "Organic Content (%)",
//     waterSource: "Water Source",
//     selectSource: "Select source",
//     climateTitle: "Climate Parameters (Auto-filled)",
//     totalRainfall: "Total Rainfall (mm)",
//     avgRainfall: "Avg Rainfall (mm)",
//     meanTemp: "Mean Temp (°C)",
//     maxTemp: "Max Temp (°C)",
//     minTemp: "Min Temp (°C)",
//     predictBtn: "Predict Yield",
//     predicting: "Predicting...",
//     required: "Required fields",
//     gettingLocation: "Getting location...",
//     gpsFound: "GPS",
//     year: "Year",
//     improved: "Improved",
//     traditional: "Traditional",
//     hybrid: "Hybrid",
//     irrigation: "Irrigation",
//     rainfed: "Rainfed",
//     canal: "Canal",
//     well: "Well",
//     river: "River",
//     mixed: "Mixed",
//   },
//   np: {
//     title: "धान उत्पादन भविष्यवाणी",
//     subtitle: "AI-संचालित भविष्यवाणीको लागि आफ्नो खेतको विवरण प्रविष्ट गर्नुहोस्",
//     farmInfo: "खेत जानकारी",
//     farmInfoDesc: "सही भविष्यवाणीको लागि आफ्नो खेतको विवरण भर्नुहोस्",
//     landArea: "जमिन क्षेत्रफल",
//     unit: "एकाइ",
//     region: "क्षेत्र",
//     selectRegion: "आफ्नो क्षेत्र छान्नुहोस्",
//     location: "स्थान / वडा",
//     locationPlaceholder: "जस्तै, देउखुरी-३, वडा-५",
//     riceType: "धानको प्रकार",
//     selectRice: "धानको किसिम छान्नुहोस्",
//     showAdvanced: "थप विकल्पहरू हेर्नुहोस्",
//     hideAdvanced: "थप विकल्पहरू लुकाउनुहोस्",
//     advancedTitle: "माटो र वातावरण विवरण",
//     humidity: "आर्द्रता (%)",
//     soilPh: "माटोको pH",
//     phosphorus: "फस्फोरस (kg/ha)",
//     nitrogen: "नाइट्रोजन (kg/ha)",
//     organic: "जैविक पदार्थ (%)",
//     waterSource: "पानीको स्रोत",
//     selectSource: "स्रोत छान्नुहोस्",
//     climateTitle: "जलवायु मापदण्डहरू (स्वचालित)",
//     totalRainfall: "कुल वर्षा (mm)",
//     avgRainfall: "औसत वर्षा (mm)",
//     meanTemp: "औसत तापमान (°C)",
//     maxTemp: "अधिकतम तापमान (°C)",
//     minTemp: "न्यूनतम तापमान (°C)",
//     predictBtn: "उत्पादन भविष्यवाणी गर्नुहोस्",
//     predicting: "गणना गर्दै...",
//     required: "आवश्यक क्षेत्रहरू",
//     gettingLocation: "स्थान प्राप्त गर्दै...",
//     gpsFound: "GPS",
//     year: "वर्ष",
//     improved: "सुधारिएको",
//     traditional: "परम्परागत",
//     hybrid: "हाइब्रिड",
//     irrigation: "सिंचाई",
//     rainfed: "वर्षामा निर्भर",
//     canal: "नहर",
//     well: "इनार",
//     river: "नदी",
//     mixed: "मिश्रित",
//   }
// }

// export default function FarmInputForm() {
//   const [loading, setLoading] = useState(false)
//   const [showAdvanced, setShowAdvanced] = useState(false)
//   const [geoLoading, setGeoLoading] = useState(true)
//   const [lang, setLang] = useState("en")
//   const t = translations[lang]

//   const [formData, setFormData] = useState({
//     // Basic fields
//     land_area: "",
//     unit: "hectares",
//     region: "",
//     location: "",
//     latitude: "",
//     longitude: "",
//     rice_type: "",
//     year: new Date().getFullYear(),
    
//     // Soil parameters (advanced)
//     humidity: "72.5",
//     soil_ph: "6.4",
//     phosphorus: "25",
//     nitrogen: "240",
//     organic: "3.2",
//     water_source: "Irrigation",
    
//     // Climate parameters (auto-filled based on region)
//     season_rain_sum: "450",
//     season_rain_mean: "56.25",
//     season_tmean: "29.8",
//     season_tmax: "33.5",
//     season_tmin: "24.1",
//   })

//   // Get geolocation on mount
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setFormData((prev) => ({
//             ...prev,
//             latitude: position.coords.latitude.toFixed(6),
//             longitude: position.coords.longitude.toFixed(6),
//           }))
//           setGeoLoading(false)
//         },
//         (error) => {
//           console.warn("Geolocation error:", error)
//           setGeoLoading(false)
//         },
//       )
//     } else {
//       setGeoLoading(false)
//     }
//   }, [])

//   // Update climate parameters when region changes
//   useEffect(() => {
//     if (formData.region && DEFAULT_CLIMATE[formData.region]) {
//       const climate = DEFAULT_CLIMATE[formData.region]
//       setFormData((prev) => ({
//         ...prev,
//         season_rain_sum: climate.season_rain_sum.toString(),
//         season_rain_mean: climate.season_rain_mean.toString(),
//         season_tmean: climate.season_tmean.toString(),
//         season_tmax: climate.season_tmax.toString(),
//         season_tmin: climate.season_tmin.toString(),
//       }))
//     }
//   }, [formData.region])

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const validateForm = () => {
//     if (!formData.land_area || !formData.region || !formData.rice_type) {
//       alert(lang === "en" 
//         ? "Please fill in all required fields: Land Area, Region, and Rice Type"
//         : "कृपया सबै आवश्यक क्षेत्रहरू भर्नुहोस्: जमिन क्षेत्रफल, क्षेत्र, र धानको प्रकार")
//       return false
//     }
//     return true
//   }

//   const handlePredict = async () => {
//     if (!validateForm()) return

//     setLoading(true)

//     // Convert land area to hectares
//     const landAreaInHectares = parseFloat(formData.land_area) * UNIT_TO_HECTARES[formData.unit]

//     // Prepare API payload matching the expected structure
//     const apiPayload = {
//       land_area: landAreaInHectares,
//       unit: "Hectares",
//       region: formData.region.charAt(0).toUpperCase() + formData.region.slice(1),
//       location: formData.location || `${formData.region}-center`,
//       rice_type: formData.rice_type,
//       humidity: parseFloat(formData.humidity),
//       soil_ph: parseFloat(formData.soil_ph),
//       phosphorus: parseFloat(formData.phosphorus),
//       nitrogen: parseFloat(formData.nitrogen),
//       organic: parseFloat(formData.organic),
//       water_source: formData.water_source,
//       season_rain_sum: parseFloat(formData.season_rain_sum),
//       season_rain_mean: parseFloat(formData.season_rain_mean),
//       season_tmean: parseFloat(formData.season_tmean),
//       season_tmax: parseFloat(formData.season_tmax),
//       season_tmin: parseFloat(formData.season_tmin),
//       year: parseInt(formData.year),
//     }

//     // Store form data and payload for results page
//     sessionStorage.setItem("riceFormData", JSON.stringify(formData))
//     sessionStorage.setItem("riceApiPayload", JSON.stringify(apiPayload))
//     sessionStorage.setItem("riceLang", lang)

//     try {
//       // Call your prediction API
//       const response = await fetch("http://localhost:8000/predict", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(apiPayload),
//       })

//       if (!response.ok) {
//         throw new Error(`API error: ${response.status}`)
//       }

//       const predictionResult = await response.json()
      
//       // Store prediction result
//       sessionStorage.setItem("ricePredictionResult", JSON.stringify(predictionResult))
      
//       // Navigate to results page
//       window.location.href = "/results"
//     } catch (error) {
//       console.error("Prediction error:", error)
//       alert(lang === "en"
//         ? `Error: Could not connect to prediction server. Please ensure the API is running at http://localhost:8000`
//         : `त्रुटि: भविष्यवाणी सर्भरमा जडान हुन सकेन। कृपया API चलिरहेको सुनिश्चित गर्नुहोस्`)
//       setLoading(false)
//     }
//   }

//   return (
//     <>
//       <Header />
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 mt-16">
//         <div className="max-w-2xl mx-auto space-y-6">
          
//           {/* Language Toggle */}
//           <div className="flex justify-end">
//             <div className="inline-flex rounded-lg border border-green-200 bg-white p-1">
//               <button
//                 onClick={() => setLang("en")}
//                 className={`px-3 py-1 text-sm rounded-md transition-all ${
//                   lang === "en" ? "bg-green-600 text-white" : "text-gray-600 hover:bg-green-50"
//                 }`}
//               >
//                 English
//               </button>
//               <button
//                 onClick={() => setLang("np")}
//                 className={`px-3 py-1 text-sm rounded-md transition-all ${
//                   lang === "np" ? "bg-green-600 text-white" : "text-gray-600 hover:bg-green-50"
//                 }`}
//               >
//                 नेपाली
//               </button>
//             </div>
//           </div>

//           {/* Header */}
//           <div className="text-center space-y-2 mb-8">
//             <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
//               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
//                 <path d="M4 12c4-8 12-8 16 0-4 0-8 4-8 8 0-4-4-8-8-8z" fill="currentColor" />
//               </svg>
//               {lang === "en" ? "Smart Rice Prediction" : "स्मार्ट धान भविष्यवाणी"}
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
//             <p className="text-gray-600">{t.subtitle}</p>
//           </div>

//           {/* Main Form Card */}
//           <div className="bg-white rounded-2xl border border-green-200 shadow-lg">
//             <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
//               <div className="flex items-center gap-3">
//                 <svg className="w-5 h-5 text-green-700" viewBox="0 0 24 24" fill="none" aria-hidden>
//                   <path d="M12 2C8 6 4 9 4 14c0 5 4 8 8 8s8-3 8-8c0-5-4-8-8-12z" fill="currentColor" />
//                 </svg>
//                 <div>
//                   <h2 className="text-lg font-semibold text-green-700">{t.farmInfo}</h2>
//                   <p className="text-sm text-gray-600">{t.farmInfoDesc}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Basic Fields */}
//               <div className="space-y-4">
                
//                 {/* Land Area + Unit */}
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="col-span-2">
//                     <label htmlFor="land_area" className="block text-sm font-semibold text-gray-700">
//                       {t.landArea} *
//                     </label>
//                     <input
//                       id="land_area"
//                       type="number"
//                       step="0.01"
//                       placeholder={lang === "en" ? "Enter land area" : "जमिन क्षेत्रफल प्रविष्ट गर्नुहोस्"}
//                       value={formData.land_area}
//                       onChange={(e) => handleInputChange("land_area", e.target.value)}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="unit" className="block text-sm font-semibold text-gray-700">
//                       {t.unit} *
//                     </label>
//                     <select
//                       id="unit"
//                       value={formData.unit}
//                       onChange={(e) => handleInputChange("unit", e.target.value)}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                     >
//                       <option value="hectares">{lang === "en" ? "Hectares" : "हेक्टर"}</option>
//                       <option value="kattha">{lang === "en" ? "Kattha" : "कट्ठा"}</option>
//                       <option value="bigha">{lang === "en" ? "Bigha" : "बिघा"}</option>
//                       <option value="ropani">{lang === "en" ? "Ropani" : "रोपनी"}</option>
//                       <option value="aana">{lang === "en" ? "Aana" : "आना"}</option>
//                       <option value="meters">{lang === "en" ? "Sq. Meters" : "वर्ग मिटर"}</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Region */}
//                 <div>
//                   <label htmlFor="region" className="block text-sm font-semibold text-gray-700">
//                     {t.region} *
//                   </label>
//                   <select
//                     id="region"
//                     value={formData.region}
//                     onChange={(e) => handleInputChange("region", e.target.value)}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="">{t.selectRegion}</option>
//                     <option value="dang">{lang === "en" ? "Dang" : "दाङ"}</option>
//                     <option value="sunsari">{lang === "en" ? "Sunsari" : "सुनसरी"}</option>
//                     <option value="morang">{lang === "en" ? "Morang" : "मोरङ"}</option>
//                     <option value="jhapa">{lang === "en" ? "Jhapa" : "झापा"}</option>
//                     <option value="kavre">{lang === "en" ? "Kavre" : "काभ्रे"}</option>
//                     <option value="kathmandu">{lang === "en" ? "Kathmandu" : "काठमाडौं"}</option>
//                   </select>
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
//                     {t.location}
//                   </label>
//                   <input
//                     id="location"
//                     placeholder={t.locationPlaceholder}
//                     value={formData.location}
//                     onChange={(e) => handleInputChange("location", e.target.value)}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                   {geoLoading ? (
//                     <p className="text-xs text-gray-500 mt-1">{t.gettingLocation}</p>
//                   ) : formData.latitude && formData.longitude ? (
//                     <p className="text-xs text-green-600 mt-1">📍 {t.gpsFound}: {formData.latitude}, {formData.longitude}</p>
//                   ) : null}
//                 </div>

//                 {/* Rice Type */}
//                 <div>
//                   <label htmlFor="rice_type" className="block text-sm font-semibold text-gray-700">
//                     {t.riceType} *
//                   </label>
//                   <select
//                     id="rice_type"
//                     value={formData.rice_type}
//                     onChange={(e) => handleInputChange("rice_type", e.target.value)}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="">{t.selectRice}</option>
//                     <option value="Improved">{t.improved} (Sabitri, Radha-4)</option>
//                     <option value="Traditional">{t.traditional} (Mansuli)</option>
//                     <option value="Hybrid">{t.hybrid} (Gorakhnath)</option>
//                   </select>
//                 </div>

//                 {/* Year */}
//                 <div>
//                   <label htmlFor="year" className="block text-sm font-semibold text-gray-700">
//                     {t.year}
//                   </label>
//                   <input
//                     id="year"
//                     type="number"
//                     min="2020"
//                     max="2030"
//                     value={formData.year}
//                     onChange={(e) => handleInputChange("year", e.target.value)}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>
//               </div>

//               {/* Advanced Options Toggle */}
//               <div className="border-t pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowAdvanced((s) => !s)}
//                   className="flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition"
//                 >
//                   {showAdvanced ? (
//                     <>
//                       <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
//                         <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                       </svg>
//                       {t.hideAdvanced}
//                     </>
//                   ) : (
//                     <>
//                       <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
//                         <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                       </svg>
//                       {t.showAdvanced}
//                     </>
//                   )}
//                 </button>
//               </div>

//               {/* Advanced Fields */}
//               {showAdvanced && (
//                 <div className="space-y-6">
//                   {/* Soil Parameters */}
//                   <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
//                     <h3 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
//                       <span>🌱</span> {t.advancedTitle}
//                     </h3>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">{t.humidity}</label>
//                         <input
//                           type="number"
//                           step="0.1"
//                           value={formData.humidity}
//                           onChange={(e) => handleInputChange("humidity", e.target.value)}
//                           className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">{t.soilPh}</label>
//                         <input
//                           type="number"
//                           step="0.1"
//                           value={formData.soil_ph}
//                           onChange={(e) => handleInputChange("soil_ph", e.target.value)}
//                           className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">{t.nitrogen}</label>
//                         <input
//                           type="number"
//                           value={formData.nitrogen}
//                           onChange={(e) => handleInputChange("nitrogen", e.target.value)}
//                           className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">{t.phosphorus}</label>
//                         <input
//                           type="number"
//                           value={formData.phosphorus}
//                           onChange={(e) => handleInputChange("phosphorus", e.target.value)}
//                           className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">{t.organic}</label>
//                         <input
//                           type="number"
//                           step="0.1"
//                           value={formData.organic}
//                           onChange={(e) => handleInputChange("organic", e.target.value)}
//                           className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">{t.waterSource}</label>
//                         <select
//                           value={formData.water_source}
//                           onChange={(e) => handleInputChange("water_source", e.target.value)}
//                           className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
//                         >
//                           <option value="Irrigation">{t.irrigation}</option>
//                           <option value="Rainfed">{t.rainfed}</option>
//                           <option value="Canal">{t.canal}</option>
//                           <option value="Well">{t.well}</option>
//                           <option value="River">{t.river}</option>
//                           <option value="Mixed">{t.mixed}</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Climate Parameters */}
//                   <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
//                     <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
//                       <span>🌤️</span> {t.climateTitle}
//                     </h3>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">{t.totalRainfall}</label>
//                         <input
//                           type="number"
//                           value={formData.season_rain_sum}
//                           onChange={(e) => handleInputChange("season_rain_sum", e.target.value)}
//                           className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">{t.avgRainfall}</label>
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={formData.season_rain_mean}
//                           onChange={(e) => handleInputChange("season_rain_mean", e.target.value)}
//                           className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">{t.meanTemp}</label>
//                         <input
//                           type="number"
//                           step="0.1"
//                           value={formData.season_tmean}
//                           onChange={(e) => handleInputChange("season_tmean", e.target.value)}
//                           className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">{t.maxTemp}</label>
//                         <input
//                           type="number"
//                           step="0.1"
//                           value={formData.season_tmax}
//                           onChange={(e) => handleInputChange("season_tmax", e.target.value)}
//                           className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">{t.minTemp}</label>
//                         <input
//                           type="number"
//                           step="0.1"
//                           value={formData.season_tmin}
//                           onChange={(e) => handleInputChange("season_tmin", e.target.value)}
//                           className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Predict Button */}
//               <div>
//                 <button
//                   onClick={handlePredict}
//                   disabled={loading}
//                   className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-semibold rounded-xl disabled:opacity-60 shadow-lg hover:shadow-xl transition-all"
//                 >
//                   {loading ? (
//                     <>
//                       <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
//                       </svg>
//                       {t.predicting}
//                     </>
//                   ) : (
//                     <>
//                       🌾 {t.predictBtn}
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <p className="text-center text-sm text-gray-500">* {t.required}</p>
//         </div>
//       </div>
//     </>
//   )
// }


import React, { useEffect, useState } from "react"
import Header from "../common/Header"

/**
 * FarmInputForm.jsx
 * Modified to match the API payload structure for rice yield prediction
 * - No prefilled data (user must enter everything)
 * - Loading bar animation during prediction
 * - Supports both basic and advanced input modes
 */

// Default climate values for regions (used when region is selected)
const DEFAULT_CLIMATE = {
  dang: { season_rain_sum: 1350, season_rain_mean: 168.75, season_tmean: 25.5, season_tmax: 30.5, season_tmin: 20.5 },
  sunsari: { season_rain_sum: 1450, season_rain_mean: 181.25, season_tmean: 26.2, season_tmax: 31.5, season_tmin: 21.0 },
  morang: { season_rain_sum: 1500, season_rain_mean: 187.5, season_tmean: 26.5, season_tmax: 32.0, season_tmin: 21.5 },
  jhapa: { season_rain_sum: 1600, season_rain_mean: 200.0, season_tmean: 26.8, season_tmax: 32.5, season_tmin: 22.0 },
  kavre: { season_rain_sum: 1200, season_rain_mean: 150.0, season_tmean: 22.0, season_tmax: 27.0, season_tmin: 17.0 },
  kathmandu: { season_rain_sum: 1100, season_rain_mean: 137.5, season_tmean: 21.5, season_tmax: 26.5, season_tmin: 16.5 },
}

// Unit conversion factors to hectares
const UNIT_TO_HECTARES = {
  hectares: 1,
  meters: 0.0001,
  aana: 0.003175,
  kattha: 0.0338,
  bigha: 0.6773,
  ropani: 0.0509,
}

// Translations
const translations = {
  en: {
    title: "Rice Yield Prediction",
    subtitle: "Enter your farm details to get AI-powered predictions",
    farmInfo: "Farm Information",
    farmInfoDesc: "Fill in your farm details for accurate predictions",
    landArea: "Land Area",
    unit: "Unit",
    region: "Region",
    selectRegion: "Select your region",
    location: "Location / Ward",
    locationPlaceholder: "e.g., Deukhuri-3, Ward-5",
    riceType: "Rice Type",
    selectRice: "Select rice variety",
    showAdvanced: "See Advanced Options",
    hideAdvanced: "Hide Advanced Options",
    advancedTitle: "Advanced Soil & Environment",
    humidity: "Humidity (%)",
    soilPh: "Soil pH",
    phosphorus: "Phosphorus (kg/ha)",
    nitrogen: "Nitrogen (kg/ha)",
    organic: "Organic Content (%)",
    waterSource: "Water Source",
    selectSource: "Select source",
    climateTitle: "Climate Parameters",
    totalRainfall: "Total Rainfall (mm)",
    avgRainfall: "Avg Rainfall (mm)",
    meanTemp: "Mean Temp (°C)",
    maxTemp: "Max Temp (°C)",
    minTemp: "Min Temp (°C)",
    predictBtn: "Predict Yield",
    predicting: "Analyzing Data...",
    required: "Required fields",
    gettingLocation: "Getting location...",
    gpsFound: "GPS",
    year: "Year",
    improved: "Improved",
    traditional: "Traditional",
    hybrid: "Hybrid",
    irrigation: "Irrigation",
    rainfed: "Rainfed",
    canal: "Canal",
    well: "Well",
    river: "River",
    mixed: "Mixed",
    analyzingStep1: "Collecting farm data...",
    analyzingStep2: "Processing climate parameters...",
    analyzingStep3: "Running ML models...",
    analyzingStep4: "Generating predictions...",
    enterValue: "Enter value",
  },
  np: {
    title: "धान उत्पादन भविष्यवाणी",
    subtitle: "AI-संचालित भविष्यवाणीको लागि आफ्नो खेतको विवरण प्रविष्ट गर्नुहोस्",
    farmInfo: "खेत जानकारी",
    farmInfoDesc: "सही भविष्यवाणीको लागि आफ्नो खेतको विवरण भर्नुहोस्",
    landArea: "जमिन क्षेत्रफल",
    unit: "एकाइ",
    region: "क्षेत्र",
    selectRegion: "आफ्नो क्षेत्र छान्नुहोस्",
    location: "स्थान / वडा",
    locationPlaceholder: "जस्तै, देउखुरी-३, वडा-५",
    riceType: "धानको प्रकार",
    selectRice: "धानको किसिम छान्नुहोस्",
    showAdvanced: "थप विकल्पहरू हेर्नुहोस्",
    hideAdvanced: "थप विकल्पहरू लुकाउनुहोस्",
    advancedTitle: "माटो र वातावरण विवरण",
    humidity: "आर्द्रता (%)",
    soilPh: "माटोको pH",
    phosphorus: "फस्फोरस (kg/ha)",
    nitrogen: "नाइट्रोजन (kg/ha)",
    organic: "जैविक पदार्थ (%)",
    waterSource: "पानीको स्रोत",
    selectSource: "स्रोत छान्नुहोस्",
    climateTitle: "जलवायु मापदण्डहरू",
    totalRainfall: "कुल वर्षा (mm)",
    avgRainfall: "औसत वर्षा (mm)",
    meanTemp: "औसत तापमान (°C)",
    maxTemp: "अधिकतम तापमान (°C)",
    minTemp: "न्यूनतम तापमान (°C)",
    predictBtn: "उत्पादन भविष्यवाणी गर्नुहोस्",
    predicting: "डाटा विश्लेषण गर्दै...",
    required: "आवश्यक क्षेत्रहरू",
    gettingLocation: "स्थान प्राप्त गर्दै...",
    gpsFound: "GPS",
    year: "वर्ष",
    improved: "सुधारिएको",
    traditional: "परम्परागत",
    hybrid: "हाइब्रिड",
    irrigation: "सिंचाई",
    rainfed: "वर्षामा निर्भर",
    canal: "नहर",
    well: "इनार",
    river: "नदी",
    mixed: "मिश्रित",
    analyzingStep1: "खेत डाटा सङ्कलन गर्दै...",
    analyzingStep2: "जलवायु मापदण्डहरू प्रशोधन गर्दै...",
    analyzingStep3: "ML मोडेलहरू चलाउँदै...",
    analyzingStep4: "भविष्यवाणी उत्पन्न गर्दै...",
    enterValue: "मान प्रविष्ट गर्नुहोस्",
  }
}

// Loading Bar Component
function LoadingBar({ progress, currentStep, lang }) {
  const t = translations[lang]
  const steps = [t.analyzingStep1, t.analyzingStep2, t.analyzingStep3, t.analyzingStep4]
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Rice Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="text-6xl animate-bounce">🌾</div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-gray-200 rounded-full blur-sm"></div>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
          {lang === 'en' ? 'Analyzing Your Farm Data' : 'तपाईंको खेत डाटा विश्लेषण गर्दै'}
        </h3>
        <p className="text-gray-500 text-sm text-center mb-6">{steps[currentStep]}</p>
        
        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        
        {/* Progress Percentage */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{lang === 'en' ? 'Progress' : 'प्रगति'}</span>
          <span className="font-semibold text-green-600">{progress}%</span>
        </div>
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-6">
          {[0, 1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step <= currentStep 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {step < currentStep ? '✓' : step + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function FarmInputForm() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [geoLoading, setGeoLoading] = useState(true)
  const [lang, setLang] = useState("en")
  const t = translations[lang]

  // Initialize with empty values (no prefilled data)
  const [formData, setFormData] = useState({
    // Basic fields - all empty
    land_area: "",
    unit: "hectares",
    region: "",
    location: "",
    latitude: "",
    longitude: "",
    rice_type: "",
    year: new Date().getFullYear(),
    
    // Soil parameters - empty (user must fill or use defaults when region selected)
    humidity: "",
    soil_ph: "",
    phosphorus: "",
    nitrogen: "",
    organic: "",
    water_source: "",
    
    // Climate parameters - empty (auto-filled when region selected)
    season_rain_sum: "",
    season_rain_mean: "",
    season_tmean: "",
    season_tmax: "",
    season_tmin: "",
  })

  // Get geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }))
          setGeoLoading(false)
        },
        (error) => {
          console.warn("Geolocation error:", error)
          setGeoLoading(false)
        },
      )
    } else {
      setGeoLoading(false)
    }
  }, [])

  // Update climate parameters when region changes
  useEffect(() => {
    if (formData.region && DEFAULT_CLIMATE[formData.region]) {
      const climate = DEFAULT_CLIMATE[formData.region]
      setFormData((prev) => ({
        ...prev,
        season_rain_sum: climate.season_rain_sum.toString(),
        season_rain_mean: climate.season_rain_mean.toString(),
        season_tmean: climate.season_tmean.toString(),
        season_tmax: climate.season_tmax.toString(),
        season_tmin: climate.season_tmin.toString(),
      }))
    }
  }, [formData.region])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const requiredFields = ['land_area', 'region', 'rice_type']
    const missing = requiredFields.filter(field => !formData[field])
    
    if (missing.length > 0) {
      alert(lang === "en" 
        ? "Please fill in all required fields: Land Area, Region, and Rice Type"
        : "कृपया सबै आवश्यक क्षेत्रहरू भर्नुहोस्: जमिन क्षेत्रफल, क्षेत्र, र धानको प्रकार")
      return false
    }

    // Validate climate data exists
    if (!formData.season_tmean || !formData.season_rain_sum) {
      alert(lang === "en"
        ? "Please select a region to auto-fill climate data, or enter climate parameters manually in Advanced Options"
        : "कृपया जलवायु डाटा स्वतः भर्न क्षेत्र छान्नुहोस्, वा थप विकल्पहरूमा म्यानुअल रूपमा प्रविष्ट गर्नुहोस्")
      return false
    }

    return true
  }

  // Animated loading progress
  const runLoadingAnimation = () => {
    return new Promise((resolve) => {
      let prog = 0
      let step = 0
      
      const interval = setInterval(() => {
        prog += Math.random() * 15 + 5
        
        if (prog >= 25 && step === 0) { step = 1; setCurrentStep(1) }
        if (prog >= 50 && step === 1) { step = 2; setCurrentStep(2) }
        if (prog >= 75 && step === 2) { step = 3; setCurrentStep(3) }
        
        if (prog >= 100) {
          prog = 100
          setProgress(100)
          clearInterval(interval)
          setTimeout(resolve, 500)
        } else {
          setProgress(Math.min(Math.round(prog), 95))
        }
      }, 300)
    })
  }

  const handlePredict = async () => {
    if (!validateForm()) return

    setLoading(true)
    setProgress(0)
    setCurrentStep(0)

    // Convert land area to hectares
    const landAreaInHectares = parseFloat(formData.land_area) * UNIT_TO_HECTARES[formData.unit]

    // Prepare API payload
    const apiPayload = {
      land_area: landAreaInHectares,
      unit: "Hectares",
      region: formData.region.charAt(0).toUpperCase() + formData.region.slice(1),
      location: formData.location || `${formData.region}-center`,
      rice_type: formData.rice_type,
      humidity: parseFloat(formData.humidity) || 70,
      soil_ph: parseFloat(formData.soil_ph) || 6.5,
      phosphorus: parseFloat(formData.phosphorus) || 25,
      nitrogen: parseFloat(formData.nitrogen) || 200,
      organic: parseFloat(formData.organic) || 3.0,
      water_source: formData.water_source || "Rainfed",
      season_rain_sum: parseFloat(formData.season_rain_sum),
      season_rain_mean: parseFloat(formData.season_rain_mean),
      season_tmean: parseFloat(formData.season_tmean),
      season_tmax: parseFloat(formData.season_tmax),
      season_tmin: parseFloat(formData.season_tmin),
      year: parseInt(formData.year),
    }

    // Clear old session data
    sessionStorage.removeItem("riceFormData")
    sessionStorage.removeItem("riceApiPayload")
    sessionStorage.removeItem("ricePredictionResult")
    sessionStorage.removeItem("riceAISuggestions")
    sessionStorage.removeItem("riceLang")
    sessionStorage.removeItem("riceSessionExpiry")

    // Store new form data
    sessionStorage.setItem("riceFormData", JSON.stringify(formData))
    sessionStorage.setItem("riceApiPayload", JSON.stringify(apiPayload))
    sessionStorage.setItem("riceLang", lang)
    
    // Set session expiry (1 hour from now)
    const expiryTime = Date.now() + (60 * 60 * 1000) // 1 hour in milliseconds
    sessionStorage.setItem("riceSessionExpiry", expiryTime.toString())

    try {
      // Start loading animation
      const animationPromise = runLoadingAnimation()
      
      // Call prediction API
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const predictionResult = await response.json()
      
      // Wait for animation to complete
      await animationPromise
      
      // Store prediction result
      sessionStorage.setItem("ricePredictionResult", JSON.stringify(predictionResult))
      
      // Navigate to results page
      window.location.href = "/results"
    } catch (error) {
      console.error("Prediction error:", error)
      setLoading(false)
      setProgress(0)
      alert(lang === "en"
        ? `Error: Could not connect to prediction server. Please ensure the API is running at http://localhost:8000`
        : `त्रुटि: भविष्यवाणी सर्भरमा जडान हुन सकेन। कृपया API चलिरहेको सुनिश्चित गर्नुहोस्`)
    }
  }

  return (
    <>
      <Header />
      
      {/* Loading Overlay */}
      {loading && <LoadingBar progress={progress} currentStep={currentStep} lang={lang} />}
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 mt-16">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Language Toggle */}
          <div className="flex justify-end">
            <div className="inline-flex rounded-lg border border-green-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => setLang("en")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all font-medium ${
                  lang === "en" ? "bg-green-600 text-white shadow" : "text-gray-600 hover:bg-green-50"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang("np")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all font-medium ${
                  lang === "np" ? "bg-green-600 text-white shadow" : "text-gray-600 hover:bg-green-50"
                }`}
              >
                नेपाली
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <span className="text-lg">🌾</span>
              {lang === "en" ? "Smart Rice Prediction" : "स्मार्ट धान भविष्यवाणी"}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl border border-green-200 shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🌱</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{t.farmInfo}</h2>
                  <p className="text-sm text-gray-600">{t.farmInfoDesc}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Fields */}
              <div className="space-y-4">
                
                {/* Land Area + Unit */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      {t.landArea} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder={t.enterValue}
                      value={formData.land_area}
                      onChange={(e) => handleInputChange("land_area", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      {t.unit} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => handleInputChange("unit", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    >
                      <option value="hectares">{lang === "en" ? "Hectares" : "हेक्टर"}</option>
                      <option value="kattha">{lang === "en" ? "Kattha" : "कट्ठा"}</option>
                      <option value="bigha">{lang === "en" ? "Bigha" : "बिघा"}</option>
                      <option value="ropani">{lang === "en" ? "Ropani" : "रोपनी"}</option>
                      <option value="aana">{lang === "en" ? "Aana" : "आना"}</option>
                      <option value="meters">{lang === "en" ? "Sq. Meters" : "वर्ग मिटर"}</option>
                    </select>
                  </div>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t.region} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleInputChange("region", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  >
                    <option value="">{t.selectRegion}</option>
                    <option value="dang">{lang === "en" ? "Dang" : "दाङ"}</option>
                    <option value="sunsari">{lang === "en" ? "Sunsari" : "सुनसरी"}</option>
                    <option value="morang">{lang === "en" ? "Morang" : "मोरङ"}</option>
                    <option value="jhapa">{lang === "en" ? "Jhapa" : "झापा"}</option>
                    <option value="kavre">{lang === "en" ? "Kavre" : "काभ्रे"}</option>
                    <option value="kathmandu">{lang === "en" ? "Kathmandu" : "काठमाडौं"}</option>
                  </select>
                  {formData.region && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {lang === "en" ? "Climate data auto-filled for" : "जलवायु डाटा स्वतः भरियो"} {formData.region}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t.location}
                  </label>
                  <input
                    placeholder={t.locationPlaceholder}
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                  {geoLoading ? (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      {t.gettingLocation}
                    </p>
                  ) : formData.latitude && formData.longitude ? (
                    <p className="text-xs text-green-600 mt-1">📍 {t.gpsFound}: {formData.latitude}, {formData.longitude}</p>
                  ) : null}
                </div>

                {/* Rice Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t.riceType} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.rice_type}
                    onChange={(e) => handleInputChange("rice_type", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  >
                    <option value="">{t.selectRice}</option>
                    <option value="Improved">{t.improved} (Sabitri, Radha-4)</option>
                    <option value="Traditional">{t.traditional} (Mansuli)</option>
                    <option value="Hybrid">{t.hybrid} (Gorakhnath)</option>
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t.year}
                  </label>
                  <input
                    type="number"
                    min="2020"
                    max="2030"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <div className="border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdvanced((s) => !s)}
                  className="flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition"
                >
                  <svg className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {showAdvanced ? t.hideAdvanced : t.showAdvanced}
                </button>
              </div>

              {/* Advanced Fields */}
              {showAdvanced && (
                <div className="space-y-6 animate-in slide-in-from-top duration-300">
                  {/* Soil Parameters */}
                  <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                    <h3 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                      <span className="text-xl">🌱</span> {t.advancedTitle}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{t.humidity}</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="70-80"
                          value={formData.humidity}
                          onChange={(e) => handleInputChange("humidity", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{t.soilPh}</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="5.5-7.0"
                          value={formData.soil_ph}
                          onChange={(e) => handleInputChange("soil_ph", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{t.nitrogen}</label>
                        <input
                          type="number"
                          placeholder="200-300"
                          value={formData.nitrogen}
                          onChange={(e) => handleInputChange("nitrogen", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{t.phosphorus}</label>
                        <input
                          type="number"
                          placeholder="20-40"
                          value={formData.phosphorus}
                          onChange={(e) => handleInputChange("phosphorus", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{t.organic}</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="2-5"
                          value={formData.organic}
                          onChange={(e) => handleInputChange("organic", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{t.waterSource}</label>
                        <select
                          value={formData.water_source}
                          onChange={(e) => handleInputChange("water_source", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">{t.selectSource}</option>
                          <option value="Irrigation">{t.irrigation}</option>
                          <option value="Rainfed">{t.rainfed}</option>
                          <option value="Canal">{t.canal}</option>
                          <option value="Well">{t.well}</option>
                          <option value="River">{t.river}</option>
                          <option value="Mixed">{t.mixed}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Climate Parameters */}
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <span className="text-xl">🌤️</span> {t.climateTitle}
                      {formData.region && (
                        <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full ml-2">
                          {lang === 'en' ? 'Auto-filled' : 'स्वतः भरिएको'}
                        </span>
                      )}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{t.totalRainfall}</label>
                        <input
                          type="number"
                          placeholder="1000-2000"
                          value={formData.season_rain_sum}
                          onChange={(e) => handleInputChange("season_rain_sum", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{t.avgRainfall}</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="100-200"
                          value={formData.season_rain_mean}
                          onChange={(e) => handleInputChange("season_rain_mean", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{t.meanTemp}</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="24-28"
                          value={formData.season_tmean}
                          onChange={(e) => handleInputChange("season_tmean", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{t.maxTemp}</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="30-35"
                          value={formData.season_tmax}
                          onChange={(e) => handleInputChange("season_tmax", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{t.minTemp}</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="18-22"
                          value={formData.season_tmin}
                          onChange={(e) => handleInputChange("season_tmin", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Predict Button */}
              <div className="pt-2">
                <button
                  onClick={handlePredict}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-semibold rounded-xl disabled:opacity-60 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                >
                  <span className="text-2xl">🌾</span>
                  {t.predictBtn}
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            <span className="text-red-500">*</span> {t.required}
          </p>
        </div>
      </div>
    </>
  )
}