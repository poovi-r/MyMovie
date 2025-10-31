# 🎬 Movie Management System (MERN Stack)

A full-stack **Movie Management System** built using the **MERN Stack** — MongoDB, Express, React, and Node.js.  
It allows users to **manage Movies, Series, and Documentaries**, including features like authentication, CRUD operations, and image uploads to Cloudinary.

---

## 🚀 Features

### 👥 User Features
- User Authentication (Signup & Login)
- Add, Edit, Delete Movies, Series, and Documentaries
- Upload and update posters via **Cloudinary**
- Filter by category (All / Movies / Series / Documentaries)
- Input validation for all fields (client + server)
- Restricts future release years

### ⚙️ Admin/Backend Features
- JWT-based protected routes
- Secure file upload using Multer
- Cloud image storage via Cloudinary
- Mongoose validation and error handling
- Role-based resource control

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js (Vite), Tailwind CSS, Axios, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT |
| **Image Upload** | Multer + Cloudinary |
| **Deployment** | Render |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone [https://github.com/PoovarasanR/movie-management-system.git](https://github.com/poovi-r/MyMovie)
cd movie-management-system

🖥️ Backend Setup
Navigate to Backend Folder
cd backend

Install Dependencies
npm install

Create Environment File

Create a .env file in /backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Start Backend Server
npm run dev


Server will start on http://localhost:5000

🎨 Frontend Setup
Navigate to Frontend Folder
cd ../frontend

Install Dependencies
npm install

Configure API Base URL

In /frontend/src/Utils/apiPaths.js:

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/",
  withCredentials: true,
});

export default axiosInstance;

Start Frontend
npm run dev


Frontend runs on http://localhost:5173

🗄️ Database Schema
🎬 Movie Schema (/backend/Models/movieModel.js)
import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["movie", "series", "documentary"], required: true },
    genres: [{ type: String, required: true }],
    director: { type: String, required: true },
    country: { type: String, required: true },
    language: { type: String, required: true },
    duration: { type: Number, required: true },
    releaseYear: { type: Number, required: true },
    budget: { type: Number, required: true },
    moviePoster: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);

👤 User Schema (/backend/Models/userModel.js)
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", userSchema);

🔑 Demo Credentials

Use these credentials to test the application:

Role	      Email	          Password
Demo User	 user@example.com  Pass@123
	
🌐 Deployment
Backend (Render)

Push your backend to GitHub.

Create a new Web Service on Render
.

Add all .env variables.

Set build & start commands:

npm install
npm start

Frontend (Render)

Build your React app:

npm run build


Deploy the dist folder on Render.

Update backend API URL in axiosInstance with your Render backend link.

🧠 Key Learnings

CRUD operations using MERN Stack

Form and server-side validation

JWT-based Authentication

Cloudinary file uploads

Full-stack deployment (Render)

👨‍💻 Author
Poovarasan R
📧 poovarasan.mern@gmail.com
🔗 LinkedIn: https://www.linkedin.com/in/poovi-r
 • GitHub: https://github.com/poovi-r

“Built with ❤️ using the MERN Stack”


