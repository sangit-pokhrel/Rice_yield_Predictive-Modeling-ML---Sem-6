// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// /**
//  * Login.jsx
//  * Standalone React + Tailwind component for login page.
//  * Uses local image: /mnt/data/a1cc47db-98fc-4c1f-93be-5a4277ba6f4f.png
//  *
//  * Different layout: form on left, image on right with rounded card inset.
//  */

// const IMAGE = "https://images.pexels.com/photos/2882566/pexels-photo-2882566.jpeg";

// export default function LoginPage({ onLogin }) {
//   const [form, setForm] = useState({ email: "", password: "", remember: false });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

//   const submit = (e) => {
//     e.preventDefault();
//     if (!form.email || !form.password) {
//       alert("Enter email and password.");
//       return;
//     }
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       alert("Signed in (demo)");
//       onLogin && onLogin();
//     }, 800);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//       <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Left: compact form card */}
//         <div className="bg-white rounded-2xl shadow-lg p-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-1">Sign In</h2>
//           <p className="text-sm text-gray-500 mb-6">Welcome back — enter your details to continue</p>

//           <form onSubmit={submit} className="space-y-4">
//             <input
//               className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-200"
//               placeholder="Email"
//               value={form.email}
//               onChange={(e) => setField("email", e.target.value)}
//               type="email"
//               required
//             />
//             <div className="relative">
//               <input
//                 className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-200"
//                 placeholder="Password"
//                 type={showPassword ? "text" : "password"}
//                 value={form.password}
//                 onChange={(e) => setField("password", e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((s) => !s)}
//                 className="absolute right-2 top-2 text-sm text-gray-500"
//               >
//                 {showPassword ? "Hide" : "Show"}
//               </button>
//             </div>

//             <div className="flex items-center justify-between text-sm">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={form.remember}
//                   onChange={(e) => setField("remember", e.target.checked)}
//                 />
//                 <span className="text-gray-600">Remember me</span>
//               </label>
//               <a href="/forgot" className="text-blue-600 underline">
//                 Forgot?
//               </a>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 rounded-md bg-amber-400 hover:bg-amber-500 text-white font-semibold"
//             >
//               {loading ? "Signing in..." : "Sign In"}
//             </button>

//             <div className="flex items-center gap-3 mt-2">
//               <div className="flex-1 h-px bg-gray-200" />
//               <div className="text-xs text-gray-400">or</div>
//               <div className="flex-1 h-px bg-gray-200" />
//             </div>

//             <div className="grid grid-cols-2 gap-3 mt-2">
//               <button
//                 type="button"
//                 onClick={() => alert("Google sign-in (demo)")}
//                 className="py-2 rounded-full border flex items-center justify-center gap-2"
//               >
//                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="g" className="w-4 h-4" />
//                 Google
//               </button>
//               <button
//                 type="button"
//                 onClick={() => alert("Facebook sign-in (demo)")}
//                 className="py-2 rounded-full border flex items-center justify-center gap-2"
//               >
//                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiXN9xSEe8unzPBEQOeAKXd9Q55efGHGB9BA&s" alt="fb" className="w-4 h-4" />
//                 Facebook
//               </button>
//             </div>

//             <p className="text-center text-sm text-gray-500 mt-3">
//               New here?{" "}
//               <a href="/register" className="text-blue-600 underline">
//                 Create an account
//               </a>
//             </p>
//           </form>
//            <Link to="/">
//           <button className="flex justify-center text-center m-auto mt-8 text-blue-500 font-bold underline">Back To Home ⟶</button>
//             </Link>
//         </div>

//         {/* Right: image with soft inset card */}
//         <div className="relative">
//           <img src={IMAGE} alt="auth right" className="w-full h-full object-cover rounded-2xl hidden md:block" />

//           {/* overlay card for small excerpt */}
//           <div className="md:absolute md:inset-8 md:rounded-xl md:bg-white md:p-6 md:shadow-lg md:max-w-sm md:right-8 md:top-20">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome back!</h3>
//             <p className="text-sm text-gray-600">Access your dashboard, predictions and more.</p>
//             <ul className="mt-4 space-y-2 text-sm text-gray-700">
//               <li>• View past predictions</li>
//               <li>• Save farm locations</li>
//               <li>• Receive tailored recommendations</li>
//             </ul>
//           </div>
//         </div>

//         {/* Mobile image below */}
//         <div className="md:hidden">
//           <img src={IMAGE} alt="mobile" className="w-full h-48 object-cover rounded-2xl" />
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Login.jsx
 * - Calls POST {BASE_URL}/api/auth/login
 * - Stores token in localStorage under "authToken"
 * - Uses uploaded local image as right-side image
 */

const IMAGE = "/mnt/data/a1cc47db-98fc-4c1f-93be-5a4277ba6f4f.png";

function getBaseUrl() {
  // Works for Vite or CRA
  // Vite: import.meta.env.VITE_API_BASE_URL
  // CRA: process.env.REACT_APP_API_BASE_URL
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
}

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const BASE = getBaseUrl();
      const resp = await axios.post(`${BASE}/api/auth/login`, {
        email: form.email,
        password: form.password,
      });

      // expecting { success: true, token: "...", data: { ... } } or similar
      const token = resp.data?.token || resp.data?.tokens?.accessToken || resp.data?.data?.token;

      if (!token) {
        // fallback: entire resp
        console.warn("Login response:", resp.data);
      }

      // store token
      if (token) {
        if (form.remember) {
          localStorage.setItem("authToken", token);
        } else {
          sessionStorage.setItem("authToken", token);
        }
      }

      // optional: save user info
      const user = resp.data?.data || resp.data?.user || null;
      if (user) {
        try {
          localStorage.setItem("user", JSON.stringify(user));
        } catch (e) { /* ignore */ }
      }

      // callback
      onLogin && onLogin();

      // navigate to home or dashboard
      navigate("/");

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Check credentials or server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: compact form card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Sign In</h2>
          <p className="text-sm text-gray-500 mb-6">Welcome back — enter your details to continue</p>

          <form onSubmit={submit} className="space-y-4">
            {error && <div className="text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}

            <input
              className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-200"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              type="email"
              required
            />
            <div className="relative">
              <input
                className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-200"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-2 text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setField("remember", e.target.checked)}
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot" className="text-blue-600 underline">Forgot?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md bg-amber-400 hover:bg-amber-500 text-white font-semibold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="text-xs text-gray-400">or</div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => alert("Google sign-in (demo)")}
                className="py-2 rounded-full border flex items-center justify-center gap-2"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="g" className="w-4 h-4" />
                Google
              </button>
              <button
                type="button"
                onClick={() => alert("Facebook sign-in (demo)")}
                className="py-2 rounded-full border flex items-center justify-center gap-2"
              >
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiXN9xSEe8unzPBEQOeAKXd9Q55efGHGB9BA&s" alt="fb" className="w-4 h-4" />
                Facebook
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-3">
              New here?{" "}
              <Link to="/register" className="text-blue-600 underline">
                Create an account
              </Link>
            </p>
          </form>

          <Link to="/">
            <button className="flex justify-center text-center m-auto mt-8 text-blue-500 font-bold underline">Back To Home ⟶</button>
          </Link>
        </div>

        {/* Right: image with soft inset card */}
        <div className="relative">
          <img src={IMAGE} alt="auth right" className="w-full h-full object-cover rounded-2xl hidden md:block" />

          {/* overlay card for small excerpt */}
          <div className="md:absolute md:inset-8 md:rounded-xl md:bg-white md:p-6 md:shadow-lg md:max-w-sm md:right-8 md:top-20">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome back!</h3>
            <p className="text-sm text-gray-600">Access your dashboard, predictions and more.</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• View past predictions</li>
              <li>• Save farm locations</li>
              <li>• Receive tailored recommendations</li>
            </ul>
          </div>
        </div>

        {/* Mobile image below */}
        <div className="md:hidden">
          <img src={IMAGE} alt="mobile" className="w-full h-48 object-cover rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
