import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className='navbar'>
            <Link to="/home">
                <button>
                    Home
                </button>
            </Link>
            <Link to="/saved">
                <button>
                    Saved Courses
                </button>
            </Link>
            <Link to="/resources">
                <button>
                    Resources
                </button>
            </Link>

        </div>
    )
}

export default Navbar
