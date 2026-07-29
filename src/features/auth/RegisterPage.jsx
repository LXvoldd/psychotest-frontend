import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/authService";
import { User, Shield } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "admin", // Default pilihan role saat mendaftar
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validasi sederhana di Frontend
    if (formData.password !== formData.password_confirmation) {
      setError("Password dan konfirmasi password tidak cocok!");
      setIsLoading(false);
      return;
    }

    try {
      // Kirim data ke authService (sudah termasuk role)
      await register(formData);
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      console.log("Error detail:", err);

      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join(". "));
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
    <div className="min-h-screen bg-[#f6f8ff]">
      <header className="flex items-center justify-between px-10 py-6">
        <h1 className="text-5xl font-extrabold text-blue-900">EduPsych</h1>
        <Link to="/login" className="font-semibold text-blue-900 hover:underline">
          Back to Login
        </Link>
      </header>

      <div className="flex justify-center mt-8 pb-12">
        <div className="bg-white w-full max-w-lg rounded-xl border border-gray-200 shadow-sm p-12">
          
          <h2 className="text-4xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-500 mt-3 text-lg leading-8">
            Choose your role and fill in your details.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded mt-6 text-sm border border-red-200 whitespace-pre-line">
              {error}
            </div>
          )}

          {/* --- PILIHAN ROLE (ADMIN / CANDIDATE) SAAT DAFTAR --- */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "admin" })}
              className={`flex items-center justify-center gap-2 py-4 rounded-lg border-2 transition text-lg ${
                formData.role === "admin" 
                  ? "border-blue-900 bg-blue-50 text-blue-900 font-semibold" 
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Shield size={20} />
              Admin
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "candidate" })}
              className={`flex items-center justify-center gap-2 py-4 rounded-lg border-2 transition text-lg ${
                formData.role === "candidate" 
                  ? "border-green-600 bg-green-50 text-green-700 font-semibold" 
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <User size={20} />
              Candidate
            </button>
          </div>
          {/* -------------------------------------------------- */}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            
            <div>
              <label className="block text-lg font-semibold mb-3">Full Name</label>
              <div className="flex items-center border rounded-lg px-4 h-16">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="flex-1 px-2 outline-none text-lg"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3">Email Address</label>
              <div className="flex items-center border rounded-lg px-4 h-16">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="flex-1 px-2 outline-none text-lg"
                  placeholder="admin@psychotest.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3">Password</label>
              <div className="flex items-center border rounded-lg px-4 h-16">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="flex-1 px-2 outline-none text-lg"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3">Confirm Password</label>
              <div className="flex items-center border rounded-lg px-4 h-16">
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  className="flex-1 px-2 outline-none text-lg"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 rounded-lg bg-blue-900 text-white font-semibold text-xl hover:bg-blue-800 transition disabled:opacity-70"
            >
              {isLoading ? "Processing..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600 text-lg">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-800 font-semibold hover:underline">
              Login here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}