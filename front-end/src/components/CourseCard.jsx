// src/components/CourseCard.jsx
import { Link } from "react-router-dom";

const CourseCard = ({ course, linkState }) => {
    return (
        <Link to={`/courses/${course.id}`} state={linkState} className="course-card">
            <h2>{course.name}</h2>
            <p>{course.description}</p>
            <div className="course-info">
                <span>{course.school}</span> | <span>{course.category}</span> | <span>{course.recent}</span>
            </div>
        </Link>
    );
};

export default CourseCard;