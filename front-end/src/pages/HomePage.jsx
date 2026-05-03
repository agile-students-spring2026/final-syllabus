import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import { COURSE_SUBJECTS } from '../utils/courseSubjects';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const HomePage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (recent) params.append("recent", recent);
    if (category) params.append("category", category);
    if (user?.school) params.append("school", user.school);

    setLoading(true);
    fetch(`${API_BASE}/courses?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch courses");
        return res.json();
      })
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [search, recent, category, user?.school]);

  return (
    <div className='homePage'>
      <header className="pageTopBar">
        <Link to="/home" className="logoStub">LOGO</Link>
        <Link to="/profile" className="profileCircleLink" aria-label="profile">
          <div className="profileCircle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0d18">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
        </Link>
      </header>

      <div className='searchBar'>
        <input
          type="text"
          placeholder='Search Courses'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <HiMagnifyingGlassCircle className='searchLogo' />
      </div>

      <div className='filterCourses'>
        <select className='recentFilter' value={recent} onChange={(e) => setRecent(e.target.value)}>
          <option value="">Recent</option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
          <option value="Earlier">Earlier</option>
        </select>
        <select
          className="courseFilter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
        <div style={{ padding: '12px 16px', backgroundColor: '#f0f2f5', borderRadius: '8px', margin: '12px 16px', fontSize: '14px', color: '#333' }}>
          Showing courses from <strong>{user.school}</strong>
        </div>
      )}

      {loading && <p className="status-message">Loading courses...</p>}
      {error && <p className="status-message error">Error: {error}</p>}

      {!loading && !error && (
        <div className="courses-grid">
          {courses.length === 0
            ? <p className="status-message">No courses found.</p>
            : courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
          }
        </div>
      )}
    </div>
  );
}

export default HomePage;
