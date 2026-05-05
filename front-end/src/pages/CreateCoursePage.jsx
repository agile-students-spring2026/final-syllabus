import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./CreateCoursePage.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [school, setSchool] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("code", code.trim());
    formData.append("description", description.trim());
    formData.append("school", school.trim() || "");
    if (image) {
      formData.append("image", image);
    }

    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE}/courses/create`, {
        method: "POST",
        headers,
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not create course");
        setSubmitting(false);
        return;
      }
      navigate("/submission-confirm");
    } catch (err) {
      setError("Network error. Is the API running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="createFormPage">
      <header className="createHeader">
        <Link to="/home" className="logoStub">Syllabus+</Link>
        <Link to="/resources" className="backLink">
          Back
        </Link>
      </header>

      <main className="createMain">
        <h1>Create Course</h1>

        {error && <p className="status-message error" style={{ marginBottom: "1rem" }}>{error}</p>}

        <form className="createForm" onSubmit={handleSubmit}>
          <label className="fieldLabel">
            Course name
            <input
              className="textInput"
              placeholder="e.g. Intro to Computer Science"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="fieldLabel">
            Course code
            <input
              className="textInput"
              placeholder="e.g. CS101 (unique in the system)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </label>

          <label className="fieldLabel">
            School
            <input
              className="textInput"
              placeholder="e.g. NYU"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </label>

          <label className="fieldLabel">
            Course description
            <textarea
              className="textArea"
              rows={5}
              placeholder="Describe the course"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <label className="fieldLabel">
            Upload course image
            <input 
              className="textInput" 
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          {imagePreview && (
            <div style={{ marginBottom: "1rem" }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "8px" }}
              />
            </div>
          )}

          <Link to="/create-resource" className="pillButton">
            Add resources
          </Link>

          <div className="formActions">
            <button className="submitBtn" type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateCoursePage;