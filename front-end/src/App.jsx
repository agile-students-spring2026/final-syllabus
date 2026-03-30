import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SavedCourses from "./pages/SavedCourses";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import AdminLogin from "./pages/AdminLogin";
import RoleSelectionScreen from "./pages/RoleSection-Signup";
import StudentDetailsScreen from "./pages/StudentDetails-signup";
import CampusRepDetailsScreen from "./pages/CampusRepDetails";
import SuccessScreen from "./pages/SuccessScreen";
import VerifyingScreen from "./pages/Verifying";
import CourseDetails from "./pages/CourseDetail";
import ResourcePage from "./pages/ResourcePage";
import UserResourcesPage from "./pages/UserResourcesPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import CreateResourcePage from "./pages/CreateResourcePage";
import CampRepDashboard from "./pages/CampRepDashboard";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";

function App() {
  const location = useLocation();
  const authPages = ['/login', '/signup', '/role-selection', '/student-details', '/campus-rep-details', '/success', '/verifying', '/admin-login', '/camp-rep-dashboard'];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div className="app-container">
      <Toaster />
      {!isAuthPage && <Header />}
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/saved" element={<SavedCourses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/role-selection" element={<RoleSelectionScreen />} />
          <Route path="/student-details" element={<StudentDetailsScreen />} />
          <Route path="/campus-rep-details" element={<CampusRepDetailsScreen />} />
          <Route path="/verifying" element={<VerifyingScreen />} />
          <Route path="/success" element={<SuccessScreen />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />
          <Route path="/courses/:courseId/resources" element={<ResourcePage />} />
          <Route path="/resources" element={<UserResourcesPage />} />
          <Route path="/create-course" element={<CreateCoursePage />} />
          <Route path="/create-resource" element={<CreateResourcePage />} />
          <Route path="/camp-rep-dashboard" element={<CampRepDashboard />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;