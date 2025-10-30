import { v2 as cloudinary } from 'cloudinary';
import { getPublicIdFromUrl, uploadBufferToCloudinary } from '../Middlewares/uploadMiddleware.js';
import Movie from '../Models/moviesModel.js';


// -------------------------------- Create new movie --------------------------------------------------------------
export const createMovie = async (req, res) => {

  try {
    console.log("📩 Received body:", req.body);
    console.log("👤 User:", req.user);
    const userId = req.user._id;

    const {
      title,
      type,
      genres,
      director,
      budget,
      country,
      language,
      duration,
      releaseYear,
      moviePoster,
    } = req.body;

    if (!title || !type || !genres || !director || !budget || !country || !language || !duration || !releaseYear) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, type, genres, director, budget, country, language, duration, releaseYear'
      });
    }

    const newMovie = new Movie({
      createdBy: userId,
      title,
      type,
      genres,
      director,
      budget,
      country,
      language,
      duration,
      releaseYear,
      moviePoster,
    });

    const savedMovie = await newMovie.save();

    await savedMovie.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: savedMovie
    });
  } catch (error) {
    console.error("❌ CreateMovie Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
      stack: error.stack,
    });
  }
}

// -------------------------------- Get Movies --------------------------------------------------------------
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find()
      .populate("createdBy", "id name email")
    if (!movies) {
      return res.status(404).json({
        success: false,
        message: "No Movies found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Movies fetched successfully",
      data: movies
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// -------------------------------- Get Movie By Id --------------------------------------------------------------
export const getMovieById = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId)
      .populate("createdBy", "name email");

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Movie fetched successfully",
      data: movie
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// -------------------------------- Update Movie --------------------------------------------------------------
export const updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const userId = req.user._id;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    if (movie.createdBy.toString() !== userId.toString()) {
      return res.status(404).json({
        success: false,
        message: "Not authorized. only the creator can update the movie"
      });
    }

    const allowedUpdates = [
      "title", "type", "genres", "director", "budget", "country", "language", "duration", "releaseYear", "moviePoster"
    ];
    const updates = {};
    allowedUpdates.forEach((key) => {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    })

    Object.assign(movie, updates);

    if (movie.budget < 0) {
      return res.status(400).json({
        success: false,
        message: "Budget cannot be negative"
      });
    }

    const updatedMovie = await movie.save();
    await updatedMovie.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: updatedMovie
    });


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// -------------------------------- Delete Movie --------------------------------------------------------------
export const deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const userId = req.user._id;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    if (movie.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this movie",
      });
    }

    if (movie.moviePoster) {
      try {
        const publicId = getPublicIdFromUrl(movie.moviePoster);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (err) {
        console.warn("Failed to delete movie poster:", err.message);
      }
    }

    await movie.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// -------------------------------- Movie Poster Upload --------------------------------------------------------------
export const uploadMoviePoster = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "Movie-Posters",
      resource_type: "image"
    });

    const imageUrl = result.secure_url;
    return res.status(200).json({
      success: true,
      message: "Movie Poster uploaded successfully",
      data: {
        imageUrl: imageUrl
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// -------------------------------- Movie Poster Update --------------------------------------------------------------
export const updateMoviePoster = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const movieId = req.params.id;
    const userId = req.user._id;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }
    if (movie.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this movie poster"
      });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "Movie-Posters",
      resource_type: "image"
    });

    const oldImageUrl = movie.moviePoster;
    const newImageUrl = result.secure_url;

    movie.moviePoster = newImageUrl;
    await movie.save();

    if (oldImageUrl) {
      try {
        const publicId = getPublicIdFromUrl(oldImageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (err) {
        console.warn("Failed to delete old image:", err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Movie poster updated successfully",
      data: {
        imageUrl: movie.moviePoster
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// -------------------------------- Delete Movie Poster --------------------------------------------------------------
export const deleteMoviePoster = async (req, res) => {
  try {
    const movieId = req.params.id;
    const userId = req.user._id;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }
    if (movie.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this movie poster"
      });
    }

    const oldImageUrl = movie.moviePoster;

    if (oldImageUrl) {
      try {
        const publicId = getPublicIdFromUrl(oldImageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (err) {
        console.warn("Failed to delete image from Cloudinary:", err.message);
      }
    }

    movie.moviePoster = "";
    await movie.save();


    return res.status(200).json({
      success: true,
      message: "Movie Poster deleted successfully",
      moviePoster: movie.moviePoster
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


