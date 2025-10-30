import express from "express";
import { protect } from "../Middlewares/authMiddleware.js";
import { upload } from "../Middlewares/uploadMiddleware.js";
import {
  createMovie,
  deleteMovie,
  deleteMoviePoster,
  getMovieById,
  getMovies,
  updateMovie,
  updateMoviePoster,
  uploadMoviePoster
} from "../Controllers/moviesController.js";


const router = express.Router();

router.get("/", protect, getMovies);
router.get("/:id", protect, getMovieById);

router.post("/create", protect, createMovie);
router.put("/:id", protect, updateMovie);
router.delete("/:id", protect, deleteMovie);

router.post("/upload-poster/:id",protect, upload.single("image"), uploadMoviePoster);
router.put("/upload-poster/:id", protect, upload.single("image"), updateMoviePoster);

router.delete("/delete-poster/:id", protect, deleteMoviePoster);

export default router;
