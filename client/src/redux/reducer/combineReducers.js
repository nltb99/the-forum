import HandleQuestion from './HandleQuestion.js'
import HandleComment from './HandleComment.js'
import { combineReducers } from 'redux'

const allReducers = combineReducers({
    questions: HandleQuestion,
    comments: HandleComment,
})

export default allReducers
