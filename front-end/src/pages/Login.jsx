import { Link } from "react-router-dom";
import { useState } from "react";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInputs";

function Login() {
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
    alert("Student login UI submitted");
  }

  return (
    <AuthCard
      title="LOGO"
      subtitle="Log in / Sign up  to access your study resources on Syllabus+"
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
        <Link to="/home">
        <button type="submit" className="primary-btn">
          Log in 
        </button>
        </Link>
        <p className="auth-footer-text">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>

        <div className="divider">Or continue with</div>

        <div className="social-buttons">
          <button type="button" className="social-btn">
            Sign in with Google
          </button>
          <button type="button" className="social-btn">
            Sign in with Apple
          </button>
        </div>

        <p className="auth-footer-text">
          Sign in as a <Link to="/admin-login">Campus Rep</Link>
        </p>
      </form>
    </AuthCard>
  );
}

export default Login;