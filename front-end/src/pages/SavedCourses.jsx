import React from 'react'
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';

const SavedCourses = () => {
    const saved = JSON.parse(localStorage.getItem("savedCourses")) || [];
    console.log(saved)

    return (
        <div className='homePage'>
            Saved Courses
            <div className='searchBar'>
                <input
                    type="text"
                    name=""
                    id=""
                    placeholder='Search Courses'
                />
                <HiMagnifyingGlassCircle className='searchLogo' />
            </div>
            <div className='filterCourses'>
                {/* Filter by when notes were added */}
                <select className='recentFilter'>
                    <option value="">Recent</option>
                    <option value="today">Today</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                </select>

                {/* Filter by course or department */}
                <select className='courseFilter'>
                    <option value="">Course</option>
                    <option value="cs101">CS 101</option>
                    <option value="math201">Math 201</option>
                    <option value="history301">History 301</option>
                </select>

                {/* Filter by type of material */}
                <select className='categoryFilter'>
                    <option value="">Material Type</option>
                    <option value="lecture-notes">Lecture Notes</option>
                    <option value="assignments">Assignments</option>
                    <option value="exams">Exams</option>
                </select>
            </div>

            {/* For the courses to be displayed on screen, use .map loop and use Card design to display each course from database as a card!*/}
            <div className="courses-grid">
                {saved.map((save) =>
                    <CourseCard key={save.id} course={save} />
                )}
            </div>
            <Navbar /> {/* place it at bottom of the page */}
        </div>
    )
}

export default SavedCourses;
