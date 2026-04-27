import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Past Papers", path: "/past-papers" },
    { name: "Quiz", path: "/quiz" },
    { name: "Current Affairs", path: "/current-affairs" },
    { name: "Mock Test", path: "/mock-test" }, // direct TestStart page
  ];

  return (
    <nav className="bg-indigo-900 shadow-md w-full px-6 py-3 fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center h-20">
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-extrabold text-yellow-400 tracking-wide select-none">
            StudyHub
          </h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-100 hover:text-yellow-300 font-semibold text-lg transition duration-200"
            >
              {item.name}
            </Link>
          ))}

          {/* Login/Logout */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="ml-4 bg-yellow-400 text-indigo-900 px-4 py-1 rounded font-bold hover:bg-yellow-300 transition duration-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/register"
              className="ml-4 bg-yellow-400 text-indigo-900 px-4 py-1 rounded font-bold hover:bg-yellow-300 transition duration-200"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-yellow-400 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 flex flex-col items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="text-yellow-300 font-semibold text-lg"
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Login/Logout */}
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="bg-yellow-400 text-indigo-900 px-4 py-1 rounded font-bold hover:bg-yellow-300"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="bg-yellow-400 text-indigo-900 px-4 py-1 rounded font-bold hover:bg-yellow-300"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
