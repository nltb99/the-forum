import React, { useState, useEffect, useRef } from 'react';
import { getCookie } from '../redux/actions/actionTypes.js';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import axios from 'axios';

function NewQuestion({ history }) {
    const [isWhiteMode, setIsWhiteMode] = useState('false');

    const tittleRef = useRef('');
    const detailRef = useRef('');

    let [validInput, setValidInput] = useState({
        isError: false,
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        let title = tittleRef.current.value.trim();
        let detail = detailRef.current.value.trim();
        if (!title || !detail) {
            setValidInput({
                isError: true,
                message: 'Input must not be null',
            });
            return;
        }
        if (typeof getCookie('id') === 'undefined') {
            setValidInput({
                isError: true,
                message: 'Please Login First!',
            });
            return;
        }
        axios
            .post('/api/question', {
                title: title.trim(),
                detail: detail.trim(),
                author: getCookie('username'),
            })
            .then((res) => {
                // console.log(res.data);
                history.push('/');
                return;
            })
            .catch((err) => {
                // console.log(err.response.data);
                // console.log(err.response.status);
            });
    };

    const removeErrorMessage = () => {
        setValidInput({
            isError: false,
            message: '',
        });
    };

    useEffect(() => {
        const theme = JSON.parse(localStorage.getItem('whitemode'));
        if (theme) setIsWhiteMode(theme);
    }, []);

    const classStylingForm = classNames({
        container: true,
        'new-question': true,
        darkColor: isWhiteMode === 'true',
        whiteColor: isWhiteMode === 'false',
    });

    return (
        <form className={classStylingForm} onSubmit={handleSubmit}>
            <h1>New Question</h1>
            <div className="form-group">
                <h3>Question</h3>
                <input
                    className="form-control"
                    name="value"
                    ref={tittleRef}
                    placeholder="Enter new question"
                />
            </div>
            <div className="form-group">
                <h3>Details</h3>
                <textarea
                    ref={detailRef}
                    placeholder="Enter Your Detail"
                    className="form-control"></textarea>
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
            <button type="submit" className="btn btn-info btn-block">
                Submit
            </button>
        </form>
    );
}

NewQuestion.propTypes = {
    title: PropTypes.string,
    detail: PropTypes.string,
};

export default NewQuestion;
