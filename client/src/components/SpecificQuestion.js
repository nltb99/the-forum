import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    getAllQuestion,
    getComment,
    addComment,
    deleteComment,
} from '../redux/actions/actionTypes.js'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'

function SpecificQuestion({ match, location }) {
    const dispatch = useDispatch()
    const contentComment = useRef('')

    const detailQuestions = useSelector((state) => state.questions)
    const detailComments = useSelector((state) => state.comments)

    const [actionFetchData, setActionFetchData] = useState(true)
    const [actionFetchComment, setActionFetchComment] = useState(false)

    let specific = detailQuestions.questions.find((cell) => {
        return cell._id == match.params.id
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        let comment = contentComment.current.value
        let slug = ''

        if (specific != null) {
            slug = specific.slug
        }

        let userInfo = JSON.parse(localStorage.getItem('user'))
        dispatch(addComment(slug, comment))
        contentComment.current.value = ''
        setActionFetchData((n) => n === true)
    }

    useEffect(() => {
        const fetch = async () => {
            await dispatch(getAllQuestion())
            if (specific != null && actionFetchData) {
                await dispatch(getComment(specific.slug))
                await setActionFetchComment((n) => n === true)
                console.log(actionFetchComment)
            }
        }
        fetch()
        return () => {
            setActionFetchData((n) => n === false)
            setActionFetchComment((n) => n === false)
        }
    }, [detailComments.comments, setActionFetchComment])

    function formatDateToString(date) {
        let output = moment(date)
            .startOf('minute')
            .fromNow()
        return output
    }

    return (
        <div className="container specific-question">
            {specific != null && (
                <div>
                    <h1>Title: {specific.title}</h1>
                    <hr />
                    <h4>Detail: {specific.detail}</h4>
                </div>
            )}
            <hr />
            <div className="container-user-comment">
                {!actionFetchComment && detailComments.comments != null ? (
                    detailComments.comments.map((comment, index) => (
                        <div key={index}>
                            <h5>
                                {comment.comment}
                                <small className="text-info">
                                    {'   '}
                                    {formatDateToString(comment.createAt)}
                                </small>
                            </h5>
                            <button
                                onClick={() => {
                                    dispatch(deleteComment(comment._id))
                                    setActionFetchData((n) => n === true)
                                }}
                                className="btn btn-danger btn-sm">
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <h1>Loading...</h1>
                )}
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="comment-user">Your Answer: </label>
                    <textarea
                        ref={contentComment}
                        name="comment-user"
                        className="form-control"></textarea>
                </div>
                <button type="submit" className="btn btn-info btn-block">
                    Submit
                </button>
            </form>
        </div>
    )
}

SpecificQuestion.propTypes = {
    _id: PropTypes.number,
    title: PropTypes.string,
    detail: PropTypes.string,
}

export default SpecificQuestion

// {detailComments.comments != null &&
//     detailComments.comments.map((comment, index) => (
//         <div key={index}>
//             <h5>
//                 {comment.comment}
//                 <small className="text-info">
//                     {'   '}
//                     {formatDateToString(comment.createAt)}
//                 </small>
//             </h5>
//             <button
//                 onClick={() => {
//                     dispatch(deleteComment(comment._id))
//                     setActionFetchData((n) => n === true)
//                 }}
//                 className="btn btn-danger btn-sm">
//                 Delete
//             </button>
//         </div>
//     ))}

// {
//     !actionFetchComment && detailComments.comments != null ? (
//         detailComments.comments.map((comment, index) => (
//             <div key={index}>
//                 <h5>
//                     {comment.comment}
//                     <small className="text-info">
//                         {'   '}
//                         {formatDateToString(comment.createAt)}
//                     </small>
//                 </h5>
//                 <button
//                     onClick={() => {
//                         dispatch(deleteComment(comment._id))
//                         setActionFetchData((n) => n === true)
//                     }}
//                     className="btn btn-danger btn-sm">
//                     Delete
//                 </button>
//             </div>
//         ))
//     ) : (
//         <h1>Loading...</h1>
//     )
// }
