import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import AdminLogin from "./pages/AdminLogin";
import RoleSelectionScreen from "./pages/RoleSection-Signup";
import StudentDetailsScreen from "./pages/StudentDetails-signup";
import CampusRepDetailsScreen from "./pages/CampusRepDetails";
import SuccessScreen from "./pages/SuccessScreen";
import VerifyingScreen from "./pages/Verifying";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  const location = useLocation();
  const authPages = ['/login', '/signup', '/role-selection', '/student-details', '/campus-rep-details', '/success', '/verifying', '/admin-login'];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div className="app-container">
    {!isAuthPage && <Header />}
      <main className="app-content">
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} /> 
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/role-selection" element={<RoleSelectionScreen />} />
      <Route path="/student-details" element={<StudentDetailsScreen />} />
      <Route path="/campus-rep-details" element={<CampusRepDetailsScreen />} />
      <Route path="/verifying" element={<VerifyingScreen />} />
      <Route path="/success" element={<SuccessScreen />} />
    </Routes>
    </main>
    {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;