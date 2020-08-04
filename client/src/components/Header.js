import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Switch } from './StyledComponents/switchMode';
import { getCookie } from '../redux/actions/actionTypes.js';

function Header() {
    let [isWhiteMode, setIsWhiteMode] = useState('');
    useEffect(() => {
        const theme = JSON.parse(localStorage.getItem('whitemode'));
        if (theme) setIsWhiteMode(theme);
    }, []);

    return (
        <nav className="navbar navbar-expand bg-dark text-white ">
            <ul className="navbar-nav" style={{ whiteSpace: 'nowrap' }}>
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
                    theme={isWhiteMode}
                    onClick={() => {
                        let isWhiteMode = JSON.parse(localStorage.getItem('whitemode'));
                        if (isWhiteMode === 'false') isWhiteMode = 'true';
                        else if (isWhiteMode === 'true') isWhiteMode = 'false';
                        localStorage.setItem('whitemode', JSON.stringify(isWhiteMode));
                        window.location.reload(true);
                    }}
                />
                <img src={require('../images/sun.png')} alt="" />
                {typeof getCookie('id') === 'undefined' && (
                    <Link to="/user/login">
                        <h5>Login</h5>
                    </Link>
                )}
                {typeof getCookie('id') !== 'undefined' && (
                    <Link to="/">
                        <h5
                            onClick={() => {
                                document.cookie = 'id=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                                document.cookie =
                                    'username=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                                document.cookie = 'tk=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                                window.location.reload(true);
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
    );
}

export default Header;
