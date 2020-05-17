import HandleQuestion from './HandleQuestion.js'
import HandleComment from './HandleComment.js'
import HandleSwitchMode from './HandleSwitchMode.js'
import { combineReducers } from 'redux'

const allReducers = combineReducers({
    questions: HandleQuestion,
    comments: HandleComment,
    switchMode: HandleSwitchMode,
})

export default allReducers
