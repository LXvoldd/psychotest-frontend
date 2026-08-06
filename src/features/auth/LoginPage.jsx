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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await login(data);

      const responseData = res.data;
      const token = responseData.data?.token || responseData.token;
      const user = responseData.data?.user || responseData.user;

      if (!token) {
        toast.error("Token tidak ditemukan dalam response");
        return;
      }

      if (!user) {
        toast.error("Data user tidak ditemukan dalam response");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role || selectedRole);

      toast.success(
        `Login berhasil sebagai ${user.role === "admin" ? "Admin" : "Candidate"}!`
      );

      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/candidate-dashboard");
      }
    } catch (err) {
      console.log(err);
      
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        toast.error("Koneksi timeout. Cek apakah backend berjalan.");
      } else if (err.response?.status === 401) {
        toast.error("Email atau Password salah");
      } else {
        toast.error(err?.response?.data?.message || "Email atau Password salah");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a2142] relative flex-col justify-center px-20 py-16 text-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
          <svg viewBox="0 0 400 400" className="absolute -top-20 -left-20 w-96 h-96 text-white">
            <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
          </svg>
          <svg viewBox="0 0 400 400" className="absolute -bottom-20 -right-20 w-80 h-80 text-white">
            <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl font-bold text-[#d4c28a] mb-20 tracking-wide">EduPsych</h1>
          
          <h2 className="text-5xl lg:text-6xl font-bold leading-tight mb-8">
            Advancing Cognitive<br />
            Research through Modern<br />
            Data Analysis
          </h2>
          <p className="text-xl text-blue-200/90 max-w-lg leading-relaxed font-light">
            Access the industry-leading platform for educational psychologists and cognitive researchers.
          </p>
        </div>
      </div>

      {}
      <div className="flex-1 flex items-center justify-center bg-white px-8 py-10 lg:px-16">
        <div className={`w-full max-w-xl transition-all duration-700 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          
          <div className="mb-10 text-left">
            <h2 className="text-4xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-2 text-base">
              Please enter your credentials to access the dashboard.
            </p>
          </div>

          {}
          <div className="mb-8">
            <p className="text-base font-medium text-gray-700 mb-3">Select your role</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`py-3 rounded-lg border-2 text-base font-semibold transition-all duration-300 ${
                  selectedRole === "admin"
                    ? "border-[#0a2142] bg-[#0a2142]/5 text-[#0a2142] shadow-sm"
                    : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                 Admin
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("candidate")}
                className={`py-3 rounded-lg border-2 text-base font-semibold transition-all duration-300 ${
                  selectedRole === "candidate"
                    ? "border-[#0a2142] bg-[#0a2142]/5 text-[#0a2142] shadow-sm"
                    : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                 Candidate
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-base font-medium text-gray-700">
                  Email Address
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="name@institution.edu"
                  className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a2142] focus:border-[#0a2142] transition-all bg-white"
                  {...register("email", { required: true })}
                />
              </div>
            </div>

            {}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-base font-medium text-gray-700">
                  Password
                </label>
                <Link to="#" className="text-sm text-[#0a2142] hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-14 py-4 border border-gray-300 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a2142] focus:border-[#0a2142] transition-all bg-white"
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7a10.01 10.01 0 01-9.543 7c-4.477 0-8.268-2.943-9.543-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {}
            <div className="flex items-center mt-2">
              <input
                id="remember-me"
                type="checkbox"
                className="h-5 w-5 text-[#0a2142] border-gray-300 rounded focus:ring-[#0a2142]"
              />
              <label htmlFor="remember-me" className="ml-3 block text-base text-gray-600">
                Remember this device for 30 days
              </label>
            </div>

            {}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-[#0a2142] hover:bg-[#0a2142]/90 text-white text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-4"
            >
              {loading ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="flex items-center gap-3 text-lg">
                  Login <span>→</span>
                </span>
              )}
            </button>
          </form>

          {}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-base text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#0a2142] font-semibold hover:underline">
                Register your account
              </Link>
            </p>
          </div>

          {}
          <div className="mt-8 flex justify-center gap-6 text-sm text-gray-400">
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