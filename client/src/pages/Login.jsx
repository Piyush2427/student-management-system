import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, UserPlus, User, BookOpen } from "lucide-react";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Login Flow
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        
        if (res.data.user.role === "student") {
          navigate("/my-profile");
        } else {
          navigate("/dashboard");
        }
      } else {
        // Signup Flow
        await axios.post("http://localhost:5000/api/auth/register", {
          name,
          email,
          password,
          course,
          role: "student"
        });

        // Automatically log them in after registration
        const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });

        localStorage.setItem("token", loginRes.data.token);
        localStorage.setItem("role", loginRes.data.user.role);
        navigate("/my-profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || `${isLogin ? "Login" : "Registration"} failed. Please check your details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/30 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/30 blur-[150px] pointer-events-none" />

      <div className="glass-panel p-10 rounded-3xl w-full max-w-md relative z-10 mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-lg mb-4">
            {isLogin ? <LogIn size={32} color="white" /> : <UserPlus size={32} color="white" />}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-400">
            {isLogin ? "Sign in to your account" : "Sign up as a new student"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <BookOpen size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enrolled Course"
                    required
                    className="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl"
                    onChange={(e) => setCourse(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={20} className="text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email address"
                required
                className="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                required
                className="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-button w-full py-3.5 rounded-xl flex justify-center items-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }} 
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;