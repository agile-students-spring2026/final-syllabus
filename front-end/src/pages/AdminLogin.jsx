import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInputs";

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
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

  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3001/api/auth/campus-rep/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login(data.user);
      navigate("/camp-rep-dashboard");
    } catch {
      setError("Could not connect to server");
    }
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

        {error && <p className="auth-error">{error}</p>}

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