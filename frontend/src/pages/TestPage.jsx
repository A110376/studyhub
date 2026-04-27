import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuestions, startTest, submitAttempt } from "../api";

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TestPage() {
  const { slug } = useParams();
  const [questions, setQuestions] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    const loadTest = async () => {
      try {
        const startRes = await startTest(slug);
        setAttemptId(startRes.data.id);

        const res = await fetchQuestions(slug);
        const qs = res.data.questions || [];
        setQuestions(qs);

        const durationMinutes = res.data.duration_minutes || 90;
        setSecondsLeft(durationMinutes * 60);

        const initAnswers = {};
        qs.forEach((q) => {
          initAnswers[q.id] = null;
        });
        setAnswers(initAnswers);
      } catch (err) {
        console.error("Failed to start test:", err);
        alert("Failed to start test");
      }
    };
    loadTest();
  }, [slug]);

  // Timer logic
  useEffect(() => {
    if (secondsLeft === null) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          submitWhenTimeEnds();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [secondsLeft]);

  const submitWhenTimeEnds = async () => {
    try {
      await handleSubmit();
    } catch (err) {
      console.error("Error submitting test on timer end:", err);
    }
  };

  const handleSelect = (qid, index) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [qid]: index }));
  };

  const handleSubmit = async () => {
    try {
      if (!attemptId) {
        alert("Attempt ID is missing!");
        return;
      }

      const payload = {
        answers: Object.fromEntries(
          Object.entries(answers)
            .filter(([_, val]) => val !== null)
            .map(([qid, idx]) => [
              qid.toString(),
              questions.find((q) => q.id === parseInt(qid)).options[idx], // ✅ send option text
            ])
        ),
      };

      const res = await submitAttempt(attemptId, payload);
      setResult(res.data);
    } catch (err) {
      console.error("Submit error:", err.response?.data || err);
      alert("Error submitting test");
    }
  };

  // ✅ Result view
  if (result) {
    return (
      <div className="pt-24 p-4 max-w-4xl mx-auto"> {/* ✅ Navbar se thoda neeche */}
        <h2 className="text-2xl font-bold mb-4">Test Result — {slug}</h2>
        <div className="mb-6">
          <p className="text-lg">Score: {result.score}</p>
          <p className="text-lg text-green-700">Correct: {result.correct}</p>
          <p className="text-lg text-red-700">Wrong: {result.wrong}</p>
          <p className="text-lg text-gray-700">Unattempted: {result.unattempted}</p>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-4 border rounded bg-white">
              <div className="mb-2 font-medium">
                {idx + 1}. {q.question}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {q.options.map((opt, optionIdx) => {
                  const selected = answers[q.id] === optionIdx;
                  return (
                    <div
                      key={optionIdx}
                      className={`p-2 border rounded ${
                        selected ? "bg-blue-100 border-blue-600" : "bg-white"
                      }`}
                    >
                      <span className="font-semibold mr-2">
                        {String.fromCharCode(65 + optionIdx)}
                      </span>
                      {opt}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ✅ Test Attempt View
  return (
    <div className="pt-24 p-4 max-w-4xl mx-auto"> {/* ✅ Navbar se neeche space */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{slug} — Attempt</h2>
        <div className="text-lg">
          Time left:{" "}
          <span className="font-mono">
            {secondsLeft !== null ? formatTime(secondsLeft) : "Loading"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, qIndex) => (
          <div key={q.id} className="p-4 border rounded bg-white">
            <div className="mb-2 font-medium">
              {qIndex + 1}. {q.question}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(q.id, idx)}
                  className={`p-2 text-left rounded border ${
                    answers[q.id] === idx
                      ? "border-blue-600 bg-blue-50"
                      : "bg-white"
                  }`}
                >
                  <span className="font-semibold mr-2">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-yellow-500 text-black rounded font-semibold hover:bg-yellow-400"
        >
          ✅ Submit Now
        </button>
      </div>
    </div>
  );
}
