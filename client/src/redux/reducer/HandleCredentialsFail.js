import { LOGINFAIL } from '../actions/actions';
const initialState = {
    msg: '',
};

const HandleCredentialFail = (state = initialState, action) => {
    switch (action.type) {
        case LOGINFAIL:
            return {
                ...state,
                msg: action.payload,
            };
        default:
            return state;
    }
};

export default HandleCredentialFail;
