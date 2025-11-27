// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// /**
//  * Register.jsx
//  * Standalone React + Tailwind component for registration page.
//  * Uses local image: /mnt/data/a1cc47db-98fc-4c1f-93be-5a4277ba6f4f.png
//  */

// const IMAGE = "https://images.pexels.com/photos/210588/pexels-photo-210588.jpeg";

// export default function RegisterPage({ onSuccess }) {
//   const [form, setForm] = useState({
//     fullName: "",
//     phone: "",
//     email: "",
//     password: "",
//     agree: false,
//   });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

//   const submit = (e) => {
//     e.preventDefault();
//     if (!form.fullName || !form.email || !form.password) {
//       alert("Please complete required fields.");
//       return;
//     }
//     if (!form.agree) {
//       alert("Please agree to terms.");
//       return;
//     }
//     setLoading(true);
//     // demo: simulate API call
//     setTimeout(() => {
//       setLoading(false);
//       alert("Account created (demo)");
//       onSuccess && onSuccess();
//     }, 900);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//       <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl shadow-xl overflow-hidden">
//         {/* Left: visual */}
//         <div className="hidden md:block">
//           <img src={IMAGE} alt="register" className="w-full h-full object-cover" />
//         </div>

//         {/* Right: form */}
//         <div className="p-8 md:p-10">
//           <h2 className="text-2xl font-bold text-gray-800 mb-1">Create an account</h2>
//           <p className="text-sm text-gray-500 mb-6">
//             Join now — it's fast and easy. We will never share your details.
//           </p>

//           <form onSubmit={submit} className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <input
//                 className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-200"
//                 placeholder="Full name"
//                 value={form.fullName}
//                 onChange={(e) => setField("fullName", e.target.value)}
//                 required
//               />
//               <input
//                 className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-200"
//                 placeholder="Phone (optional)"
//                 value={form.phone}
//                 onChange={(e) => setField("phone", e.target.value)}
//               />
//             </div>

//             <input
//               className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-200"
//               placeholder="Email address"
//               type="email"
//               value={form.email}
//               onChange={(e) => setField("email", e.target.value)}
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

//             <label className="flex items-start gap-2 text-sm">
//               <input
//                 type="checkbox"
//                 checked={form.agree}
//                 onChange={(e) => setField("agree", e.target.checked)}
//                 className="mt-1"
//               />
//               <span className="text-gray-600">
//                 I agree to the <span className="text-blue-600 underline">Terms & Conditions</span>
//               </span>
//             </label>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 rounded-md bg-amber-400 hover:bg-amber-500 text-white font-semibold"
//             >
//               {loading ? "Creating account..." : "Register Now"}
//             </button>

//             <div className="flex items-center gap-3 mt-2">
//               <div className="flex-1 h-px bg-gray-200" />
//               <div className="text-xs text-gray-400">or</div>
//               <div className="flex-1 h-px bg-gray-200" />
//             </div>

//             <div className="grid grid-cols-2 gap-3 mt-2">
//               <button
//                 type="button"
//                 onClick={() => alert("Google OAuth (demo)")}
//                 className="py-2 rounded-full border flex items-center justify-center gap-2"
//               >
//                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="g" className="w-4 h-4" />
//                 Google
//               </button>
//               <button
//                 type="button"
//                 onClick={() => alert("Facebook OAuth (demo)")}
//                 className="py-2 rounded-full border flex items-center justify-center gap-2"
//               >
//                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiXN9xSEe8unzPBEQOeAKXd9Q55efGHGB9BA&s" alt="fb" className="w-4 h-4" />
//                 Facebook
//               </button>
//             </div>

//             <p className="text-center text-sm text-gray-500 mt-3">
//               Already have an account?{" "}
//               <a href="/login" className="text-blue-600 underline">
//                 Sign in
//               </a>
//             </p>
//           </form>
//           <Link to="/">
//           <button className="flex justify-center text-center m-auto mt-8 text-blue-500 font-bold underline">Back To Home ⟶</button>
//             </Link>
//         </div>

//         {/* Mobile image under form */}
//         <div className="md:hidden">
//           <img src={IMAGE} alt="auth" className="w-full h-56 object-cover" />
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Register.jsx
 * - Calls POST {BASE_URL}/api/auth/register
 * - On success stores token and redirects (or calls onSuccess)
 */

const IMAGE = "https://images.pexels.com/photos/210588/pexels-photo-210588.jpeg";

function getBaseUrl() {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
}

export default function RegisterPage({ onSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.email || !form.password) {
      setError("Please complete required fields.");
      return;
    }
    if (!form.agree) {
      setError("Please agree to terms.");
      return;
    }

    setLoading(true);
    try {
      const BASE = getBaseUrl();
      const resp = await axios.post(`${BASE}/api/auth/register`, {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      });

      const token = resp.data?.token || resp.data?.tokens?.accessToken || resp.data?.data?.token;

      if (token) {
        localStorage.setItem("authToken", token);
      }

      const user = resp.data?.data || resp.data?.user || null;
      if (user) localStorage.setItem("user", JSON.stringify(user));

      onSuccess && onSuccess();
      navigate("/login");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left: visual */}
        <div className="hidden md:block">
          <img src={IMAGE} alt="register" className="w-full h-full object-cover" />
        </div>

        {/* Right: form */}
        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Create an account</h2>
          <p className="text-sm text-gray-500 mb-6">
            Join now — it's fast and easy. We will never share your details.
          </p>

          <form onSubmit={submit} className="space-y-4">
            {error && <div className="text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-200"
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                required
              />
              <input
                className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-200"
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
            </div>

            <input
              className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-200"
              placeholder="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
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

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => setField("agree", e.target.checked)}
                className="mt-1"
              />
              <span className="text-gray-600">
                I agree to the <span className="text-blue-600 underline">Terms & Conditions</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md bg-amber-400 hover:bg-amber-500 text-white font-semibold"
            >
              {loading ? "Creating account..." : "Register Now"}
            </button>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="text-xs text-gray-400">or</div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => alert("Google OAuth (demo)")}
                className="py-2 rounded-full border flex items-center justify-center gap-2"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="g" className="w-4 h-4" />
                Google
              </button>
              <button
                type="button"
                onClick={() => alert("Facebook OAuth (demo)")}
                className="py-2 rounded-full border flex items-center justify-center gap-2"
              >
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiXN9xSEe8unzPBEQOeAKXd9Q55efGHGB9BA&s" alt="fb" className="w-4 h-4" />
                Facebook
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 underline">
                Sign in
              </Link>
            </p>
          </form>

          <Link to="/">
            <button className="flex justify-center text-center m-auto mt-8 text-blue-500 font-bold underline">Back To Home ⟶</button>
          </Link>
        </div>

        {/* Mobile image under form */}
        <div className="md:hidden">
          <img src={IMAGE} alt="auth" className="w-full h-56 object-cover" />
        </div>
      </div>
    </div>
  );
}
