import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bearerHeaders } from "../utils/apiAuth";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

/** Matches back-end Resource.category enum */
const RESOURCE_TYPE_OPTIONS = [
  { value: "notes", label: "Notes" },
  { value: "flashcards", label: "Flashcards" },
  { value: "videos", label: "Videos" },
  { value: "practice", label: "Practice" },
];

const ACCEPT_BY_TYPE = {
  notes: ".pdf,.doc,.docx,.txt,.md,.ppt,.pptx",
  videos: "video/*,.mp4,.webm,.mov,.m4v,.mkv",
  flashcards: ".json,.csv,.txt",
  practice: ".pdf,.doc,.docx,.txt,.md",
};

const HINT_BY_TYPE = {
  notes: "PDF, Word, PowerPoint, or text",
  videos: "MP4, WebM, MOV, or similar",
  flashcards: "JSON, CSV, or text",
  practice: "PDF, Word, or text",
};

function fileExtension(name) {
  const n = name || "";
  const i = n.lastIndexOf(".");
  if (i < 0) return "";
  return n.slice(i).toLowerCase();
}

function extensionOkForType(ext, resourceType) {
  if (!resourceType || !ext) return false;
  const allow = {
    notes: new Set([".pdf", ".doc", ".docx", ".txt", ".md", ".ppt", ".pptx"]),
    videos: new Set([".mp4", ".webm", ".mov", ".m4v", ".mkv"]),
    flashcards: new Set([".json", ".csv", ".txt"]),
    practice: new Set([".pdf", ".doc", ".docx", ".txt", ".md"]),
  }[resourceType];
  return allow ? allow.has(ext) : false;
}

const CreateResourcePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromDirect = searchParams.get("from") === "direct";
  const { user, token } = useAuth();
  const fileInputRef = useRef(null);

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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

  const pickFile = useCallback(() => {
    if (!resourceType) return;
    fileInputRef.current?.click();
  }, [resourceType]);

  const applyFile = useCallback(
    (file) => {
      if (!resourceType || !file) return;
      const ext = fileExtension(file.name);
      if (!extensionOkForType(ext, resourceType)) {
        setSubmitError(
          `That file type doesn't match "${RESOURCE_TYPE_OPTIONS.find((o) => o.value === resourceType)?.label ?? resourceType}". ${HINT_BY_TYPE[resourceType]}.`
        );
        setSelectedFile(null);
        return;
      }
      setSubmitError(null);
      setSelectedFile(file);
    },
    [resourceType]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer?.files?.[0];
      applyFile(file);
    },
    [applyFile]
  );

  const onResourceTypeChange = (nextType) => {
    setResourceType(nextType);
    setSubmitError(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function handleSubmit() {
    setSubmitError(null);
    if (!title.trim()) {
      setSubmitError("Please enter a title.");
      return;
    }
    if (!selectedCourseId) {
      setSubmitError("Please select a course.");
      return;
    }
    if (!resourceType) {
      setSubmitError("Please select a resource type.");
      return;
    }
    if (!selectedFile) {
      setSubmitError("Please choose a file to upload.");
      return;
    }

    const ext = fileExtension(selectedFile.name);
    if (!extensionOkForType(ext, resourceType)) {
      setSubmitError("File type doesn't match the selected resource type.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("courseId", selectedCourseId);
    formData.append("category", resourceType);
    formData.append("file", selectedFile);
    if (user?.id) formData.append("uploadedBy", String(user.id));

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/resources/upload`, {
        method: "POST",
        headers: bearerHeaders(token),
        body: formData,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || `Upload failed (${res.status})`);
      }
      if (fromDirect) {
        navigate("/submission-confirm");
      } else {
        navigate(-1);
      }
    } catch (err) {
      setSubmitError(err.message || "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  const uploadDisabled = !resourceType;
  const typeHint = resourceType ? HINT_BY_TYPE[resourceType] : null;

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
            Title
            <input
              className="textInput"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="fieldLabel">
            Resource type
            <select
              className="textInput courseSelect"
              value={resourceType}
              onChange={(e) => onResourceTypeChange(e.target.value)}
              aria-label="Resource type"
            >
              <option value="">Select a type</option>
              {RESOURCE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <div className="fieldLabel">
            <span>Upload</span>
            {typeHint ? (
              <p className="fieldHint">{typeHint}</p>
            ) : (
              <p className="fieldHint">Choose a resource type first, then add your file.</p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="uploadInputHidden"
              accept={resourceType ? ACCEPT_BY_TYPE[resourceType] : undefined}
              aria-hidden
              tabIndex={-1}
              onChange={(e) => {
                const file = e.target.files?.[0];
                applyFile(file);
                e.target.value = "";
              }}
            />
            <div
              className={`textInput filePick ${dragOver ? "filePick--drag" : ""} ${uploadDisabled ? "filePick--disabled" : ""}`}
              onClick={() => pickFile()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pickFile();
                }
              }}
              role="button"
              tabIndex={uploadDisabled ? -1 : 0}
              aria-label="Choose file to upload"
              onDragEnter={(e) => {
                e.preventDefault();
                if (!uploadDisabled) setDragOver(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (!uploadDisabled) setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={uploadDisabled ? undefined : onDrop}
            >
              <span
                className={`filePick__text ${!selectedFile ? "filePick__text--placeholder" : ""}`}
              >
                {uploadDisabled
                  ? "Select a resource type first"
                  : selectedFile
                    ? selectedFile.name
                    : "Choose file..."}
              </span>
            </div>
          </div>

          {submitError ? <p className="fieldHint fieldHint--error">{submitError}</p> : null}

          <div className="formActions">
            <button
              className="submitBtn"
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Uploading…" : "Add"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateResourcePage;
