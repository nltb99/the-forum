import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addQuestion, getAllQuestion } from '../redux/actions/actionTypes.js'
import PropTypes from 'prop-types'
import classNames from 'classnames'

function NewQuestion({ history }) {
    const dispatch = useDispatch()

    const tittleRef = useRef('')
    const detailRef = useRef('')

    const [coincident, setCoincident] = useState({
        output: '',
    })

    const allQuestions = useSelector((state) => state.questions)

    const isDarkMode = useSelector((state) => state.switchMode)

    useEffect(() => {
        dispatch(getAllQuestion())
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        let title = tittleRef.current.value
        let detail = detailRef.current.value

        if (allQuestions != null) {
            allQuestions.questions.map((cell) => {
                if (cell.title == title) {
                    setCoincident({
                        output: (
                            <div className="alert alert-warning alert-dismissible fade show">
                                <button type="button" className="close" data-dismiss="alert">
                                    &times;
                                </button>
                                That title of question already have!
                            </div>
                        ),
                    })
                    return
                }
            })
        }

        if (!title.trim() || !detail.trim()) {
            setCoincident({
                output: (
                    <div className="alert alert-danger alert-dismissible fade show">
                        <button type="button" className="close" data-dismiss="alert">
                            &times;
                        </button>
                        Empty value
                    </div>
                ),
            })
            return
        }
        let userInfo = JSON.parse(localStorage.getItem('user'))
        await dispatch(addQuestion(title, detail))
        await history.push('/')
    }

    const classStylingForm = classNames({
        container: true,
        'new-question': true,
        darkColor: !isDarkMode,
        whiteColor: isDarkMode,
    })

    return (
        <form className={classStylingForm} onSubmit={handleSubmit}>
            <h1>New Question</h1>
            <div className="form-group">
                <h3>Question</h3>
                <input
                    className="form-control"
                    name="value"
                    ref={tittleRef}
                    placeholder="Enter new question"
                />
            </div>
            <div className="form-group">
                <h3>Details</h3>
                <textarea
                    ref={detailRef}
                    placeholder="Enter Your Detail"
                    className="form-control"></textarea>
            </div>
            {coincident.output}
            <button type="submit" className="btn btn-success btn-block">
                Submit
            </button>
        </form>
    )
}

NewQuestion.propTypes = {
    title: PropTypes.string,
    detail: PropTypes.string,
}

export default NewQuestion
