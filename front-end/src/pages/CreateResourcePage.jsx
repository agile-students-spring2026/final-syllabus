import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const CreateResourcePage = () => {
  return (
    <div className="createFormPage">
      <header className="createHeader">
        <div className="logoStub">LOGO</div>
        <Link to="/resources" className="backLink">
          Back
        </Link>
      </header>

      <main className="createMain">
        <h1>Create Resources</h1>

        <form className="createForm" onSubmit={(e) => e.preventDefault()}>
          <label className="fieldLabel">
            Select Course
            <input className="textInput" placeholder="Courses" />
          </label>

          <label className="fieldLabel">
            Select / Add Category
            <input className="textInput" placeholder="Courses" />
          </label>

          <label className="fieldLabel">
            Topic
            <input className="textInput" placeholder="Topic" />
          </label>

          <label className="fieldLabel">
            Title
            <input className="textInput" placeholder="Title" />
          </label>

          <label className="fieldLabel">
            Resource type selection
            <div className="selectMock">
              <span>Resource</span>
              <span className="caret">▾</span>
            </div>
          </label>

          <label className="fieldLabel">
            Upload
            <div className="uploadBox">Content Upload Area</div>
          </label>

          <div className="formActions">
            <button className="submitBtn" type="button">
              Submit
            </button>
          </div>
        </form>
      </main>

      <div className="navBar">
        <Navbar />
      </div>
    </div>
  );
};

export default CreateResourcePage;
