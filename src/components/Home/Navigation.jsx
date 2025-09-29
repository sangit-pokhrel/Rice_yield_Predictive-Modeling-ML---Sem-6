import { ChevronDown } from "lucide-react"

export default function Navigation() {
  const navItems = [
    { label: "Home", hasDropdown: false },
    { label: "About", hasDropdown: false },
    { label: "Crop Yeild Predictor", hasDropdown: false },
    { label: "Shop", hasDropdown: false  },
    { label: "Contact", hasDropdown: false  },
  ]

  return (
    <nav className="hidden md:flex items-center gap-8">
      {navItems.map((item) => (
        <div key={item.label} className="flex items-center gap-1 cursor-pointer group">
          <span
            className={`font-large ${
              item.label === "Crop Yeild Predictor"
                ? "text-orange-500 hover:text-green-600 font-bold bg-yellow-200 p-2  rounded-full"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            {item.label}
          </span>
          {item.hasDropdown && (
            <ChevronDown
              className={`w-4 h-4 ${
                item.label === "Crop Yeild Predictor"
                  ? "text-yellow-500 group-hover:text-green-600"
                  : "text-gray-500 group-hover:text-gray-700"
              }`}
            />
          )}
        </div>
      ))}
    </nav>
  )
}
