import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="font-bold text-2xl text-gray-900">
        Clarix<span className="text-violet-600">AI</span>
      </Link>
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          Tools
        </Link>
        <Link
          to="/history"
          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          History
        </Link>
        <Link
          to="/pricing"
          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          Pricing
        </Link>
        {user ? (
          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold border ${user.plan === "pro" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}
            >
              {user.plan === "pro" ? "⭐ Pro" : "Free"}
            </span>
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-900 text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
