// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"
// import { Calendar, MapPin, Droplets, Thermometer, Beaker, TrendingUp, Leaf } from "lucide-react"

// // Dummy data for Deukhuri region
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

// const weatherData = [
//   { factor: "Rainfall", current: 1250, optimal: 1400, unit: "mm" },
//   { factor: "Temperature", current: 28, optimal: 26, unit: "°C" },
//   { factor: "Humidity", current: 75, optimal: 80, unit: "%" },
//   { factor: "Soil pH", current: 6.2, optimal: 6.5, unit: "" },
// ]

// const plantingSchedule = [
//   { activity: "Land Preparation", period: "Chaitra 15 - Baisakh 15", status: "completed" },
//   { activity: "Seed Sowing", period: "Baisakh 20 - Jestha 5", status: "current" },
//   { activity: "Transplanting", period: "Jestha 10 - Jestha 25", status: "upcoming" },
//   { activity: "Harvesting", period: "Kartik 1 - Kartik 30", status: "upcoming" },
// ]

// export default function RicePredictionDashboard() {
//   const [location, setLocation] = useState("Deukhuri-3, Dang")
//   const [landSize, setLandSize] = useState("2.5")
//   const [riceVariety, setRiceVariety] = useState("Sabitri")

//   return (
//     <div className="container mx-auto px-4 py-8 space-y-8">
//       {/* Header Section */}
//       <div className="text-center space-y-4">
//         <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
//           <Leaf className="w-4 h-4" />
//           Smart Agriculture for Deukhuri
//         </div>
//         <h1 className="text-4xl font-bold text-foreground">Rice Yield Prediction</h1>
//         <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//           AI-powered predictions for small-scale farmers in Deukhuri region. Get insights on optimal planting times,
//           expected yields, and farming recommendations.
//         </p>
//       </div>

//       {/* Input Form */}
//       <Card className="border-2 border-primary/20">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <MapPin className="w-5 h-5 text-primary" />
//             Farm Information
//           </CardTitle>
//           <CardDescription>Enter your farm details to get personalized predictions</CardDescription>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="space-y-2">
//             <Label htmlFor="location">Location</Label>
//             <Select value={location} onValueChange={setLocation}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Deukhuri-1, Dang">Deukhuri-1, Dang</SelectItem>
//                 <SelectItem value="Deukhuri-2, Dang">Deukhuri-2, Dang</SelectItem>
//                 <SelectItem value="Deukhuri-3, Dang">Deukhuri-3, Dang</SelectItem>
//                 <SelectItem value="Deukhuri-4, Dang">Deukhuri-4, Dang</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="landSize">Land Size (Bigha)</Label>
//             <Input
//               id="landSize"
//               value={landSize}
//               onChange={(e) => setLandSize(e.target.value)}
//               placeholder="Enter land size"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="variety">Rice Variety</Label>
//             <Select value={riceVariety} onValueChange={setRiceVariety}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Sabitri">Sabitri</SelectItem>
//                 <SelectItem value="Radha-4">Radha-4</SelectItem>
//                 <SelectItem value="Hardinath-1">Hardinath-1</SelectItem>
//                 <SelectItem value="Mansuli">Mansuli</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Prediction Results */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="w-5 h-5 text-primary" />
//               Yield Prediction by Month
//             </CardTitle>
//             <CardDescription>Expected rice yield (tons/bigha) throughout the growing season</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={yieldPredictionData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="yield" fill="var(--color-chart-1)" name="Predicted Yield" />
//                 <Bar dataKey="optimal" fill="var(--color-chart-4)" name="Optimal Yield" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Beaker className="w-5 h-5 text-secondary" />
//               Soil Composition
//             </CardTitle>
//             <CardDescription>Current soil analysis for your location</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie data={soilComposition} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
//                   {soilComposition.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
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
//           </CardContent>
//         </Card>
//       </div>

//       {/* Environmental Factors */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Thermometer className="w-5 h-5 text-chart-3" />
//             Environmental Conditions
//           </CardTitle>
//           <CardDescription>Current vs optimal conditions for rice cultivation</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {weatherData.map((item) => (
//               <div key={item.factor} className="space-y-3">
//                 <div className="flex items-center gap-2">
//                   {item.factor === "Rainfall" && <Droplets className="w-4 h-4 text-chart-3" />}
//                   {item.factor === "Temperature" && <Thermometer className="w-4 h-4 text-secondary" />}
//                   {item.factor === "Humidity" && <Droplets className="w-4 h-4 text-chart-3" />}
//                   {item.factor === "Soil pH" && <Beaker className="w-4 h-4 text-chart-5" />}
//                   <span className="text-sm font-medium">{item.factor}</span>
//                 </div>
//                 <div className="space-y-1">
//                   <div className="flex justify-between items-center">
//                     <span className="text-xs text-muted-foreground">Current</span>
//                     <span className="text-lg font-bold">
//                       {item.current}
//                       {item.unit}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-xs text-muted-foreground">Optimal</span>
//                     <span className="text-sm text-primary">
//                       {item.optimal}
//                       {item.unit}
//                     </span>
//                   </div>
//                   <div className="w-full bg-muted rounded-full h-2">
//                     <div
//                       className="bg-primary h-2 rounded-full transition-all duration-300"
//                       style={{
//                         width: `${Math.min((item.current / item.optimal) * 100, 100)}%`,
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Planting Schedule */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Calendar className="w-5 h-5 text-accent" />
//             Optimal Planting Schedule
//           </CardTitle>
//           <CardDescription>Recommended timeline for maximum yield in Deukhuri region</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {plantingSchedule.map((activity, index) => (
//               <div key={activity.activity} className="flex items-center gap-4 p-4 rounded-lg border">
//                 <div className="flex-shrink-0">
//                   <div
//                     className={`w-3 h-3 rounded-full ${
//                       activity.status === "completed"
//                         ? "bg-primary"
//                         : activity.status === "current"
//                           ? "bg-secondary"
//                           : "bg-muted"
//                     }`}
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex items-center justify-between">
//                     <h4 className="font-medium">{activity.activity}</h4>
//                     <Badge
//                       variant={
//                         activity.status === "completed"
//                           ? "default"
//                           : activity.status === "current"
//                             ? "secondary"
//                             : "outline"
//                       }
//                     >
//                       {activity.status}
//                     </Badge>
//                   </div>
//                   <p className="text-sm text-muted-foreground mt-1">{activity.period}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Prediction Summary */}
//       <Card className="bg-primary/5 border-primary/20">
//         <CardHeader>
//           <CardTitle className="text-primary">AI Prediction Summary</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="text-center">
//               <div className="text-3xl font-bold text-primary">6.8 tons</div>
//               <div className="text-sm text-muted-foreground">Expected Total Yield</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-secondary">2.72 tons/bigha</div>
//               <div className="text-sm text-muted-foreground">Yield per Bigha</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-accent">NPR 2,04,000</div>
//               <div className="text-sm text-muted-foreground">Estimated Revenue</div>
//             </div>
//           </div>
//           <Separator />
//           <div className="space-y-2">
//             <h4 className="font-medium text-primary">Recommendations:</h4>
//             <ul className="space-y-1 text-sm text-muted-foreground">
//               <li>• Plant during Jestha 10-25 for optimal yield</li>
//               <li>• Consider soil pH adjustment to reach 6.5</li>
//               <li>• Monitor rainfall - supplemental irrigation may be needed</li>
//               <li>• Sabitri variety is well-suited for your location</li>
//             </ul>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Calendar, MapPin, Droplets, Thermometer, Beaker, TrendingUp, Leaf } from "lucide-react"

// Dummy data for Deukhuri region
const yieldPredictionData = [
  { month: "Chaitra", yield: 4.2, optimal: 4.8 },
  { month: "Baisakh", yield: 5.1, optimal: 5.5 },
  { month: "Jestha", yield: 5.8, optimal: 6.2 },
  { month: "Ashadh", yield: 6.5, optimal: 7.0 },
  { month: "Shrawan", yield: 7.2, optimal: 7.8 },
  { month: "Bhadra", yield: 6.8, optimal: 7.4 },
]

const soilComposition = [
  { name: "Clay", value: 35, color: "#8B4513" },
  { name: "Silt", value: 40, color: "#D2691E" },
  { name: "Sand", value: 25, color: "#F4A460" },
]

const weatherData = [
  { factor: "Rainfall", current: 1250, optimal: 1400, unit: "mm" },
  { factor: "Temperature", current: 28, optimal: 26, unit: "°C" },
  { factor: "Humidity", current: 75, optimal: 80, unit: "%" },
  { factor: "Soil pH", current: 6.2, optimal: 6.5, unit: "" },
]

const plantingSchedule = [
  { activity: "Land Preparation", period: "Chaitra 15 - Baisakh 15", status: "completed" },
  { activity: "Seed Sowing", period: "Baisakh 20 - Jestha 5", status: "current" },
  { activity: "Transplanting", period: "Jestha 10 - Jestha 25", status: "upcoming" },
  { activity: "Harvesting", period: "Kartik 1 - Kartik 30", status: "upcoming" },
]

export default function RicePredictionDashboard() {
  const [location, setLocation] = useState("Deukhuri-3, Dang")
  const [landSize, setLandSize] = useState("2.5")
  const [riceVariety, setRiceVariety] = useState("Sabitri")

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-8 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <Leaf className="w-4 h-4" />
          Smart Agriculture for Deukhuri
        </div>
        <h1 className="text-4xl font-bold text-foreground mt-4">Rice Yield Prediction</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          AI-powered predictions for small-scale farmers in Deukhuri region. Get insights on optimal planting times,
          expected yields, and farming recommendations.
        </p>
      </div>

      {/* Input Form */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Farm Information
          </CardTitle>
          <CardDescription>Enter your farm details to get personalized predictions</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Deukhuri-1, Dang">Deukhuri-1, Dang</SelectItem>
                <SelectItem value="Deukhuri-2, Dang">Deukhuri-2, Dang</SelectItem>
                <SelectItem value="Deukhuri-3, Dang">Deukhuri-3, Dang</SelectItem>
                <SelectItem value="Deukhuri-4, Dang">Deukhuri-4, Dang</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="landSize">Land Size (Bigha)</Label>
            <Input
              id="landSize"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
              placeholder="Enter land size"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="variety">Rice Variety</Label>
            <Select value={riceVariety} onValueChange={setRiceVariety}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sabitri">Sabitri</SelectItem>
                <SelectItem value="Radha-4">Radha-4</SelectItem>
                <SelectItem value="Hardinath-1">Hardinath-1</SelectItem>
                <SelectItem value="Mansuli">Mansuli</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">AI Prediction Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">6.8 tons</div>
              <div className="text-sm text-muted-foreground">Expected Total Yield</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">2.72 tons/bigha</div>
              <div className="text-sm text-muted-foreground">Yield per Bigha</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">NPR 2,04,000</div>
              <div className="text-sm text-muted-foreground">Estimated Revenue</div>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-primary">Recommendations:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Plant during Jestha 10-25 for optimal yield</li>
              <li>• Consider soil pH adjustment to reach 6.5</li>
              <li>• Monitor rainfall - supplemental irrigation may be needed</li>
              <li>• Sabitri variety is well-suited for your location</li>
            </ul>
          </div>
        </CardContent>
      </Card>

       {/* Environmental Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-chart-3" />
            Environmental Conditions
          </CardTitle>
          <CardDescription>Current vs optimal conditions for rice cultivation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weatherData.map((item) => (
              <div key={item.factor} className="space-y-3">
                <div className="flex items-center gap-2">
                  {item.factor === "Rainfall" && <Droplets className="w-4 h-4 text-chart-3" />}
                  {item.factor === "Temperature" && <Thermometer className="w-4 h-4 text-secondary" />}
                  {item.factor === "Humidity" && <Droplets className="w-4 h-4 text-chart-3" />}
                  {item.factor === "Soil pH" && <Beaker className="w-4 h-4 text-chart-5" />}
                  <span className="text-sm font-medium">{item.factor}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Current</span>
                    <span className="text-lg font-bold">
                      {item.current}
                      {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Optimal</span>
                    <span className="text-sm text-primary">
                      {item.optimal}
                      {item.unit}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((item.current / item.optimal) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


      {/* Prediction Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Yield Prediction by Month
            </CardTitle>
            <CardDescription>Expected rice yield (tons/bigha) throughout the growing season</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yieldPredictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="yield" fill="var(--color-chart-1)" name="Predicted Yield" />
                <Bar dataKey="optimal" fill="var(--color-chart-4)" name="Optimal Yield" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="w-5 h-5 text-secondary" />
              Soil Composition
            </CardTitle>
            <CardDescription>Current soil analysis for your location</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={soilComposition} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                  {soilComposition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {soilComposition.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

     
      {/* Planting Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            Optimal Planting Schedule
          </CardTitle>
          <CardDescription>Recommended timeline for maximum yield in Deukhuri region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plantingSchedule.map((activity, index) => (
              <div key={activity.activity} className="flex items-center gap-4 p-4 rounded-lg border">
                <div className="flex-shrink-0">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      activity.status === "completed"
                        ? "bg-primary"
                        : activity.status === "current"
                          ? "bg-secondary"
                          : "bg-muted"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{activity.activity}</h4>
                    <Badge
                      variant={
                        activity.status === "completed"
                          ? "default"
                          : activity.status === "current"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.period}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prediction Summary */}
      
    </div>
  )
}
