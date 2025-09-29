export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
        <div className="w-6 h-6 bg-yellow-400 rounded-full relative">
          <div className="absolute top-1 left-1 w-2 h-2 bg-green-600 rounded-full"></div>
          <div className="absolute top-2 right-1 w-1 h-3 bg-green-600 rounded-full transform rotate-45"></div>
        </div>
      </div>
      <span className="text-xl font-bold text-gray-800">AGRON</span>
    </div>
  )
}
