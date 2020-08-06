import React from 'react';
import { Link } from 'react-router-dom';
import { Switch } from './StyledComponents/switchMode';
import { getCookie } from '../redux/actions/actionTypes.js';
import avt from '../images/square.png';

function Menu() {
    const turnOffUnderline = {
        textDecoration: 'none',
        color: 'rgb(49, 49, 49)',
    };
    return (
        <div className="header">
            <div className="over_header">
                <img src={avt} alt="" />
                <p>
                    {typeof getCookie('id') === 'undefined' && (
                        <Link to="/user/login" style={turnOffUnderline}>
                            <span className="header_text">login</span>
                        </Link>
                    )}
                    {typeof getCookie('id') !== 'undefined' && (
                        <Link
                            to="/"
                            style={turnOffUnderline}
                            onClick={() => {
                                document.cookie = 'id=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                                document.cookie =
                                    'username=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                                document.cookie = 'tk=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                                window.location.reload(true);
                            }}>
                            <span className="header_text">logout</span>
                        </Link>
                    )}
                    /
                    <Link to="/user/register" style={turnOffUnderline}>
                        <span className="header_text">register</span>
                    </Link>
                </p>
            </div>
            <h1 className="cover">Wondering Site</h1>
            <div className="menu">
                <Link to="/question/new" style={turnOffUnderline}>
                    <h5 className="menu_cell">New Question?</h5>
                </Link>
            </div>
            <h5 className="menu_cell">ಠ_ಠ</h5>
        </div>
    );
}

export default Menu;

// <p>
//     {typeof getCookie('id') === 'undefined' && (
//         <Link to="/user/login" style={turnOffUnderline}>
//             login
//         </Link>
//     )}
//     {typeof getCookie('id') !== 'undefined' && (
//         <Link
//             to="/"
//             style={turnOffUnderline}
//             onClick={() => {
//                 document.cookie =
//                     'id=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//                 document.cookie =
//                     'username=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//                 document.cookie =
//                     'tk=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//                 window.location.reload(true);
//             }}>
//             logout
//         </Link>
//     )}
//     /
//     <Link to="/user/register" style={turnOffUnderline}>
//         register
//     </Link>
// </p>
