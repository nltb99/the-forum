import React, { lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const NewQuestion = lazy(() => import('./components/NewQuestion'));
const Home = lazy(() => import('./components/Home'));
const SpecificQuestion = lazy(() => import('./components/SpecificQuestion'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const EmailReset = lazy(() => import('./components/EmailReset'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const MissingRoute = lazy(() => import('./components/MissingRoute'));
const WholeBody = lazy(() => import('./components/StyledComponents/wholebody'));
const Logo = lazy(() => import('./components/Logo'));

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {sessionStorage.getItem('intro') === null && <Logo />}
            <Router>
                <WholeBody />
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
        </Suspense>
    );
}

export default App;
