import React from 'react'
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
import Navbar from '../components/Navbar';
import { courses } from "../data/sampleDatabase";
import CourseCard from '../components/CourseCard';

const HomePage = () => {

  return (
    <div className='homePage'>
      Home
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
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <Navbar /> {/* place it at bottom of the page */}
    </div>
  )
}

export default HomePage;
