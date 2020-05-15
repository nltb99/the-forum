import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import allReducers from './reducer/combineReducers.js'

const store = createStore(
    allReducers,
    applyMiddleware(thunk),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

export default store
