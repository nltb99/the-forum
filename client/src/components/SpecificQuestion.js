import React, { useEffect, useState, useRef } from 'react'
import { addComment, deleteComment } from '../redux/actions/actionTypes.js'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import classNames from 'classnames'
import useSWR, { mutate } from 'swr'

import lottie from 'lottie-web'
import animationLoading from '../images/loading.json'

function SpecificQuestion({ match, location }) {
    const dispatch = useDispatch()
    const contentComment = useRef('')

    const id = location.search.match(/((?<=id=).+(?=\&))/g)[0]
    const slug = location.search.match(/((?<=slug=).*)/g)[0]

    const [isWhiteMode, setIsWhiteMode] = useState('false')

    const questions = useSWR(`/api/question/${id}`)
    const comments = useSWR(`/api/comment/${slug}`)

    const handleSubmit = async (e) => {
        e.preventDefault()
        let comment = contentComment.current.value

        mutate(`/api/comment/${slug}`, [...comments.data, comment], false)
        await dispatch(addComment(slug, comment))
        mutate(`/api/comment/${slug}`)
        contentComment.current.value = ''
    }

    function formatDateToString(date) {
        let output = moment(date)
            .startOf('minute')
            .fromNow()
        return output
    }

    function revealDestroy(id) {
        const name = JSON.parse(localStorage.getItem('username'))
        if (name === '\u0061\u0064\u006D\u0069\u006E') {
            return (
                <button
                    onClick={async () => {
                        const url = `/api/comment/${slug}`
                        mutate(
                            url,
                            comments?.data?.filter((e) => e._id !== id),
                            false,
                        )
                        await dispatch(deleteComment(id))
                        mutate(url)
                    }}
                    className="btn btn-danger btn-sm">
                    Delete
                </button>
            )
        }
    }

    useEffect(() => {
        const theme = JSON.parse(localStorage.getItem('whitemode'))
        setIsWhiteMode(theme)
    }, [])

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

    const classStylingSpecific = classNames({
        container: true,
        'specific-question': true,
        whiteColor: isWhiteMode === 'false',
        darkColor: isWhiteMode === 'true',
    })

    return (
        <div className={classStylingSpecific}>
            {questions.data && comments.data ? (
                <React.Fragment>
                    <div>
                        <h1>Title: {questions?.data?.title}</h1>
                        <hr className="hr-styling" />
                        <h5>Detail: {questions?.data?.detail}</h5>
                    </div>
                    <hr className="hr-styling" />
                    <div className="container-user-comment">
                        {comments?.data?.map((comment, index) => (
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
                </React.Fragment>
            ) : (
                <div className="waiting-specific-question">
                    <br />
                    <hr className="hr-styling" />
                </div>
            )}
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
