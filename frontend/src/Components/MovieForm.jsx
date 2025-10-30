import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance, { API_PATHS } from "../Utils/apiPaths.js";

const MovieForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [movieData, setMovieData] = useState({
    title: "",
    director: "",
    country: "",
    language: "",
    duration: "",
    releaseYear: "",
    type: "",
    genres: [],
    budget: "",
    moviePoster: "",
  });

  const [posterFile, setPosterFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchMovie = async () => {
        try {
          const res = await axiosInstance.get(API_PATHS.MOVIES.GET_MOVIE_BY_ID(id));
          setMovieData(res.data.data);
          setPreview(res.data.data.moviePoster || null);
        } catch (err) {
          console.error("Error fetching movie:", err);
          setError("Failed to load movie details");
        }
      };
      fetchMovie();
    }
  }, [id]);

  const validateMovie = () => {
    if (!movieData.title || movieData.title.length < 2)
      return "Title must be at least 2 characters long";
    if (!movieData.type) return "Please select a movie type";
    if (!movieData.genres || movieData.genres.length === 0)
      return "Please select at least one genre";
    if (!movieData.director) return "Please enter the director's name";
    if (!movieData.budget || movieData.budget < 1)
      return "Budget must be a positive number";
    if (!movieData.duration || movieData.duration < 1)
      return "Duration must be at least 1 minute";
    if (!movieData.releaseYear || movieData.releaseYear > new Date().getFullYear())
      return "Release year cannot be in the future";
    return null;
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadPoster = async (movieId) => {
    if (!posterFile) return;

    const formData = new FormData();
    formData.append("image", posterFile);

    try {
      const uploadUrl = id
        ? API_PATHS.MOVIES.UPDATE_MOVIE_POSTER(id)
        : API_PATHS.MOVIES.UPLOAD_MOVIE_POSTER(movieId);

      const res = await axiosInstance.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const posterUrl = res.data?.data?.imageUrl || res.data?.moviePoster;
      if (posterUrl) {
        setMovieData((prev) => ({ ...prev, moviePoster: posterUrl }));
        return posterUrl;
      }
      return null;
    } catch (err) {
      console.error("Poster upload failed:", err);
      setError("Failed to upload poster");
      return null;
    }
  };

  const handleDeletePoster = async () => {
    if (!id || !movieData.moviePoster) return;

    if (confirm("Are you sure you want to delete this poster?")) {
      try {
        await axiosInstance.delete(API_PATHS.MOVIES.DELETE_MOVIE_POSTER(id));
        setMovieData({ ...movieData, moviePoster: "" });
        setPreview(null);
        alert("Poster deleted successfully!");
      } catch (err) {
        console.error("Failed to delete poster:", err);
        setError("Failed to delete poster");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const validationError = validateMovie();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      let res;
      if (id) {
        res = await axiosInstance.put(API_PATHS.MOVIES.UPDATE_MOVIE(id), movieData);
      } else {
        res = await axiosInstance.post(API_PATHS.MOVIES.CREATE_MOVIE, movieData);
      }

      const movieId = id || res.data.data._id;

      if (posterFile) {
        const posterUrl = await uploadPoster(movieId);
        if (posterUrl) {
          await axiosInstance.put(API_PATHS.MOVIES.UPDATE_MOVIE(movieId), {
            ...movieData,
            moviePoster: posterUrl,
          });
          setMovieData((prev) => ({ ...prev, moviePoster: posterUrl }));
          setPreview(posterUrl);
        }
      }

      alert(id ? "✅ Movie updated successfully!" : "✅ Movie created successfully!");
      navigate("/movies");
    } catch (err) {
      console.error("Error saving movie:", err.response?.data || err.message);
      if (err.response?.data?.error?.includes("E11000")) {
        setError("A movie with this title already exists!");
      } else {
        setError(err.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-6 py-12">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl p-10 mt-15 transition-all duration-300 hover:shadow-indigo-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          {id ? "Update Movie Details" : "🎬 Add New Movie"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Poster Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Movie Poster</label>

            {preview ? (
              <div className="flex flex-col items-center">
                <img
                  src={preview}
                  alt="Poster Preview"
                  className="w-48 h-64 object-cover rounded-xl shadow-md mb-3 border border-gray-200"
                />
                <div className="flex gap-3">
                  <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm shadow transition-all duration-200">
                    Change Poster
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterChange}
                      className="hidden"
                    />
                  </label>
                  {id && (
                    <button
                      type="button"
                      onClick={handleDeletePoster}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm shadow transition-all duration-200"
                    >
                      Delete Poster
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm shadow transition-all duration-200">
                Upload Poster
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Title</label>
            <input
              value={movieData.title}
              onChange={(e) => setMovieData({ ...movieData, title: e.target.value })}
              type="text"
              placeholder="Enter movie title"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
            />
          </div>

          {/* Director */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Director</label>
            <input
              value={movieData.director}
              onChange={(e) => setMovieData({ ...movieData, director: e.target.value })}
              type="text"
              placeholder="Enter director name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
            />
          </div>

          {/* Country & Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Country</label>
              <input
                value={movieData.country}
                onChange={(e) => setMovieData({ ...movieData, country: e.target.value })}
                type="text"
                placeholder="Enter country"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Language</label>
              <input
                value={movieData.language}
                onChange={(e) => setMovieData({ ...movieData, language: e.target.value })}
                type="text"
                placeholder="Enter language"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Type</label>
            <select
              value={movieData.type}
              onChange={(e) => setMovieData({ ...movieData, type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
            >
              <option value="">Select type</option>
              <option value="movie">Movie</option>
              <option value="series">Series</option>
              <option value="documentary">Documentary</option>
            </select>
          </div>

          {/* Genres */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Genres (Select multiple)
            </label>
            <select
              value={movieData.genres}
              onChange={(e) =>
                setMovieData({
                  ...movieData,
                  genres: Array.from(e.target.selectedOptions, (opt) => opt.value),
                })
              }
              multiple
              className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
            >
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Comedy">Comedy</option>
              <option value="Horror">Horror</option>
              <option value="Romance">Romance</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Thriller">Thriller</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Budget, Duration, Release Year */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Budget ($)", field: "budget", placeholder: "e.g. 20000000" },
              { label: "Duration (min)", field: "duration", placeholder: "e.g. 120" },
              { label: "Release Year", field: "releaseYear", placeholder: "e.g. 2023" },
            ].map(({ label, field, placeholder }) => (
              <div key={field}>
                <label className="block text-gray-700 font-medium mb-1">{label}</label>
                <input
                  value={movieData[field]}
                  onChange={(e) =>
                    setMovieData({ ...movieData, [field]: e.target.value })
                  }
                  type="number"
                  placeholder={placeholder}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                />
              </div>
            ))}
          </div>

                    {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white font-semibold py-2.5 px-8 rounded-lg shadow-md transition-all duration-300`}
            >
              {loading ? "Saving..." : id ? "Update Movie" : "Add Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieForm;
