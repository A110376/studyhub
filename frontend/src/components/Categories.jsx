import { Link } from "react-router-dom";
import { FaFileAlt, FaQuestionCircle, FaFlask, FaGlobe, FaChartBar } from "react-icons/fa";

const categories = [
  {
    title: "Past Papers",
    description: "Access solved and unsolved past papers to understand real exam trends.",
    icon: <FaFileAlt className="mx-auto text-yellow-500" />,
    link: "/past-papers",
  },
  {
    title: "Quiz",
    description: "Quick quizzes to test your concepts and knowledge instantly.",
    icon: <FaQuestionCircle className="mx-auto text-yellow-500" />,
    link: "/quiz",
  },
  {
    title: "Mock Test",
    description: "Full-length mock tests to simulate the actual PPSC exam environment.",
    icon: <FaFlask className="mx-auto text-yellow-500" />,
    link: "/mock-test",
  },
  {
    title: "Current Affairs",
    description: "Stay updated with the latest national and international events.",
    icon: <FaGlobe className="mx-auto text-yellow-500" />,
    link: "/current-affairs",
  },
  {
    title: "Result",
    description: "Check your test and exam results quickly and accurately.",
    icon: <FaChartBar className="mx-auto text-yellow-500" />,
    link: "/result",
  },
];

export default function Categories() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 mt-16 mb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {categories.map((cat) => (
          <Link
            to={cat.link}
            key={cat.title}
            className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-200 hover:shadow-lg transition duration-300 ease-in-out group"
          >
            <div className="text-5xl mb-4">{cat.icon}</div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-2 group-hover:text-yellow-600 transition">
              {cat.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{cat.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
