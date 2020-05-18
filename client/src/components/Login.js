import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import { userLogin } from '../redux/actions/actionTypes'

function Login({ history }) {
    const isDarkMode = useSelector((state) => state.switchMode)
    const loginFail = useSelector((state) => state.credentialsFalse)
    const loginSuccess = useSelector((state) => state.credentials)

    const dispatch = useDispatch()

    const usernameInput = useRef()
    const passwordInput = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const username = usernameInput.current.value
        const password = passwordInput.current.value
        if (!username || !password) {
            alert('null')
            return
        }
        await dispatch(userLogin(username, password))
        if (localStorage.getItem('username') != null) {
            await history.push('/')
            await window.location.reload(true)
        }
    }

    const classStylingForm = classNames({
        container: true,
        'auth-form': true,
        whiteColor: isDarkMode,
        darkColor: !isDarkMode,
    })
    return (
        <form className={classStylingForm} onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div>
                <label>Username</label>
                <input ref={usernameInput} className="form-control" type="text" />
            </div>
            <div>
                <label>Password</label>
                <input ref={passwordInput} className="form-control" type="password" />
            </div>
            <div>
                {loginFail.msg && (
                    <div className="alert alert-danger alert-dismissible my-4 fade show">
                        <button type="button" className="close" data-dismiss="alert">
                            &times;
                        </button>
                        {loginFail.msg}
                    </div>
                )}
            </div>
            <button type="submit" className="btn btn-info btn-block mt-4">
                Submit
            </button>
        </form>
    )
}

export default Login
