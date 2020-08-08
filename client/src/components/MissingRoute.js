import React from 'react';
import Menu from './Menu';

function MissingRoute() {
    return (
        <div>
            <Menu />
            <h1 className="container" style={{ textAlign: 'center', marginTop: 20 }}>
                Missing Route
            </h1>
        </div>
    );
}

export default MissingRoute;
