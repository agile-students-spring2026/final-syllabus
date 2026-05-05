import logo from '../assets/syllabus_plus_logo.svg';
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ReviewCourse.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const ReviewCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/admin/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  const handleAccept = () => {
    fetch(`${API_BASE}/admin/courses/${courseId}/approve`, { method: "POST" }).catch(() => {});
    navigate("/camp-rep-dashboard");
  };

  const handleReject = () => {
    fetch(`${API_BASE}/admin/courses/${courseId}/reject`, { method: "POST" }).catch(() => {});
    navigate("/camp-rep-dashboard");
  };

  if (loading) return <div className="reviewCoursePage" />;

  if (!course || course.error) {
    return (
      <div className="reviewCoursePage">
        <p style={{ color: "#f5f5f5", padding: 24 }}>Course not found.</p>
      </div>
    );
  }

  return (
    <div className="reviewCoursePage">
      <header className="reviewCourseHeader">
        <Link to="/camp-rep-dashboard" className="logoStub"><img src={logo} alt="Syllabus+" height="32" /></Link>
        <Link to="/profile" className="profileStub" aria-label="profile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0d18">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </Link>
      </header>

      <div className="reviewCourseBackBtn">
        <Link to={-1}>&#8592; Review</Link>
      </div>

      <main className="reviewCourseMain">
        <div className="reviewCourseCard">
          <div className="reviewCourseThumbnail" />
          <div className="reviewCourseCardFooter">
            <div>
              <p className="reviewCourseTitle">{course.name}</p>
              <p className="reviewCourseCategory">{course.category}</p>
            </div>
            <span className="reviewCourseBadge">Pending</span>
          </div>
        </div>

        <section className="reviewCourseOverview">
          <h2 className="reviewOverviewHeading">Course Overview</h2>

          <p className="reviewOverviewDescription">{course.description}</p>

          <div className="reviewOverviewMeta">
            <div className="reviewOverviewMetaItem">
              <span className="reviewOverviewMetaLabel">Instructor</span>
              <span className="reviewOverviewMetaValue">{course.instructor}</span>
            </div>
            <div className="reviewOverviewMetaDivider" />
            <div className="reviewOverviewMetaItem">
              <span className="reviewOverviewMetaLabel">Duration</span>
              <span className="reviewOverviewMetaValue">{course.duration}</span>
            </div>
            <div className="reviewOverviewMetaDivider" />
            <div className="reviewOverviewMetaItem">
              <span className="reviewOverviewMetaLabel">Level</span>
              <span className="reviewOverviewMetaValue">{course.level}</span>
            </div>
          </div>

          <div className="reviewOverviewBlock">
            <h3 className="reviewOverviewBlockTitle">What You'll Learn</h3>
            <ul className="reviewOverviewBullets">
              {course.whatYoullLearn.map((item, i) => (
                <li key={i} className="reviewOverviewBullet">{item}</li>
              ))}
            </ul>
          </div>

          <div className="reviewOverviewBlock">
            <h3 className="reviewOverviewBlockTitle">Modules</h3>
            <ol className="reviewOverviewModules">
              {course.modules.map((mod, i) => (
                <li key={i} className="reviewOverviewModule">{mod}</li>
              ))}
            </ol>
          </div>
        </section>

        <div className="reviewCourseActions">
          <button className="reviewCourseBtn reviewCourseBtn--reject" onClick={handleReject}>Reject</button>
          <button className="reviewCourseBtn reviewCourseBtn--accept" onClick={handleAccept}>Accept</button>
        </div>
      </main>
    </div>
  );
};

export default ReviewCourse;
