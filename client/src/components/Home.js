import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteQuestion, getAllQuestion, countQuestion } from '../redux/actions/actionTypes.js'
import { Link } from 'react-router-dom'
import moment from 'moment'
import classNames from 'classnames'

// Impor amount of comment
import QuantityComment from './QuantityComment.js'

function Home() {
    const [actionFetchData, setActionFetchData] = useState(false)

    const state = useSelector((state) => state.questions)
    const dispatch = useDispatch()

    const isDarkMode = useSelector((state) => state.switchMode)

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

    return (
        <div className="container home-route">
            <h1 className={isDarkMode ? 'text-white' : 'text-dark'}>
                Questions ({state.counting && state.counting})
            </h1>
            {state.questions &&
                state.questions.map((cell, index) => (
                    <div className={styleEachQuestion} key={index}>
                        <div>
                            <Link to={`/question/${cell._id}`} className="text-info">
                                Q: {cell.title}
                            </Link>
                            <QuantityComment isDarkMode={isDarkMode} slug={cell.slug} />
                            <h5 className={isDarkMode ? 'whiteColor' : 'darkColor'}>
                                {formatDateToString(cell.createAt)}
                            </h5>
                        </div>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                                setActionFetchData(!actionFetchData)
                                dispatch(deleteQuestion(cell._id, cell.slug))
                            }}>
                            Delete
                        </button>
                    </div>
                ))}
        </div>
    )
}

export default Home
