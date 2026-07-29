import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  User,       // Tambahan untuk ikon Candidate
  Shield,     // Tambahan untuk ikon Admin
} from "lucide-react";

import { login } from "../../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State untuk memilih Role (Admin / Candidate)
  const [selectedRole, setSelectedRole] = useState("admin"); // Default: Admin

  const {
    register,
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await login(data);
      
      // Simpan token & data user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Simpan role yang dipilih agar bisa dibaca di halaman lain
      localStorage.setItem("role", selectedRole);

      toast.success(`Login berhasil sebagai ${selectedRole === 'admin' ? 'Admin' : 'Candidate'}!`);

      // Arahkan ke halaman yang berbeda berdasarkan Role
      if (selectedRole === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/candidate-dashboard");
      }
    } catch (err) {
      console.log(err);

      toast.error(
        err?.response?.data?.message ||
          "Email atau Password salah"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8ff]">

      {/* Header */}
      <header className="flex items-center justify-between px-10 py-6">

        <h1 className="text-5xl font-extrabold text-blue-900">
          EduPsych
        </h1>

        <button className="font-semibold text-blue-900 hover:underline">
          Support
        </button>

      </header>

      {/* Card */}
      <div className="flex justify-center mt-8">

        <div className="bg-white w-full max-w-lg rounded-xl border border-gray-200 shadow-sm p-12">

          <h2 className="text-5xl font-bold text-gray-900">
            Welcome back
          </h2>

          <p className="text-gray-500 mt-5 text-xl leading-9">
            Choose your role and enter credentials.
          </p>

          {/* --- PILIHAN ROLE (ADMIN / CANDIDATE) --- */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedRole("admin")}
              className={`flex items-center justify-center gap-2 py-4 rounded-lg border-2 transition text-lg ${
                selectedRole === "admin" 
                  ? "border-blue-900 bg-blue-50 text-blue-900 font-semibold" 
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Shield size={20} />
              Admin
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("candidate")}
              className={`flex items-center justify-center gap-2 py-4 rounded-lg border-2 transition text-lg ${
                selectedRole === "candidate" 
                  ? "border-green-600 bg-green-50 text-green-700 font-semibold" 
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <User size={20} />
              Candidate
            </button>
          </div>
          {/* --------------------------------------- */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-7"
          >

            {/* Email */}
            <div>
              <label className="block text-lg font-semibold mb-3">
                Email Address
              </label>

              <div className="flex items-center border rounded-lg px-4 h-16">
                <Mail className="text-gray-400" size={22} />
                <input
                  type="email"
                  placeholder="admin@psychotest.com"
                  className="flex-1 px-4 outline-none text-lg"
                  {...register("email", {
                    required: true,
                  })}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-3">
                <label className="text-lg font-semibold">
                  Password
                </label>
                <button
                  type="button"
                  className="text-blue-700 hover:underline"
                  onClick={() => toast("Feature coming soon")}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="flex items-center border rounded-lg px-4 h-16">
                <Lock className="text-gray-400" size={22} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="flex-1 px-4 outline-none text-lg"
                  {...register("password", {
                    required: true,
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-400" size={22} />
                  ) : (
                    <Eye className="text-gray-400" size={22} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-3 text-gray-600">
              <input type="checkbox" />
              Remember this device for 30 days
            </label>

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 rounded-lg bg-blue-900 text-white font-semibold text-xl hover:bg-blue-800 flex items-center justify-center gap-3 transition disabled:opacity-70"
            >
              {loading ? "Signing In..." : "Login"}
              {!loading && <LogIn size={22} />}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-5">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm tracking-widest">
                INSTITUTIONAL SSO
              </span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* SSO */}
            <button
              type="button"
              onClick={() => toast("Institution SSO belum tersedia.")}
              className="w-full border rounded-lg h-16 hover:bg-gray-50 transition font-semibold"
            >
              Continue with Institution Account
            </button>

          </form>

          {/* Register */}
          <p className="text-center mt-10 text-gray-600">
            Don't have an account?
            <button
              type="button"
              onClick={() => navigate("/register")} 
              className="ml-2 text-blue-800 font-semibold hover:underline"
            >
              Register your institution
            </button>
          </p>

          {/* Footer */}
          <div className="flex justify-between text-gray-400 text-sm mt-12">
            <button type="button" onClick={() => toast("Privacy Policy")}>
              Privacy Policy
            </button>
            <button type="button" onClick={() => toast("Terms of Service")}>
              Terms of Service
            </button>
            <button type="button" onClick={() => toast("Security Standards")}>
              Security Standards
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}