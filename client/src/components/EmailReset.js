import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import axios from 'axios';

function EmailReset() {
    const [isWhiteMode, setIsWhiteMode] = useState('false');

    let [validInput, setValidInput] = useState({
        isError: false,
        isSuccess: false,
        message: '',
    });

    const emailInput = useRef();
    const usernameInput = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = emailInput.current.value,
            username = usernameInput.current.value;
        if (email.length === 0) {
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
                username: username.trim(),
                email: email.trim(),
            })
            .then((res) => {
                if (res.status === 200) {
                    setValidInput({
                        isSuccess: true,
                        message: 'Your email has been sent',
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
            <h1>Enter email for reset</h1>
            <div>
                <label>Email</label>
                <input
                    ref={emailInput}
                    defaultValue={'baonltps11095@fpt.edu.vn'}
                    className="form-control"
                    type="text"
                />
            </div>
            <div>
                <label>Username</label>
                <input
                    ref={usernameInput}
                    defaultValue={'sirbao'}
                    className="form-control"
                    type="text"
                />
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
                {validInput.isSuccess && (
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
            <button type="submit" className="btn btn-info btn-block mt-4">
                Submit
            </button>
        </form>
    );
}

export default EmailReset;
