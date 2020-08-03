import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { userRegister } from '../redux/actions/actionTypes';
import axios from 'axios';

function Register({ history }) {
    const dispatch = useDispatch();
    const [isWhiteMode, setIsWhiteMode] = useState('false');

    let [validRegister, setValidRegister] = useState({
        isError: false,
        message: '',
    });

    const usernameInput = useRef();
    const passwordInput = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;
        if (username.length === 0 || password.length === 0) {
            setValidRegister({
                isError: true,
                message: 'Input must not be null',
            });
            return;
        }
        if (!password.match(/.{6,}/g)) {
            setValidRegister({
                isError: true,
                message: 'Password must contain at least six characters',
            });
            return;
        }
        if (password.includes(username)) {
            setValidRegister({
                isError: true,
                message: 'Password is too similar to Username',
            });
            return;
        }
        axios.get('/api/user/users').then((res) => {
            if (res.data.some((e) => e.username === username)) {
                setValidRegister({
                    isError: true,
                    message: 'Username is already taken',
                });
                return;
            }
        });
        dispatch(userRegister(username, password));
        history.push('/user/login');
        window.location.reload(true);
    };

    function removeErrorMessage() {
        setValidRegister({
            isError: false,
            message: '',
        });
    }

    const classStylingForm = classNames({
        container: true,
        'auth-form': true,
        whiteColor: isWhiteMode === 'false',
        darkColor: isWhiteMode === 'true',
    });

    useEffect(() => {
        const theme = JSON.parse(localStorage.getItem('whitemode'));
        setIsWhiteMode(theme);
    }, []);

    return (
        <form className={classStylingForm} onSubmit={handleSubmit}>
            <h1>Register</h1>
            <div>
                <label>Username</label>
                <input ref={usernameInput} className="form-control" type="text" />
            </div>
            <div>
                <label>Password</label>
                <input ref={passwordInput} className="form-control" type="password" />
            </div>
            <div>
                {validRegister.isError && (
                    <div className="alert alert-danger alert-dismissible my-4 fade show">
                        <button
                            type="button"
                            className="close"
                            data-dismiss="alert"
                            onClick={removeErrorMessage}>
                            &times;
                        </button>
                        {validRegister.message}
                    </div>
                )}
            </div>
            <button type="submit" className="btn btn-info btn-block mt-4">
                Submit
            </button>
        </form>
    );
}

export default Register;
