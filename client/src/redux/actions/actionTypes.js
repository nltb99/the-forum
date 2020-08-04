import {
    ADDQUESTION,
    COUNTQUESTION,
    DELETEQUESTION,
    GETQUESTION,
    ADDCOMMENT,
    DELETECOMMENT,
    ISLOADING,
    ISDARKMODE,
    ISWHITEMODE,
    USERLOGIN,
    USERREGISTER,
    LOADCREDENTIAL,
    LOGINFAIL,
} from './actions.js';
import axios from 'axios';

// Question Action
export const addQuestion = (title, detail, author) => {
    return async function(dispatch) {
        await axios.post('/api/question', { title, detail, author }).then((res) =>
            dispatch({
                type: ADDQUESTION,
                payload: res.data,
            }),
        );
    };
};

// export const countQuestion = (counting) => {
//     return async function(dispatch) {
//         await axios.get(`/api/question/quantity/${counting}`).then((res) =>
//             dispatch({
//                 type: COUNTQUESTION,
//                 payload: res.data,
//             }),
//         )
//     }
// }

export const deleteQuestion = (id, slug) => {
    return async function(dispatch) {
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
                    });
                }),
            );
    };
};

export const getAllQuestion = () => {
    return async function(dispatch) {
        await dispatch(isLoading());
        await axios.get('/api/question').then((res) =>
            dispatch({
                type: GETQUESTION,
                payload: res.data,
            }),
        );
    };
};

// Comment Action
// export const getComment = (slug) => async (dispatch) => {
//     await axios.get(`/api/comment/${slug}`).then((res) =>
//         dispatch({
//             type: GETCOMMENT,
//             payload: res.data,
//         }),
//     )
// }

export const addComment = (title, comment) => {
    return async function(dispatch) {
        await axios.post(`/api/comment`, { title, comment }).then((res) =>
            dispatch({
                type: ADDCOMMENT,
                payload: res.data,
            }),
        );
    };
};

export const deleteComment = (id) => {
    return async function(dispatch) {
        await axios.delete(`/api/comment/specific/${id}`).then((res) =>
            dispatch({
                type: DELETECOMMENT,
                payload: id,
            }),
        );
    };
};

// Handle is loading
export const isLoading = () => {
    return {
        type: ISLOADING,
    };
};

// Check theme
export const isDarkmode = () => {
    return {
        type: ISDARKMODE,
    };
};

export const isWhiteMode = () => {
    return {
        type: ISWHITEMODE,
    };
};

// Check authen token user
export const userRegister = (username, password, email) => {
    return function(dispatch) {
        axios.post('/api/user/register', { username, password, email }).then((res) =>
            dispatch({
                type: USERREGISTER,
                payload: res.data,
            }),
        );
    };
};

export const userLogin = (username, password) => {
    return async function(dispatch) {
        const configs = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await axios
            .post('/api/user/login', { username, password }, configs)
            .then((res) => {
                dispatch({
                    type: USERLOGIN,
                    payload: res.data,
                });
            })
            .catch((err) => {
                dispatch({
                    type: LOGINFAIL,
                    payload: 'Password does not match',
                });
            });
    };
};

export const loadCredential = () => {
    return {
        type: LOADCREDENTIAL,
    };
};

export const getCookie = (name) => {
    let matches = document.cookie.match(
        new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'),
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
};
