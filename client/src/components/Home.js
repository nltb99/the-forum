import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteQuestion, getAllQuestion, countQuestion } from '../redux/actions/actionTypes.js'
import { Link } from 'react-router-dom'
import moment from 'moment'
import classNames from 'classnames'
import InfoQuestion from './StyledComponents/home'

import lottie from 'lottie-web'
import animationLoading from '../images/loading.json'

// Impor amount of comment
import QuantityComment from './QuantityComment.js'

function Home() {
    const [actionFetchData, setActionFetchData] = useState(false)

    const state = useSelector((state) => state.questions)
    const dispatch = useDispatch()

    const isDarkMode = useSelector((state) => state.switchMode)

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

    useEffect(() => {
        dispatch(getAllQuestion())
        dispatch(countQuestion())
    }, [actionFetchData])

    function formatDateToString(date) {
        if (date != null) {
            let output = moment(date)
                .startOf('minute')
                .fromNow()
            return output
        }
    }

    const styleEachQuestion = classNames({
        'my-4': true,
        'question-each': true,
        'background-common-light': !isDarkMode,
        'background-common-dark': isDarkMode,
    })

    function revealDestroy(id, slug) {
        const name = JSON.parse(localStorage.getItem('username'))
        if (name === '\u0061\u0064\u006D\u0069\u006E') {
            return (
                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                        setActionFetchData(!actionFetchData)
                        dispatch(deleteQuestion(id, slug))
                    }}>
                    Delete
                </button>
            )
        }
    }

    return (
        <div className="container home-route">
            <h1 className={isDarkMode ? 'text-white' : 'text-dark'}>
                Questions ({state.counting && state.counting})
            </h1>
            {state?.questions?.map((cell, index) => (
                <div className={styleEachQuestion} key={index}>
                    <div>
                        <Link to={`/question/${cell._id}`} className="text-info">
                            Q: {cell.title}
                        </Link>
                        <QuantityComment isDarkMode={isDarkMode} slug={cell.slug} />
                        <InfoQuestion isDarkMode={isDarkMode}>
                            <p>
                                {cell.author}
                                {'  |'}
                            </p>
                            <p className={isDarkMode ? 'whiteColor' : 'darkColor'}>
                                {formatDateToString(cell.createAt)}
                            </p>
                        </InfoQuestion>
                    </div>
                    {revealDestroy(cell._id, cell.slug)}
                </div>
            ))}
            {state.questions.length === 0 && (
                <div style={{ width: '100px', textAlign: 'center' }} ref={_el}></div>
            )}
        </div>
    )
}

export default Home
