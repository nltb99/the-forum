import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Switch } from './StyledComponents/switchMode'
import { isDarkmode } from '../redux/actions/actionTypes'

function Header() {
    const dispatch = useDispatch()
    const isDarkMode = useSelector((state) => state.switchMode)

    useEffect(() => {
        if (isDarkMode) {
            document.body.style.background = '#262626'
        }
        if (!isDarkMode) {
            document.body.style.background = '#fff'
        }
    }, [isDarkMode])

    // function displayUsername() {
    //     if (localStorage.getItem('username') == null) return
    //     let username = JSON.parse(localStorage.getItem('username'))
    //     return username
    // }

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
                        New Question
                    </Link>
                </li>
            </ul>
            <div className="collapse navbar-collapse"></div>
            <div className="switch-mode-navbar">
                <img src={require('../images/moon.png')} alt="" />
                <Switch
                    type="checkbox"
                    theme={isDarkMode}
                    onClick={() => {
                        dispatch(isDarkmode())
                    }}
                />
                <img src={require('../images/sun.png')} alt="" />
                {localStorage.getItem('username') == null && (
                    <Link to="/user/login">
                        <h5>Login</h5>
                    </Link>
                )}
                {localStorage.getItem('username') != null && (
                    <Link to="/">
                        <h5
                            onClick={() => {
                                localStorage.removeItem('username')
                                window.location.reload(true)
                            }}>
                            Logout
                        </h5>
                    </Link>
                )}

                <Link to="/user/register">
                    <h5>Register</h5>
                </Link>
            </div>
        </nav>
    )
}

export default Header
