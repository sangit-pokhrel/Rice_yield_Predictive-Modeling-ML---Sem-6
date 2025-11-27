// import React, { useEffect, useState } from "react"
// import Header from "../common/Header"
// /**
//  * FarmInputForm.jsx
//  * - Plain React + Tailwind (no Next.js or custom UI components)
//  * - Uses geolocation, shows advanced options, saves form to sessionStorage,
//  *   and redirects to /results after simulated prediction.
//  *
//  * Local uploaded image path (use if you need a background/logo):
//  * IMAGE_URL = "/mnt/data/e7f0d612-a73d-4824-8602-3340f5692563.png"
//  */
// const IMAGE_URL = "/mnt/data/e7f0d612-a73d-4824-8602-3340f5692563.png"

// export default function FarmInputForm() {
//   const [loading, setLoading] = useState(false)
//   const [showAdvanced, setShowAdvanced] = useState(false)
//   const [geoLoading, setGeoLoading] = useState(true)

//   const [formData, setFormData] = useState({
//     // Basic fields
//     landArea: "",
//     areaUnit: "hectares",
//     region: "",
//     location: "",
//     latitude: "",
//     longitude: "",
//     riceType: "",
//     // Advanced fields
//     humidity: "",
//     ph: "",
//     phosphorus: "",
//     nitrogen: "",
//     organicContent: "",
//     waterSource: "",
//   })

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

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const validateForm = () => {
//     if (!formData.landArea || !formData.region || !formData.riceType) {
//       alert("Please fill in all required fields: Land Area, Region, and Rice Type")
//       return false
//     }
//     if (showAdvanced) {
//       if (!formData.humidity || !formData.ph || !formData.waterSource) {
//         alert("Please fill in all required advanced fields: Humidity, pH, and Water Source")
//         return false
//       }
//     }
//     return true
//   }

//   const handlePredict = () => {
//     if (!validateForm()) return

//     setLoading(true)
//     sessionStorage.setItem("riceFormData", JSON.stringify(formData))

//     // Simulate an API call for prediction (replace with real fetch if needed)
//     setTimeout(() => {
//       setLoading(false)
//       // navigate to results page
//       window.location.href = "/results"
//     }, 1000)
//   }

//   return (
//     <>
//     <Header />
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 mt-16">
//       <div className="max-w-2xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="text-center space-y-2 mb-8">
//           <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
//             {/* small leaf svg */}
//             <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
//               <path d="M4 12c4-8 12-8 16 0-4 0-8 4-8 8 0-4-4-8-8-8z" fill="currentColor" />
//             </svg>
//             Smart Rice Prediction
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900">Rice Yield Prediction</h1>
//           <p className="text-gray-600">Enter your farm details to get AI-powered predictions</p>
//         </div>

//         {/* Main Form Card */}
//         <div className="bg-white rounded-2xl border border-green-200 shadow-lg">
//           <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
//             <div className="flex items-center gap-3">
//               <svg className="w-5 h-5 text-green-700" viewBox="0 0 24 24" fill="none" aria-hidden>
//                 <path d="M12 2C8 6 4 9 4 14c0 5 4 8 8 8s8-3 8-8c0-5-4-8-8-12z" fill="currentColor" />
//               </svg>
//               <div>
//                 <h2 className="text-lg font-semibold text-green-700">Farm Information</h2>
//                 <p className="text-sm text-gray-600">Fill in your farm details for accurate predictions</p>
//               </div>
//             </div>
//           </div>

//           <div className="p-6 space-y-6">
//             {/* Basic Fields */}
//             <div className="space-y-4">
//               {/* Land Area */}
//               <div className="grid grid-cols-3 gap-4">
//                 <div className="col-span-2">
//                   <label htmlFor="landArea" className="block text-sm font-semibold text-gray-700">
//                     Land Area *
//                   </label>
//                   <input
//                     id="landArea"
//                     type="number"
//                     placeholder="Enter land area"
//                     value={formData.landArea}
//                     onChange={(e) => handleInputChange("landArea", e.target.value)}
//                     className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="areaUnit" className="block text-sm font-semibold text-gray-700">
//                     Unit *
//                   </label>
//                   <select
//                     id="areaUnit"
//                     value={formData.areaUnit}
//                     onChange={(e) => handleInputChange("areaUnit", e.target.value)}
//                     className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
//                   >
//                     <option value="meters">Meters</option>
//                     <option value="aana">Aana</option>
//                     <option value="hectares">Hectares</option>
//                     <option value="kattha">Kattha</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Region */}
//               <div>
//                 <label htmlFor="region" className="block text-sm font-semibold text-gray-700">
//                   Region *
//                 </label>
//                 <select
//                   id="region"
//                   value={formData.region}
//                   onChange={(e) => handleInputChange("region", e.target.value)}
//                   className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
//                 >
//                   <option value="">Select your region</option>
//                   <option value="dang">Dang</option>
//                   <option value="sunsari">Sunsari</option>
//                   <option value="morang">Morang</option>
//                   <option value="jhapa">Jhapa</option>
//                   <option value="kavre">Kavre</option>
//                   <option value="kathmandu">Kathmandu</option>
//                 </select>
//               </div>

//               {/* Location with Geolocation */}
//               <div>
//                 <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
//                   Location / Ward
//                 </label>
//                 <input
//                   id="location"
//                   placeholder="e.g., Deukhuri-3, Ward-5"
//                   value={formData.location}
//                   onChange={(e) => handleInputChange("location", e.target.value)}
//                   className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
//                 />
//                 {geoLoading ? (
//                   <p className="text-xs text-gray-500 mt-1">Getting location...</p>
//                 ) : formData.latitude && formData.longitude ? (
//                   <p className="text-xs text-green-600 mt-1">📍 GPS: {formData.latitude}, {formData.longitude}</p>
//                 ) : null}
//               </div>

//               {/* Rice Type */}
//               <div>
//                 <label htmlFor="riceType" className="block text-sm font-semibold text-gray-700">
//                   Rice Type *
//                 </label>
//                 <select
//                   id="riceType"
//                   value={formData.riceType}
//                   onChange={(e) => handleInputChange("riceType", e.target.value)}
//                   className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
//                 >
//                   <option value="">Select rice variety</option>
//                   <option value="sabitri">Sabitri</option>
//                   <option value="radha-4">Radha-4</option>
//                   <option value="hardinath-1">Hardinath-1</option>
//                   <option value="mansuli">Mansuli</option>
//                   <option value="basmati">Basmati</option>
//                 </select>
//               </div>
//             </div>

//             {/* Advanced Options Toggle */}
//             <div className="border-t pt-4">
//               <button
//                 type="button"
//                 onClick={() => setShowAdvanced((s) => !s)}
//                 className="flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition"
//               >
//                 {showAdvanced ? (
//                   <>
//                     {/* up chevron */}
//                     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
//                       <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                     Hide Advanced Options
//                   </>
//                 ) : (
//                   <>
//                     {/* down chevron */}
//                     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
//                       <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                     See Advanced Options
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Advanced Fields */}
//             {showAdvanced && (
//               <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
//                 <h3 className="font-semibold text-gray-700">Advanced Soil & Environment</h3>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="humidity" className="block text-sm text-gray-600">Humidity (%) *</label>
//                     <input
//                       id="humidity"
//                       type="number"
//                       placeholder="70-80"
//                       value={formData.humidity}
//                       onChange={(e) => handleInputChange("humidity", e.target.value)}
//                       className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="ph" className="block text-sm text-gray-600">Soil pH *</label>
//                     <input
//                       id="ph"
//                       type="number"
//                       step="0.1"
//                       placeholder="6.0-7.0"
//                       value={formData.ph}
//                       onChange={(e) => handleInputChange("ph", e.target.value)}
//                       className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="phosphorus" className="block text-sm text-gray-600">Phosphorus (ppm)</label>
//                     <input
//                       id="phosphorus"
//                       type="number"
//                       placeholder="20-30"
//                       value={formData.phosphorus}
//                       onChange={(e) => handleInputChange("phosphorus", e.target.value)}
//                       className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="nitrogen" className="block text-sm text-gray-600">Nitrogen (ppm)</label>
//                     <input
//                       id="nitrogen"
//                       type="number"
//                       placeholder="200-300"
//                       value={formData.nitrogen}
//                       onChange={(e) => handleInputChange("nitrogen", e.target.value)}
//                       className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="organicContent" className="block text-sm text-gray-600">Organic Content (%)</label>
//                     <input
//                       id="organicContent"
//                       type="number"
//                       step="0.1"
//                       placeholder="2-5"
//                       value={formData.organicContent}
//                       onChange={(e) => handleInputChange("organicContent", e.target.value)}
//                       className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="waterSource" className="block text-sm text-gray-600">Water Source *</label>
//                     <select
//                       id="waterSource"
//                       value={formData.waterSource}
//                       onChange={(e) => handleInputChange("waterSource", e.target.value)}
//                       className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
//                     >
//                       <option value="">Select source</option>
//                       <option value="canal">Canal</option>
//                       <option value="well">Well</option>
//                       <option value="river">River</option>
//                       <option value="rainwater">Rainwater</option>
//                       <option value="bore-well">Bore Well</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Predict Button */}
//             <div>
//               <button
//                 onClick={handlePredict}
//                 disabled={loading}
//                 className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-lg disabled:opacity-60"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
//                       <path d="M12 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       <path d="M12 18v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       <path d="M4.9 4.9l2.8 2.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       <path d="M16.3 16.3l2.8 2.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                     Predicting...
//                   </>
//                 ) : (
//                   "Predict Yield"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         <p className="text-center text-sm text-gray-500">* Required fields</p>
//       </div>
//     </div>
    
//     </>
//   )
// }