import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { startTest, fetchQuestions } from "../api";

export default function TestStart() {
  const { slug } = useParams();
  const [testInfo, setTestInfo] = useState(null);
  const navigate = useNavigate();

  const mockTestOptions = [
    { label: "Lecturer Urdu", slug: "lecturer-urdu" },
    { label: "Assistant Director", slug: "assistant-director" },
    { label: "Food Safety Officer", slug: "food-safety-officer" },
    { label: "Computer Programmer", slug: "computer-programmer" },
    { label: "District Officer Civil Defence", slug: "civil-defence" },
  ];

  useEffect(() => {
    if (slug) {
      const loadTest = async () => {
        try {
          const res = await fetchQuestions(slug);
          setTestInfo(res.data);
        } catch (err) {
          console.error("Error fetching test:", err);
        }
      };
      loadTest();
    }
  }, [slug]);

  const handleStart = async (testSlug) => {
    try {
      const res = await startTest(testSlug);
      const attempt = res.data;
      navigate(`/mock-test/${testSlug}/attempt/${attempt.id}`, { replace: true });
    } catch (err) {
      console.error("Error starting test:", err);
      alert("Failed to start test");
    }
  };

  if (!slug) {
    return (
      <div className="pt-28 p-6 max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-6">Mock Test</h2>
        <div className="space-y-4">
          {mockTestOptions.map((test) => (
            <button
              key={test.slug}
              onClick={() => navigate(`/mock-test/${test.slug}`)}
              className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg shadow 
                         hover:bg-blue-700 active:bg-blue-800 transition duration-300"
            >
              {test.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!testInfo) return <div className="p-6 pt-28">Loading test info...</div>;

  return (
    <div className="pt-28 p-6 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">
        {testInfo.title}
      </h2>
      <p className="text-lg">Duration: {testInfo.duration_minutes} minutes</p>
      <p className="text-lg mb-6">Total Questions: {testInfo.questions.length}</p>
      <button
        onClick={() => handleStart(slug)}
        className="mt-4 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow 
                   hover:bg-blue-700 active:bg-blue-800 transition duration-300"
      >
        🚀 Start Test
      </button>
    </div>
  );
}
