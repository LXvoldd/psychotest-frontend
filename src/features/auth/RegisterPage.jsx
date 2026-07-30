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

    // 1. Validasi Frontend
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
      // ================================================================
      // PERBAIKAN PENTING UNTUK MENGATASI ERROR 422:
      // Kita kirim field 'role' secara eksplisit agar diterima Backend Laravel.
      // ================================================================
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role: "candidate", // <--- Tambahkan ini! Backend butuh field ini.
      };

      await register(payload);

      alert("✅ Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      console.log("Error detail:", err);

      // 2. Logic parsing error yang lebih baik untuk 422
      if (err.response?.status === 422) {
        // Laravel mengirim error validasi di object 'errors'
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col">

      <header className="flex items-center justify-between px-8 md:px-16 lg:px-24 py-6 md:py-8 flex-shrink-0">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-900">EduPsych</h1>
        <Link
          to="/login"
          className="text-base md:text-lg font-semibold text-blue-700 hover:text-blue-900 transition"
        >
          Sign In
        </Link>
      </header>

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
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Create Account
                </h2>
                <p className="text-gray-500 mt-4 text-lg md:text-xl leading-relaxed">
                  Register as a candidate to access psychological assessments and track your progress.
                </p>
                
                <div className="mt-8 hidden lg:block">
                  <div className="w-16 h-1 bg-green-600 rounded-full mb-4"></div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="lg:col-span-3">

              {error && (
                <div className="bg-red-50 text-red-600 p-4 md:p-5 rounded-xl text-sm md:text-base border-2 border-red-200 whitespace-pre-line mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-5 md:px-6 py-4 md:py-5 outline-none text-base md:text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50 hover:bg-white"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-5 md:px-6 py-4 md:py-5 outline-none text-base md:text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50 hover:bg-white"
                    placeholder="candidate@email.com"
                  />
                </div>

                <div>
                  <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full border-2 border-gray-200 rounded-xl px-5 md:px-6 py-4 md:py-5 outline-none text-base md:text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50 hover:bg-white"
                    placeholder="Minimal 8 karakter"
                  />
                  <p className="text-sm text-gray-400 mt-1">Password minimal 8 karakter</p>
                </div>

                <div>
                  <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-5 md:px-6 py-4 md:py-5 outline-none text-base md:text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50 hover:bg-white"
                    placeholder="Konfirmasi password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 md:py-5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-lg md:text-xl lg:text-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Register as Candidate"
                  )}
                </button>

              </form>

              <p className="text-center mt-6 text-base md:text-lg text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-800 font-semibold hover:underline hover:text-blue-600 transition">
                  Login here
                </Link>
              </p>

            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm md:text-base text-gray-400 mt-10 pt-8 border-t border-gray-100">
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