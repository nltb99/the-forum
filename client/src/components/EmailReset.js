import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import axios from 'axios';

function EmailReset({ history }) {
    const [isWhiteMode, setIsWhiteMode] = useState('false');

    let [registerFail, setRegisterFail] = useState({
        isError: false,
        message: '',
    });

    const emailInput = useRef();
    const usernameInput = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios
            .post('/api/user/resetpassword', {
                username: usernameInput.current.value,
                email: emailInput.current.value,
            })
            .then((res) => {
                console.log(res.data);
            });
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

export default EmailReset;
