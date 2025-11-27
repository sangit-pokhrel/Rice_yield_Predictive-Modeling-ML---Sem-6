// import React, { useEffect, useState } from "react"
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"
// import { ArrowLeft, TrendingUp, Beaker, Calendar, MapPin } from "lucide-react"

// /**
//  * ResultsPage.jsx
//  *
//  * Plain React + Tailwind (JSX)
//  * - Reads form data from sessionStorage ("riceFormData")
//  * - Recharts charts for yield & soil composition
//  * - Replace UI primitives with plain HTML/Tailwind
//  *
//  * Local uploaded image you provided:
//  * IMAGE_URL = "/mnt/data/e7f0d612-a73d-4824-8602-3340f5692563.png"
//  */

// const IMAGE_URL = "/mnt/data/e7f0d612-a73d-4824-8602-3340f5692563.png"

// const yieldPredictionData = [
//   { month: "Chaitra", yield: 4.2, optimal: 4.8 },
//   { month: "Baisakh", yield: 5.1, optimal: 5.5 },
//   { month: "Jestha", yield: 5.8, optimal: 6.2 },
//   { month: "Ashadh", yield: 6.5, optimal: 7.0 },
//   { month: "Shrawan", yield: 7.2, optimal: 7.8 },
//   { month: "Bhadra", yield: 6.8, optimal: 7.4 },
// ]

// const soilComposition = [
//   { name: "Clay", value: 35, color: "#8B4513" },
//   { name: "Silt", value: 40, color: "#D2691E" },
//   { name: "Sand", value: 25, color: "#F4A460" },
// ]

// const plantingSchedule = [
//   { activity: "Land Preparation", period: "Chaitra 15 - Baisakh 15", status: "completed" },
//   { activity: "Seed Sowing", period: "Baisakh 20 - Jestha 5", status: "current" },
//   { activity: "Transplanting", period: "Jestha 10 - Jestha 25", status: "upcoming" },
//   { activity: "Harvesting", period: "Kartik 1 - Kartik 30", status: "upcoming" },
// ]

// export default function ResultsPage() {
//   const [formData, setFormData] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const raw = sessionStorage.getItem("riceFormData")
//     if (raw) {
//       try {
//         setFormData(JSON.parse(raw))
//       } catch (err) {
//         console.warn("Failed to parse riceFormData:", err)
//         setFormData(null)
//       }
//     }
//     setLoading(false)
//   }, [])

//   const goBack = () => {
//     // naive navigation back to root form — adjust if your app uses routing
//     window.location.href = "/"
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
//         <div className="text-gray-600">Loading results...</div>
//       </div>
//     )
//   }

//   if (!formData) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-green-50 to-blue-50 p-6">
//         <p className="text-gray-700">No form data found. Please fill the form first.</p>
//         <div className="flex gap-3">
//           <button
//             onClick={() => (window.location.href = "/")}
//             className="px-4 py-2 rounded-md bg-green-600 text-white"
//           >
//             Back to Form
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center gap-4 mb-6">
//           <button
//             onClick={goBack}
//             className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-white shadow-sm"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Form
//           </button>

//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Prediction Results</h1>
//             <p className="text-gray-600">Your personalized rice yield analysis</p>
//           </div>
//         </div>

//         {/* Farm Summary Card */}
//         <section className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-6">
//           <div className="flex items-start justify-between gap-6">
//             <div>
//               <h2 className="flex items-center gap-2 text-lg font-semibold text-green-700">
//                 <MapPin className="w-5 h-5 text-green-700" />
//                 Your Farm Details
//               </h2>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//                 <div>
//                   <p className="text-sm text-gray-600">Land Area</p>
//                   <p className="text-lg font-semibold">
//                     {formData.landArea} {formData.areaUnit}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Region</p>
//                   <p className="text-lg font-semibold capitalize">{formData.region}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Rice Type</p>
//                   <p className="text-lg font-semibold capitalize">{formData.riceType}</p>
//                 </div>
//                 {formData.location && (
//                   <div>
//                     <p className="text-sm text-gray-600">Location</p>
//                     <p className="text-lg font-semibold">{formData.location}</p>
//                   </div>
//                 )}
//               </div>

//               {formData.latitude && formData.longitude && (
//                 <p className="text-xs text-gray-500 mt-4">
//                   📍 GPS: {formData.latitude}, {formData.longitude}
//                 </p>
//               )}
//             </div>

//             {/* optional image / visual */}
//             <div className="hidden lg:block w-40 h-24 rounded-md overflow-hidden">
//               <img src={IMAGE_URL} alt="farm" className="w-full h-full object-cover" />
//             </div>
//           </div>
//         </section>

//         {/* Prediction Summary */}
//         <section className="rounded-2xl overflow-hidden bg-gradient-to-br from-green-500 to-blue-500 text-white p-6">
//           <h3 className="sr-only">AI Prediction Summary</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="text-center">
//               <div className="text-4xl font-bold">6.8 tons</div>
//               <div className="text-sm opacity-90">Expected Total Yield</div>
//             </div>
//             <div className="text-center">
//               <div className="text-4xl font-bold">2.72 tons/{formData.areaUnit}</div>
//               <div className="text-sm opacity-90">Yield per Unit</div>
//             </div>
//             <div className="text-center">
//               <div className="text-4xl font-bold">₨ 2,04,000</div>
//               <div className="text-sm opacity-90">Estimated Revenue</div>
//             </div>
//           </div>
//         </section>

//         {/* Recommendations */}
//         <section className="rounded-2xl bg-white border p-6">
//           <h4 className="text-green-700 text-lg font-semibold">Recommendations</h4>
//           <ul className="mt-4 space-y-2">
//             <li className="flex items-start gap-2">
//               <span className="text-green-600 font-bold">✓</span>
//               <span>Plant during Jestha 10-25 for optimal yield</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-green-600 font-bold">✓</span>
//               <span>Consider soil pH adjustment to reach 6.5</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-green-600 font-bold">✓</span>
//               <span>Monitor rainfall - supplemental irrigation may be needed</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-green-600 font-bold">✓</span>
//               <span className="capitalize">{formData.riceType} variety is well-suited for your location</span>
//             </li>
//           </ul>
//         </section>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <section className="rounded-2xl bg-white border p-4 lg:col-span-2">
//             <div className="flex items-center justify-between mb-3">
//               <h5 className="flex items-center gap-2 text-lg font-medium">
//                 <TrendingUp className="w-5 h-5 text-green-600" /> Yield Prediction by Month
//               </h5>
//               <span className="text-sm text-gray-500">Expected yield throughout season</span>
//             </div>

//             <div style={{ width: "100%", height: 300 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={yieldPredictionData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="yield" fill="#10b981" name="Predicted Yield" />
//                   <Bar dataKey="optimal" fill="#3b82f6" name="Optimal Yield" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </section>

//           <section className="rounded-2xl bg-white border p-4">
//             <div className="flex items-center justify-between mb-3">
//               <h5 className="flex items-center gap-2 text-lg font-medium">
//                 <Beaker className="w-5 h-5 text-blue-600" /> Soil Composition
//               </h5>
//               <span className="text-sm text-gray-500">Current soil analysis</span>
//             </div>

//             <div style={{ width: "100%", height: 200 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie data={soilComposition} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
//                     {soilComposition.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="mt-4 space-y-2">
//               {soilComposition.map((item) => (
//                 <div key={item.name} className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
//                     <span className="text-sm">{item.name}</span>
//                   </div>
//                   <span className="text-sm font-medium">{item.value}%</span>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>

//         {/* Planting Schedule */}
//         <section className="rounded-2xl bg-white border p-6">
//           <div className="flex items-center justify-between mb-3">
//             <h5 className="flex items-center gap-2 text-lg font-medium">
//               <Calendar className="w-5 h-5 text-amber-600" /> Optimal Planting Schedule
//             </h5>
//             <span className="text-sm text-gray-500">Recommended timeline</span>
//           </div>

//           <div className="space-y-3">
//             {plantingSchedule.map((activity) => (
//               <div key={activity.activity} className="flex items-center gap-4 p-3 rounded-lg border">
//                 <div className="flex-shrink-0">
//                   <div
//                     className={`w-3 h-3 rounded-full ${
//                       activity.status === "completed"
//                         ? "bg-green-600"
//                         : activity.status === "current"
//                         ? "bg-blue-600"
//                         : "bg-gray-300"
//                     }`}
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex items-center justify-between">
//                     <h4 className="font-medium">{activity.activity}</h4>
//                     <span
//                       className={`px-2 py-1 text-xs rounded ${
//                         activity.status === "completed"
//                           ? "bg-green-100 text-green-800"
//                           : activity.status === "current"
//                           ? "bg-blue-100 text-blue-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {activity.status}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600 mt-1">{activity.period}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Advanced Data Display */}
//         {(formData.humidity || formData.ph || formData.phosphorus || formData.nitrogen || formData.organicContent || formData.waterSource) && (
//           <section className="rounded-2xl bg-white border p-6">
//             <h4 className="text-lg font-medium mb-4">Advanced Soil & Environmental Data</h4>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//               {formData.humidity && (
//                 <div>
//                   <p className="text-sm text-gray-600">Humidity</p>
//                   <p className="text-2xl font-bold text-blue-600">{formData.humidity}%</p>
//                 </div>
//               )}
//               {formData.ph && (
//                 <div>
//                   <p className="text-sm text-gray-600">Soil pH</p>
//                   <p className="text-2xl font-bold text-green-600">{formData.ph}</p>
//                 </div>
//               )}
//               {formData.phosphorus && (
//                 <div>
//                   <p className="text-sm text-gray-600">Phosphorus</p>
//                   <p className="text-2xl font-bold text-orange-600">{formData.phosphorus} ppm</p>
//                 </div>
//               )}
//               {formData.nitrogen && (
//                 <div>
//                   <p className="text-sm text-gray-600">Nitrogen</p>
//                   <p className="text-2xl font-bold text-yellow-600">{formData.nitrogen} ppm</p>
//                 </div>
//               )}
//               {formData.organicContent && (
//                 <div>
//                   <p className="text-sm text-gray-600">Organic Content</p>
//                   <p className="text-2xl font-bold text-amber-600">{formData.organicContent}%</p>
//                 </div>
//               )}
//               {formData.waterSource && (
//                 <div>
//                   <p className="text-sm text-gray-600">Water Source</p>
//                   <p className="text-lg font-bold text-cyan-600 capitalize">{formData.waterSource}</p>
//                 </div>
//               )}
//             </div>
//           </section>
//         )}

//         {/* Action Buttons */}
//         <div className="flex gap-4 justify-center">
//           <button onClick={goBack} className="px-8 py-2 rounded-md bg-green-600 text-white">
//             Modify Inputs
//           </button>
//           <button onClick={() => window.print()} className="px-8 py-2 rounded-md border bg-white">
//             Print Report
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }