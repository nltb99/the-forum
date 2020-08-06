import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './components/Header.js';
import NewQuestion from './components/NewQuestion.js';
import Home from './components/Home.js';
import SpecificQuestion from './components/SpecificQuestion.js';
import Login from './components/Login';
import Register from './components/Register';
import EmailReset from './components/EmailReset';
import ResetPassword from './components/ResetPassword';
import MissingRoute from './components/MissingRoute.js';
import WholeBody from './components/StyledComponents/wholebody';

function App() {
    const [theme, setTheme] = useState('');
    useEffect(() => {
        const isWhiteMode = JSON.parse(localStorage.getItem('whitemode'));
        setTheme(isWhiteMode);
        if (isWhiteMode && isWhiteMode === 'true') {
            localStorage.setItem('whitemode', JSON.stringify('true'));
        } else if (!isWhiteMode) {
            localStorage.setItem('whitemode', JSON.stringify('false'));
        }
    }, []);
    return (
        <React.Fragment>
            <Router>
                <WholeBody theme={theme} />
                <Switch>
                    <Route exact path="/" component={Home}></Route>
                    <Route path="/question/new" component={NewQuestion}></Route>
                    <Route path="/question" component={SpecificQuestion}></Route>
                    <Route path="/user/login" component={Login}></Route>
                    <Route path="/user/register" component={Register}></Route>
                    <Route path="/user/emailreset" component={EmailReset}></Route>
                    <Route path="/user/resetpassword" component={ResetPassword}></Route>
                    <Route exact path="*" component={MissingRoute}></Route>
                </Switch>
            </Router>
        </React.Fragment>
    );
}

export default App;
