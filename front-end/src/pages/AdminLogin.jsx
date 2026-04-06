import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInputs";

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    navigate("/camp-rep-dashboard");
  }

  return (
    <AuthCard
      title="Campus Rep Login"
      subtitle="Access the Rep dashboard"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your campus rep email"
        />

        <AuthInput
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />

        <div className="auth-options">
          <button
            type="button"
            className="link-button"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide password" : "Show password"}
          </button>
        </div>

        <button type="submit" className="primary-btn">
          Sign in as Campus Rep
        </button>

        <p className="auth-footer-text">
          Not an Campus Rep? <Link to="/login">Log in as student</Link>
        </p>
      </form>
    </AuthCard>
  );
}

export default AdminLogin;