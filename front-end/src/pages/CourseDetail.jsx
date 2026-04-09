import React from 'react'
import placeHolderImage from '../assets/placeHolderImage.png'
import { Link, useParams } from 'react-router-dom';
import { courses } from '../data/sampleDatabase';
import { GoArrowLeft } from "react-icons/go";
import toast from 'react-hot-toast';
import './CourseDetails.css';
import './CourseDetails.css';

const CourseDetails = () => {
    const { courseId } = useParams();
    const course = courses.find((c) => String(c.id) === courseId);
    if (!course) {
        return <h2>Course not found</h2>;
    }

    const handleSave = () => {
        const saved = JSON.parse(localStorage.getItem("savedCourses")) || [];
        const exists = saved.find((c) => c.id === course.id);
        if (!exists) {
            saved.push(course);
            localStorage.setItem("savedCourses", JSON.stringify(saved));
            toast.success("Course Saved!");
        }
    };

    const handleDelete = () => {
        const saved = JSON.parse(localStorage.getItem("savedCourses")) || [];
        const updated = saved.filter((courseItem) => courseItem.id !== course.id);
        localStorage.setItem("savedCourses", JSON.stringify(updated));
        toast.error("Course Removed!");
    };

    return (
        <div className='courseDetails'>
            <div className='backBtn'>
                <Link to="/home">
                    <GoArrowLeft /> Back
                </Link>
            </div>

            <div className='title'>
                <h2>Course Details</h2>
            </div>
            <div className='coursePhoto'>
                <img src={placeHolderImage} alt="Course placeholder" />
            </div>
            <div className='courseTitle'>
                <h2>{course.name}</h2>
            </div>
            <div className='infoArea'>
                <div className='innerCourseTitle'>
                    <p>Course Name: {course.name}</p>
                </div>
                <div className='description'>
                    <p>Description: {course.description}</p>
                </div>
            </div>
            <div className="actionRow">
                <button className="actionButton" onClick={handleSave}>Save</button>

                <Link
                    to={`/courses/${course.id}/resources`}
                    className="actionButton actionLinkButton"
                >
                    Resources
                </Link>
            </div>
        </div>
    );
}

export default CourseDetails;
