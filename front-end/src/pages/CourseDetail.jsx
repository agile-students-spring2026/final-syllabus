import React from 'react'
import Navbar from '../components/Navbar';
import placeHolderImage from '../assets/placeHolderImage.png'
import { Link, useParams } from 'react-router-dom';
import { courses } from '../data/sampleDatabase';

//What is Course Overview Button, does it link anywhere
//What is notes, flashcards Hardcode
//Is there 2 course titles? One at top and one in the inner div?
//What Info do we want to replace "What you'll learn" section with
//What's the difference between 2 resources

//Back button to link to home page
const CourseDetails = () =>{
    const { courseId } = useParams();
    const course =  courses.find((c) => String(c.id) === courseId);
    if (!course) {
    return <h2>Course not found</h2>;
    }

    return(
        
        <div className='courseDetails'>
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
          <button className="actionButton">Save</button>

          <Link
            to={`/courses/${course.id}/resources`}
            className="actionButton actionLinkButton"
          >
            Resources
          </Link>
        </div>

        <div className='navBar'>
            <Navbar/>
        </div>
        </div>
    )

}

export default CourseDetails;
