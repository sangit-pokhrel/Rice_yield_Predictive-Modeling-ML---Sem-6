// import { Search, ShoppingCart, Menu } from "lucide-react"

// import Logo from "../../assets/images/logo.png"
// import Navigation from "@/components/Home/navigation"
// import { Link } from "react-router-dom"
// // import { Button } from "../ui/Button"


// export default function Header() {
//   return (
//     <header className="absolute top-0 left-0 right-0 z-50 px-4 py-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
//           <div className="flex items-center justify-between">
//             <img src={Logo} alt="Agron Logo" className="w-10 h-10" />
//             <Navigation />
//             <div className="flex items-center gap-4">
//               <Search className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
//               {/* <div className="relative">
//                 <ShoppingCart className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
//                 <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
//                   2
//                 </span>
//               </div> */}
//               <Link to="/login">
//               <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-extrabold transition-colors duration-300">
//                 {"Login ?"} 
//               </button>
//               </Link>
//               <Menu className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 md:hidden" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }
import React, { useEffect, useRef, useState } from "react";
import { Search, Menu, User as UserIcon, LogOut, Grid } from "lucide-react";
import Navigation from "@/components/Home/navigation";
import { Link, useNavigate } from "react-router-dom";
import LogoImage from "../../assets/images/logo.png"

// use your uploaded logo file path as requested
const Logo = LogoImage;

export default function Header() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // prefer localStorage but check sessionStorage fallback
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    let user = localStorage.getItem("user") || sessionStorage.getItem("user");
    try {
      user = user ? JSON.parse(user) : null;
    } catch (e) {
      user = null;
    }

    setAuth({ token, user });
  }, []);

  useEffect(() => {
    // close dropdown on outside click
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleLogout = () => {
    // remove tokens & user (both local and session)
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");

    setAuth({ token: null, user: null });
    setOpen(false);

    // optionally redirect to home or login
    navigate("/");
  };

  const userInitials = (user) => {
    if (!user) return "";
    const name = user.fullName || user.name || "";
    const parts = name.trim().split(" ");
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src={Logo} alt="SmartYeild Logo" className="w-10 h-10 object-cover rounded-full" />
              <span className="font-bold text-gray-800 hidden sm:inline">SmartYeild</span>
            </Link>

            {/* Navigation (hidden on very small screens if your Navigation handles responsiveness) */}
            <div className="hidden md:flex md:items-center md:gap-6">
              <Navigation />
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />

              {/* If logged in show profile, else show Login button */}
              {auth.token ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setOpen((s) => !s)}
                    className="flex items-center gap-2 border border-gray-200 px-3 py-1 rounded-full hover:shadow-sm transition"
                    aria-haspopup="true"
                    aria-expanded={open}
                    aria-label="Open profile menu"
                  >
                    {auth.user && auth.user.avatar ? (
                      <img
                        src="https://images.pexels.com/photos/3735580/pexels-photo-3735580.jpeg"
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-medium">
                        {userInitials(auth.user)}
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm font-medium text-gray-700">
                      {auth.user?.fullName ? auth.user.fullName.split(" ")[0] : "Profile"}
                    </span>
                  </button>

                  {/* Dropdown */}
                  {open && (
                    <div className="absolute right-0 mt-3 w-44 bg-white border rounded-lg shadow-lg py-2 z-50">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                        onClick={() => setOpen(false)}
                      >
                        <Grid className="w-4 h-4" />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-extrabold transition-colors duration-300">
                      Login
                    </button>
                  </Link>
                </>
              )}

              <Menu className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 md:hidden" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
