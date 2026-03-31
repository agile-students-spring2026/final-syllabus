import { Link } from "react-router-dom";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
import { courses } from "../data/sampleDatabase";
import CourseCard from '../components/CourseCard';

const HomePage = () => {
  return (
    <div className='homePage'>
      <header className="pageTopBar">
        <Link to="/home" className="logoStub">LOGO</Link>
        <Link to="/profile" className="profileCircleLink" aria-label="profile">
          <div className="profileCircle" />
        </Link>
      </header>

      <div className='searchBar'>
        <input
          type="text"
          placeholder='Search Courses'
        />
        <HiMagnifyingGlassCircle className='searchLogo' />
      </div>

      <div className='filterCourses'>
        <select className='recentFilter'>
          <option value="">Recent</option>
          <option value="today">Today</option>
          <option value="this-week">This Week</option>
          <option value="this-month">This Month</option>
        </select>
        <select className='courseFilter'>
          <option value="">Course</option>
          <option value="cs101">CS 101</option>
          <option value="math201">Math 201</option>
          <option value="history301">History 301</option>
        </select>
        <select className='categoryFilter'>
          <option value="">Material Type</option>
          <option value="lecture-notes">Lecture Notes</option>
          <option value="assignments">Assignments</option>
          <option value="exams">Exams</option>
        </select>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
