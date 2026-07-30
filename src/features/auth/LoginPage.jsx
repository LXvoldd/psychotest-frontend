import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { login } from "../../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("admin");
  const [isVisible, setIsVisible] = useState(false);

  const { register, handleSubmit } = useForm();

  // ANIMASI MASUK
  useEffect(() => {
    // Kasih delay kecil biar lebih halus
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await login(data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", selectedRole);

      toast.success(
        `Login berhasil sebagai ${selectedRole === "admin" ? "Admin" : "Candidate"}!`
      );

      if (selectedRole === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/candidate-dashboard");
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Email atau Password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">

      {/* HEADER - dengan animasi */}
      <header className={`flex items-center justify-between px-8 md:px-16 lg:px-24 py-6 md:py-8 flex-shrink-0 transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
      }`}>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-900">
          EduPsych
        </h1>
        <Link
          to="/register"
          className="text-base md:text-lg font-semibold text-blue-700 hover:text-blue-900 transition"
        >
          Register
        </Link>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-8 py-8 md:py-12">
        <div 
          className={`bg-white w-full max-w-4xl lg:max-w-5xl rounded-3xl border border-gray-200 shadow-2xl p-10 md:p-16 lg:p-20 transition-all duration-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* LEFT SIDE - WELCOME */}
            <div className="lg:col-span-2">
              <div className="h-full flex flex-col justify-center">
                <div className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1 rounded-full mb-4 w-fit">
                  Secure Login
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Welcome back
                </h2>
                <p className="text-gray-500 mt-4 text-lg md:text-xl leading-relaxed">
                  Choose your role and enter your credentials to access your dashboard.
                </p>
                
                <div className="mt-8 hidden lg:block">
                  <div className="w-16 h-1 bg-blue-900 rounded-full mb-4"></div>
                  <p className="text-sm text-gray-400">
                    Secure platform for psychological assessments
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="lg:col-span-3">

              {/* ROLE SELECTOR */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole("admin")}
                  className={`py-4 md:py-5 rounded-xl border-2 transition-all duration-300 text-base md:text-lg lg:text-xl font-semibold ${
                    selectedRole === "admin"
                      ? "border-blue-900 bg-blue-50 text-blue-900 shadow-md scale-[1.02]"
                      : "border-gray-200 text-gray-500 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("candidate")}
                  className={`py-4 md:py-5 rounded-xl border-2 transition-all duration-300 text-base md:text-lg lg:text-xl font-semibold ${
                    selectedRole === "candidate"
                      ? "border-green-600 bg-green-50 text-green-700 shadow-md scale-[1.02]"
                      : "border-gray-200 text-gray-500 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  Candidate
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">

                {/* EMAIL */}
                <div>
                  <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="admin@psychotest.com"
                    className="w-full border-2 border-gray-200 rounded-xl px-5 md:px-6 py-4 md:py-5 outline-none text-base md:text-lg lg:text-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50 hover:bg-white"
                    {...register("email", { required: true })}
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-base md:text-lg font-semibold text-gray-700">
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full border-2 border-gray-200 rounded-xl px-5 md:px-6 py-4 md:py-5 outline-none text-base md:text-lg lg:text-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50 hover:bg-white"
                      {...register("password", { required: true })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm md:text-base font-medium transition"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* REMEMBER ME */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 text-sm md:text-base text-gray-600 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 md:w-6 md:h-6 rounded border-gray-300 text-blue-900 focus:ring-blue-500 cursor-pointer" 
                    />
                    Remember me
                  </label>
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 md:py-5 rounded-xl bg-gradient-to-r from-blue-900 to-blue-800 text-white font-semibold text-lg md:text-xl lg:text-2xl hover:from-blue-800 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>

              </form>

              {/* REGISTER LINK */}
              <p className="text-center mt-6 text-base md:text-lg text-gray-600">
                New user?{" "}
                <Link
                  to="/register"
                  className="text-blue-800 font-semibold hover:underline hover:text-blue-600 transition"
                >
                  Create an account
                </Link>
              </p>

            </div>
          </div>

          {/* FOOTER LINKS */}
          <div className={`flex flex-wrap justify-center gap-6 md:gap-8 text-sm md:text-base text-gray-400 mt-10 pt-8 border-t border-gray-100 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>
            <button type="button" onClick={() => toast("Privacy Policy")} className="hover:text-gray-600 transition">
              Privacy Policy
            </button>
            <button type="button" onClick={() => toast("Terms of Service")} className="hover:text-gray-600 transition">
              Terms of Service
            </button>
            <button type="button" onClick={() => toast("Security Standards")} className="hover:text-gray-600 transition">
              Security Standards
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}