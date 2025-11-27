"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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

export default function PredictionResults({ formData }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
          <Leaf className="w-4 h-4" />
          Prediction Results
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Your Rice Yield Prediction</h1>
        <p className="text-lg text-gray-600">
          Based on {formData.region} • {formData.location} • {formData.riceType}
        </p>
      </div>

      {/* Input Summary Card */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <MapPin className="w-5 h-5" />
            Your Farm Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Land Area</p>
              <p className="font-semibold">
                {formData.landArea} {formData.landUnit}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Region</p>
              <p className="font-semibold">{formData.region}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold">{formData.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rice Variety</p>
              <p className="font-semibold">{formData.riceType}</p>
            </div>
            {formData.waterSource && (
              <div>
                <p className="text-sm text-gray-600">Water Source</p>
                <p className="font-semibold">{formData.waterSource}</p>
              </div>
            )}
            {formData.latitude && formData.longitude && (
              <div>
                <p className="text-sm text-gray-600">Geolocation</p>
                <p className="font-semibold text-xs">
                  {formData.latitude.toFixed(4)}°, {formData.longitude.toFixed(4)}°
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Prediction Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700">AI Prediction Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">6.8 tons</div>
              <div className="text-sm text-gray-600">Expected Total Yield</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2.72 tons/bigha</div>
              <div className="text-sm text-gray-600">Yield per Bigha</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">NPR 2,04,000</div>
              <div className="text-sm text-gray-600">Estimated Revenue</div>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-green-700">Recommendations:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Plant during Jestha 10-25 for optimal yield</li>
              <li>• Consider soil pH adjustment to reach 6.5</li>
              <li>• Monitor rainfall - supplemental irrigation may be needed</li>
              <li>• {formData.riceType} variety is well-suited for your location</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-orange-600" />
            Environmental Conditions
          </CardTitle>
          <CardDescription>Current vs optimal conditions for rice cultivation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weatherData.map((item) => (
              <div key={item.factor} className="space-y-3">
                <div className="flex items-center gap-2">
                  {item.factor === "Rainfall" && <Droplets className="w-4 h-4 text-blue-600" />}
                  {item.factor === "Temperature" && <Thermometer className="w-4 h-4 text-orange-600" />}
                  {item.factor === "Humidity" && <Droplets className="w-4 h-4 text-blue-600" />}
                  {item.factor === "Soil pH" && <Beaker className="w-4 h-4 text-purple-600" />}
                  <span className="text-sm font-medium">{item.factor}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Current</span>
                    <span className="text-lg font-bold">
                      {item.current}
                      {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Optimal</span>
                    <span className="text-sm text-green-600">
                      {item.optimal}
                      {item.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Yield Prediction by Month
            </CardTitle>
            <CardDescription>Expected rice yield throughout the growing season</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yieldPredictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="yield" fill="#16a34a" name="Predicted Yield" />
                <Bar dataKey="optimal" fill="#0ea5e9" name="Optimal Yield" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="w-5 h-5 text-purple-600" />
              Soil Composition
            </CardTitle>
            <CardDescription>Current soil analysis</CardDescription>
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
            <Calendar className="w-5 h-5 text-amber-600" />
            Optimal Planting Schedule
          </CardTitle>
          <CardDescription>Recommended timeline for maximum yield</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plantingSchedule.map((activity) => (
              <div key={activity.activity} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200">
                <div className="flex-shrink-0">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      activity.status === "completed"
                        ? "bg-green-600"
                        : activity.status === "current"
                          ? "bg-blue-600"
                          : "bg-gray-300"
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
                  <p className="text-sm text-gray-600 mt-1">{activity.period}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
