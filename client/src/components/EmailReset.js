import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import axios from 'axios';

function EmailReset() {
    const [isWhiteMode, setIsWhiteMode] = useState('false');

    let [validInput, setValidInput] = useState({
        isError: false,
        isNotFound: false,
        isSucceed: false,
        message: '',
    });

    const emailInput = useRef();
    const usernameInput = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = emailInput.current.value.trim(),
            username = usernameInput.current.value.trim();
        if (!email || !username) {
            setValidInput({
                isError: true,
                message: 'Input must not be null',
            });
            return;
        }
        if (!email.match(/^[a-z][a-z0-9_\.]{4,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,5}){1,2}$/g)) {
            setValidInput({
                isError: true,
                message: 'Email is not valid!',
            });
            return;
        }
        axios
            .post('/api/user/resetpassword', {
                email,
                username,
            })
            .then((res) => {
                if (res.status === 200) {
                    setValidInput({
                        isSucceed: true,
                        isNotFound: false,
                        isError: false,
                        message: 'Check your email for instructions',
                    });
                }
            })
            .catch((err) => {
                if (err.response.status === 404) {
                    setValidInput({
                        isNotFound: true,
                        message: 'Email or Username not found!',
                    });
                }
            });
    };

    function removeErrorMessage() {
        setValidInput({
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
            <h1>Forgot your password?</h1>
            <div>
                <h5>Email</h5>
                <input ref={emailInput} className="form-control" type="text" />
            </div>
            <div>
                <h5>Username</h5>
                <input ref={usernameInput} className="form-control" type="text" />
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
                {validInput.isSucceed && (
                    <div className="alert alert-success alert-dismissible my-4 fade show">
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
                {validInput.isNotFound && (
                    <div className="alert alert-warning alert-dismissible my-4 fade show">
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
            <button type="submit" className="btn btn-info btn-block mt-4">
                Submit
            </button>
        </form>
    );
}

export default EmailReset;
