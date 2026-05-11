import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const BACKEND_URL = "http://localhost:5003";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.token) {
        login(data.user, data.token);
        toast.success("Account created!");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:flex w-1/2 bg-violet-600 flex-col justify-between p-12">
        <div>
          <h1 className="text-white font-bold text-2xl">ClarixAI</h1>
        </div>
        <div>
          <h2 className="text-white text-4xl font-bold mb-4">
            Start for free. Upgrade when you're ready.
          </h2>
          <p className="text-violet-200 text-lg">
            5 free AI requests every day. No credit card required.
          </p>
        </div>
        <div className="bg-white/10 rounded-2xl p-6">
          <p className="text-white font-medium mb-1">
            "ClarixAI helped me land my first remote job."
          </p>
          <p className="text-violet-200 text-sm">
            — Junior developer, Zimbabwe
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-500 mb-8">
            Free forever. 5 AI requests per day.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1 block">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1 block">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-violet-600 text-white py-3 rounded-lg hover:bg-violet-700 disabled:opacity-50 font-semibold mt-2"
            >
              {loading ? "Creating..." : "Create Free Account"}
            </button>
          </form>
          <p className="text-gray-500 mt-6 text-sm text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-violet-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
