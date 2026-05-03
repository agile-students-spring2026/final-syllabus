// src/components/CourseCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
    return (
        <Link to={`/courses/${course.id}`} className="course-card">
            {course.coverImageUrl ? (
                <img
                    className="course-card-thumb"
                    src={course.coverImageUrl}
                    alt=""
                    loading="lazy"
                />
            ) : null}
            <h2>{course.name}</h2>
            <p>{course.description}</p>
            <div className="course-info">
                <span>{course.school}</span> | <span>{course.category}</span> | <span>{course.recent}</span>
            </div>
        </Link>
    );
};

export default CourseCard;