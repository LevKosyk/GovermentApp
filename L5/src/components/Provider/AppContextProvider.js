import React, { useState, createContext } from 'react';
import { CustomLightTheme, CustomDarkTheme } from '../Theme/Themes';

export const AppContext = createContext(null);

const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState(CustomLightTheme); 

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <AppContext.Provider value={{ theme, changeTheme }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
