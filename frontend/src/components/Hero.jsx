import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-100 text-indigo-900 py-28 px-6 rounded-b-3xl shadow-lg mt-6">
      <div className="max-w-screen-xl mx-auto text-center px-6 md:px-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 tracking-tight leading-tight">
          Prepare for <span className="text-yellow-600">PPSC</span> with Confidence
        </h1>

        <p className="text-lg sm:text-xl mb-12 leading-relaxed text-indigo-700">
          StudyHub provides past papers, quizzes, mock tests, and current affairs updates all in one place.
          Start your journey today and ace your exams!
        </p>

        <button
          onClick={() => navigate("/register")}
          className="bg-yellow-400 text-indigo-900 font-semibold py-4 px-10 rounded-full shadow-md hover:bg-yellow-300 transition duration-300 ease-in-out transform hover:-translate-y-1"
          aria-label="Go to Login or Signup page"
        >
          Start Now
        </button>
      </div>
    </section>
  );
}
