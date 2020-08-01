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
import axios from 'axios'
import classNames from 'classnames'

import lottie from 'lottie-web'
import animationLoading from '../images/loading.json'

function SpecificQuestion({ match, location }) {
    const dispatch = useDispatch()
    const contentComment = useRef('')

    const detailQuestions = useSelector((state) => state.questions)
    // const detailComments = useSelector((state) => state.comments)

    const [userComments, setUserComments] = useState([])

    const [submitComment, setSubmitComment] = useState(true)

    const isDarkMode = useSelector((state) => state.switchMode)

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

        // let userInfo = JSON.parse(localStorage.getItem('user'))
        dispatch(addComment(slug, comment))
        contentComment.current.value = ''
        setSubmitComment(true)
    }

    function formatDateToString(date) {
        let output = moment(date)
            .startOf('minute')
            .fromNow()
        return output
    }

    //Handle Comment
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getAllQuestion())
            if (specific != null && submitComment) {
                const dataFetching = await axios.get(`/api/comment/${specific.slug}`)
                await setUserComments(dataFetching.data)
            }
        }
        fetchData()
        return () => {
            setSubmitComment(false)
        }
    }, [submitComment, userComments, setUserComments])

    const classStylingSpecific = classNames({
        container: true,
        'specific-question': true,
        darkColor: !isDarkMode,
        whiteColor: isDarkMode,
    })

    function revealDestroy(id) {
        const name = JSON.parse(localStorage.getItem('username'))
        if (name === '\u0061\u0064\u006D\u0069\u006E') {
            return (
                <button
                    onClick={() => {
                        dispatch(deleteComment(id))
                        setSubmitComment(true)
                    }}
                    className="btn btn-danger btn-sm">
                    Delete
                </button>
            )
        }
    }

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

    return (
        <div className={classStylingSpecific}>
            {specific != null && (
                <div>
                    <h1>Title: {specific.title}</h1>
                    <hr className="hr-styling" />
                    <h5>Detail: {specific.detail}</h5>
                </div>
            )}
            <hr className="hr-styling" />
            <div className="container-user-comment">
                {!submitComment &&
                    userComments?.map((comment, index) => (
                        <div key={index}>
                            <h5>
                                {comment.comment}
                                <small className="text-info">
                                    {'   '}
                                    {formatDateToString(comment.createAt)}
                                </small>
                            </h5>
                            {revealDestroy(comment._id)}
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

// <div style={{ width: '100px', textAlign: 'center' }} ref={_el}></div> // for loading comments
