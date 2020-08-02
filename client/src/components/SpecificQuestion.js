import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
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

    const isDarkMode = useSelector((state) => state.switchMode)

    //SWR
    const swrFetchQuestion = useSWR(`/api/question/${id}`)
    const swrFetchComments = useSWR(`/api/comment/${slug}`)

    console.log('haha')

    const handleSubmit = async (e) => {
        e.preventDefault()
        let comment = contentComment.current.value

        //swr
        mutate(`/api/comment/${slug}`, [...swrFetchComments.data, comment], false)
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
                    onClick={async () => {
                        const url = `/api/comment/${slug}`
                        mutate(
                            url,
                            swrFetchComments?.data?.filter((e) => e._id !== id),
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
            {
                <div>
                    <h1>Title: {swrFetchQuestion?.data?.title}</h1>
                    <hr className="hr-styling" />
                    <h5>Detail: {swrFetchQuestion?.data?.detail}</h5>
                </div>
            }
            <hr className="hr-styling" />
            <div className="container-user-comment">
                {swrFetchComments?.data?.map((comment, index) => (
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
