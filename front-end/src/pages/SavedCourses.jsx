import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
import CourseCard from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const SavedCourses = () => {
    const { token } = useAuth();
    const [savedCourses, setSavedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState("");
    const [recent, setRecent] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        if (!token) {
            setError("Please log in to view saved courses");
            setLoading(false);
            return;
        }
        setLoading(true);
        fetch(`${API_BASE}/saved-courses`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch saved courses");
                return res.json();
            })
            .then((data) => {
                setSavedCourses(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [token]);

    const filtered = savedCourses.filter((c) => {
        const matchesSearch =
            !search ||
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase());
        const matchesRecent = !recent || c.recent === recent;
        const matchesCategory = !category || c.category === category;
        return matchesSearch && matchesRecent && matchesCategory;
    });

    return (
        <div className='homePage'>
            <header className="pageTopBar">
                <Link to="/home" className="logoStub">Syllabus+</Link>
                <Link to="/profile" className="profileCircleLink" aria-label="profile">
                    <div className="profileCircle">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0d18">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    </div>
                </Link>
            </header>

            <div className='searchBar'>
                <input
                    type="text"
                    placeholder='Search Courses'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <HiMagnifyingGlassCircle className='searchLogo' />
            </div>

            <div className='filterCourses'>
                <select className='recentFilter' value={recent} onChange={(e) => setRecent(e.target.value)}>
                    <option value="">Recent</option>
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                </select>
                <select className='courseFilter'>
                    <option value="">Course</option>
                    <option value="cs101">CS 101</option>
                    <option value="math201">Math 201</option>
                    <option value="history301">History 301</option>
                </select>
                <select className='categoryFilter' value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Material Type</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="History">History</option>
                    <option value="Literature">Literature</option>
                    <option value="Biology">Biology</option>
                    <option value="Physics">Physics</option>
                </select>
            </div>

            {loading && <p className="status-message">Loading saved courses...</p>}
            {error && <p className="status-message error">Error: {error}</p>}

            {!loading && !error && (
                <div className="courses-grid">
                    {filtered.length === 0
                        ? <p className="status-message">No saved courses found.</p>
                        : filtered.map((course) => (
                            <CourseCard key={course.id} course={course} linkState={{ fromSaved: true }} />
                        ))
                    }
                </div>
            )}
        </div>
    );
}

export default SavedCourses;
