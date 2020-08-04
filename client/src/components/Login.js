import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { getCookie } from '../redux/actions/actionTypes';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Link } from 'react-router-dom';

function Login({ history }) {
    const [isWhiteMode, setIsWhiteMode] = useState('false');

    const authPassword = useSelector((state) => state.credentialsFalse);

    let [validInput, setValidInput] = useState({
        isError: false,
        message: '',
    });

    const usernameInput = useRef();
    const passwordInput = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = usernameInput.current.value.trim();
        const password = passwordInput.current.value.trim();
        if (!username || !password) {
            setValidInput({
                isError: true,
                message: 'Input must not be null',
            });
            return;
        }
        axios.post('/api/user/login', { username, password }).then((res) => {
            if (res.status === 200) {
                jwt.verify(
                    res.data.token,
                    '\u0061\u0063\u0063\u0065\u0073\u0073',
                    async (err, payload) => {
                        if (err) throw err;
                        const { _id, username } = await payload;
                        document.cookie = await `username=${username}; path=/; max-age=${60 *
                            60 *
                            24 *
                            2}`;
                        document.cookie = await `id=${_id}; path=/; max-age=${60 * 60 * 24 * 3}`;
                        document.cookie = await `tk=${res.data.token}; path=/; max-age=${60 *
                            60 *
                            24 *
                            2}`;
                        await history.push('/');
                        await window.location.reload(true);
                    },
                );
            } else if (res.status === 204) {
                setValidInput({
                    isError: true,
                    message: 'Username does not exists',
                });
            } else if (res.status === 206) {
                setValidInput({
                    isError: true,
                    message: 'Incorrect password',
                });
            }
        });
    };

    const classStylingForm = classNames({
        container: true,
        'auth-form': true,
        whiteColor: isWhiteMode === 'false',
        darkColor: isWhiteMode === 'true',
    });

    useEffect(() => {
        const theme = JSON.parse(localStorage.getItem('whitemode'));
        setIsWhiteMode(theme);
        if (typeof getCookie('id') !== 'undefined') {
            history.push('/');
        }
    }, []);

    function removeErrorMessage() {
        setValidInput({
            isError: false,
            message: '',
        });
        authPassword.msg = '';
    }

    return (
        <form className={classStylingForm} onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div>
                <h5>Username</h5>
                <input ref={usernameInput} className="form-control" type="text" />
            </div>
            <div>
                <h5>Password</h5>
                <input ref={passwordInput} className="form-control" type="password" />
            </div>
            <div>
                {validInput.isError && (
                    <div className="alert alert-danger alert-dismissible my-4 fade show">
                        <button
                            type="button"
                            className="close"
                            data-dismiss="alert"
                            onClick={removeErrorMessage}>
                            &times;
                        </button>
                        {validInput.message}
                    </div>
                )}
            </div>
            <div>
                {authPassword.msg && (
                    <div className="alert alert-danger alert-dismissible my-4 fade show">
                        <button
                            type="button"
                            className="close"
                            data-dismiss="alert"
                            onClick={removeErrorMessage}>
                            &times;
                        </button>
                        {authPassword.msg}
                    </div>
                )}
            </div>
            <Link to="/user/emailreset">
                <h3 style={{ marginTop: 20, fontSize: 20 }}>{'  '}Forgot password?</h3>
            </Link>
            <button type="submit" className="btn btn-info btn-block mt-4">
                Submit
            </button>
        </form>
    );
}

export default Login;
