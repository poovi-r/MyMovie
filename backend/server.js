import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './Config/db.js';
import authRoute from './Routes/authRoute.js';
import moviesRoute from './Routes/moviesRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/movies", moviesRoute);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});



