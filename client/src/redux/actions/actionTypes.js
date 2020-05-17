import {
    ADDQUESTION,
    COUNTQUESTION,
    DELETEQUESTION,
    GETQUESTION,
    ADDCOMMENT,
    GETCOMMENT,
    DELETECOMMENT,
    ISLOADING,
    ISDARKMODE,
} from './actions.js'
import axios from 'axios'

// Question Action
export const addQuestion = (title, detail) => async (dispatch) => {
    await axios.post('/api/question', { title, detail }).then((res) =>
        dispatch({
            type: ADDQUESTION,
            payload: res.data,
        }),
    )
}

export const countQuestion = (counting) => async (dispatch) => {
    await axios.get(`/api/question/quantity/${counting}`).then((res) =>
        dispatch({
            type: COUNTQUESTION,
            payload: res.data,
        }),
    )
}

export const deleteQuestion = (id, slug) => async (dispatch) => {
    await axios
        .all([axios.delete(`/api/question/${id}`), axios.delete(`/api/comment/${slug}`)])
        .then(
            axios.spread((question, comment) => {
                dispatch({
                    type: DELETEQUESTION,
                    payload: {
                        id,
                        slug,
                    },
                })
            }),
        )
}

export const getAllQuestion = () => async (dispatch) => {
    await dispatch(isLoading())
    await axios.get('/api/question').then((res) =>
        dispatch({
            type: GETQUESTION,
            payload: res.data,
        }),
    )
}

// Comment Action
export const getComment = (slug) => async (dispatch) => {
    await axios.get(`/api/comment/${slug}`).then((res) =>
        dispatch({
            type: GETCOMMENT,
            payload: res.data,
        }),
    )
}

export const addComment = (title, comment) => async (dispatch) => {
    await axios.post(`/api/comment`, { title, comment }).then((res) =>
        dispatch({
            type: ADDCOMMENT,
            payload: res.data,
        }),
    )
}

export const deleteComment = (id) => async (dispatch) => {
    await axios.delete(`/api/comment/specific/${id}`).then((res) =>
        dispatch({
            type: DELETECOMMENT,
            payload: id,
        }),
    )
}

// Handle is loading
export const isLoading = () => {
    return {
        type: ISLOADING,
    }
}

// Check is Dark Mode
export const isDarkmode = () => {
    return {
        type: ISDARKMODE,
    }
}
