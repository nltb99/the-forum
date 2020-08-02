import { USERLOGIN, USERREGISTER, LOADCREDENTIAL } from '../actions/actions'
const initialsState = {
    token: localStorage.getItem('token'),
    username: JSON.stringify(localStorage.getItem('username')),
    msg: '',
}

const HandleCredentials = (state = initialsState, action) => {
    switch (action.type) {
        case LOADCREDENTIAL:
            return {
                ...state,
            }
        case USERREGISTER:
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                ...action.payload,
                msg: 'Register Succeed',
            }
        case USERLOGIN:
            localStorage.setItem('username', JSON.stringify(action.payload.username))
            return {
                ...state,
                ...action.payload,
                msg: 'Login Succeed!',
            }
            return {}
        default:
            return state
    }
}

export default HandleCredentials
