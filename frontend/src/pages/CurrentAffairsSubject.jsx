import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const CurrentAffairsSubject = () => {
  const { subject } = useParams();
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const file = await import(`../data/current-affairs/${subject}.json`);
        setMcqs(file.default);
      } catch (error) {
        console.error("Error loading MCQs", error);
        setMcqs([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [subject]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold capitalize mb-8 text-gray-800">
        {subject.replace(/-/g, " ")}
      </h2>

      {mcqs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mcqs.map((mcq, index) => (
            <div key={index} className="border p-5 rounded-lg shadow bg-white hover:shadow-md transition">
              <p className="font-semibold text-gray-800 mb-2">
                {index + 1}. {mcq.question}
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {mcq.options.map((opt, i) => (
                  <li
                    key={i}
                    className={
                      opt === mcq.answer
                        ? "text-green-600 font-semibold"
                        : ""
                    }
                  >
                    {opt}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-gray-500 italic">
                Explanation: {mcq.explanation}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No MCQs available for this subject.</p>
      )}
    </div>
  );
};

export default CurrentAffairsSubject;
