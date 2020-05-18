import React, { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import { userRegister } from '../redux/actions/actionTypes'

function Register({ history }) {
    const isDarkMode = useSelector((state) => state.switchMode)
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
        await dispatch(userRegister(username, password))
        await history.push('/user/login')
    }

    const classStylingForm = classNames({
        container: true,
        'auth-form': true,
        whiteColor: isDarkMode,
        darkColor: !isDarkMode,
    })
    return (
        <form className={classStylingForm} onSubmit={handleSubmit}>
            <h1>Register</h1>
            <div>
                <label>Username</label>
                <input ref={usernameInput} className="form-control" type="text" />
            </div>
            <div>
                <label>Password</label>
                <input ref={passwordInput} className="form-control" type="password" />
            </div>
            <button type="submit" className="btn btn-info btn-block mt-4">
                Submit
            </button>
        </form>
    )
}

export default Register
