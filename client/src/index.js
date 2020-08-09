import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { SWRConfig } from 'swr';
import axios from 'axios';
import { getCookie } from './redux/actions/actionTypes';

// axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.headers.common['Authorization'] = `Bearer ${getCookie('tk')}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const fetcher = (...args) => axios(...args).then((res) => res.data);

ReactDOM.render(
    <Provider store={store}>
        <SWRConfig
            value={{
                revalidateOnFocus: true,
                revalidateOnMount: true,
                refreshInterval: 2000,
                shouldRetryOnError: true,
                fetcher,
            }}>
            <App />
        </SWRConfig>
    </Provider>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
