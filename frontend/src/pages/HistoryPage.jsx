import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const BACKEND_URL = "http://localhost:5003";

function HistoryPage() {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/ai/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Request History</h1>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-400">
            No requests yet. Try one of the AI tools!
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {history.map((log, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-xl p-5 border border-gray-700"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-blue-400 font-semibold text-sm capitalize">
                    {log.tool.replace(/-/g, " ")}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {log.response?.slice(0, 200)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
