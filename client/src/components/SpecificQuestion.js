import React, { useEffect, useState, useRef } from 'react';
import { getCookie } from '../redux/actions/actionTypes.js';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import InfoQuestion from './StyledComponents/home';

import lottie from 'lottie-web';
import animationLoading from '../images/loading.json';

function SpecificQuestion({ match, location, initialQuestion }) {
    const contentComment = useRef('');

    const id = location.search.match(/(?<=id=)(.+)/g)[0];

    const [isWhiteMode, setIsWhiteMode] = useState('false');
    const [validInput, setValidInput] = useState({
        isError: false,
        message: '',
    });

    const question = useSWR(`/api/question/${id}`, { initialData: initialQuestion });

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            let comment = await contentComment.current.value.trim();
            if (typeof getCookie('id') === 'undefined') {
                setValidInput({
                    isError: true,
                    message: 'Please Login First',
                });
                return;
            }
            if (!comment) return;
            const url = await '/api/comment/insert';
            mutate(
                url,
                [...question?.data?.comments, { id, comment, owner: getCookie('username') }],
                false,
            );
            await axios
                .patch(url, { id, comment, owner: getCookie('username') })
                .then((res) => {
                    // console.log(res.status);
                    // console.log(res.data);
                })
                .catch((err) => {
                    // console.log(err.response.data);
                });
            mutate(url);
            contentComment.current.value = '';
        } catch (e) {
            // console.log(e);
        }
    };

    function removeErrorMessage() {
        setValidInput({
            isError: false,
            message: '',
        });
    }

    function formatDateToString(date) {
        let output = moment(date)
            .startOf('minute')
            .fromNow();
        return output;
    }

    function revealDestroy(idComment, author) {
        if (getCookie('username') === 'admin' || getCookie('username') === author) {
            return (
                <button
                    onClick={async () => {
                        const url = await '/api/comment/delete';
                        await mutate(
                            url,
                            question?.data?.comments?.filter((e) => e._id !== idComment),
                            false,
                        );
                        await axios
                            .patch(url, { id, idComment })
                            .then((res) => {
                                // console.log(res.status);
                                // console.log(res.data);
                            })
                            .catch((err) => {
                                // console.log(err.response.status);
                                // console.log(err.response.data);
                            });
                        await mutate(url);
                    }}
                    className="btn btn-secondary btn-sm">
                    Delete
                </button>
            );
        }
    }

    async function handleIncreaseLike(idQuestion, idComment) {
        try {
            const url = await '/api/comment/increaselike';
            mutate(url, { id: idQuestion, idComment });
            await axios.patch(url, { id: idQuestion, idComment }).then((res) => {
                console.log(res.data);
                console.log(res.status);
            });
            mutate(url);
        } catch (e) {
            console.log(e);
        }
    }
    async function handleDecreaseLike(idQuestion, idComment) {
        try {
            const url = await '/api/comment/decreaselike';
            mutate(url, { id: idQuestion, idComment });
            await axios.patch(url, { id: idQuestion, idComment }).then((res) => {
                console.log(res.data);
                console.log(res.status);
            });
            mutate(url);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        const theme = JSON.parse(localStorage.getItem('whitemode'));
        setIsWhiteMode(theme);
    }, []);

    //lottie
    const _el = useRef();
    useEffect(() => {
        lottie.loadAnimation({
            container: _el.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationLoading,
        });
    }, []);

    const classStylingSpecific = classNames({
        container: true,
        'specific-question': true,
        whiteColor: isWhiteMode === 'false',
        darkColor: isWhiteMode === 'true',
    });

    return (
        <div className={classStylingSpecific}>
            {question.data ? (
                <React.Fragment>
                    <div>
                        <h1>Title: {question?.data?.title}</h1>
                        <hr className="hr-styling" />
                        <h4>Detail: {question?.data?.detail}</h4>
                    </div>
                    <hr className="hr-styling" />
                    <div style={{ marginLeft: '10x' }}>
                        {question?.data?.comments?.map((comment, index) => (
                            <div key={index}>
                                <h5>
                                    {comment.comment}
                                    <InfoQuestion>
                                        <p className="text-info">
                                            {'   '}
                                            {comment.owner}
                                            {'  |'}
                                        </p>
                                        <p
                                            className={
                                                isWhiteMode === 'false' ? 'whiteColor' : 'darkColor'
                                            }>
                                            {'   '}
                                            <button
                                                onClick={() =>
                                                    handleIncreaseLike(
                                                        question?.data?._id,
                                                        comment._id,
                                                    )
                                                }>
                                                Like
                                            </button>
                                            {'   '}
                                            {comment.loveComment}
                                            {'   '}
                                            <button
                                                onClick={() =>
                                                    handleDecreaseLike(
                                                        question?.data?._id,
                                                        comment._id,
                                                    )
                                                }>
                                                Dislike
                                            </button>
                                            {'  |'}
                                        </p>
                                        <p className="text-info text-sm">
                                            {'   '}
                                            {formatDateToString(comment.createdCommentAt)}
                                            {'  |'}
                                        </p>
                                        <p>{revealDestroy(comment._id, comment.owner)}</p>
                                    </InfoQuestion>
                                </h5>
                                <hr className="hr-styling" />
                            </div>
                        ))}
                    </div>
                    <hr className="hr-styling" />
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="comment-user">Your Answer: </label>
                            <textarea
                                ref={contentComment}
                                name="comment-user"
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
                </React.Fragment>
            ) : (
                <div className="waiting-specific-question">
                    <br />
                    <hr className="hr-styling" />
                </div>
            )}
        </div>
    );
}

SpecificQuestion.propTypes = {
    _id: PropTypes.number,
    title: PropTypes.string,
    detail: PropTypes.string,
};

export default SpecificQuestion;

SpecificQuestion.getInitialProps = async (ctx) => {
    const res = await axios('/api/question');
    const json = res.data;
    return { initialQuestion: json };
};

// <div style={{ width: '100px', textAlign: 'center' }} ref={_el}></div> // for loading comments
