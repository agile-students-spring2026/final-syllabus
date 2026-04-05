import { Link, useParams } from "react-router-dom";
import { courses } from "../data/sampleDatabase";
import "./ReviewResources.css";

const ReviewResources = () => {
  const { courseId } = useParams();
  const course = courses.find((c) => String(c.id) === courseId) ?? courses[0];

  const resourceTypes = [...new Set(course.resources.map((r) => r.type))].join(", ");

  return (
    <div className="reviewResPage">
      <header className="reviewResHeader">
        <Link to="/home" className="logoStub">LOGO</Link>
        <Link to="/profile" className="profileStub" aria-label="profile" />
      </header>

      <div className="reviewResBackBtn">
        <Link to={-1}>&#8592; Review</Link>
      </div>

      <main className="reviewResMain">
        <div className="reviewResCard">
          <div className="reviewResThumbnail" />
          <div className="reviewResCardFooter">
            <div>
              <p className="reviewResTitle">{course.name}</p>
              <p className="reviewResTypes">{resourceTypes}</p>
            </div>
            <span className="reviewResBadge">Pending</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewResources;
