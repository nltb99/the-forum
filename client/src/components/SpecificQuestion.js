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
import Menu from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

function SpecificQuestion({ match, location, initialQuestion }) {
    const contentComment = useRef('');

    const id = location.search.match(/(?<=id=)(.+)/g)[0];

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
            await axios.patch(url, { id, comment, owner: getCookie('username') });
            mutate(url);
            contentComment.current.value = '';
        } catch (e) {}
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
                        await axios.patch(url, { id, idComment });
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
            await axios.patch(url, { id: idQuestion, idComment });
            mutate(url);
        } catch (e) {
            console.log(e);
        }
    }
    async function handleDecreaseLike(idQuestion, idComment) {
        try {
            const url = await '/api/comment/decreaselike';
            mutate(url, { id: idQuestion, idComment });
            await axios.patch(url, { id: idQuestion, idComment });
            mutate(url);
        } catch (e) {
            console.log(e);
        }
    }

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
        whiteColor: true,
    });

    return (
        <div>
            <Menu />
            <div className={classStylingSpecific}>
                {question?.data && (
                    <React.Fragment>
                        <div>
                            <h1>Title: {question?.data?.title}</h1>
                            <h4>Detail: {question?.data?.detail}</h4>
                        </div>
                        <hr className="hr-styling" />
                        <div style={{ marginLeft: '10x' }} className="comment-each">
                            {question?.data?.comments?.map((comment, index) => (
                                <div key={index}>
                                        {comment.comment}
                                        <InfoQuestion>
                                            <p>
                                                {'   '}
                                                {comment.owner}
                                                {'  |'}
                                            </p>
                                            <p >
                                                {'   '}
                                                <FontAwesomeIcon
                                                    icon={faThumbsUp}
                                                    color={
                                                        comment.voteComment.whomvote.length !== 0 &&
                                                        comment.voteComment.whomvote.filter(
                                                            (e) => e.whom === getCookie('username'),
                                                        ).length !== 0 &&
                                                        comment.voteComment.whomvote.filter(
                                                            (e) => e.whom === getCookie('username'),
                                                        )[0].state
                                                            ? 'red'
                                                            : 'white'
                                                    }
                                                    onClick={() =>
                                                        handleIncreaseLike(
                                                            question?.data?._id,
                                                            comment._id,
                                                        )
                                                    }
                                                />
                                                {'   '}
                                                {comment.voteComment.vote}
                                                {'   '}
                                                <FontAwesomeIcon
                                                    icon={faThumbsDown}
                                                    color={
                                                        comment.voteComment.whomvote.length !== 0 &&
                                                        comment.voteComment.whomvote.filter(
                                                            (e) => e.whom === getCookie('username'),
                                                        ).length !== 0 &&
                                                        !comment.voteComment.whomvote.filter(
                                                            (e) => e.whom === getCookie('username'),
                                                        )[0].state
                                                            ? 'red'
                                                            : 'white'
                                                    }
                                                    onClick={() =>
                                                        handleDecreaseLike(
                                                            question?.data?._id,
                                                            comment._id,
                                                        )
                                                    }
                                                />
                                                {'  |'}
                                            </p>
                                            <p >
                                                {'   '}
                                                {formatDateToString(comment.createdCommentAt)}
                                                {'  |'}
                                            </p>
                                            <p>{revealDestroy(comment._id, comment.owner)}</p>
                                        </InfoQuestion>
                                    <hr className="hr-styling" />
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="comment-user">Your Answer: </label>
                                <textarea
                                    ref={contentComment}
                                    name="comment-user"
                                    className="form-control"></textarea>
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
                            <button type="submit" className="btn btn-block submit-btn">
                                Comment
                            </button>
                        </form>
                    </React.Fragment>
                )}
            </div>
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
