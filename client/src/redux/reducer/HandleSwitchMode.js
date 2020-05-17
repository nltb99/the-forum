import { ISDARKMODE } from '../actions/actions'

const HandleSwitchMode = (state = true, action) => {
    switch (action.type) {
        case ISDARKMODE:
            return !state
        default:
            return state
    }
}

export default HandleSwitchMode
