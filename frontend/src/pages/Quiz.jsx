import React from "react";
import { useNavigate } from "react-router-dom";

const subjects = [
  "Pakistan Affairs",
  "International Affairs",
  "Science and Tech",
  "Sports",
  "Economy",
  "Environment",
  "Defence",
  "Education",
  "Health",
  "Miscellaneous",
  "Subjects",
];

const Quiz = () => {
  const navigate = useNavigate();

  const handleClick = (subject) => {
    const path = `/quiz/${subject.toLowerCase().replace(/\s+/g, "-")}`;
    navigate(path);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <h1 className="text-3xl mb-6 text-gray-800 font-semibold">Quiz Subjects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject}
            onClick={() => handleClick(subject)}
            className="bg-gray-100 p-5 rounded-lg cursor-pointer shadow hover:bg-blue-100 hover:scale-105 transition transform duration-200 font-medium"
          >
            {subject}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
