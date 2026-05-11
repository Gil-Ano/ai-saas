import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function SuccessPage() {
  const navigate = useNavigate();
  const { user, login, token } = useAuth();

  useEffect(() => {
    toast.success("Welcome to Pro! Unlimited requests unlocked.");
    const updated = { ...user, plan: "pro" };
    login(updated, token);
    setTimeout(() => navigate("/"), 3000);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          You are now Pro!
        </h1>
        <p className="text-gray-500 mb-6">
          Unlimited AI requests unlocked. Redirecting to dashboard...
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-violet-600 text-white px-6 py-3 rounded-xl hover:bg-violet-700 font-semibold"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default SuccessPage;
