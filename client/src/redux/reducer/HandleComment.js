import { GETCOMMENT, ADDCOMMENT, DELETECOMMENT, GETQUANTITYOFCOMMENT } from '../actions/actions.js';

const initialState = {
    comments: [],
    quantity: '',
};

const HandleComment = (state = initialState, action) => {
    switch (action.type) {
        case GETCOMMENT:
            return {
                ...state,
                comments: action.payload,
            };
        case ADDCOMMENT:
            return {
                ...state,
                comments: [action.payload, ...state.comments],
            };
        case DELETECOMMENT:
            return {
                ...state,
                comments: state.comments.filter((cell) => cell._id !== action.payload),
            };
        case GETQUANTITYOFCOMMENT:
            return {
                ...state,
                quantity: action.payload,
            };
        default:
            return state;
    }
};

export default HandleComment;
