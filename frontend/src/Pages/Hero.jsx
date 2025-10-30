import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center h-screen px-4 text-center bg-gradient-to-b from-gray-900 to-gray-700 text-white">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
        Welcome to Favorite Movies & TV Shows
      </h1>

      <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl">
        Manage all your favorite entertainment in one place.
      </p>
    </section>
  );
};

export default Hero;
