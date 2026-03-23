import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { courses } from "../data/sampleDatabase";
import "./ResourcePage.css";

const ResourcePage = () => {
  const { courseId } = useParams();
  const course = courses.find((item) => String(item.id) === courseId);

  if (!course) {
    return (
      <div className="resourcePage">
        <div className="resourceHeader">
          <h2>Course not found</h2>
          <Link to="/home" className="resourceBack">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const resources = course.resources || [];

  return (
    <div className="resourcePage">
      <div className="resourceHeader">
        <p className="resourceEyebrow">Resources</p>
        <h2>{course.name}</h2>
        <p className="resourceSub">
          Shared drops for this class. Grab what you need or add your own later.
        </p>
      </div>

      <div className="resourceList">
        {resources.length === 0 ? (
          <div className="resourceEmpty">
            <p>No resources yet. Be the first to share something useful.</p>
          </div>
        ) : (
          resources.map((item) => (
            <div
              key={item.id}
              className="resourceCard"
              role="button"
              tabIndex={0}
            >
              <div className="resourceMeta">
                <span className="pill">{item.type}</span>
                <span className="pill pillGhost">{item.format}</span>
                <span className="pill when">{item.added}</span>
              </div>
              <h3>{item.title}</h3>
              <p className="resourceHint">
                Mock link for {course.name}. (Stays on this page.)
              </p>
            </div>
          ))
        )}
      </div>

      <div className="resourceActions">
        <Link to={`/courses/${course.id}`} className="resourceBack">
          Back to course
        </Link>
      </div>

      <div className="navBar">
        <Navbar />
      </div>
    </div>
  );
};

export default ResourcePage;
