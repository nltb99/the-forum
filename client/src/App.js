import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Header from './components/Header.js'
import NewQuestion from './components/NewQuestion.js'
import Home from './components/Home.js'
import SpecificQuestion from './components/SpecificQuestion.js'
import Login from './components/Login'
import Register from './components/Register'
import MissingRoute from './components/MissingRoute.js'

function App() {
    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path="/" component={Home}></Route>
                <Route path="/question/new" component={NewQuestion}></Route>
                <Route path="/question/:id" component={SpecificQuestion}></Route>
                <Route path="/user/login" component={Login}></Route>
                <Route path="/user/register" component={Register}></Route>
                <Route exact path="*" component={MissingRoute}></Route>
            </Switch>
        </Router>
    )
}

export default App
