import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import AdminLogin from "./pages/AdminLogin";
import CourseDetails from "./pages/CourseDetail";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  return (
    <div className="app-container"> 
    <Header/>
      <main className="app-content"> 
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} /> 
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/courses/:courseId" element ={<CourseDetails/>} />
    </Routes>
    </main>
    <Footer/>
    </div>
  );
}

export default App;