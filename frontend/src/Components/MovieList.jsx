import React, { useEffect, useState } from "react";
import axiosInstance, { API_PATHS } from "../Utils/apiPaths";
import { useNavigate } from "react-router-dom";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(API_PATHS.MOVIES.GET_ALL_MOVIES);
        setMovies(res.data.data);
        setFilteredMovies(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch movies. Try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (selectedType === "All") {
      setFilteredMovies(movies);
    } else {
      setFilteredMovies(
        movies.filter(
          (movie) => movie.type.toLowerCase() === selectedType.toLowerCase()
        )
      );
    }
  }, [selectedType, movies]);

  const handleDelete = async (movieId, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );
    if (!confirmDelete) return;
    try {
      await axiosInstance.delete(API_PATHS.MOVIES.DELETE_MOVIE(movieId));
      setMovies((prev) => prev.filter((movie) => movie._id !== movieId));
      alert("Movie deleted successfully ✅");
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to delete movie. Try again later."
      );
    }
  };

  const formatYear = (year) => (year ? year : "N/A");
  const formatDuration = (duration) => (duration ? `${duration} min` : "N/A");

  if (loading)
    return (
      <div className="text-center py-10 text-lg font-semibold">
        Loading movies...
      </div>
    );

  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white rounded-xl p-4 mt-20 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Your Collection
        </h2>
        <select
          className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All">All</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="documentary">Documentary</option>
        </select>
      </div>

      {filteredMovies.length === 0 ? (
        <p className="text-gray-600 text-center py-10">
          No{" "}
          {selectedType === "All"
            ? "movies"
            : selectedType.toLowerCase()}{" "}
          found.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          {/* Mobile View */}
          <div className="md:hidden space-y-4 p-4">
            {filteredMovies.map((movie) => (
              <div
                key={movie._id}
                className="bg-white p-4 rounded-lg shadow border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  {movie.moviePoster ? (
                    <img
                      src={movie.moviePoster}
                      alt={movie.title}
                      className="h-20 w-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-20 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">No Poster</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{movie.title}</h3>
                    <span className="inline-block mt-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      {movie.type}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    <span className="text-gray-500">Director:</span>{" "}
                    {movie.director}
                  </p>
                  <p>
                    <span className="text-gray-500">Language:</span>{" "}
                    {movie.language}
                  </p>
                  <p>
                    <span className="text-gray-500">Release Year:</span>{" "}
                    {formatYear(movie.releaseYear)}
                  </p>
                  <p>
                    <span className="text-gray-500">Duration:</span>{" "}
                    {formatDuration(movie.duration)}
                  </p>
                  <p>
                    <span className="text-gray-500">Budget:</span> $
                    {movie.budget}
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => navigate(`/edit/${movie._id}`)}
                    className="flex-1 py-2 text-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(movie._id, movie.title)}
                    className="flex-1 py-2 text-center text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <table className="hidden md:table min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs leading-wide font-bold text-left">
              <tr>
                <th className="px-6 py-3">POSTER</th>
                <th className="px-6 py-3">TITLE</th>
                <th className="px-6 py-3">TYPE</th>
                <th className="px-6 py-3">DIRECTOR</th>
                <th className="px-6 py-3">LANGUAGE</th>
                <th className="px-6 py-3">RELEASE YEAR</th>
                <th className="px-6 py-3">DURATION (min)</th>
                <th className="px-6 py-3">BUDGET ($)</th>
                <th className="px-6 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovies.map((movie) => (
                <tr key={movie._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {movie.moviePoster ? (
                      <img
                        src={movie.moviePoster}
                        alt={movie.title}
                        className="h-16 w-12 rounded-md object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No Poster</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {movie.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {movie.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movie.director}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movie.language}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatYear(movie.releaseYear)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDuration(movie.duration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movie.budget}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => navigate(`/edit/${movie._id}`)}
                      className="text-blue-600 hover:text-blue-900 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(movie._id, movie.title)}
                      className="text-red-600 hover:text-red-900 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MovieList;
