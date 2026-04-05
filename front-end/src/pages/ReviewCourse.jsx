import { Link, useParams } from "react-router-dom";
import { courses } from "../data/sampleDatabase";
import "./ReviewCourse.css";

const ReviewCourse = () => {
  const { courseId } = useParams();
  const course = courses.find((c) => String(c.id) === courseId) ?? courses[0];

  return (
    <div className="reviewCoursePage">
      <header className="reviewCourseHeader">
        <Link to="/home" className="logoStub">LOGO</Link>
        <Link to="/profile" className="profileStub" aria-label="profile" />
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
          <button className="reviewCourseBtn reviewCourseBtn--reject">Reject</button>
          <button className="reviewCourseBtn reviewCourseBtn--accept">Accept</button>
        </div>
      </main>
    </div>
  );
};

export default ReviewCourse;
