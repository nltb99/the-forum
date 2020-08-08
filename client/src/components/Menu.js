import React from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from '../redux/actions/actionTypes.js';
import avt from '../images/sketch_me.png';

function Menu() {
    const turnOffUnderline = {
        textDecoration: 'none',
        color: 'rgb(49, 49, 49)',
    };
    return (
        <div className="header">
            <div className="over_header">
                <Link to="/" style={turnOffUnderline}>
                    <img src={avt} alt="author" />
                </Link>
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
            <div className="below_header">
                <Link to="/" style={turnOffUnderline}>
                    <h1 className="cover overflow-off">Wondering Site</h1>
                </Link>
                <Link to="/question/new" style={turnOffUnderline} className="overflow-off">
                    <h5 className="below_header-cell">New Question?</h5>
                </Link>
                <h3 className="overflow-off">ಠ_ಠ</h3>
            </div>
        </div>
    );
}

export default Menu;
