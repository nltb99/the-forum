import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import Menu from './Menu';
import axios from 'axios';

function ResetPassword({ location, history }) {
    const passwordInput = useRef('');
    const confirmPasswordInput = useRef('');

    let [validInput, setValidInput] = useState({
        isError: false,
        isSucceed: false,
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const password = passwordInput.current.value.trim(),
            confirmPassword = confirmPasswordInput.current.value.trim();

        if (!password || !confirmPassword) {
            setValidInput({
                isError: true,
                message: 'Input must not be null',
            });
            return;
        }
        if (!password.match(/.{6,}/g) || !confirmPassword.match(/.{6,}/g)) {
            setValidInput({
                isError: true,
                message: 'Password must contain at least six characters',
            });
            return;
        }
        if (password !== confirmPassword) {
            setValidInput({
                isError: true,
                message: 'Incorrect password',
            });
            return;
        }
        const urlDecode = location.search.match(/(?<=tk\=)(.+)/g) || '';
        const options = {
            headers: { Authorization: `Bearer ${urlDecode[0]}` },
        };
        axios
            .patch('/api/user/update', { password: confirmPassword }, options)
            .then((res) => {
                if (res.status === 200) {
                    setValidInput({
                        isError: false,
                        isSucceed: true,
                        message: 'Your password has been changed!',
                    });
                }
            })
            .catch((err) => {
                if (err.response) {
                    // console.log(err.response.status);
                }
                setValidInput({
                    isError: true,
                    message: 'Invalid',
                });
                return;
            });
    };

    const removeErrorMessage = () => {
        setValidInput({
            isError: false,
            message: '',
        });
    };

    const classStylingForm = classNames({
        container: true,
        'auth-form': true,
        whiteColor: true,
    });

    return (
        <div>
            <Menu />
            <form className={classStylingForm} onSubmit={handleSubmit}>
                <h1>Reset your password</h1>
                <div>
                    <label>Password:</label>
                    <input ref={passwordInput} className="form-control" type="password" />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input ref={confirmPasswordInput} className="form-control" type="password" />
                </div>
                {validInput.isError && (
                    <div className="alert alert-dark alert-dismissible my-4 fade show">
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
                {validInput.isSucceed && (
                    <div className="alert alert-info alert-dismissible my-4 fade show">
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
                <button type="submit" className="btn btn-block submit-btn mt-4">
                    Reset Password
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;
