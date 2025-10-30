import mongoose from "mongoose";

const moviesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter the movie title"],
      trim: true,
      minlength: [2, "Movie title must be at least 2 characters long"],
      maxlength: [100, "Movie title cannot exceed 100 characters"],
      unique: true,
    },
    type: {
      type: String,
      enum: ["movie", "series", "documentary"],
      required: [true, "Please specify the type of content"],
    },
    genres: {
      type: [String],
      enum: [
        "Action",
        "Adventure",
        "Comedy",
        "Horror",
        "Romance",
        "Sci-Fi",
        "Thriller",
        "Other"
      ],
      required: [true, "Please enter at least one genre"],
    },
    director: {
      type: String,
      required: [true, "Please enter the director's name"],
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, "Please enter the budget"],
      min: [1, "Budget must be a positive number"],
    },
    country: {
      type: String,
      required: [true, "Please enter the country"],
      trim: true,
    },
    language: {
      type: String,
      default: "English",
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Please enter the duration in minutes"],
      min: [1, "Duration must be at least 1 minute"],
    },
    releaseYear: {
      type: Number,
      required: [true, "Please enter the release year"],
      max: [new Date().getFullYear(), "Release year cannot be in the future"],
    },
    moviePoster: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Movie must be associated with a user"],
    },
  },
  { timestamps: true }
);

moviesSchema.pre("save", async function (next) {
  const User = mongoose.model("User");
  const user = await User.findById(this.createdBy);
  if (!user) {
    return next(new Error("User not found"));
  }
  next();
});

const Movie = mongoose.model("Movie", moviesSchema);
export default Movie;
