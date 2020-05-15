import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Header from './components/Header.js'
import NewQuestion from './components/NewQuestion.js'
import Home from './components/Home.js'
import SpecificQuestion from './components/SpecificQuestion.js'
import MissingRoute from './components/MissingRoute.js'

import { CallbackLogin } from './components/LoginFacebook.js'

function App() {
    return (
        <Router>
            <CallbackLogin>
                <Header />
            </CallbackLogin>
            <Switch>
                <Route exact path="/" component={Home}></Route>
                <Route exact path="/question/new" component={NewQuestion}></Route>
                <Route exact path="/question/:id" component={SpecificQuestion}></Route>
                <Route exact path="*" component={MissingRoute}></Route>
            </Switch>
        </Router>
    )
}

export default App
