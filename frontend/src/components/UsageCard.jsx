function UsageCard({ requestsToday, remainingRequests, plan, totalRequests }) {
  const limit = plan === "pro" ? 999 : 5;
  const percentage =
    plan === "pro" ? 0 : Math.min((requestsToday / limit) * 100, 100);

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <h3 className="text-white font-semibold mb-3">Usage Today</h3>
      {plan === "pro" ? (
        <p className="text-green-400 font-semibold">⭐ Unlimited requests</p>
      ) : (
        <>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>{requestsToday} used</span>
            <span>{remainingRequests} remaining</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${percentage >= 100 ? "bg-red-500" : percentage >= 60 ? "bg-yellow-500" : "bg-blue-500"}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs mt-2">Resets daily at midnight</p>
        </>
      )}
      <p className="text-gray-400 text-sm mt-3">
        Total requests:{" "}
        <span className="text-white font-semibold">{totalRequests}</span>
      </p>
    </div>
  );
}

export default UsageCard;
