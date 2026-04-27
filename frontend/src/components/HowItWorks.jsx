import React from "react";
import { FaBook, FaPenFancy, FaCheckCircle, FaRocket } from "react-icons/fa";

export default function HowItWorks() {
  const steps = [
    {
      icon: <FaBook />,
      title: "Choose Your Subject",
      description:
        "Select the subject you want to prepare for from our extensive list of PPSC topics.",
    },
    {
      icon: <FaPenFancy />,
      title: "Practice Quizzes & Past Papers",
      description:
        "Test your knowledge with quizzes and solve past papers tailored to your exam pattern.",
    },
    {
      icon: <FaCheckCircle />,
      title: "Take Mock Tests",
      description:
        "Simulate real exam conditions with full-length mock tests to build confidence and timing.",
    },
    {
      icon: <FaRocket />,
      title: "Track Your Progress",
      description:
        "Monitor your scores and improve continuously with detailed feedback and analytics.",
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 mt-20 mb-24">
      <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-12 text-center">
        How It Works
      </h2>

      <div className="relative border-l-4 border-yellow-400 ml-4 md:ml-12">
        {steps.map((step, idx) => (
          <div key={idx} className="mb-10 ml-6 md:ml-12 relative">
            {/* Icon circle */}
            <div className="absolute -left-8 top-0 flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 text-indigo-900 text-2xl shadow-md">
              {step.icon}
            </div>

            {/* Card content */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
