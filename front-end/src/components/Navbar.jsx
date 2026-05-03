import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const location = useLocation();
    const { user } = useAuth();
    const isCampusRep = user?.role === 'campus-rep';
    const homePath = isCampusRep ? '/camp-rep-dashboard' : '/home';
    const homeActive = location.pathname === homePath;

    return (
        <nav className='navbar'>
            <Link
                to={homePath}
                className={`nav-item${homeActive ? ' nav-active' : ''}`}
            >
                <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                <span>Home</span>
            </Link>
            {!isCampusRep && (
            <Link
                to="/saved"
                className={`nav-item${location.pathname === '/saved' ? ' nav-active' : ''}`}
            >
                <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                </svg>
                <span>Saved</span>
            </Link>
            )}
            <Link
                to="/resources"
                className={`nav-item${location.pathname === '/resources' ? ' nav-active' : ''}`}
            >
                <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
                </svg>
                <span>Resources</span>
            </Link>
        </nav>
    )
}

export default Navbar
