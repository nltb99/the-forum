import { USERLOGIN, USERREGISTER, LOADCREDENTIAL } from '../actions/actions';
const initialsState = {
    username: "",
    msg: '',
};

const HandleCredentials = (state = initialsState, action) => {
    switch (action.type) {
        case LOADCREDENTIAL:
            return {
                ...state,
            };
        case USERREGISTER:
            return {
                ...state,
                ...action.payload,
                msg: 'Register Succeed',
            };
        case USERLOGIN:
            return {
                ...state,
                ...action.payload,
                msg: 'Login Succeed!',
            };
            return {};
        default:
            return state;
    }
};

export default HandleCredentials;
