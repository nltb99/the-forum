import React, { useState, useEffect, createContext } from 'react';

export const HookContext = createContext();

export const HookProvider = (props) => {
    let [isWhiteMode, setIsWhiteMode] = useState('');

    useEffect(() => {
        let theme = JSON.parse(localStorage.getItem('whitemode'));
        if (theme) setIsWhiteMode(theme);
    }, [isWhiteMode, setIsWhiteMode]);

    return (
        <HookContext.Provider value={[isWhiteMode, setIsWhiteMode]}>
            {props.children}
        </HookContext.Provider>
    );
};
