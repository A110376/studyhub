import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const QuizPage = () => {
  const { subject } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/accounts/question-list/?subject=${subject}`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, [subject]);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      const token = localStorage.getItem("access");
      const responses = questions.map((q) => ({
        question_id: q.id,
        selected_option: answers[q.id],
        correct_answer: q.answer,
      }));

      const payload = { subject, responses };

      const res = await axios.post(
        "http://127.0.0.1:8000/api/accounts/submit/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data);
      setSubmitted(true);
    } catch (error) {
      console.error("Submit error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-indigo-900 mb-6 capitalize text-center">
        {subject.replace("-", " ")} Quiz
      </h2>

      {!submitted ? (
        <>
          {questions.map((q) => (
            <div
              key={q.id}
              className="mb-6 p-5 border border-indigo-200 rounded-xl bg-white shadow"
            >
              <p className="font-semibold text-indigo-900 mb-2">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <label
                    key={`${q.id}-${i}`}
                    className="flex items-center text-indigo-800"
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => handleOptionChange(q.id, opt)}
                      className="mr-3 accent-yellow-400"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-semibold px-8 py-2 rounded transition duration-200 shadow"
            >
              Submit Quiz
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mt-12 p-6 bg-white shadow rounded-xl">
          <h3 className="text-2xl font-bold text-green-600 mb-4">
            Your Score: {result.score} / {questions.length}
          </h3>
          <p className="text-indigo-800">Great job! 🎉</p>

          <div className="mt-6 p-4 border-t border-gray-200 text-sm text-gray-700">
            📊 <span className="font-medium text-blue-700">Want to see your full performance history?</span><br />
            Click below to view your progress over time.
          </div>

          <button
            onClick={() => navigate("/result")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition duration-200"
          >
            View Performance
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
