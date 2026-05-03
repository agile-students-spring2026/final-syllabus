import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInputs";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();
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
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login(data.user, data.token);
      if (data.user?.role === "campus-rep" || data.user?.role === "campus_rep") {
        navigate("/camp-rep-dashboard");
      } else {
        navigate("/home");
      }
    } catch {
      setError("Could not connect to server");
    }
  }

  return (
    <AuthCard
      title="LOGO"
      subtitle="Log in / Sign in to access your study resources on Syllabus+"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your school email"
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

          <button type="button" className="link-button">
            Forgot password?
          </button>
        </div>
        <p className="auth-footer-text">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="primary-btn">
          Log in
        </button>

      </form>
    </AuthCard>
  );
}

export default Login;