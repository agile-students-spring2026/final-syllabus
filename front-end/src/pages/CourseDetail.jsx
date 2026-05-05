import React, { useState, useEffect } from "react";
import placeHolderImage from "../assets/placeHolderImage.png";
import { Link, useParams, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import "./CourseDetails.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/courses/${courseId}`)
      .then((res) => {
        if (res.status === 404) {
          setCourse(null);
          return null;
        }

        if (!res.ok) {
          throw new Error("Failed to load course");
        }

        return res.json();
      })
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [courseId]);

  const handleSave = async () => {
    if (!token) {
      toast.error("Please log in before saving a course.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          toast("Course already saved.");
          return;
        }

        toast.error(data.error || "Could not save course.");
        return;
      }

      toast.success(data.message || "Course saved!");
    } catch {
      toast.error("Could not connect to the server.");
    }
  };

  if (loading) {
    return (
      <div className="courseDetails">
        <p className="status-message">Loading course...</p>
      </div>
    );
  }

  if (error || !course) {
    return <h2>Course not found</h2>;
  }

  return (
    <div className="courseDetails">
      <div className="backBtn">
        <Link to="/home">
          <GoArrowLeft /> Back
        </Link>
      </div>

      <div className="title">
        <h2>Course Details</h2>
      </div>

      <div className="coursePhoto">
        <img
          src={course.imageFileName ? `http://localhost:5001/uploads/course-images/${course.imageFileName}` : placeHolderImage}
          alt="Course"
        />      </div>
      <div className="courseTitle">
        <h2>{course.name}</h2>
      </div>

      <div className="infoArea">
        <div className="innerCourseTitle">
          <p>Course Name: {course.name}</p>
        </div>

        <div className="description">
          <p>Description: {course.description}</p>
        </div>
      </div>

      <div className="actionRow">
        <button className="actionButton" onClick={handleSave}>
          Save
        </button>

        <Link
          to={`/courses/${course.id}/resources`}
          className="actionButton actionLinkButton"
        >
          Resources
        </Link>
      </div>
    </div>
  );
};

export default CourseDetails;