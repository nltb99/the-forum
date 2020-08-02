import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { userRegister } from '../redux/actions/actionTypes';
import axios from 'axios';

function Register({ history }) {
    const dispatch = useDispatch();
    const [isWhiteMode, setIsWhiteMode] = useState('false');

    let [registerFail, setRegisterFail] = useState({
        isError: false,
        message: '',
    });

    const usernameInput = useRef();
    const passwordInput = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let checkValid = true;
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;
        if (username.length === 0 || password.length === 0) {
            checkValid = false;
            await setRegisterFail({
                isError: true,
                message: 'Input must not null',
            });
            return;
        }
        if (password.includes(username)) {
            checkValid = false;
            await setRegisterFail({
                isError: true,
                message: 'Password is too similar to Username',
            });
            return;
        }
        await axios.get('/api/user/users').then((res) => {
            if (res.data.some((e) => e.username === username)) {
                checkValid = false;
                setRegisterFail({
                    isError: true,
                    message: 'Username already exists',
                });
                return;
            }
        });
        if (checkValid) {
            await dispatch(userRegister(username, password));
            await history.push('/user/login');
            window.location.reload(true);
        }
    };

    function removeErrorMessage() {
        setRegisterFail({
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
                {registerFail.isError && (
                    <div className="alert alert-danger alert-dismissible my-4 fade show">
                        <button
                            type="button"
                            className="close"
                            data-dismiss="alert"
                            onClick={removeErrorMessage}>
                            &times;
                        </button>
                        {registerFail.message}
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
