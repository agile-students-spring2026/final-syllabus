import { Link } from "react-router-dom";
import { useState } from "react";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInputs";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    alert("Sign-up UI submitted");
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Join Syllabus+ and start learning from peer-created resources"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthInput
          label="Full name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
        />

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
          placeholder="Create a password"
        />

        <AuthInput
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
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
          Create account
        </button>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthCard>
  );
}

export default Signup;