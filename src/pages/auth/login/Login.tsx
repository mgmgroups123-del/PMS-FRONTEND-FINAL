import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { Input } from "../../../components/ui/input";
import buildingImage from "../../../assets/All Logos.jpeg";
import { useNavigate } from "react-router-dom";
import { loginService } from "../../../features/auth/login/service"; 
import { useAuth } from "../../../components/auth/AuthContext";
import mgmlogo from "../../../assets/MGM_Logo.png"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {login} = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await loginService({ email, password });
      login(res?.data)
      console.log("Login API Response:", res);
      const { message } = res.data || {};
      if (res?.success) {
        toast.success(message || "Signed In successful!");
        navigate("/");
      } else {
        toast.error(message || "Invalid credentials");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
  
      {/* Left side - Login Form */}
      <div className="flex flex-col justify-center items-center px-12 w-1/2 bg-white">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <img src={mgmlogo} alt="MGM Logo" className="w-[350px] h-auto"/>
          </div>
          <p className="text-gray-600 mb-10 text-center text-lg">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@propertyrms.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#ed3237] focus:border-transparent transition-all"
                defaultValue=""
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-[#ed3237] focus:border-transparent transition-all"
                  defaultValue=""
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ed3237] hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Secure login powered by MGM Property Management
            </p>
          </div>
        </div>
      </div>

      <div className="w-1/2 h-screen flex items-center justify-center bg-gray-50">
        <img
          src={buildingImage}
          alt="Building"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}

export default Login;
