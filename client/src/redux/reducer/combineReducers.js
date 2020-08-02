import HandleQuestion from './HandleQuestion.js';
import HandleComment from './HandleComment.js';
import HandleSwitchMode from './HandleSwitchMode.js';
import HandleCredentials from './HandleCredentials.js';
import HandleCredentialsFails from './HandleCredentialsFail';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    questions: HandleQuestion,
    comments: HandleComment,
    switchMode: HandleSwitchMode,
    credentials: HandleCredentials,
    credentialsFalse: HandleCredentialsFails,
});

export default allReducers;
