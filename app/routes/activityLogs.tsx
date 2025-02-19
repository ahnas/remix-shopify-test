import React, { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import Header from "~/components/Header";

const ActivityLogs = () => {
  const fetcher = useFetcher();
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem("activity_logs") || "[]");
    setLogs(storedLogs);
  }, []);

  const clearLogs = () => {
    localStorage.removeItem("activity_logs");
    setLogs([]);
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        {logs.length > 0 ? (
          <ul className="bg-gray-100 p-4 rounded-lg">
            {logs.map((log, index) => (
              <li key={index} className="py-2 border-b last:border-none">
                {log}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent activities.</p>
        )}
        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Clear Logs
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
