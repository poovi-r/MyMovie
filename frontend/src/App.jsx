import { BrowserRouter , Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Hero from "./Pages/Hero";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import MovieList from "./Components/MovieList";
import MovieForm from "./Components/MovieForm";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/add" element={<MovieForm />} />
        <Route path="/edit/:id" element={<MovieForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
