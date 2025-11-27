"use client"

import { Cloud, CloudRain, Sun } from "lucide-react"

export default function WeatherCard({ data, onClick, isSelected }) {
  const getWeatherIcon = () => {
    if (data.rainfall > 10) return <CloudRain className="w-8 h-8 text-blue-500" />
    if (data.rainfall > 0) return <Cloud className="w-8 h-8 text-gray-500" />
    return <Sun className="w-8 h-8 text-yellow-500" />
  }

  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg transition border-2 text-center ${
        isSelected
          ? "bg-green-100 border-green-500 shadow-lg"
          : "bg-white border-gray-200 hover:border-green-300 shadow"
      }`}
    >
      {getWeatherIcon()}
      <p className="text-xs font-semibold text-gray-900 mt-2">{data.day}</p>
      <p className="text-xs text-gray-600">{data.rainfall}mm</p>
      <div className="bg-gray-200 rounded-full h-1 mt-2">
        <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${data.chance}%` }}></div>
      </div>
    </button>
  )
}
