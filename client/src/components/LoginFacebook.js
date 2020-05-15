import React, { useState, createContext } from 'react'
// import FacebookLogin from 'react-facebook-login'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

export const LoginContext = createContext()

export const CallbackLogin = (props) => {
    const [account, setAccount] = useState([
        {
            isLoggedin: false,
            userId: '',
            name: '',
            picture: '',
            token: '',
            infoUser: {},
        },
    ])

    const stylingButton = {
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
    }

    let fbLogin

    function componentClicked() {
        // setTimeout(() => {
        //     window.location.reload(true)
        // }, 3000)
    }

    function responseFacebook(res) {
        const infoUser = {
            name: res.name,
            picture: res.picture.data.url,
            token: res.accessToken,
        }
        setAccount({
            isLoggedin: true,
            infoUser: localStorage.setItem('user', JSON.stringify(infoUser)),
        })
    }
    if (account.isLoggedin) {
        fbLogin = null
    } else {
        if (localStorage.getItem('token') != null) {
            fbLogin = null
        } else {
            fbLogin = (
                <FacebookLogin
                    appId="249251383150943"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook}
                    onClick={componentClicked}
                    cssClass="my-facebook-button-class"
                    render={(renderProps) => (
                        <button
                            style={stylingButton}
                            className="button-account"
                            onClick={renderProps.onClick}>
                            Log In
                        </button>
                    )}
                />
            )
        }
    }
    return (
        <div>
            <LoginContext.Provider
                value={{
                    loginBtn: fbLogin,
                    info: account,
                }}>
                {props.children}
            </LoginContext.Provider>
        </div>
    )
}
