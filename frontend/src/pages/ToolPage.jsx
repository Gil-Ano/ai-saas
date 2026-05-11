import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const BACKEND_URL = "http://localhost:5003";

const toolConfig = {
  "resume-analyzer": {
    name: "Resume Analyzer",
    description:
      "Upload your CV or paste it below, then add the job description to get a detailed match analysis.",
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
    hasUpload: true,
    fields: [
      {
        key: "resume",
        label: "Your Resume",
        placeholder: "Paste your resume here or upload a PDF above...",
        type: "textarea",
      },
      {
        key: "jobDescription",
        label: "Job Description",
        placeholder: "Paste the job description here...",
        type: "textarea",
      },
    ],
  },
  "cover-letter": {
    name: "Cover Letter Generator",
    description:
      "Generate a tailored cover letter for any job application in seconds.",
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
    hasUpload: false,
    fields: [
      {
        key: "companyName",
        label: "Company Name",
        placeholder: "e.g. Google",
        type: "input",
      },
      {
        key: "jobDescription",
        label: "Job Description",
        placeholder: "Paste the job description...",
        type: "textarea",
      },
      {
        key: "resume",
        label: "Your Background",
        placeholder: "Paste your resume or key experience...",
        type: "textarea",
      },
    ],
  },
  "interview-questions": {
    name: "Interview Coach",
    description:
      "Get tailored interview questions with tips on how to answer each one.",
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
    hasUpload: false,
    fields: [
      {
        key: "jobTitle",
        label: "Job Title",
        placeholder: "e.g. Full Stack Developer",
        type: "input",
      },
      {
        key: "skills",
        label: "Key Skills",
        placeholder: "e.g. React, Node.js, MongoDB",
        type: "input",
      },
    ],
  },
  "content-rewriter": {
    name: "Content Rewriter",
    description: "Rewrite any content in any tone or style instantly.",
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
    hasUpload: false,
    fields: [
      {
        key: "content",
        label: "Content to Rewrite",
        placeholder: "Paste your content here...",
        type: "textarea",
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "e.g. professional, casual, persuasive",
        type: "input",
      },
      {
        key: "type",
        label: "Content Type",
        placeholder: "e.g. email, blog post, tweet",
        type: "input",
      },
    ],
  },
  "code-explainer": {
    name: "Code Explainer",
    description: "Paste any code and get a clear plain English explanation.",
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
    hasUpload: false,
    fields: [
      {
        key: "language",
        label: "Programming Language",
        placeholder: "e.g. JavaScript, Python",
        type: "input",
      },
      {
        key: "code",
        label: "Code",
        placeholder: "Paste your code here...",
        type: "textarea",
      },
    ],
  },
};

function ToolPage() {
  const { toolId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const config = toolConfig[toolId];
  if (!config) return <div className="text-gray-900 p-8">Tool not found</div>;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "text/plain") {
      const text = await file.text();
      setInputs((prev) => ({ ...prev, resume: text }));
      toast.success("Resume loaded!");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await fetch(`${BACKEND_URL}/api/upload/pdf`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setInputs((prev) => ({ ...prev, resume: data.text }));
        toast.success("Resume extracted successfully!");
      } else {
        toast.error("Could not read PDF. Please paste manually.");
      }
    } catch (err) {
      toast.error("Upload failed. Please paste your resume manually.");
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/${toolId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
      } else if (data.limitReached) {
        toast.error(
          "Daily limit reached. Upgrade to Pro for unlimited requests.",
        );
        navigate("/pricing");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-8 py-8">
        <button
          onClick={() => navigate("/")}
          className="text-gray-400 hover:text-gray-700 mb-6 flex items-center gap-2 text-sm"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            {config.icon}
            <h1 className="text-2xl font-bold text-gray-900">{config.name}</h1>
          </div>
          <p className="text-gray-500 text-sm mb-6">{config.description}</p>

          {config.hasUpload && (
            <div
              onClick={() => fileRef.current.click()}
              className="border-2 border-dashed border-violet-200 bg-violet-50 rounded-xl p-6 text-center cursor-pointer hover:border-violet-400 transition-colors mb-6"
            >
              <input
                type="file"
                ref={fileRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.txt"
              />
              {uploading ? (
                <p className="text-violet-600 font-medium">
                  Extracting text from PDF...
                </p>
              ) : (
                <>
                  <svg
                    className="w-8 h-8 text-violet-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <p className="text-violet-600 font-medium">
                    Click to upload your resume PDF or TXT
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Or paste your resume in the field below
                  </p>
                </>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {config.fields.map((field) => (
              <div key={field.key}>
                <label className="text-gray-700 text-sm font-semibold mb-1.5 block">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    placeholder={field.placeholder}
                    value={inputs[field.key] || ""}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-900 text-sm h-36 resize-none bg-slate-50"
                    required
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={inputs[field.key] || ""}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-900 text-sm bg-slate-50"
                    required
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="bg-violet-600 text-white py-3 rounded-xl hover:bg-violet-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-900 font-bold text-lg">Result</h3>
              <button
                onClick={copyResult}
                className="flex items-center gap-2 text-violet-600 hover:text-violet-700 text-sm font-medium border border-violet-200 px-3 py-1.5 rounded-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </button>
            </div>
            <pre className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ToolPage;
