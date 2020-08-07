import React, { useEffect, useRef } from 'react';
import { getCookie } from '../redux/actions/actionTypes.js';
import { Link } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import lottie from 'lottie-web';
import animationLoading from '../images/loading.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import InfoQuestion from './StyledComponents/home';
import QuantityComment from './QuantityComment.js';
import Menu from './Menu';

function Home({ initialQuestions }) {
    const questions = useSWR(`/api/question`, { initialData: initialQuestions });

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

    function formatDateToString(date) {
        if (date != null) {
            let output = moment(date)
                .startOf('minute')
                .fromNow();
            return output;
        }
    }

    function revealDestroy(id, slug, author) {
        if (getCookie('username') === author || getCookie('username') === 'admin') {
            return (
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={async () => {
                        const url = `/api/question`;
                        await mutate(
                            url,
                            questions?.data?.filter((e) => e._id !== id),
                            false,
                        );
                        await axios.delete(url, { data: { id } });
                        await mutate(url);
                    }}>
                    Delete
                </button>
            );
        }
    }

    async function handleIncreaseLike(idQuestion) {
        try {
            if (typeof getCookie('id') === 'undefined') {
                alert('Please Login First');
            } else {
                const url = await '/api/question/increaselike';
                mutate(url, { id: idQuestion });
                await axios.patch(url, { id: idQuestion });
                mutate(url);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async function handleDecreaseLike(idQuestion) {
        try {
            if (typeof getCookie('id') === 'undefined') {
                alert('Please Login First');
            } else {
                const url = await '/api/question/decreaselike';
                mutate(url, { id: idQuestion });
                await axios.patch(url, { id: idQuestion });
                mutate(url);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const styleEachQuestion = classNames({
        'question-each': true,
        'background-common-light': true,
    });

    return (
        <div>
            <Menu />
            <div className="container home-route">
                <h1 className="overflow-off">Questions ({questions?.data?.length})</h1>
                <React.Fragment>
                    {questions?.data?.map((cell, index) => (
                        <div className={styleEachQuestion} key={index}>
                            <div>
                                <Link
                                    to={(location) => ({
                                        ...location,
                                        pathname: `/question`,
                                        search: `?id=${cell._id}`,
                                    })}
                                    className="question-each-title text-info">
                                    {cell.title}
                                </Link>
                                <div className="whiteColor">
                                    {cell.detail
                                        .split(' ')
                                        .slice(0, 3)
                                        .join(' ')}
                                    ...
                                </div>
                                <InfoQuestion>
                                    <p>
                                        {'   '}by {cell.author}
                                        {'  |'}
                                    </p>
                                    <QuantityComment id={cell._id} />
                                    <p className={'whiteColor'}>
                                        {'   '}
                                        <FontAwesomeIcon
                                            icon={faThumbsUp}
                                            className="thumbs-icon"
                                            color={
                                                cell.voteQuestion.whomvote.length !== 0 &&
                                                cell.voteQuestion.whomvote.filter(
                                                    (e) => e.whom === getCookie('username'),
                                                ).length !== 0 &&
                                                cell.voteQuestion.whomvote.filter(
                                                    (e) => e.whom === getCookie('username'),
                                                )[0].state
                                                    ? 'red'
                                                    : 'white'
                                            }
                                            onClick={() => handleIncreaseLike(cell._id)}
                                        />
                                        {'    '}
                                        {cell.voteQuestion.vote}
                                        {'    '}
                                        <FontAwesomeIcon
                                            icon={faThumbsDown}
                                            className="thumbs-icon"
                                            onClick={() => handleDecreaseLike(cell._id)}
                                            color={
                                                cell.voteQuestion.whomvote.length !== 0 &&
                                                cell.voteQuestion.whomvote.filter(
                                                    (e) => e.whom === getCookie('username'),
                                                ).length !== 0 &&
                                                !cell.voteQuestion.whomvote.filter(
                                                    (e) => e.whom === getCookie('username'),
                                                )[0].state
                                                    ? 'red'
                                                    : 'white'
                                            }
                                        />
                                        {'  |'}
                                    </p>
                                    <p className={'whiteColor'}>
                                        {'   '}
                                        {formatDateToString(cell.createAt)}
                                        {'  |'}
                                    </p>
                                    <p>
                                        {'   '}
                                        {revealDestroy(cell._id, cell.slug, cell.author)}
                                    </p>
                                </InfoQuestion>
                            </div>
                        </div>
                    ))}
                </React.Fragment>
                {!questions.data && (
                    <div style={{ width: '100px', textAlign: 'center' }} ref={_el}></div>
                )}
            </div>
        </div>
    );
}

export default Home;

Home.getInitialProps = async (ctx) => {
    const res = await axios('/api/question');
    const json = res.data;
    return { initialQuestions: json };
};
