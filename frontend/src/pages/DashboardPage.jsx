import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const BACKEND_URL = "http://localhost:5003";

const tools = [
  {
    id: "resume-analyzer",
    name: "Resume Analyzer",
    description:
      "Upload your CV and a job description. Get a match score, missing skills, and specific improvements.",
    bg: "bg-violet-100",
    border: "border-violet-300",
    iconBg: "bg-violet-200",
    icon: (
      <svg
        className="w-6 h-6 text-violet-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    tag: "Most Popular",
    tagColor: "bg-violet-200 text-violet-800",
  },
  {
    id: "cover-letter",
    name: "Cover Letter Generator",
    description:
      "Generate a tailored, professional cover letter for any job in seconds.",
    bg: "bg-blue-100",
    border: "border-blue-300",
    iconBg: "bg-blue-200",
    icon: (
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    tag: "Save Time",
    tagColor: "bg-blue-200 text-blue-800",
  },
  {
    id: "interview-questions",
    name: "Interview Coach",
    description:
      "Get 10 interview questions for any role with tips on how to answer each one well.",
    bg: "bg-green-100",
    border: "border-green-300",
    iconBg: "bg-green-200",
    icon: (
      <svg
        className="w-6 h-6 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
    tag: "Get Hired",
    tagColor: "bg-green-200 text-green-800",
  },
  {
    id: "content-rewriter",
    name: "Content Rewriter",
    description:
      "Rewrite any content — emails, posts, bios — in any tone or style instantly.",
    bg: "bg-orange-100",
    border: "border-orange-300",
    iconBg: "bg-orange-200",
    icon: (
      <svg
        className="w-6 h-6 text-orange-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    tag: "Write Better",
    tagColor: "bg-orange-200 text-orange-800",
  },
  {
    id: "code-explainer",
    name: "Code Explainer",
    description:
      "Paste any code and get a plain English explanation. Perfect for learning and debugging.",
    bg: "bg-slate-100",
    border: "border-slate-300",
    iconBg: "bg-slate-200",
    icon: (
      <svg
        className="w-6 h-6 text-slate-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    tag: "For Developers",
    tagColor: "bg-slate-200 text-slate-800",
  },
];

function DashboardPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUserData)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="bg-white border-b border-gray-200 px-8 py-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Good day, {user?.name} 👋
            </h1>
            <p className="text-gray-500">
              Pick a tool and let AI do the heavy lifting.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-50 border border-gray-200 rounded-xl px-6 py-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {userData?.requestsToday || 0}
              </p>
              <p className="text-gray-500 text-xs mt-1">Used today</p>
            </div>
            <div className="bg-slate-50 border border-gray-200 rounded-xl px-6 py-4 text-center">
              <p className="text-2xl font-bold text-violet-600">
                {userData?.remainingRequests ||
                  (user?.plan === "pro" ? "∞" : 5)}
              </p>
              <p className="text-gray-500 text-xs mt-1">Remaining</p>
            </div>
            <div className="bg-slate-50 border border-gray-200 rounded-xl px-6 py-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {userData?.totalRequests || 0}
              </p>
              <p className="text-gray-500 text-xs mt-1">Total requests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10">
        {user?.plan === "free" && userData?.requestsToday >= 5 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex justify-between items-center">
            <p className="text-amber-800 text-sm font-medium">
              You have used all 5 free requests today. Upgrade for unlimited
              access.
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-violet-700 font-medium"
            >
              Upgrade to Pro
            </button>
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 mb-6">AI Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => navigate(`/tool/${tool.id}`)}
              className={`${tool.bg} border ${tool.border} rounded-2xl p-6 text-left hover:shadow-md transition-all group`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`${tool.iconBg} p-3 rounded-xl`}>
                  {tool.icon}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${tool.tagColor}`}
                >
                  {tool.tag}
                </span>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2 group-hover:text-violet-600 transition-colors">
                {tool.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {tool.description}
              </p>
              <div className="mt-4 flex items-center text-violet-600 text-sm font-medium">
                Use tool →
              </div>
            </button>
          ))}

          {user?.plan === "free" && (
            <button
              onClick={() => navigate("/pricing")}
              className="bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl p-6 text-left hover:opacity-95 transition-opacity"
            >
              <div className="bg-white/20 p-3 rounded-xl w-fit mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">
                Upgrade to Pro
              </h3>
              <p className="text-violet-200 text-sm leading-relaxed">
                Get unlimited requests, priority processing and early access to
                new tools.
              </p>
              <div className="mt-4 bg-white text-violet-600 text-sm font-bold px-4 py-2 rounded-lg inline-block">
                $9 / month
              </div>
            </button>
          )}
        </div>

        <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-900 font-bold mb-1">API Access</h3>
              <p className="text-gray-500 text-sm">
                Use your API key to access ClarixAI programmatically
              </p>
            </div>
            <code className="text-sm bg-slate-50 border border-gray-200 px-4 py-2 rounded-lg text-gray-600">
              {user?.apiKey?.slice(0, 24)}...
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
