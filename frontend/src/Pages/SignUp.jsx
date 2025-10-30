import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axiosInstance, { API_PATHS } from "../Utils/apiPaths.js";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const { data } = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData);

      if (data.success) {
        setSuccessMsg(data.message);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMsg(data.message || "Registration failed");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-gray-100 mt-4 sm:mt-6 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-indigo-200">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-2">
          Create Account
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4 sm:mb-6">
          Join <span className="font-semibold text-indigo-600">Favorite Movies</span> and start exploring
        </p>

        {errorMsg && (
          <p className="text-red-500 text-center font-medium animate-pulse mb-3">
            {errorMsg}
          </p>
        )}
        {successMsg && (
          <p className="text-green-600 text-center font-medium mb-3">
            {successMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors duration-200 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiFillEyeInvisible className="h-5 w-5" />
                ) : (
                  <AiFillEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors duration-200 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiFillEyeInvisible className="h-5 w-5" />
                ) : (
                  <AiFillEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-800 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-200"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
