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
      </main>
    </div>
  );
};

export default ReviewCourse;
