import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

function Header() {
    return (
        <nav className="navbar navbar-expand bg-dark text-white ">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link text-white" to="/">
                        Home
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-white" to="/question/new">
                        New Question?
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Header
