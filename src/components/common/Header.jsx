import { Search, ShoppingCart, Menu } from "lucide-react"

import Logo from "../../assets/images/logo.png"
import Navigation from "@/components/Home/navigation"
// import { Button } from "../ui/Button"


export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
          <div className="flex items-center justify-between">
            <img src={Logo} alt="Agron Logo" className="w-10 h-10" />
            <Navigation />
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
              {/* <div className="relative">
                <ShoppingCart className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  2
                </span>
              </div> */}
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-extrabold transition-colors duration-300">
                {"Any Doubts ?"} 
              </button>
              <Menu className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 md:hidden" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
