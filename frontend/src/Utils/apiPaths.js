import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mymovie-eryh.onrender.com/",
  withCredentials: true,
});

//interceptor to add the token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const API_PATHS = {
  AUTH: {
    REGISTER: "api/auth/register",
    LOGIN: "api/auth/login",
    GET_PROFILE: "api/auth/profile",
    UPDATE_PROFILE: "api/auth/profile",
    CHANGE_PASSWORD: "api/auth/change-password",
    DELETE_ACCOUNT: "api/auth/delete-account"
  },
  MOVIES: {
    GET_ALL_MOVIES: "api/movies",
    GET_MOVIE_BY_ID: (movieId) => `api/movies/${movieId}`,
    CREATE_MOVIE: "api/movies/create",
    UPDATE_MOVIE: (movieId) => `api/movies/${movieId}`,
    DELETE_MOVIE: (movieId) => `api/movies/${movieId}`,
    UPLOAD_MOVIE_POSTER: (movieId) => `api/movies/upload-poster/${movieId}`,
    UPDATE_MOVIE_POSTER: (movieId) => `api/movies/upload-poster/${movieId}`,
    DELETE_MOVIE_POSTER: (movieId) => `api/movies/delete-poster/${movieId}`,
  }
};
export default axiosInstance;