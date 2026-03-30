import { Link } from "react-router-dom";
import "./CreateCoursePage.css";

const CreateCoursePage = () => {
  return (
    <div className="createFormPage">
      <header className="createHeader">
        <div className="logoStub">LOGO</div>
        <Link to="/resources" className="backLink">
            Back
        </Link>
      </header>

      <main className="createMain">
        <h1>Create Course</h1>

        <form className="createForm" onSubmit={(e) => e.preventDefault()}>
          <label className="fieldLabel">
            Course Name
            <input className="textInput" placeholder="Course name" />
          </label>

          <label className="fieldLabel">
            Course / Add Category
            <input className="textInput" placeholder="Courses" />
          </label>

          <label className="fieldLabel">
            Topic
            <input className="textInput" placeholder="Topic" />
          </label>

          <label className="fieldLabel">
            Course Description
            <textarea
              className="textArea"
              rows={5}
              placeholder="Describe Course"
            />
          </label>

          <label className="fieldLabel">
            Upload Course image
            <input className="textInput" placeholder="Upload from browser" />
          </label>

          <button className="pillButton" type="button">
            Add resources
          </button>

          <div className="formActions">
            <button className="submitBtn" type="button">
              Submit
            </button>
          </div>
        </form>
      </main>

    </div>
  );
};

export default CreateCoursePage;
