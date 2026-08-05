import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/authService";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.password_confirmation) {
      setError("Password dan konfirmasi password tidak cocok!");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter!");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role: "candidate",
      };

      await register(payload);
      alert("✅ Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      console.log("Error detail:", err);

      if (err.response?.status === 422) {
        if (err.response?.data?.errors) {
          const errorMessages = Object.values(err.response.data.errors).flat();
          setError(errorMessages.join(". "));
        } else {
          setError("Data yang dikirim tidak valid (Error 422). Cek kembali form Anda.");
        }
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registrasi gagal. Silakan periksa kembali data Anda.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* ===== LEFT SIDE ===== */}
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
            Building the Future of<br />
            Psychological Assessment
          </h2>
          <p className="text-xl text-blue-200/90 max-w-lg leading-relaxed font-light">
            Join thousands of clinical professionals and educational institutions using EduPsych to deliver psychometric precision and actionable insights.
          </p>
        </div>
      </div>

      {/* ===== RIGHT SIDE ===== */}
      <div className="flex-1 flex items-center justify-center bg-white px-8 py-10 lg:px-16">
        <div className={`w-full max-w-xl transition-all duration-700 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          
          <div className="mb-10 text-left">
            <h2 className="text-4xl font-bold text-gray-900">Create Account</h2>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-base border-2 border-red-200 whitespace-pre-line mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nama Lengkap */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-4 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a2142] focus:border-[#0a2142] transition-all bg-white"
                placeholder="Nama Lengkap"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1.5">
                Alamat Gmail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-4 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a2142] focus:border-[#0a2142] transition-all bg-white"
                placeholder="Nama@Gmail.com"
              />
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a2142] focus:border-[#0a2142] transition-all bg-white"
                    placeholder="********"
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7a10.01 10.01 0 01-9.543 7c-4.477 0-8.268-2.943-9.543-7z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a2142] focus:border-[#0a2142] transition-all bg-white"
                    placeholder="********"
                  />
                </div>
              </div>
            </div>

            {/* Persetujuan / Checkbox */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="h-5 w-5 text-[#0a2142] border-gray-300 rounded focus:ring-[#0a2142] mt-0.5"
              />
              <label htmlFor="terms" className="ml-3 block text-base text-gray-600 leading-relaxed">
                I agree to the <Link to="#" className="text-[#0a2142] hover:underline">Terms of Service</Link> and acknowledge the <Link to="#" className="text-[#0a2142] hover:underline">Privacy Policy</Link> regarding sensitive data handling.
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-[#0a2142] hover:bg-[#0a2142]/90 text-white text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-2"
            >
              {isLoading ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="flex items-center gap-3 text-lg">
                  Register Account <span>✨</span>
                </span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-base text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-[#0a2142] font-semibold hover:underline">
                Log in here
              </Link>
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-8 flex justify-center gap-6 text-sm text-gray-400">
            <button type="button" onClick={() => alert("Privacy Policy")} className="hover:text-gray-600 transition">
              Privacy Policy
            </button>
            <button type="button" onClick={() => alert("Terms of Service")} className="hover:text-gray-600 transition">
              Terms of Service
            </button>
            <button type="button" onClick={() => alert("Security Standards")} className="hover:text-gray-600 transition">
              Security Standards
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}