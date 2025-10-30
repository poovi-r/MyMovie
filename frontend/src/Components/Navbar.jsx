import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const path = location.pathname;

  return (
    <nav className="bg-gray-900 text-white shadow-lg py-4 px-4 md:px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="text-xl md:text-2xl font-bold hover:text-indigo-300 transition-colors duration-200"
        >
          🎬 MyMovies
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-800"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Nav Links */}
        <div
          className={`${
            isMenuOpen
              ? "flex flex-col absolute top-full left-0 right-0 bg-gray-900 p-4 space-y-3"
              : "hidden"
          } md:flex md:flex-row md:static md:space-y-0 md:gap-6 md:items-center`}
        >
          {isLoggedIn ? (
            <>
              <Link
                to="/movies"
                className={`px-3 py-2 rounded-md transition-all duration-200 ${
                  path === "/movies"
                    ? "bg-indigo-800 text-indigo-200"
                    : "hover:text-gray-300 hover:bg-gray-800"
                }`}
              >
                Movies
              </Link>
              <Link
                to="/add"
                className={`px-3 py-2 rounded-md transition-all duration-200 ${
                  path === "/add"
                    ? "bg-indigo-800 text-indigo-200"
                    : "hover:text-gray-300 hover:bg-gray-800"
                }`}
              >
                Add Movie
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md hover:text-red-400 hover:bg-red-900/20 font-medium transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {path === "/" && (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md hover:text-gray-300 hover:bg-gray-800 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-2 rounded-md hover:text-gray-300 hover:bg-gray-800 transition-all duration-200"
                  >
                    Signup
                  </Link>
                </>
              )}

              {path === "/login" && (
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-md hover:text-gray-300 hover:bg-gray-800 transition-all duration-200"
                >
                  Signup
                </Link>
              )}

              {path === "/signup" && (
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md hover:text-gray-300 hover:bg-gray-800 transition-all duration-200"
                >
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
