import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addQuestion, getCookie } from '../redux/actions/actionTypes.js';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import useSWR from 'swr';

function NewQuestion({ history }) {
    const dispatch = useDispatch();
    const [isWhiteMode, setIsWhiteMode] = useState('false');

    const tittleRef = useRef('');
    const detailRef = useRef('');

    const [coincident, setCoincident] = useState({
        output: '',
    });

    //SWR
    const swrFetchQuestions = useSWR(`/api/question`);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let title = await tittleRef.current.value;
        let detail = await detailRef.current.value;

        swrFetchQuestions.data.map((cell) => {
            if (cell.title == title) {
                setCoincident({
                    output: (
                        <div className="alert alert-warning alert-dismissible fade show">
                            <button type="button" className="close" data-dismiss="alert">
                                &times;
                            </button>
                            That title of question already have!
                        </div>
                    ),
                });
                return;
            }
        });

        if (!title.trim() || !detail.trim()) {
            setCoincident({
                output: (
                    <div className="alert alert-danger alert-dismissible fade show">
                        <button type="button" className="close" data-dismiss="alert">
                            &times;
                        </button>
                        Please fill all fields
                    </div>
                ),
            });
            return;
        }
        if (localStorage.getItem('username') === null) {
            setCoincident({
                output: (
                    <div className="alert alert-danger alert-dismissible fade show">
                        <button type="button" className="close" data-dismiss="alert">
                            &times;
                        </button>
                        Please login first
                    </div>
                ),
            });
            return;
        }
        await dispatch(
            addQuestion(
                title,
                detail,
                getCookie('\u0075\u0073\u0065\u0072\u006E\u0061\u006D\u0065'),
            ),
        );
        await history.push('/');
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
            {coincident.output}
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
