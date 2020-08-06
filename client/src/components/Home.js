import React, { useEffect, useState, useRef } from 'react';
import { getCookie } from '../redux/actions/actionTypes.js';
import { Link } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import InfoQuestion from './StyledComponents/home';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import lottie from 'lottie-web';
import animationLoading from '../images/loading.json';
import QuantityComment from './QuantityComment.js';
import Menu from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

function Home({ initialQuestions }) {
    const [isWhiteMode, setIsWhiteMode] = useState('false');

    const questions = useSWR(`/api/question`, { initialData: initialQuestions });

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

    function formatDateToString(date) {
        if (date != null) {
            let output = moment(date)
                .startOf('minute')
                .fromNow();
            return output;
        }
    }

    useEffect(() => {
        const theme = JSON.parse(localStorage.getItem('whitemode'));
        if (theme) setIsWhiteMode(theme);
    }, []);

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
                        await axios
                            .delete(url, { data: { id } })
                            .then((res) => {
                                // console.log(res.status);
                                // console.log(res.data);
                            })
                            .catch((err) => {
                                // console.log(err.response.data);
                            });
                        await mutate(url);
                    }}>
                    Delete
                </button>
            );
        }
    }

    async function handleIncreaseLike(idQuestion) {
        try {
            const url = await '/api/question/increaselike';
            mutate(url, { id: idQuestion });
            await axios.patch(url, { id: idQuestion }).then((res) => {
                console.log(res.data);
                console.log(res.status);
            });
            mutate(url);
        } catch (e) {
            console.log(e);
        }
    }
    async function handleDecreaseLike(idQuestion) {
        try {
            const url = await '/api/question/decreaselike';
            mutate(url, { id: idQuestion });
            await axios.patch(url, { id: idQuestion }).then((res) => {
                console.log(res.data);
                console.log(res.status);
            });
            mutate(url);
        } catch (e) {
            console.log(e);
        }
    }

    const styleEachQuestion = classNames({
        'question-each': true,
        'background-common-light': isWhiteMode === 'true',
        'background-common-dark': isWhiteMode === 'false',
    });

    return (
        <div>
            <Menu />
            <div className="container home-route">
                <h1 className={isWhiteMode === 'false' ? 'text-white' : 'text-dark'}>
                    Questions ({questions?.data?.length})
                </h1>
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
                                    className="text-info">
                                    {cell.title}
                                </Link>
                                <div className="darkColor">
                                    {cell.detail
                                        .split(' ')
                                        .slice(0, 3)
                                        .join(' ')}
                                    ...
                                </div>
                                <InfoQuestion isWhiteMode={isWhiteMode}>
                                    <p>
                                        {'   '}
                                        by {cell.author}
                                        {'  |'}
                                    </p>
                                    <QuantityComment isWhiteMode={isWhiteMode} id={cell._id} />
                                    <p
                                        className={
                                            isWhiteMode === 'false' ? 'whiteColor' : 'darkColor'
                                        }>
                                        {'   '}
                                        <FontAwesomeIcon
                                            icon={faThumbsUp}
                                            color="white"
                                            onClick={() => handleIncreaseLike(cell._id)}
                                        />
                                        {'   '}
                                        {cell.loveQuestion}
                                        {'   '}
                                        <FontAwesomeIcon
                                            icon={faThumbsDown}
                                            onClick={() => handleDecreaseLike(cell._id)}
                                            color="red"
                                        />
                                        {'  |'}
                                    </p>
                                    <p
                                        className={
                                            isWhiteMode === 'false' ? 'whiteColor' : 'darkColor'
                                        }>
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
