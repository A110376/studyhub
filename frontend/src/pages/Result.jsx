import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const Result = () => {
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/accounts/performance/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        const formatted = res.data.map(item => ({
          ...item,
          date: new Date(item.date_taken).toLocaleDateString(),
        }));
        setPerformanceData(formatted);
      } catch (error) {
        console.error('Error fetching performance:', error);
      }
    };
    fetchPerformance();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-blue-700">
          📊 Performance Overview
        </h2>

        {/* Chart Section */}
        <div className="p-6 rounded-xl shadow mb-12 bg-blue-50">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#1d4ed8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* History Table */}
        <div className="p-6 rounded-xl shadow bg-gray-50">
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            🕓 Quiz History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 border">Date</th>
                  <th className="px-6 py-3 border">Subject</th>
                  <th className="px-6 py-3 border">Score</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-5 text-gray-500">No data yet.</td>
                  </tr>
                ) : (
                  performanceData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100 transition-all">
                      <td className="px-6 py-3 border">{item.date}</td>
                      <td className="px-6 py-3 border capitalize">{item.subject}</td>
                      <td className="px-6 py-3 border font-medium">{item.score}/{item.total}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
