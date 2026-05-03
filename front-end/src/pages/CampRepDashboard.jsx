import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";
import { COURSE_SUBJECTS } from "../utils/courseSubjects";
import { bearerHeaders } from "../utils/apiAuth";
import "./CampRepDashboard.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const CampRepDashboard = () => {
  const { token, user } = useAuth();
  const location = useLocation();

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState("");
  const [courseCategory, setCourseCategory] = useState("");

  const [pendingKind, setPendingKind] = useState("");
  const [pendingCategory, setPendingCategory] = useState("");
  const [pendingItems, setPendingItems] = useState([]);
  const [verifiedCourses, setVerifiedCourses] = useState(0);
  const [verifiedResources, setVerifiedResources] = useState(0);
  const [schoolLabel, setSchoolLabel] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (recent) params.append("recent", recent);
    if (courseCategory) params.append("category", courseCategory);
    if (user?.school) params.append("school", user.school);

    setCoursesLoading(true);
    fetch(`${API_BASE}/courses?${params.toString()}`, { headers: bearerHeaders(token) })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch courses");
        return res.json();
      })
      .then((data) => {
        setCourses(data);
        setCoursesLoading(false);
        setCoursesError(null);
      })
      .catch((err) => {
        setCoursesError(err.message);
        setCoursesLoading(false);
      });
  }, [search, recent, courseCategory, user?.school, token]);

  useEffect(() => {
    fetch(`${API_BASE}/admin/dashboard`, { headers: bearerHeaders(token) })
      .then((res) => res.json())
      .then((d) => {
        setVerifiedCourses(d.verifiedCourses ?? 0);
        setVerifiedResources(d.verifiedResources ?? 0);
        if (d.school) setSchoolLabel(d.school);
        else if (d.campusCode) setSchoolLabel(d.campusCode);
      })
      .catch(() => {});
  }, [location.pathname, token]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (pendingKind) params.append("kind", pendingKind);
    if (pendingCategory) params.append("category", pendingCategory);

    fetch(`${API_BASE}/admin/pending?${params.toString()}`, {
      headers: bearerHeaders(token),
    })
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data)
          ? data.map((item) => ({
              ...item,
              to:
                item.kind === "Course"
                  ? `/review-course/${item.courseId}`
                  : `/review-resources/${item.courseId}`,
            }))
          : [];
        setPendingItems(items);
      })
      .catch(() => setPendingItems([]));
  }, [pendingKind, pendingCategory, location.pathname, token]);

  return (
    <div className="campRepDash">
      <header className="pageTopBar">
        <Link to="/camp-rep-dashboard" className="logoStub">
          LOGO
        </Link>
        <Link to="/profile" className="profileCircleLink" aria-label="profile">
          <div className="profileCircle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0d18">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
        </Link>
      </header>

      <div className="searchBar">
        <input
          type="text"
          placeholder="Search Courses"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <HiMagnifyingGlassCircle className="searchLogo" />
      </div>

      <div className="filterCourses">
        <select className="recentFilter" value={recent} onChange={(e) => setRecent(e.target.value)}>
          <option value="">Recent</option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
          <option value="Earlier">Earlier</option>
        </select>
        <select
          className="courseFilter"
          value={courseCategory}
          onChange={(e) => setCourseCategory(e.target.value)}
          aria-label="Filter by subject"
        >
          <option value="">Subject</option>
          {COURSE_SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {user?.school && (
        <div className="campRepSchoolBanner">
          Showing courses from <strong>{user.school}</strong>
        </div>
      )}

      {coursesLoading && <p className="status-message">Loading courses...</p>}
      {coursesError && <p className="status-message error">Error: {coursesError}</p>}

      {!coursesLoading && !coursesError && (
        <div className="courses-grid">
          {courses.length === 0 ? (
            <p className="status-message">No courses found.</p>
          ) : (
            courses.map((course) => <CourseCard key={course.id} course={course} />)
          )}
        </div>
      )}

      <section className="campRepModerationBlock">
        <p className="campRepDashEyebrow">{schoolLabel || user?.school || "Campus"}</p>
        <h2 className="campRepModerationHeading">Pending review</h2>

        <div className="campRepFilters">
          <select className="campRepFilterBtn" value={pendingKind} onChange={(e) => setPendingKind(e.target.value)}>
            <option value="">Type</option>
            <option value="Course">Course</option>
            <option value="Resource">Resource</option>
          </select>
          <select
            className="campRepFilterBtn"
            value={pendingCategory}
            onChange={(e) => setPendingCategory(e.target.value)}
          >
            <option value="">Category</option>
            <option value="Notes">Notes</option>
            <option value="Practice Questions">Practice Questions</option>
            <option value="Flashcards">Flashcards</option>
            <option value="Videos">Videos</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="History">History</option>
            <option value="Physics">Physics</option>
          </select>
        </div>

        <div className="campRepStatsCard">
          <div className="campRepStatRow">
            <span className="campRepStatLabel">Verified Course</span>
            <span className="campRepStatValue">{verifiedCourses}</span>
          </div>
          <div className="campRepStatDivider" />
          <div className="campRepStatRow">
            <span className="campRepStatLabel">Verified Resources</span>
            <span className="campRepStatValue">{verifiedResources}</span>
          </div>
        </div>

        <div className="campRepReviewSection">
          <h3 className="campRepReviewTitle">Queue</h3>
          <div className="campRepReviewList">
            {pendingItems.map((item) => (
              <Link key={item.id} to={item.to} className="campRepReviewCard">
                <div className="campRepReviewCardTop">
                  <span className="campRepReviewKind">{item.kind}</span>
                  <span className="campRepPendingBadge">Pending</span>
                </div>
                <p className="campRepReviewName">{item.name}</p>
                <span className="campRepReviewCategory">{item.category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CampRepDashboard;
