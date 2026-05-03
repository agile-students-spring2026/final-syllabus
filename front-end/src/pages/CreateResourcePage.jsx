import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bearerHeaders } from "../utils/apiAuth";
import "./CreateResourcePage.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const CreateResourcePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromDirect = searchParams.get("from") === "direct";
  const { user, token } = useAuth();

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  useEffect(() => {
    const school = user?.school?.trim();
    if (!school) {
      setCourses([]);
      setCoursesLoading(false);
      setCoursesError(null);
      setSelectedCourseId("");
      return;
    }

    const params = new URLSearchParams();
    params.append("school", school);

    setCoursesLoading(true);
    setCoursesError(null);

    fetch(`${API_BASE}/courses?${params.toString()}`, { headers: bearerHeaders(token) })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load courses");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setCourses([]);
        }
        setCoursesLoading(false);
      })
      .catch(() => {
        setCoursesError("Could not load courses.");
        setCourses([]);
        setCoursesLoading(false);
      });
  }, [user?.school, token]);

  return (
    <div className="createFormPage">
      <header className="createHeader">
        <Link to="/home" className="logoStub">LOGO</Link>
        <Link to="/resources" className="backLink">
          Back
        </Link>
      </header>

      <main className="createMain">
        <h1>Create Resources</h1>

        <form className="createForm" onSubmit={(e) => e.preventDefault()}>
          <label className="fieldLabel">
            Select Course
            {!user?.school?.trim() ? (
              <p className="fieldHint">
                Add your university in your profile to see courses for your school.
              </p>
            ) : null}
            {coursesError ? <p className="fieldHint fieldHint--error">{coursesError}</p> : null}
            <select
              className="textInput courseSelect"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              disabled={!user?.school?.trim() || coursesLoading}
              aria-busy={coursesLoading}
            >
              <option value="">
                {coursesLoading ? "Loading courses…" : "Select a course"}
              </option>
              {!coursesLoading &&
                courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </label>

          <label className="fieldLabel">
            Select / Add Category
            <input className="textInput" placeholder="Courses" />
          </label>

          <label className="fieldLabel">
            Topic
            <input className="textInput" placeholder="Topic" />
          </label>

          <label className="fieldLabel">
            Title
            <input className="textInput" placeholder="Title" />
          </label>

          <label className="fieldLabel">
            Resource type selection
            <div className="selectMock">
              <span>Resource</span>
              <span className="caret">▾</span>
            </div>
          </label>

          <label className="fieldLabel">
            Upload
            <div className="uploadBox">Content Upload Area</div>
          </label>

          <div className="formActions">
            <button className="submitBtn" type="button" onClick={() => fromDirect ? navigate('/submission-confirm') : navigate(-1)}>
              Add
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateResourcePage;
