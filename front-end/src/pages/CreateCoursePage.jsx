import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { COURSE_SUBJECTS } from "../utils/courseSubjects";
import "./CreateCoursePage.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
const MAX_IMAGE_BYTES = 450 * 1024;

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { token, user } = useAuth();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedDataUrl, setUploadedDataUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const clearCoverImage = () => {
    setUploadedDataUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image must be smaller than 450KB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedDataUrl(typeof reader.result === "string" ? reader.result : "");
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const schoolFromProfile = user?.school?.trim();
    if (!schoolFromProfile) {
      setError("Add your university in your profile before creating a course.");
      return;
    }

    setSubmitting(true);
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const payload = {
      name: name.trim(),
      code: code.trim(),
      description: description.trim(),
      category: category.trim(),
      school: schoolFromProfile,
    };
    if (uploadedDataUrl) payload.coverImageUrl = uploadedDataUrl;

    try {
      const res = await fetch(`${API_BASE}/courses/create`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
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
        <Link to="/home" className="logoStub">LOGO</Link>
        <Link to="/resources" className="backLink">
            Back
        </Link>
      </header>

      <main className="createMain">
        <h1>Create Course</h1>

        {error && <p className="status-message error" style={{ marginBottom: "1rem" }}>{error}</p>}

        <form className="createForm" onSubmit={handleSubmit}>
          <label className="fieldLabel">
            <span className="fieldLabelTitle">
              Course name{" "}
              <span className="requiredMark" aria-hidden="true">
                *
              </span>
            </span>
            <input
              className="textInput"
              placeholder="e.g. Intro to Computer Science"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-required="true"
            />
          </label>

          <label className="fieldLabel">
            <span className="fieldLabelTitle">
              Course code{" "}
              <span className="requiredMark" aria-hidden="true">
                *
              </span>
            </span>
            <input
              className="textInput"
              placeholder="e.g. CS101 (unique in the system)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              aria-required="true"
            />
          </label>

          <label className="fieldLabel">
            <span className="fieldLabelTitle">
              Course / category{" "}
              <span className="requiredMark" aria-hidden="true">
                *
              </span>
            </span>
            <select
              className="selectInput"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              aria-required="true"
              aria-label="Course subject"
            >
              <option value="" disabled>
                Subject
              </option>
              {COURSE_SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </label>

          <label className="fieldLabel">
            <span className="fieldLabelTitle">
              Course description{" "}
              <span className="requiredMark" aria-hidden="true">
                *
              </span>
            </span>
            <textarea
              className="textArea"
              rows={5}
              placeholder="Describe the course"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              aria-required="true"
            />
          </label>

          <div className="coverImageBlock">
            <span className="fieldLabelTitle">Course Image</span>
            <div className="courseImagePickArea">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="courseImageOverlayInput"
                onChange={handleImageFile}
                aria-label={uploadedDataUrl ? "Change course image" : "Choose course image"}
              />
              {uploadedDataUrl ? (
                <>
                  <img src={uploadedDataUrl} alt="" className="courseImageThumb" />
                  <span className="courseImageHint">Change image</span>
                </>
              ) : (
                <span className="courseImageHint">Choose image</span>
              )}
            </div>
            {uploadedDataUrl ? (
              <button type="button" className="courseImageRemoveLink" onClick={clearCoverImage}>
                Remove image
              </button>
            ) : null}
          </div>

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
