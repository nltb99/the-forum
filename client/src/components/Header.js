import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Switch } from './StyledComponents/switchMode'
import { isDarkmode } from '../redux/actions/actionTypes'

function Header() {
    const dispatch = useDispatch()
    const isDarkMode = useSelector((state) => state.switchMode)

    const mode = localStorage.getItem('mode') || true

    useEffect(() => {
        if (isDarkMode) {
            document.body.style.background = '#262626'
        }
        if (!isDarkMode) {
            document.body.style.background = '#fff'
        }
    }, [isDarkMode, mode])

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
            <div className="collapse navbar-collapse"></div>
            <div className="switch-mode-navbar">
                <img src={require('../images/moon.png')} />
                <Switch
                    type="checkbox"
                    mode={mode}
                    onClick={() => {
                        dispatch(isDarkmode())
                        if (!isDarkMode) {
                            localStorage.setItem('mode', true)
                        }
                        if (isDarkMode) {
                            localStorage.setItem('mode', false)
                        }
                    }}
                />
                <img src={require('../images/sun.png')} />
            </div>
        </nav>
    )
}

export default Header
