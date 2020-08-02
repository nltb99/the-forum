import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { userLogin } from '../redux/actions/actionTypes';
import axios from 'axios';

function Login({ history }) {
    const [isWhiteMode, setIsWhiteMode] = useState('false');

    const authPassword = useSelector((state) => state.credentialsFalse);

    const dispatch = useDispatch();

    let [authInput, setAuthInput] = useState({
        isError: false,
        message: '',
    });

    const usernameInput = useRef();
    const passwordInput = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;
        if (username.length === 0 || password.length === 0) {
            await setAuthInput({
                isError: true,
                message: 'Input must not null',
            });
            return;
        }
        const configs = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await axios.post('/api/user/login', { username, password }, configs).then((res) => {
            if (res.status === 200) {
                localStorage.setItem('username', JSON.stringify(username));
                history.push('/');
                window.location.reload(true);
            } else if (res.status === 204) {
                setAuthInput({
                    isError: true,
                    message: 'Username does not exists',
                });
            } else if (res.status === 206) {
                setAuthInput({
                    isError: true,
                    message: 'Password is not match',
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
        const isLogged = JSON.parse(localStorage.getItem('username'));
        if (isLogged !== null) {
            history.push('/');
            window.location.reload(true);
        }
    }, []);

    function removeErrorMessage() {
        setAuthInput({
            isError: false,
            message: '',
        });
        authPassword.msg = '';
    }

    return (
        <form className={classStylingForm} onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div>
                <label>Username</label>
                <input ref={usernameInput} className="form-control" type="text" />
            </div>
            <div>
                <label>Password</label>
                <input ref={passwordInput} className="form-control" type="password" />
            </div>
            <div>
                {authInput.isError && (
                    <div className="alert alert-danger alert-dismissible my-4 fade show">
                        <button
                            type="button"
                            className="close"
                            data-dismiss="alert"
                            onClick={removeErrorMessage}>
                            &times;
                        </button>
                        {authInput.message}
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
            <button type="submit" className="btn btn-info btn-block mt-4">
                Submit
            </button>
        </form>
    );
}

export default Login;
