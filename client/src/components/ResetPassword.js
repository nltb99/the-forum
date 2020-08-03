import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import axios from 'axios';
import { getCookie } from '../redux/actions/actionTypes.js';

function ResetPassword({ location }) {
    const [isWhiteMode, setIsWhiteMode] = useState('false');
    const [_id, setId] = useState('');

    const passwordInput = useRef('');
    const confirmPasswordInput = useRef('');

    function handleSubmit(e) {
        e.preventDefault();
        const urlDecode = location.search.match(/(?<=tk\=)(.+)/g)[0];
        console.log(urlDecode);
        // axios
        //     .post('/api/user/update', { password: confirmPasswordInput.current.value })
        //     .then((res) => {});
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
        setId(getCookie('id'));
    }, []);

    return (
        <form className={classStylingForm} onSubmit={handleSubmit}>
            <h1>Reset your password</h1>
            <div>
                <label>Password:</label>
                <input
                    ref={passwordInput}
                    defaultValue={'baonltps11095@fpt.edu.vn'}
                    className="form-control"
                    type="text"
                />
            </div>
            <div>
                <label>Confirm Password:</label>
                <input
                    ref={confirmPasswordInput}
                    defaultValue={'baonltps11095@fpt.edu.vn'}
                    className="form-control"
                    type="text"
                />
            </div>
            <button type="submit" className="btn btn-info btn-block mt-4">
                Submit
            </button>
        </form>
    );
}

export default ResetPassword;
