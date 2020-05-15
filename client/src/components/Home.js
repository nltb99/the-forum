import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteQuestion, getAllQuestion, countQuestion } from '../redux/actions/actionTypes.js'
import { Link } from 'react-router-dom'
import moment from 'moment'

// Impor amount of comment
import QuantityComment from './QuantityComment.js'

function Home({ match }) {
    const state = useSelector((state) => state.questions)
    const [actionFetchData, setActionFetchData] = useState(false)

    const dispatch = useDispatch()

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

    return (
        <div className="container home-route">
            <h1>Questions ({state.counting})</h1>
            {state.questions.map((cell, index) => (
                <div className="bg-light" key={index}>
                    <Link to={`/question/${cell._id}`} className="text-info">
                        Q: {cell.title}
                    </Link>
                    <QuantityComment slug={cell.slug} />
                    <h5>{formatDateToString(cell.createAt)}</h5>
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
