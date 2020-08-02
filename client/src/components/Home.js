import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteQuestion } from '../redux/actions/actionTypes.js'
import { Link } from 'react-router-dom'
import moment from 'moment'
import classNames from 'classnames'
import InfoQuestion from './StyledComponents/home'
import useSWR, { mutate } from 'swr'

import lottie from 'lottie-web'
import animationLoading from '../images/loading.json'

// Impor amount of comment
import QuantityComment from './QuantityComment.js'

function Home() {
    const [actionFetchData, setActionFetchData] = useState(false)

    const [isWhiteMode, setIsWhiteMode] = useState('false')

    const dispatch = useDispatch()

    //SWR
    const swrFetchQuestions = useSWR(`/api/question`)

    //lottie
    const _el = useRef()
    useEffect(() => {
        lottie.loadAnimation({
            container: _el.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationLoading,
        })
    }, [])

    function formatDateToString(date) {
        if (date != null) {
            let output = moment(date)
                .startOf('minute')
                .fromNow()
            return output
        }
    }

    useEffect(() => {
        const theme = JSON.parse(localStorage.getItem('whitemode'))
        setIsWhiteMode(theme)
    }, [])

    function revealDestroy(id, slug) {
        const name = JSON.parse(localStorage.getItem('username'))
        if (name === '\u0061\u0064\u006D\u0069\u006E') {
            return (
                <button
                    className="btn btn-danger btn-sm"
                    onClick={async () => {
                        setActionFetchData(!actionFetchData)

                        const url = `/api/question`
                        mutate(
                            url,
                            swrFetchQuestions?.data?.filter((e) => e._id !== id),
                            false,
                        )
                        await dispatch(deleteQuestion(id, slug))
                        mutate(url)
                    }}>
                    Delete
                </button>
            )
        }
    }

    const styleEachQuestion = classNames({
        'my-4': true,
        'question-each': true,
        'background-common-light': isWhiteMode === 'true',
        'background-common-dark': isWhiteMode === 'false',
    })

    return (
        <div className="container home-route">
            <h1 className={isWhiteMode === 'false' ? 'text-white' : 'text-dark'}>
                Questions ({swrFetchQuestions?.data?.length})
            </h1>
            <React.Fragment>
                {swrFetchQuestions?.data?.map((cell, index) => (
                    <div className={styleEachQuestion} key={index}>
                        <div>
                            <Link
                                to={(location) => ({
                                    ...location,
                                    pathname: `/question`,
                                    search: `?id=${cell._id}&slug=${cell.slug}`,
                                })}
                                className="text-info">
                                Q: {cell.title}
                            </Link>
                            <QuantityComment isWhiteMode={isWhiteMode} slug={cell.slug} />
                            <InfoQuestion isWhiteMode={isWhiteMode}>
                                <p>
                                    {cell.author}
                                    {'  |'}
                                </p>
                                <p className={isWhiteMode === 'false' ? 'whiteColor' : 'darkColor'}>
                                    {formatDateToString(cell.createAt)}
                                </p>
                            </InfoQuestion>
                        </div>
                        {revealDestroy(cell._id, cell.slug)}
                    </div>
                ))}
            </React.Fragment>
            {!swrFetchQuestions.data && (
                <div style={{ width: '100px', textAlign: 'center' }} ref={_el}></div>
            )}
        </div>
    )
}

export default Home
