import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const BACKEND_URL = "http://localhost:5003";

function PricingPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleUpgrade = async () => {
    if (!token) {
      navigate("/register");
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/stripe/create-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Could not start checkout");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-gray-500 text-lg">
            Start for free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Free</h2>
              <p className="text-gray-500 text-sm mb-4">
                Perfect for trying out ClarixAI
              </p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500 mb-2">/ month</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/register")}
              className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-violet-300 hover:text-violet-600 transition-colors mb-8"
            >
              Get started free
            </button>
            <div className="space-y-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                What you get
              </p>
              {[
                "5 AI requests per day",
                "Access to all 5 AI tools",
                "Resume analyzer with match score",
                "Cover letter generation",
                "Interview question coaching",
                "Content rewriting",
                "Code explanation",
                "Request history (last 20)",
                "Personal API key",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-600 text-sm">{feature}</span>
                </div>
              ))}
              {[
                "Unlimited requests",
                "Priority processing",
                "Early access to new tools",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-400 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-violet-600 rounded-2xl p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full">
              MOST POPULAR
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Pro</h2>
              <p className="text-violet-200 text-sm mb-4">
                For professionals who need more
              </p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-bold text-white">$9</span>
                <span className="text-violet-200 mb-2">/ month</span>
              </div>
            </div>
            <button
              onClick={handleUpgrade}
              className="w-full bg-white text-violet-600 py-3 rounded-xl font-semibold hover:bg-violet-50 transition-colors mb-8"
            >
              Upgrade to Pro
            </button>
            <div className="space-y-4">
              <p className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
                Everything in Free, plus
              </p>
              {[
                "Unlimited AI requests per day",
                "Access to all 5 AI tools",
                "Resume analyzer with match score",
                "Cover letter generation",
                "Interview question coaching",
                "Content rewriting",
                "Code explanation",
                "Full request history",
                "Personal API key",
                "Priority processing",
                "Early access to new tools",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-white text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-gray-400 text-sm mt-10">
          No contracts. Cancel anytime. All plans include a personal API key.
        </p>
      </div>
    </div>
  );
}

export default PricingPage;
