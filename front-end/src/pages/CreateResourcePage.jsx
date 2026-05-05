import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./CreateResourcePage.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const RESOURCE_TYPES = [
  { value: "notes", label: "Notes" },
  { value: "flashcards", label: "Flashcards" },
  { value: "past-questions", label: "Past Questions" },
  { value: "videos", label: "Videos" },
  { value: "practice", label: "Practice" },
];

const CreateResourcePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/courses/all`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCourses(data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please log in first");
      navigate("/login");
      return;
    }
    if (!courseId || !category || !title.trim() || !file) {
      toast.error("All fields and a file are required");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("courseId", courseId);
    formData.append("category", category);
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/resources/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Upload failed");
        return;
      }
      toast.success("Resource submitted for review!");
      navigate("/submission-confirm");
    } catch {
      toast.error("Could not connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="createFormPage">
      <header className="createHeader">
        <Link to="/home" className="logoStub">Syllabus+</Link>
        <Link to="/resources" className="backLink">Back</Link>
      </header>

      <main className="createMain">
        <h1>Create Resources</h1>

        <form className="createForm" onSubmit={handleSubmit}>
          <label className="fieldLabel">
            Select Course
            <select
              className="textInput"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            >
              <option value="">-- Select a course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.code ? ` (${c.code})` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="fieldLabel">
            Resource Type
            <select
              className="textInput"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">-- Select type --</option>
              {RESOURCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>

          <label className="fieldLabel">
            Title
            <input
              className="textInput"
              placeholder="e.g. Week 3 Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label className="fieldLabel">
            Upload File
            <input
              type="file"
              className="textInput"
              style={{ paddingTop: "8px" }}
              onChange={(e) => setFile(e.target.files[0] || null)}
              required
            />
          </label>

          {file && (
            <p style={{ color: "#8fe9e6", fontSize: "0.85rem", margin: 0 }}>
              Selected: {file.name}
            </p>
          )}

          <div className="formActions">
            <button className="submitBtn" type="submit" disabled={submitting}>
              {submitting ? "Uploading…" : "Add"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateResourcePage;
